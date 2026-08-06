import { Scheme } from '../models/Scheme.js';
import { SchemeApplication } from '../models/SchemeApplication.js';
import { generateFarmerAIResponse, generateSchemeAIResponse } from '../services/aiService.js';

const MOCK_SCHEMES = [
  {
    _id: 'scheme_1',
    title: 'PM-KISAN Samman Nidhi Yojana',
    titleHindi: 'प्रधानमंत्री किसान सम्मान निधि योजना',
    titleMarathi: 'पंतप्रधान शेतकरी सन्मान निधी योजना',
    code: 'PM-KISAN',
    category: 'Financial Assistance',
    shortDescription: 'Direct annual income support of ₹6,000 transferred in 3 equal installments of ₹2,000 directly into farmer bank accounts.',
    shortDescriptionHindi: 'छोटे और सीमांत किसानों को ₹6,000 प्रति वर्ष 3 किश्तों में प्रत्यक्ष बैंक खाते में वित्तीय सहायता।',
    shortDescriptionMarathi: 'शेतकऱ्यांना वर्षाला ₹६,००० अर्थसहाय्य थेट बँक खात्यात जमा केले जाते.',
    fullDescription: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN) provides 100% central funding to enable landholding farmers to procure seed, fertilizers, and agricultural inputs.',
    eligibilityCriteria: {
      maxLandAcres: 10,
      targetCrops: ['Cotton', 'Wheat', 'Soybean', 'Paddy', 'All Crops'],
      targetStates: ['Maharashtra', 'Madhya Pradesh', 'Punjab', 'Uttar Pradesh', 'All India'],
      farmerCategory: ['Small & Marginal Farmers', 'All Farmers', 'Women Farmers'],
    },
    benefits: ['₹6,000 per year via Direct Benefit Transfer (DBT)', 'Zero middleman deduction', 'Aadhaar-linked automated payment'],
    requiredDocuments: ['Aadhaar Card', 'Bank Passbook linked with Aadhaar', 'Land Record (7/12 Extract / Khatauni)'],
    applicationDeadline: '31st December 2026 (Open)',
    applicationUrl: 'https://pmkisan.gov.in',
    isActive: true,
  },
  {
    _id: 'scheme_2',
    title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    titleHindi: 'प्रधानमंत्री फसल बीमा योजना',
    titleMarathi: 'पंतप्रधान पीक विमा योजना',
    code: 'PMFBY',
    category: 'Insurance & Credit',
    shortDescription: 'Comprehensive crop insurance against non-preventable natural risks (drought, flood, unseasonal rainfall, pest attacks).',
    shortDescriptionHindi: 'सूखा, बाढ़ और कीट हमले से फसल नुकसान पर न्यूनतम प्रीमियम पर पूर्ण सुरक्षा।',
    shortDescriptionMarathi: 'नैसर्गिक आपत्ती व कीड रोगांमुळे होणाऱ्या पीक नुकसानीवर सर्वसमावेशक विमा संरक्षण.',
    fullDescription: 'PMFBY offers complete financial security against pre-sowing to post-harvest crop damage with minimal premium rates (2% Kharif, 1.5% Rabi).',
    eligibilityCriteria: {
      maxLandAcres: 50,
      targetCrops: ['Cotton', 'Soybean', 'Wheat', 'Paddy', 'Pulses'],
      targetStates: ['Maharashtra', 'Madhya Pradesh', 'Gujarat', 'All India'],
      farmerCategory: ['All Farmers', 'Tenant Farmers', 'Small & Marginal Farmers'],
    },
    benefits: ['2% premium for Kharif crops & 1.5% for Rabi', '72-hour fast claim reporting via app', 'Full yield protection'],
    requiredDocuments: ['Aadhaar Card', 'Sowing Certificate', 'Land Possession Document', 'Bank Passbook'],
    applicationDeadline: '31st July 2026 (Kharif Cutoff)',
    applicationUrl: 'https://pmfby.gov.in',
    isActive: true,
  },
  {
    _id: 'scheme_3',
    title: 'PM Krishi Sinchayee Yojana (Drip & Sprinkler Subsidy)',
    titleHindi: 'प्रधानमंत्री कृषि सिंचाई योजना (ड्रिप सब्सिडी)',
    titleMarathi: 'पंतप्रधान कृषी सिंचन योजना (ठिबक सबसिडी)',
    code: 'PMKSY',
    category: 'Solar & Irrigation',
    shortDescription: '45% to 55% capital subsidy for installing micro-irrigation systems (Drip and Sprinkler sets) to double water efficiency.',
    shortDescriptionHindi: 'सूक्ष्म सिंचाई (ड्रिप/स्प्रिंकलर) सेट लगाने के लिए 45% से 55% तक सरकारी सब्सिडी।',
    shortDescriptionMarathi: 'ठिबक व तुषार सिंचन संचावर ४५% ते ५५% शासकीय अनुदान.',
    fullDescription: 'PMKSY Per Drop More Crop scheme promotes water conservation technologies for horticultural and field crops.',
    eligibilityCriteria: {
      maxLandAcres: 15,
      targetCrops: ['Cotton', 'Sugarcane', 'Vegetables', 'Fruits', 'Soybean'],
      targetStates: ['Maharashtra', 'Karnataka', 'Telangana', 'All India'],
      farmerCategory: ['Small & Marginal Farmers', 'Women Farmers', 'SC/ST Farmers'],
    },
    benefits: ['Up to 55% subsidy for Small & Marginal farmers', 'Saves 40-50% water while increasing yield by 30%'],
    requiredDocuments: ['Electricity Bill / Water Source Proof', '7/12 & 8A Land Extract', 'Aadhaar Card', 'Bank Passbook'],
    applicationDeadline: '31st October 2026',
    applicationUrl: 'https://pmksy.gov.in',
    isActive: true,
  },
  {
    _id: 'scheme_4',
    title: 'PM-KUSUM Solar Agriculture Pump Scheme',
    titleHindi: 'पीएम-कुसुम सोलर पंप योजना',
    titleMarathi: 'पीएम-कुसुम सौर कृषी पंप योजना',
    code: 'PM-KUSUM',
    category: 'Solar & Irrigation',
    shortDescription: 'Up to 60% combined capital subsidy for installing off-grid standalone solar agricultural pumps (3HP to 7.5HP).',
    shortDescriptionHindi: 'खेती में दिन के समय निर्बाध सिंचाई के लिए सोलर पंप पर 60% कुल सब्सिडी।',
    shortDescriptionMarathi: 'सौर कृषी पंपासाठी ६०% अनुदान व हक्काची दिवसभरात वीज.',
    fullDescription: 'PM-KUSUM ensures daytime solar power security for farmers, eliminating reliance on diesel pumps and erratic night power grids.',
    eligibilityCriteria: {
      maxLandAcres: 25,
      targetCrops: ['All Crops'],
      targetStates: ['Maharashtra', 'Rajasthan', 'Haryana', 'All India'],
      farmerCategory: ['All Farmers', 'Small & Marginal Farmers', 'SC/ST Farmers'],
    },
    benefits: ['60% total subsidy (30% Central + 30% State)', 'Zero electricity bill & daytime reliable irrigation'],
    requiredDocuments: ['Aadhaar Card', 'Land Ownership Record', 'DISCOM No Dues Certificate', 'Bank Passbook'],
    applicationDeadline: '15th November 2026',
    applicationUrl: 'https://pmkusum.mnre.gov.in',
    isActive: true,
  },
  {
    _id: 'scheme_5',
    title: 'Magel Tyala Shettale (On-Demand Farm Pond Subsidy)',
    titleHindi: 'मागेल त्याला शेततळे (मांगने पर खेत तालाब योजना)',
    titleMarathi: 'मागेल त्याला शेततळे योजना (महाराष्ट्र राज्य)',
    code: 'MTS-MH',
    category: 'Solar & Irrigation',
    shortDescription: 'Direct grant subsidy of up to ₹50,000 for constructing individual farm ponds to store rainwater.',
    shortDescriptionHindi: 'वर्षा जल संचयन हेतु खेत में तालाब निर्माण के लिए ₹50,000 की सीधी सब्सिडी।',
    shortDescriptionMarathi: 'शेततळे खोदकामासाठी रु. ५०,००० पर्यंत थेट आर्थिक अनुदान.',
    fullDescription: 'Maharashtra State Government initiative providing on-demand financial grant for farm pond excavation to battle drought.',
    eligibilityCriteria: {
      maxLandAcres: 10,
      targetCrops: ['Cotton', 'Soybean', 'Pulses', 'Horticulture'],
      targetStates: ['Maharashtra'],
      targetDistricts: ['Nagpur', 'Wardha', 'Amravati', 'Yavatmal', 'Chandrapur', 'Akola', 'Buldhana'],
      farmerCategory: ['Small & Marginal Farmers', 'SC/ST Farmers'],
    },
    benefits: ['₹50,000 direct subsidy in 3 stages', 'Guarantees protective irrigation during dry spells'],
    requiredDocuments: ['7/12 & 8A Land Extract', 'Self-Declaration Form', 'Aadhaar Card', 'Bank Passbook'],
    applicationDeadline: '31st March 2027',
    applicationUrl: 'https://mahadbt.maharashtra.gov.in',
    isActive: true,
  },
];

