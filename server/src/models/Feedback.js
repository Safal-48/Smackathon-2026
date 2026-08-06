import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    name: { type: String, default: 'Anonymous Farmer' },
    phone: String,
    category: {
      type: String,
      enum: ['soil_analysis', 'government_scheme', 'ai_assistant', 'general', 'bug_report'],
      default: 'general',
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    message: {
      type: String,
      required: [true, 'Feedback message is required'],
      maxlength: [1000, 'Feedback cannot exceed 1000 characters'],
    },
    status: {
      type: String,
      enum: ['open', 'in_review', 'resolved'],
      default: 'open',
    },
    adminReply: String,
    resolvedAt: Date,
  },
  { timestamps: true }
);

export const Feedback = mongoose.model('Feedback', feedbackSchema);
