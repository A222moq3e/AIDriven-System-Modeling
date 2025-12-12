import OpenAI from 'openai';
import Diagram from '../models/Diagram.js';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// @desc    Generate Mermaid code from prompt and Auto-Save
// @route   POST /api/diagrams/generate
// @access  Public (or Protected if we add middleware later)
export const generateDiagram = async (req, res) => {
  const { prompt, type, userId, save = false } = req.body;

  if (!prompt) {
    return res.status(400).json({ 
      success: false,
      message: 'Prompt is required' 
    });
  }

  try {
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that generates valid Mermaid.js diagram code. Return ONLY the mermaid code, no markdown fencing, no explanation."
        },
        {
          role: "user",
          content: `Create a ${type || 'flowchart'} mermaid diagram for: ${prompt}`
        }
      ],
      max_tokens: 500,
    });

    const mermaidCode = aiResponse.choices[0].message.content.trim();
    // Clean up if the AI adds markdown backticks by mistake
    const cleanCode = mermaidCode.replace(/^```mermaid\n?/, '').replace(/```$/, '');

    let savedDiagram = null;
    // Only save when explicitly requested (save === true) to avoid duplicates during retries
    if (save && userId) {
      const newDiagram = new Diagram({
        userId,
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

// @desc    Get user diagrams
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
  const { userId, prompt, mermaidCode, type } = req.body;

  if (!userId || !prompt || !mermaidCode) {
    return res.status(400).json({
      success: false,
      message: 'userId, prompt, and mermaidCode are required',
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
        id: savedDiagram._id.toString(),
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
