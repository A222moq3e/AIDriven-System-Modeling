import OpenAI from 'openai';
import Diagram from '../models/Diagram.js';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// @desc    Generate Mermaid code from prompt and Auto-Save
// @route   POST /api/diagrams/generate
// @access  Private (protected by auth middleware)
export const generateDiagram = async (req, res) => {
  const { prompt, type, save = false } = req.body;
  const authUserId = req.user?.userId;

  if (!prompt) {
    return res.status(400).json({ 
      success: false,
      message: 'Prompt is required' 
    });
  }

  try {
    // Construct the prompt with the diagram type
    const diagramType = type || 'flowchart';
    const fullPrompt = `Create for me a "${diagramType}" diagram, I want it for: ${prompt}`;
    
    // Use stored prompt ID if available, otherwise fall back to chat completions
    const storedPromptId = process.env.OPENAI_PROMPT_ID;
    const storedPromptVersion = process.env.OPENAI_PROMPT_VERSION || "4";
    
    // Log what we're sending to OpenAI
    console.log('\n=== OpenAI Request ===');
    console.log('API Type:', storedPromptId ? 'Responses API' : 'Chat Completions API');
    console.log('Diagram Type:', diagramType);
    console.log('User Prompt:', prompt);
    console.log('Full Constructed Prompt:', fullPrompt);
    
    let requestPayload;
    let aiResponse;
    
    if (storedPromptId) {
      // Use stored prompt with responses API
      // Pass the full constructed prompt directly as input
      requestPayload = {
        prompt: {
          id: storedPromptId,
          version: storedPromptVersion
        },
        input: fullPrompt
      };
      console.log('Request Payload:', JSON.stringify(requestPayload, null, 2));
      console.log('===================\n');
      
      aiResponse = await openai.responses.create(requestPayload);
    } else {
      // Fallback to chat completions with inline prompt
      requestPayload = {
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that generates valid Mermaid.js diagram code. Return ONLY the mermaid code, no markdown fencing, no explanation."
          },
          {
            role: "user",
            content: fullPrompt
          }
        ],
        max_tokens: 500,
      };
      console.log('Request Payload:', JSON.stringify(requestPayload, null, 2));
      console.log('===================\n');
      
      aiResponse = await openai.chat.completions.create(requestPayload);
    }

    // Log the full OpenAI response for debugging
    console.log('\n=== OpenAI Response ===');
    console.log('Response Type:', storedPromptId ? 'Responses API' : 'Chat Completions API');
    console.log('Full Response:', JSON.stringify(aiResponse, null, 2));
    console.log('Response Keys:', Object.keys(aiResponse || {}));
    console.log('======================\n');
    
    // Extract content based on API type
    let mermaidCode;
    if (storedPromptId) {
      // Response from responses API
      // The response has output_text field with the actual text
      if (aiResponse.output_text) {
        mermaidCode = aiResponse.output_text;
      } else if (aiResponse.output && Array.isArray(aiResponse.output)) {
        // Fallback: extract from output array (find message type with text)
        const messageOutput = aiResponse.output.find(item => 
          item.type === 'message' && 
          item.content && 
          Array.isArray(item.content)
        );
        if (messageOutput && messageOutput.content) {
          const textContent = messageOutput.content.find(c => c.type === 'output_text');
          if (textContent && textContent.text) {
            mermaidCode = textContent.text;
          }
        }
      }
      
      // Ensure we have a string
      if (!mermaidCode || typeof mermaidCode !== 'string') {
        console.warn('Could not extract mermaidCode from Responses API, using fallback');
        mermaidCode = '';
      }
    } else {
      // Response from chat completions API
      mermaidCode = aiResponse.choices[0].message.content.trim();
    }
    
    console.log('Extracted mermaidCode type:', typeof mermaidCode);
    console.log('Extracted mermaidCode length:', mermaidCode?.length || 0);
    console.log('Extracted mermaidCode preview:', mermaidCode?.substring(0, 100) || 'empty');
    
    // Clean up if the AI adds markdown backticks by mistake
    const cleanCode = mermaidCode.trim().replace(/^```mermaid\n?/, '').replace(/```$/, '');

    let savedDiagram = null;
    // Only save when explicitly requested (save === true) to avoid duplicates during retries
    // Route is authenticated; use authenticated user id
    if (save) {
      const newDiagram = new Diagram({
        userId: authUserId,
        prompt,
        mermaidCode: cleanCode,
        type: type || 'flowchart',
      });
      
      savedDiagram = await newDiagram.save();
    }

    res.status(200).json({
      success: true,
      data: {
        mermaid: cleanCode,
        type: type || 'flowchart',
        diagramId: savedDiagram ? savedDiagram._id.toString() : null,
      },
    });
  } catch (error) {
    console.error("OpenAI Error:", error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to generate diagram' 
    });
  }
};

// @desc    Get authenticated user's diagrams
// @route   GET /api/diagrams/:userId
// @access  Public
export const getDiagrams = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ 
      success: false,
      message: 'User ID is required' 
    });
  }

  try {
    const userDiagrams = await Diagram.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    // Convert _id to id for consistency
    const formattedDiagrams = userDiagrams.map(diagram => ({
      id: diagram._id.toString(),
      userId: diagram.userId,
      prompt: diagram.prompt,
      mermaidCode: diagram.mermaidCode,
      type: diagram.type,
      createdAt: diagram.createdAt,
      updatedAt: diagram.updatedAt,
    }));

    res.status(200).json({
      success: true,
      data: formattedDiagrams,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch diagrams' 
    });
  }
};

// @desc    Persist a validated diagram
// @route   POST /api/diagrams
// @access  Private (requires authentication)
export const saveDiagram = async (req, res) => {
  const { prompt, mermaidCode, type } = req.body;

  // userId is taken from the authenticated user to prevent spoofing
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
    });
  }

  if (!prompt || !mermaidCode) {
    return res.status(400).json({
      success: false,
      message: 'prompt and mermaidCode are required',
    });
  }

  try {
    const newDiagram = new Diagram({
      userId,
      prompt,
      mermaidCode,
      type: type || 'flowchart',
    });

    const savedDiagram = await newDiagram.save();

    res.status(201).json({
      success: true,
      data: {
        id: savedDiagram._id.toString(), // backward compatibility
        diagramId: savedDiagram._id.toString(),
        userId: savedDiagram.userId,
        prompt: savedDiagram.prompt,
        mermaidCode: savedDiagram.mermaidCode,
        type: savedDiagram.type,
        createdAt: savedDiagram.createdAt,
        updatedAt: savedDiagram.updatedAt,
      },
    });
  } catch (error) {
    console.error('Save diagram error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save diagram',
    });
  }
};
