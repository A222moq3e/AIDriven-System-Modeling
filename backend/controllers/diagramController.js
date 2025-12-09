const OpenAI = require('openai');
const Diagram = require('../models/Diagram');
const dotenv = require('dotenv');

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// @desc    Generate Mermaid code from prompt and Auto-Save
// @route   POST /api/diagrams/generate
// @access  Public (or Protected if we add middleware later)
const generateDiagram = async (req, res) => {
  const { prompt, type, userId } = req.body;

  if (!prompt) {
    return res.status(400).json({ message: 'Prompt is required' });
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
      savedDiagram = await Diagram.create({
        userId,
        prompt,
        mermaidCode: cleanCode,
        type: type || 'flowchart',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        mermaid: cleanCode,
        type: type || 'flowchart',
        diagramId: savedDiagram ? savedDiagram._id : null,
      },
    });
  } catch (error) {
    console.error("OpenAI Error:", error);
    res.status(500).json({ message: 'Failed to generate diagram' });
  }
};

// @desc    Get user diagrams
// @route   GET /api/diagrams/:userId
// @access  Public
const getDiagrams = async (req, res) => {
  const { userId } = req.params;

  try {
    const diagrams = await Diagram.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: diagrams,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch diagrams' });
  }
};

module.exports = {
  generateDiagram,
  getDiagrams,
};
/*
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const response = await openai.responses.create({
  prompt: {
    "id": "pmpt_6925efc645008196aef1bed0c7ea4c4b0e39ebb9f904648c",
    "version": "2"
  },
  input: [],
  reasoning: {},
  store: true,
  include: [
    "reasoning.encrypted_content",
    "web_search_call.action.sources"
  ]
});

*/