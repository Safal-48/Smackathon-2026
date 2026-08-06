import mongoose from 'mongoose';

const soilReportSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    nitrogen: {
      type: Number,
      required: true,
    },
    phosphorus: {
      type: Number,
      required: true,
    },
    potassium: {
      type: Number,
      required: true,
    },
    pH: {
      type: Number,
      required: true,
    },
    moisture: {
      type: Number,
      default: 45,
    },
    organicCarbon: {
      type: Number,
      default: 0.65,
    },
    soilImage: String,
    temperature: {
      type: Number,
      default: 28,
    },
    locationName: {
      type: String,
      default: 'Farm Plot #1',
    },
    soilType: {
      type: String,
      enum: ['Black Cotton', 'Red Soil', 'Alluvial', 'Clay Loam', 'Sandy Loam'],
      default: 'Black Cotton',
    },
    soilHealthScore: {
      type: Number,
      default: 85,
    },
    fertilityReport: {
      nitrogenLevel: String,
      phosphorusLevel: String,
      potassiumLevel: String,
      organicCarbonLevel: String,
      pHStatus: String,
      summary: String,
    },
    recommendedCrops: [
      {
        name: String,
        suitabilityScore: Number,
        expectedYield: String,
        season: String,
        reason: String,
      },
    ],
    recommendedFertilizers: [
      {
        name: String,
        dosage: String,
        timing: String,
      },
    ],
    irrigationAdvice: {
      frequency: String,
      method: String,
      waterVolumePerAcre: String,
      moistureManagement: String,
    },
    soilImprovementTips: [String],
    healthStatus: {
      type: String,
      enum: ['Optimal', 'Deficient', 'Acidic', 'Alkaline', 'Attention Needed'],
      default: 'Optimal',
    },
  },
  { timestamps: true }
);

export const SoilReport = mongoose.model('SoilReport', soilReportSchema);
