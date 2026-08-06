import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ['user', 'ai'],
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    default: 'en',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const chatHistorySchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    topic: {
      type: String,
      default: 'Government Scheme Inquiry',
    },
    messages: [chatMessageSchema],
  },
  { timestamps: true }
);

export const ChatHistory = mongoose.model('ChatHistory', chatHistorySchema);