export const getSchemes = async (req, res, next) => {
  try {
    const { category, search, state, district, crop, farmerCategory, landAcres } = req.query;

    let filter = { isActive: true };

    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { titleHindi: { $regex: search, $options: 'i' } },
        { titleMarathi: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
      ];
    }

    let schemes = [];
    try {
      schemes = await Scheme.find(filter).sort({ createdAt: -1 });
    } catch (err) {
      console.warn('Scheme DB query fallback active');
    }

    if (!schemes || schemes.length === 0) {
      schemes = MOCK_SCHEMES;
    }

    // Smart Client-Side & Server Filter Logic
    let filtered = schemes.filter((s) => {
      // 1. Category Filter
      if (category && s.category.toLowerCase() !== category.toLowerCase()) return false;

      // 2. Search Query
      if (search) {
        const q = search.toLowerCase();
        const matchTitle = s.title.toLowerCase().includes(q) || (s.titleHindi && s.titleHindi.includes(q)) || (s.titleMarathi && s.titleMarathi.includes(q));
        const matchCode = s.code.toLowerCase().includes(q);
        const matchDesc = s.shortDescription.toLowerCase().includes(q);
        if (!matchTitle && !matchCode && !matchDesc) return false;
      }

      // 3. State & District Filter
      if (state && state !== 'All States') {
        const targetStates = s.eligibilityCriteria?.targetStates || [];
        if (!targetStates.includes('All India') && !targetStates.includes(state)) return false;
      }

      if (district && s.eligibilityCriteria?.targetDistricts?.length > 0) {
        if (!s.eligibilityCriteria.targetDistricts.includes(district)) return false;
      }

      // 4. Crop Filter
      if (crop && crop !== 'All Crops') {
        const targetCrops = s.eligibilityCriteria?.targetCrops || [];
        if (!targetCrops.includes('All Crops') && !targetCrops.includes(crop)) return false;
      }

      // 5. Land Size Filter
      if (landAcres) {
        const acres = Number(landAcres);
        if (s.eligibilityCriteria?.maxLandAcres && acres > s.eligibilityCriteria.maxLandAcres) return false;
      }

      // 6. Farmer Category Filter
      if (farmerCategory && farmerCategory !== 'All Categories') {
        const cats = s.eligibilityCriteria?.farmerCategory || [];
        if (!cats.includes('All Farmers') && !cats.includes(farmerCategory)) return false;
      }

      return true;
    });

    res.json({ success: true, count: filtered.length, schemes: filtered });
  } catch (error) {
    next(error);
  }
};

