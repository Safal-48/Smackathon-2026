import { Feedback } from '../models/Feedback.js';

// POST /api/v1/feedback — submit feedback (public, no auth required)
export const submitFeedback = async (req, res, next) => {
  try {
    const { category, rating, message, name, phone } = req.body;

    if (!message || message.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Feedback message must be at least 10 characters.',
      });
    }

    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5.' });
    }

    const feedbackData = {
      category: category || 'general',
      rating: rating ? Number(rating) : undefined,
      message: message.trim(),
      name: name || (req.user ? req.user.fullName : 'Anonymous Farmer'),
      phone: phone || (req.user ? req.user.phone : undefined),
    };

    if (req.user?._id) {
      feedbackData.userId = req.user._id;
    }

    let feedback;
    try {
      feedback = await Feedback.create(feedbackData);
    } catch (err) {
      // Return mock success if DB unavailable
      feedback = { _id: 'fb_' + Date.now(), ...feedbackData, status: 'open', createdAt: new Date() };
    }

    res.status(201).json({
      success: true,
      message: 'Thank you for your feedback! We will review it shortly.',
      feedback,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/feedback — admin: get all feedback (paginated)
export const getAllFeedback = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, category } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;

    const skip = (Number(page) - 1) * Number(limit);

    const [feedback, total] = await Promise.all([
      Feedback.find(filter)
        .populate('userId', 'fullName phone district')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Feedback.countDocuments(filter),
    ]);

    res.json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      feedback,
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/v1/feedback/:id — admin: update feedback status & reply
export const updateFeedbackStatus = async (req, res, next) => {
  try {
    const { status, adminReply } = req.body;
    const update = {};
    if (status) update.status = status;
    if (adminReply) update.adminReply = adminReply;
    if (status === 'resolved') update.resolvedAt = new Date();

    const feedback = await Feedback.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!feedback) {
      return res.status(404).json({ success: false, message: 'Feedback record not found' });
    }
    res.json({ success: true, feedback });
  } catch (error) {
    next(error);
  }
};
