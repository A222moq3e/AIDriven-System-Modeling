import OpenAI from 'openai';
import { db } from '../db/index.js';
import { diagrams } from '../db/schema.js';
import { eq, desc } from 'drizzle-orm';
import { generateId } from '../utils/crypto.js';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// @desc    Generate Mermaid code from prompt and Auto-Save
// @route   POST /api/diagrams/generate
// @access  Public (or Protected if we add middleware later)
export const generateDiagram = async (req, res) => {
  const { prompt, type, userId } = req.body;

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
    if (userId) {
      const diagramId = generateId();
      const [createdDiagram] = await db
        .insert(diagrams)
        .values({
          id: diagramId,
          userId,
          prompt,
          mermaidCode: cleanCode,
          type: type || 'flowchart',
        })
        .returning({
          id: diagrams.id,
          userId: diagrams.userId,
          prompt: diagrams.prompt,
          mermaidCode: diagrams.mermaidCode,
          type: diagrams.type,
          createdAt: diagrams.createdAt,
        });
      
      savedDiagram = createdDiagram;
    }

    res.status(200).json({
      success: true,
      data: {
        mermaid: cleanCode,
        type: type || 'flowchart',
        diagramId: savedDiagram ? savedDiagram.id : null,
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
    const userDiagrams = await db
      .select()
      .from(diagrams)
      .where(eq(diagrams.userId, userId))
      .orderBy(desc(diagrams.createdAt));

    res.status(200).json({
      success: true,
      data: userDiagrams,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch diagrams' 
    });
  }
};
