/**
 * AI Soil Health, Fertility & Agronomic Advisory Service
 * Calculates Soil Health Score (0-100), Fertility Breakdown,
 * Crop Suitability, Fertilizer Dosages, Irrigation Advice & Soil Improvement Tips.
 */

export const analyzeSoilQuality = (
  nitrogen,
  phosphorus,
  potassium,
  pH,
  moisture = 45,
  organicCarbon = 0.65,
  soilType = 'Black Cotton',
  soilImage = null
) => {
  const crops = [];
  const fertilizers = [];
  const soilImprovementTips = [];

  // 1. Calculate Comprehensive Soil Health Score (0 - 100)
  let nScore = Math.min(100, (nitrogen / 80) * 100);
  let pScore = Math.min(100, (phosphorus / 40) * 100);
  let kScore = Math.min(100, (potassium / 60) * 100);
  let ocScore = Math.min(100, (organicCarbon / 0.8) * 100);
  
  let phPenalty = Math.abs(6.8 - pH) * 15;
  let rawScore = Math.round((nScore * 0.3 + pScore * 0.25 + kScore * 0.25 + ocScore * 0.2) - phPenalty);
  let soilHealthScore = Math.max(35, Math.min(98, rawScore));

  // Determine pH Health
  let healthStatus = 'Optimal';
  let pHStatus = 'Balanced / Neutral (6.5 - 7.5)';
  if (pH < 6.0) {
    healthStatus = 'Acidic';
    pHStatus = 'Acidic (< 6.0) - High Aluminium Toxicity Risk';
    fertilizers.push({
      name: 'Agricultural Lime (Calcite / Dolomitic Limestone)',
      dosage: '250 - 300 kg / acre',
      timing: 'Incorporate 3-4 weeks before seed sowing during tilling.',
    });
    soilImprovementTips.push('Apply Agricultural Lime or Wood Ash to raise soil pH to optimal 6.5.');
  } else if (pH > 7.8) {
    healthStatus = 'Alkaline';
    pHStatus = 'Alkaline (> 7.8) - Micronutrient Fixation Risk';
    fertilizers.push({
      name: 'Gypsum (Calcium Sulfate) & Elemental Sulfur',
      dosage: '200 kg / acre',
      timing: 'Mix thoroughly into topsoil during land preparation.',
    });
    soilImprovementTips.push('Incorporate agricultural gypsum and sulfur-enriched compost to reduce alkalinity.');
  }

  // Nitrogen Assessment & Recommendations
  let nitrogenLevel = 'Optimal (60 - 90 kg/ha)';
  if (nitrogen < 50) {
    nitrogenLevel = 'Deficient (< 50 kg/ha)';
    fertilizers.push({
      name: 'Urea (46% N) / Neem Coated Urea',
      dosage: '45 - 50 kg / acre (2 split doses)',
      timing: '50% at sowing, 50% at peak vegetative growth stage.',
    });
    soilImprovementTips.push('Plant leguminous green manure crops (Sesbania / Sunnhemp) to naturally fix atmospheric nitrogen.');
  }

  // Phosphorus Assessment
  let phosphorusLevel = 'Optimal (25 - 45 kg/ha)';
  if (phosphorus < 25) {
    phosphorusLevel = 'Low (< 25 kg/ha)';
    fertilizers.push({
      name: 'Single Super Phosphate (SSP) / Di-Ammonium Phosphate (DAP)',
      dosage: '50 kg / acre',
      timing: 'Apply as basal fertilizer at root zone level during seeding.',
    });
    soilImprovementTips.push('Use Phosphate Solubilizing Bacteria (PSB) bio-fertilizer to release bound soil phosphorus.');
  }

  // Potassium Assessment
  let potassiumLevel = 'Optimal (40 - 70 kg/ha)';
  if (potassium < 40) {
    potassiumLevel = 'Deficient (< 40 kg/ha)';
    fertilizers.push({
      name: 'Muriate of Potash (MOP - 60% K2O)',
      dosage: '25 - 30 kg / acre',
      timing: 'Apply during grain/pod development to bolster disease resistance.',
    });
  }

  // Organic Carbon Assessment
  let organicCarbonLevel = 'High (> 0.75%)';
  if (organicCarbon < 0.5) {
    organicCarbonLevel = 'Low (< 0.5%)';
    soilImprovementTips.push('Add 3-5 tonnes of Well-Rotted Farmyard Manure (FYM) or Vermicompost per acre annually.');
  } else if (organicCarbon < 0.75) {
    organicCarbonLevel = 'Moderate (0.5% - 0.75%)';
    soilImprovementTips.push('Practice zero-tillage or reduced tillage to preserve organic carbon humus.');
  }

  soilImprovementTips.push('Adopt crop rotation alternating deep-rooted cereals with nitrogen-fixing pulses.');

  // Crop Recommendation Logic
  if (nitrogen >= 40 && pH >= 6.0 && pH <= 8.2 && (soilType === 'Black Cotton' || soilType === 'Alluvial')) {
    crops.push({
      name: 'Cotton (Bt Cotton Hybrid)',
      suitabilityScore: 95,
      expectedYield: '12 - 15 Quintals / acre',
      season: 'Kharif (June - Nov)',
      reason: 'Black clay soil provides optimal cation exchange capacity for cotton roots.',
    });
  }

  if (nitrogen >= 45 && phosphorus >= 20 && pH >= 6.5 && pH <= 7.8) {
    crops.push({
      name: 'Wheat (Sharbati / Durum)',
      suitabilityScore: 92,
      expectedYield: '18 - 22 Quintals / acre',
      season: 'Rabi (Nov - April)',
      reason: 'Ideal soil NPK balance and cool climate root aeration.',
    });
  }

  if (phosphorus >= 15 && potassium >= 30) {
    crops.push({
      name: 'Soybean (JS 335 / JS 9560)',
      suitabilityScore: 89,
      expectedYield: '8 - 10 Quintals / acre',
      season: 'Kharif (June - Sept)',
      reason: 'Legumes thrive on current phosphorus levels while rebuilding soil nitrogen.',
    });
  }

  if (moisture >= 40 && nitrogen >= 60 && pH >= 5.5 && pH <= 7.2) {
    crops.push({
      name: 'Paddy / Rice (Basmati)',
      suitabilityScore: 87,
      expectedYield: '22 - 26 Quintals / acre',
      season: 'Kharif',
      reason: 'High clay moisture retention supports standing water puddle conditions.',
    });
  }

  if (crops.length < 3) {
    crops.push({
      name: 'Maize (Hybrid Yellow Corn)',
      suitabilityScore: 84,
      expectedYield: '20 - 24 Quintals / acre',
      season: 'Kharif / Rabi',
      reason: 'Highly adaptable crop with moderate nutrient demand.',
    });
  }

  // Irrigation Advice based on Soil Type & Moisture
  let irrigationAdvice = {
    frequency: 'Every 5 - 7 Days',
    method: 'Drip Irrigation System (4 LPH emitters)',
    waterVolumePerAcre: '12,000 - 15,000 Litres per cycle',
    moistureManagement: 'Maintain 45-55% field capacity during flowering and pod development.',
  };

  if (soilType === 'Sandy Loam') {
    irrigationAdvice.frequency = 'Every 3 - 4 Days (High Percolation)';
    irrigationAdvice.method = 'Micro-Sprinklers / Drip Tape';
  } else if (soilType === 'Black Cotton' || soilType === 'Clay Loam') {
    irrigationAdvice.frequency = 'Every 7 - 9 Days (High Moisture Retention)';
    irrigationAdvice.method = 'Drip Irrigation with 1.5m lateral spacing';
  }

  return {
    soilHealthScore,
    healthStatus,
    fertilityReport: {
      nitrogenLevel,
      phosphorusLevel,
      potassiumLevel,
      organicCarbonLevel,
      pHStatus,
      summary: `Soil Health Score is ${soilHealthScore}/100. Soil exhibits ${healthStatus.toLowerCase()} characteristics with ${organicCarbonLevel.toLowerCase()} organic carbon content.`,
    },
    crops: crops.sort((a, b) => b.suitabilityScore - a.suitabilityScore),
    fertilizers,
    irrigationAdvice,
    soilImprovementTips,
  };
};
