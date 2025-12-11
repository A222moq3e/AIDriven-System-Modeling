const mongoose = require('mongoose');

const diagramSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  prompt: {
    type: String,
    required: true,
  },
  mermaidCode: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Diagram', diagramSchema);
