import mongoose from 'mongoose';

const schemeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    titleHindi: String,
    titleMarathi: String,
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    category: {
      type: String,
      enum: ['Financial Assistance', 'Insurance & Credit', 'Solar & Irrigation', 'Soil & Fertilizer Subsidy', 'Equipment & Tech'],
      required: true,
    },
    shortDescription: {
      type: String,
      required: true,
    },
    shortDescriptionHindi: String,
    shortDescriptionMarathi: String,
    fullDescription: {
      type: String,
      required: true,
    },
    eligibilityCriteria: {
      maxLandAcres: Number,
      minLandAcres: Number,
      targetCrops: [String],
      targetStates: [String],
      targetDistricts: [String],
      farmerCategory: [String], // e.g. ['Small & Marginal', 'All Farmers', 'Women Farmers', 'SC/ST']
      incomeCap: Number,
    },
    benefits: [String],
    benefitsHindi: [String],
    benefitsMarathi: [String],
    requiredDocuments: [String],
    applicationDeadline: {
      type: String,
      default: '31st March 2027 (Ongoing)',
    },
    applicationUrl: String,
    portalHelpContact: String,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Scheme = mongoose.model('Scheme', schemeSchema);