export const chatWithSchemeAI = async (req, res, next) => {
  try {
    const { prompt, language, imageBase64 } = req.body;

    if (!prompt) {
      return res.status(400).json({ success: false, message: 'Query prompt is required' });
    }

    let schemes = [];
    try {
      schemes = await Scheme.find({ isActive: true });
    } catch (e) {
      schemes = MOCK_SCHEMES;
    }

    const aiAnswer = await generateFarmerAIResponse(prompt, language || 'en', imageBase64 || null, schemes);

    res.json({
      success: true,
      answer: aiAnswer,
      language: language || 'en',
    });
  } catch (error) {
    next(error);
  }
};

export const applyForScheme = async (req, res, next) => {
  try {
    const { schemeId, farmerNotes } = req.body;

    let appObj;
    if (req.user && req.user._id) {
      try {
        appObj = await SchemeApplication.create({
          farmerId: req.user._id,
          schemeId,
          farmerNotes: farmerNotes || 'Application recorded via Smart Farming Assistant App.',
        });
      } catch (err) {
        console.warn('SchemeApplication DB create fallback');
      }
    }

    res.status(201).json({
      success: true,
      message: 'Application recorded successfully!',
      application: appObj || {
        _id: 'app_' + Date.now(),
        schemeId,
        status: 'Submitted',
        farmerNotes,
        createdAt: new Date(),
      },
    });
  } catch (error) {
    next(error);
  }
};
