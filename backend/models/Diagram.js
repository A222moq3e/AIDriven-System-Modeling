import mongoose from 'mongoose';

const diagramSchema = new mongoose.Schema({
  userId: {
    type: String,
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
    default: 'flowchart',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
diagramSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Diagram', diagramSchema);
