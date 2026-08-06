import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['scheme', 'weather', 'soil_report', 'system', 'payment', 'reminder'],
      default: 'system',
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    actionUrl: String,   // deeplink route e.g. '/schemes'
    metadata: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

// Auto-expire notifications after 30 days
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 3600 });

export const Notification = mongoose.model('Notification', notificationSchema);
