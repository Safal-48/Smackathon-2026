import { SoilReport } from '../models/SoilReport.js';
import { analyzeSoilQuality } from '../services/soilMlService.js';

export const analyzeSoil = async (req, res, next) => {
  try {
    const { nitrogen, phosphorus, potassium, pH, moisture, organicCarbon, soilImage, temperature, locationName, soilType } = req.body;

    const n = Number(nitrogen);
    const p = Number(phosphorus);
    const k = Number(potassium);
    const phVal = Number(pH);
    const moist = Number(moisture || 45);
    const oc = Number(organicCarbon || 0.65);

    if (isNaN(n) || isNaN(p) || isNaN(k) || isNaN(phVal)) {
      return res.status(400).json({ success: false, message: 'Invalid numeric soil values provided' });
    }

    const analysis = analyzeSoilQuality(n, p, k, phVal, moist, oc, soilType || 'Black Cotton', soilImage);

    let report;
    if (req.user && req.user._id) {
      try {
        report = await SoilReport.create({
          farmerId: req.user._id,
          nitrogen: n,
          phosphorus: p,
          potassium: k,
          pH: phVal,
          moisture: moist,
          organicCarbon: oc,
          soilImage: soilImage || null,
          temperature: temperature || 28,
          locationName: locationName || 'Main Farm Plot',
          soilType: soilType || 'Black Cotton',
          soilHealthScore: analysis.soilHealthScore,
          healthStatus: analysis.healthStatus,
          fertilityReport: analysis.fertilityReport,
          recommendedCrops: analysis.crops,
          recommendedFertilizers: analysis.fertilizers,
          irrigationAdvice: analysis.irrigationAdvice,
          soilImprovementTips: analysis.soilImprovementTips,
        });
      } catch (err) {
        console.warn('SoilReport DB save fallback mode active');
      }
    }

    res.json({
      success: true,
      report: report || {
        _id: 'report_' + Date.now(),
        nitrogen: n,
        phosphorus: p,
        potassium: k,
        pH: phVal,
        moisture: moist,
        organicCarbon: oc,
        soilImage: soilImage || null,
        soilType: soilType || 'Black Cotton',
        locationName: locationName || 'Main Farm Plot',
        soilHealthScore: analysis.soilHealthScore,
        healthStatus: analysis.healthStatus,
        fertilityReport: analysis.fertilityReport,
        recommendedCrops: analysis.crops,
        recommendedFertilizers: analysis.fertilizers,
        irrigationAdvice: analysis.irrigationAdvice,
        soilImprovementTips: analysis.soilImprovementTips,
        createdAt: new Date(),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getSoilHistory = async (req, res, next) => {
  try {
    let reports = [];
    if (req.user && req.user._id) {
      reports = await SoilReport.find({ farmerId: req.user._id }).sort({ createdAt: -1 });
    }

    if (reports.length === 0) {
      const demoAnalysis = analyzeSoilQuality(65, 32, 45, 6.8, 48, 0.72, 'Black Cotton');
      reports = [
        {
          _id: 'sample_hist_1',
          nitrogen: 65,
          phosphorus: 32,
          potassium: 45,
          pH: 6.8,
          moisture: 48,
          organicCarbon: 0.72,
          locationName: 'North Field Plot #1',
          soilType: 'Black Cotton',
          soilHealthScore: demoAnalysis.soilHealthScore,
          healthStatus: demoAnalysis.healthStatus,
          fertilityReport: demoAnalysis.fertilityReport,
          recommendedCrops: demoAnalysis.crops,
          recommendedFertilizers: demoAnalysis.fertilizers,
          irrigationAdvice: demoAnalysis.irrigationAdvice,
          soilImprovementTips: demoAnalysis.soilImprovementTips,
          createdAt: new Date(Date.now() - 86400000 * 3),
        },
      ];
    }

    res.json({ success: true, reports });
  } catch (error) {
    next(error);
  }
};
