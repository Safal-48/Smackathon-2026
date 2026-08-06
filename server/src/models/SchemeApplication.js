import mongoose from 'mongoose';

const schemeApplicationSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    schemeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Scheme',
      required: true,
    },
    status: {
      type: String,
      enum: ['Submitted', 'Under Review', 'Approved', 'Rejected'],
      default: 'Submitted',
    },
    farmerNotes: String,
    adminRemarks: String,
  },
  { timestamps: true }
);

export const SchemeApplication = mongoose.model('SchemeApplication', schemeApplicationSchema);
