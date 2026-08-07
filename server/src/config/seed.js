import { User } from '../models/User.js';
import { Scheme } from '../models/Scheme.js';
import { SoilReport } from '../models/SoilReport.js';

export const seedInitialData = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('🌱 Seeding initial Farmer & Admin accounts into MongoDB...');
      
      // Admin Account
      const admin = await User.create({
        fullName: 'KrishiSeva Admin',
        phone: '9999999999',
        password: 'admin123',
        role: 'admin',
        state: 'Maharashtra',
        district: 'Nagpur',
        preferredLanguage: 'en',
      });

      // Sample Farmer Accounts
      const farmer1 = await User.create({
        fullName: 'Safal Sharma',
        phone: '9876543210',
        password: 'farmer123',
        role: 'farmer',
        state: 'Maharashtra',
        district: 'Nagpur',
        farmSizeAcres: 3.5,
        preferredLanguage: 'en',
      });

      const farmer2 = await User.create({
        fullName: 'Ramesh Patil',
        phone: '9876543211',
        password: 'farmer123',
        role: 'farmer',
        state: 'Maharashtra',
        district: 'Wardha',
        farmSizeAcres: 5.0,
        preferredLanguage: 'mr',
      });

      console.log('✅ Created initial accounts in MongoDB:');
      console.log(`   - Admin: 9999999999 / admin123`);
      console.log(`   - Farmer 1: 9876543210 / farmer123`);
      console.log(`   - Farmer 2: 9876543211 / farmer123`);

      // Seed initial Soil Report for Farmer 1
      await SoilReport.create({
        farmerId: farmer1._id,
        nitrogen: 65,
        phosphorus: 28,
        potassium: 42,
        pH: 6.8,
        moisture: 48,
        organicCarbon: 0.72,
        locationName: 'Plot A - Main Farm',
        soilType: 'Black Cotton',
        soilHealthScore: 92,
        healthStatus: 'Optimal',
        recommendedCrops: [
          { name: 'Bt Cotton (NHH-44)', suitabilityScore: 95, expectedYield: '15 Q/acre', season: 'Kharif', reason: 'High NPK fertility & optimal pH' },
          { name: 'Soybean (JS-335)', suitabilityScore: 90, expectedYield: '10 Q/acre', season: 'Kharif', reason: 'Good organic carbon level' },
        ],
        recommendedFertilizers: [
          { name: 'Urea (46% N)', dosage: '25 kg/acre', timing: 'Split application at 30 days' },
          { name: 'DAP (18:46:0)', dosage: '20 kg/acre', timing: 'Basal application at sowing' },
        ],
        irrigationAdvice: {
          frequency: 'Every 5-7 days',
          method: 'Drip Irrigation',
          waterVolumePerAcre: '4000 Liters/day',
          moistureManagement: 'Maintain 45-50% soil saturation',
        },
        soilImprovementTips: [
          'Add 3-4 tons of Farm Yard Manure (FYM) per acre before sowing.',
          'Practice mulching to conserve moisture during hot dry spells.',
        ],
      });

      console.log('✅ Created sample Soil Health Report in MongoDB.');
    }
  } catch (err) {
    console.warn('Seed initial data warning:', err.message);
  }
};
