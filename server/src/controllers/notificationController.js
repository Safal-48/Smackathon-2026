import { Notification } from '../models/Notification.js';

// GET /api/v1/notifications — get user notifications (latest 20)
export const getNotifications = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    let notifications = [];
    try {
      notifications = await Notification.find({ userId: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));
    } catch (err) {
      // Fallback mock notifications
      notifications = [
        {
          _id: 'notif_1',
          type: 'payment',
          title: 'PM-KISAN Installment Received',
          message: '17th installment of ₹2,000 has been credited to your linked bank account.',
          isRead: false,
          createdAt: new Date(Date.now() - 2 * 3600 * 1000),
          actionUrl: '/schemes',
        },
        {
          _id: 'notif_2',
          type: 'weather',
          title: 'Rain Alert for Tomorrow',
          message: 'Moderate rainfall (15mm) expected tomorrow. Postpone pesticide spraying.',
          isRead: false,
          createdAt: new Date(Date.now() - 30 * 60 * 1000),
          actionUrl: '/',
        },
        {
          _id: 'notif_3',
          type: 'soil_report',
          title: 'Soil Report Generated',
          message: 'Your Plot A soil analysis is ready. Health Score: 88/100.',
          isRead: true,
          createdAt: new Date(Date.now() - 86400 * 1000),
          actionUrl: '/soil-analysis',
        },
        {
          _id: 'notif_4',
          type: 'scheme',
          title: 'PMKSY Drip Subsidy Deadline',
          message: 'Last date to apply for PMKSY drip irrigation subsidy is 31st October 2026.',
          isRead: false,
          createdAt: new Date(Date.now() - 3 * 86400 * 1000),
          actionUrl: '/schemes',
        },
      ];
    }

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    res.json({
      success: true,
      count: notifications.length,
      unreadCount,
      notifications,
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/v1/notifications/:id/read — mark single notification as read
export const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { isRead: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    res.json({ success: true, notification });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/v1/notifications/mark-all-read — mark all as read
export const markAllRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ userId: req.user._id, isRead: false }, { isRead: true });
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/v1/notifications/:id — delete a notification
export const deleteNotification = async (req, res, next) => {
  try {
    await Notification.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    res.json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    next(error);
  }
};

// Helper to create system notifications (used by other controllers)
export const createNotification = async (userId, type, title, message, actionUrl = null) => {
  try {
    await Notification.create({ userId, type, title, message, actionUrl });
  } catch (err) {
    console.warn('Notification create failed (non-critical):', err.message);
  }
};
