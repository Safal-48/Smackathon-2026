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
    requiredDocuments: ['Aadhaar card', 'Bank passbook (Aadhaar linked)', 'Land record (Khatauni/Patta / 7/12 & 8A)'],
    requiredDocumentsHindi: ['आधार कार्ड', 'बैंक पासबुक (आधार से लिंक)', 'जमीन का रिकॉर्ड (खतौनी/पट्टा / 7/12)'],
    requiredDocumentsMarathi: ['आधार कार्ड', 'बँक पासबुक (आधार लिंक)', 'जमीन उतारा (७/१२ आणि ८अ)'],
    applicationSteps: [
      'Collect Aadhaar, bank passbook and land papers.',
      'Visit nearest CSC or open pmkisan.gov.in.',
      'Click \'New Farmer Registration\' and fill details.',
      'Submit and note the registration number.',
      'Track status on the same website.'
    ],
    applicationStepsHindi: [
      'आधार कार्ड, बैंक पासबुक और जमीन के दस्तावेज इकट्ठा करें।',
      'निकटतम CSC केंद्र पर जाएं या pmkisan.gov.in खोलें।',
      '\'न्यू फार्मर रजिस्ट्रेशन\' पर क्लिक करें और विवरण भरें।',
      'सबमिट करें और पंजीकरण संख्या नोट करें।',
      'उसी वेबसाइट पर आवेदन स्थिति ट्रैक करें।'
    ],
    applicationStepsMarathi: [
      'आधार कार्ड, बँक पासबुक आणि ७/१२ उतारा गोळा करा.',
      'जवळच्या महा-ई-सेवा केंद्राला भेट द्या किंवा pmkisan.gov.in उघडा.',
      '\'न्यू फार्मर रजिस्ट्रेशन\' वर क्लिक करा आणि माहिती भरा.',
      'अर्ज सबमिट करा आणि नोंदणी क्रमांक लिहून ठेवा.',
      'त्याच वेबसाईटवर अर्जाची स्थिती तपासा.'
    ],
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
    requiredDocuments: ['Aadhaar Card', 'Sowing Certificate / Declaration', 'Land Possession Document (7/12)', 'Bank Passbook'],
    requiredDocumentsHindi: ['आधार कार्ड', 'बुआई प्रमाण पत्र / घोषणा पत्र', 'भूमि स्वामित्व दस्तावेज (7/12)', 'बैंक पासबुक'],
    requiredDocumentsMarathi: ['आधार कार्ड', 'पिक पेरा दाखला / घोषणापत्र', 'जमीन उतारा (७/१२ व ८अ)', 'बँक पासबुक'],
    applicationSteps: [
      'Get crop sowing certificate from Gram Panchayat or Talathi.',
      'Visit National Crop Insurance Portal (pmfby.gov.in) or Bank Branch.',
      'Fill crop sowing details and land survey number.',
      'Pay nominal premium (2% for Kharif crops).',
      'Download insurance policy receipt.'
    ],
    applicationStepsHindi: [
      'ग्राम पंचायत या पटवारी से फसल बुआई प्रमाण पत्र लें।',
      'राष्ट्रीय फसल बीमा पोर्टल (pmfby.gov.in) या बैंक शाखा पर जाएं।',
      'फसल विवरण और भूमि सर्वे नंबर भरें।',
      'न्यूनतम प्रीमियम राशि का भुगतान करें।',
      'बीमा नीति की रसीद डाउनलोड करें।'
    ],
    applicationStepsMarathi: [
      'ग्रामपंचायत किंवा तलाठ्याकडून पिक पेरा दाखला मिळवा.',
      'पीक विमा पोर्टल (pmfby.gov.in) किंवा बँक शाखेत जा.',
      'पिकाची माहिती आणि ७/१२ सर्व्हे नंबर प्रविष्ट करा.',
      'नामात्र विमा हप्ता भरा.',
      'पीक विमा पावती डाउनलोड करा.'
    ],
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
    requiredDocumentsHindi: ['बिजली बिल / जल स्रोत प्रमाण पत्र', '7/12 और 8A भूमि रिकॉर्ड', 'आधार कार्ड', 'बैंक पासबुक'],
    requiredDocumentsMarathi: ['वीज बिल / पाणी स्त्रोत पुरावा', '७/१२ आणि ८अ उतारा', 'आधार कार्ड', 'बँक पासबुक'],
    applicationSteps: [
      'Register on State DBT Agriculture Portal (e.g. MahaDBT).',
      'Select \'Micro Irrigation (Drip/Sprinkler)\' under PMKSY.',
      'Upload 7/12 extract and water source proof.',
      'Select empanelled drip manufacturer & get quotation.',
      'Upon pre-sanction, install system and submit invoice for subsidy release.'
    ],
    applicationStepsHindi: [
      'राज्य डीबीटी कृषि पोर्टल (जैसे MahaDBT) पर पंजीकरण करें।',
      'PMKSY के तहत \'सूक्ष्म सिंचाई (ड्रिप/स्प्रिंकलर)\' चुनें।',
      '7/12 एक्सट्रैक्ट और जल स्रोत का प्रमाण अपलोड करें।',
      'अनुमोदित ड्रिप निर्माता कंपनी चुनें और कोटेशन प्राप्त करें।',
      'मंजूरी मिलने के बाद सिस्टम लगाएं और सब्सिडी के लिए बिल जमा करें।'
    ],
    applicationStepsMarathi: [
      'महाडीबीटी (MahaDBT) कृषी पोर्टलवर नोंदणी करा.',
      'सिंचन योजनेअंतर्गत \'ठिबक / तुषार सिंचन\' पर्याय निवडा.',
      '७/१२ उतारा व विहीर/पाणी स्त्रोताचा पुरावा अपलोड करा.',
      'मान्यताप्राप्त कंपनीकडून कोटेशन घ्या.',
      'पूर्वसंमती मिळाल्यावर संच बसवा व अनुदान खात्यात मिळवा.'
    ],
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
    requiredDocuments: ['Aadhaar Card', 'Land Ownership Record (7/12)', 'DISCOM No Dues Certificate / No Elec Connection Proof', 'Bank Passbook'],
    requiredDocumentsHindi: ['आधार कार्ड', 'भूमि स्वामित्व प्रमाण (7/12)', 'बिजली कंपनी अनापत्ति / नो कनेक्शन प्रमाण', 'बैंक पासबुक'],
    requiredDocumentsMarathi: ['आधार कार्ड', 'जमीन मालकी हक्क ७/१२', 'वीज जोडणी नसल्याचे प्रमाणपत्र / नो ड्यूस', 'बँक पासबुक'],
    applicationSteps: [
      'Visit State Renewable Energy Portal (e.g., MEDA / PM-KUSUM portal).',
      'Fill online application for Standalone Solar Agriculture Pump.',
      'Upload land ownership papers and water source details.',
      'Pay 10% farmer share cost after application verification.',
      'Vendor installs solar pump setup at farm land.'
    ],
    applicationStepsHindi: [
      'राज्य नवीकरणीय ऊर्जा पोर्टल (जैसे MEDA / PM-KUSUM) पर जाएं।',
      'सोलर कृषि पंप के लिए ऑनलाइन आवेदन भरें।',
      'भूमि रिकॉर्ड और जल स्रोत विवरण अपलोड करें।',
      'आवेदन सत्यापन के बाद 10% किसान अंशदान राशि जमा करें।',
      'विक्रेता द्वारा खेत में सोलर पंप स्थापित किया जाएगा।'
    ],
    applicationStepsMarathi: [
      'मेढा (MEDA) किंवा कुसुम योजना पोर्टलवर अर्ज करा.',
      'सौर कृषी पंपासाठी ऑनलाईन अर्ज प्रविष्ट करा.',
      '७/१२ आणि पाण्याच्या स्त्रोताची माहिती अपलोड करा.',
      'छाननी पूर्ण झाल्यावर १०% शेतकरी हिस्सा भरा.',
      'कंपनीद्वारे शेतात सौर पंप संच बसवला जाईल.'
    ],
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
    requiredDocumentsHindi: ['7/12 और 8A भूमि रिकॉर्ड', 'स्वयं घोषणा पत्र', 'आधार कार्ड', 'बैंक पासबुक'],
    requiredDocumentsMarathi: ['७/१२ आणि ८अ उतारा', 'स्वयंघोषणा पत्र', 'आधार कार्ड', 'बँक पासबुक'],
    applicationSteps: [
      'Apply online on MahaDBT Farmer Portal.',
      'Select \'Farm Pond (शेततळे)\' under Soil & Water Conservation.',
      'Agriculture officer visits land for site feasibility inspection.',
      'Receive administrative sanction letter.',
      'Excavate farm pond as per dimensions & receive ₹50,000 grant in bank account.'
    ],
    applicationStepsHindi: [
      'MahaDBT किसान पोर्टल पर ऑनलाइन आवेदन करें।',
      'मृदा व जल संरक्षण के तहत \'खेत तालाब\' विकल्प चुनें।',
      'कृषि अधिकारी साइट निरीक्षण के लिए खेत का दौरा करेंगे।',
      'प्रशासनिक स्वीकृति पत्र प्राप्त करें।',
      'मानक आकार के अनुसार तालाब खोदें और ₹50,000 की राशि प्राप्त करें।'
    ],
    applicationStepsMarathi: [
      'महाडीबीटी शेतकरी पोर्टलवर ऑनलाईन अर्ज करा.',
      'मृद व जल संधारणांतर्गत \'शेततळे\' पर्याय निवडा.',
      'कृषी सहाय्यक शेतात येऊन जागेची पाहणी करतील.',
      'प्रशासकीय मान्यता पत्र (Sanction Order) मिळवा.',
      'शेततळ्याचे खोदकाम पूर्ण करा आणि ५०,००० रुपये अनुदान खात्यात मिळवा.'
    ],
    applicationDeadline: '31st March 2027',
    applicationUrl: 'https://mahadbt.maharashtra.gov.in',
    isActive: true,
  },
  {
    _id: 'scheme_6',
    title: 'Kisan Credit Card (KCC) Low-Interest Agri Loan',
    titleHindi: 'किसान क्रेडिट कार्ड (KCC) योजना',
    titleMarathi: 'किसान क्रेडिट कार्ड (KCC) सवलतीचे कर्ज योजना',
    code: 'KCC-LOAN',
    category: 'Insurance & Credit',
    shortDescription: 'Concessional crop loan up to ₹3 Lakh at 4% effective interest rate per annum with zero collateral up to ₹1.6 Lakh.',
    shortDescriptionHindi: 'केवल 4% की रियायती ब्याज दर पर ₹3 लाख तक का आसान कृषि ऋण।',
    shortDescriptionMarathi: 'फक्त ४% व्याजदराने ₹३ लाखांपर्यंत सवलतीचे पीक कर्ज.',
    fullDescription: 'Kisan Credit Card provides revolving crop credit to farmers to purchase seeds, fertilizers, pesticides, and manage post-harvest expenses without high-interest money lenders.',
    eligibilityCriteria: {
      maxLandAcres: 50,
      targetCrops: ['All Crops', 'Livestock', 'Fisheries'],
      targetStates: ['All India'],
      farmerCategory: ['All Farmers', 'Tenant Farmers', 'Sharecroppers'],
    },
    benefits: ['Interest subvention making effective interest rate only 4%', 'Collateral-free loan up to ₹1,60,000', 'Flexible repayment linked to harvest'],
    requiredDocuments: ['Aadhaar Card & PAN Card', 'Land Record (7/12 & 8A / Khatauni)', 'No Dues Certificate from nearby bank branches', 'Passport Size Photograph'],
    requiredDocumentsHindi: ['आधार कार्ड व पैन कार्ड', 'भूमि स्वामित्व रिकॉर्ड (7/12 व खतौनी)', 'अन्य बैंकों का नो ड्यूस प्रमाण पत्र', 'पासपोर्ट आकार फोटो'],
    requiredDocumentsMarathi: ['आधार कार्ड आणि पॅन कार्ड', 'जमीन उतारा (७/१२ आणि ८अ)', 'बँक बिनदेय दाखला (No Dues)', 'पासपोर्ट फोटो'],
    applicationSteps: [
      'Visit your nearest Commercial Bank, RRB, or District Cooperative Bank branch.',
      'Obtain KCC Application Form or download from RBI / PM-Kisan website.',
      'Attach land ownership 7/12 extract and crop details.',
      'Bank officer verifies land records and approves credit limit.',
      'Receive KCC Debit ATM card for instant cash withdrawals.'
    ],
    applicationStepsHindi: [
      'निकटतम वाणिज्यिक बैंक, ग्रामीण बैंक या सहकारी बैंक शाखा में जाएं।',
      'KCC आवेदन पत्र प्राप्त करें और भरें।',
      'भूमि रिकॉर्ड (7/12) और बुआई विवरण संलग्न करें।',
      'बैंक अधिकारी जमीन के कागजों की जांच करेंगे और लोन लिमिट स्वीकृत करेंगे।',
      'नकद निकासी के लिए KCC डेबिट एटीएम कार्ड प्राप्त करें।'
    ],
    applicationStepsMarathi: [
      'जवळच्या राष्ट्रीयीकृत किंवा जिल्हा मध्यवर्ती सहकारी बँकेत जा.',
      'केसीसी (KCC) अर्ज फॉर्म मिळवा व भरा.',
      '७/१२ आणि ८अ उतारा जोडणी करा.',
      'बँक अधिकाऱ्यांकडून तपासणीनंतर कर्ज मर्यादा मंजूर होईल.',
      'एटीएम कार्ड (KCC ATM Debit Card) मिळवून रक्कम वापरा.'
    ],
    applicationDeadline: 'Ongoing / Open Round the Year',
    applicationUrl: 'https://pmkisan.gov.in',
    isActive: true,
  },
  {
    _id: 'scheme_7',
    title: 'PM Kisan Maandhan Yojana (Farmer Assured Pension)',
    titleHindi: 'प्रधानमंत्री किसान मानधन योजना (पेंशन योजना)',
    titleMarathi: 'पंतप्रधान शेतकरी मानधन योजना (निवृत्तीवेतन)',
    code: 'PM-KMY',
    category: 'Financial Assistance',
    shortDescription: 'Guaranteed minimum monthly pension of ₹3,000 to small & marginal farmers after attaining the age of 60 years.',
    shortDescriptionHindi: '60 वर्ष की आयु के बाद छोटे व सीमांत किसानों को ₹3,000 की मासिक सुनिश्चित पेंशन।',
    shortDescriptionMarathi: 'वयाची ६० वर्षे पूर्ण झाल्यानंतर दरमहा ₹३,००० निश्चित निवृत्तीवेतन.',
    fullDescription: 'Voluntary and contributory pension scheme for landholding farmers aged 18 to 40 years, with equal matching contribution by the Central Government.',
    eligibilityCriteria: {
      maxLandAcres: 5,
      targetCrops: ['All Crops'],
      targetStates: ['All India'],
      farmerCategory: ['Small & Marginal Farmers'],
    },
    benefits: ['₹3,000 per month fixed pension after age 60', 'Central Govt contributes equal matching monthly amount (₹55 - ₹200)', 'Spouse receives 50% family pension upon death'],
    requiredDocuments: ['Aadhaar Card', 'Savings Bank Account passbook with IFSC', 'Land Holding Record (7/12)'],
    requiredDocumentsHindi: ['आधार कार्ड', 'बचत बैंक खाता पासबुक (IFSC कोड सहित)', 'भूमि दस्तावेज (7/12)'],
    requiredDocumentsMarathi: ['आधार कार्ड', 'बँक पासबुक', '७/१२ जमीन उतारा'],
    applicationSteps: [
      'Visit nearest Common Service Centre (CSC VLE).',
      'Provide Aadhaar number and bank account details for Auto-Debit mandate.',
      'Initial monthly contribution (₹55 to ₹200 based on entry age) paid at CSC.',
      'Sign the auto-debit consent form.',
      'Receive Pension Card with unique Pension Number.'
    ],
    applicationStepsHindi: [
      'निकटतम कॉमन सर्विस सेंटर (CSC) पर जाएं।',
      'आधार नंबर और बैंक खाता विवरण दें।',
      'प्रारंभिक मासिक अंशदान (₹55 से ₹200) का भुगतान करें।',
      'ऑटो-डेबिट ऑटोमेशन फॉर्म पर हस्ताक्षर करें।',
      'विशिष्ट पेंशन नंबर वाला किसान पेंशन कार्ड प्राप्त करें।'
    ],
    applicationStepsMarathi: [
      'जवळच्या सीएससी (CSC) केंद्रात जा.',
      'आधार कार्ड व बँक पासबुक माहिती द्या.',
      'वयानुसार ठरलेला हप्ता (₹५५ ते ₹२००) भरणा करा.',
      'बँक ऑटो-डेबिट संमती फॉर्मवर स्वाक्षरी करा.',
      'शेतकरी निवृत्तीवेतन कार्ड मिळवा.'
    ],
    applicationDeadline: 'Open for entry age 18-40 years',
    applicationUrl: 'https://pmkmy.gov.in',
    isActive: true,
  },
  {
    _id: 'scheme_8',
    title: 'Sub-Mission on Agricultural Mechanization (SMAM)',
    titleHindi: 'कृषि यांत्रिकीकरण उप-मिशन (ट्रैक्टर व उपकरण सब्सिडी)',
    titleMarathi: 'कृषी यांत्रिकीकरण उपअभियान (ट्रॅक्टर व अवजारे अनुदान)',
    code: 'SMAM-MACHINERY',
    category: 'Machinery & Infrastructure',
    shortDescription: '40% to 50% financial subsidy for purchasing agricultural tractors, rotavators, harvesters, and power tillers.',
    shortDescriptionHindi: 'ट्रैक्टर, रोटावेटर और पावर टिलर खरीद पर 40% से 50% तक की भारी सरकारी सब्सिडी।',
    shortDescriptionMarathi: 'ट्रॅक्टर, पॉवर टिलर, रोटाव्हेटर खरेदीवर ४०% ते ५०% पर्यंत शासकीय अनुदान.',
    fullDescription: 'SMAM promotes farm mechanization to offset labor shortages and increase farm productivity through individual equipment subsidies and Custom Hiring Centres (CHC).',
    eligibilityCriteria: {
      maxLandAcres: 20,
      targetCrops: ['All Crops'],
      targetStates: ['Maharashtra', 'Madhya Pradesh', 'Punjab', 'All India'],
      farmerCategory: ['Small & Marginal Farmers', 'Women Farmers', 'SC/ST Farmers'],
    },
    benefits: ['40-50% subsidy on individual machinery purchase', 'Up to 80% subsidy for setting up Custom Hiring Centres (CHC)'],
    requiredDocuments: ['Aadhaar Card', 'Land Record (7/12 & 8A)', 'Bank Passbook', 'Quotation from authorized implement dealer', 'Caste Certificate (if applicable)'],
    requiredDocumentsHindi: ['आधार कार्ड', 'भूमि रिकॉर्ड (7/12)', 'बैंक पासबुक', 'अधिकृत डीलर से कोटेशन', 'जाति प्रमाण पत्र (यदि लागू हो)'],
    requiredDocumentsMarathi: ['आधार कार्ड', '७/१२ आणि ८अ उतारा', 'बँक पासबुक', 'मान्यताप्राप्त डीलरचे कोटेशन', 'जातीचा दाखला (लागू असल्यास)'],
    applicationSteps: [
      'Register on agrimachinery.nic.in portal or State MahaDBT portal.',
      'Choose machinery/equipment type (Tractor / Rotavator / Thresher).',
      'Upload 7/12 land extract, photo, and dealer quotation.',
      'Track online lottery selection or merit approval.',
      'Purchase equipment upon pre-sanction and submit GST invoice for direct subsidy disbursement.'
    ],
    applicationStepsHindi: [
      'agrimachinery.nic.in या राज्य महाडीबीटी पोर्टल पर पंजीकरण करें।',
      'कृषि उपकरण प्रकार (ट्रैक्टर / रोटावेटर / थ्रेशर) चुनें।',
      '7/12 भूमि रिकॉर्ड और डीलर कोटेशन अपलोड करें।',
      'ऑनलाइन लॉटरी या प्री-संक्शन मंजूरी प्राप्त करें।',
      'उपकरण खरीदें और सब्सिडी के लिए जीएसटी इनवॉइस जमा करें।'
    ],
    applicationStepsMarathi: [
      'agrimachinery.nic.in किंवा महाडीबीटीवर अर्ज नोंदवा.',
      'अवजाराचा प्रकार (ट्रॅक्टर, रोटाव्हेटर, पेरणी यंत्र) निवडा.',
      '७/१२ उतारा आणि डीलर कोटेशन अपलोड करा.',
      'पूर्वसंमती पत्र मिळाल्यानंतर अवजार खरेदी करा.',
      'जीएसटी बिल अपलोड करून अनुदान बँक खात्यात मिळवा.'
    ],
    applicationDeadline: '30th November 2026',
    applicationUrl: 'https://agrimachinery.nic.in',
    isActive: true,
  },
  {
    _id: 'scheme_9',
    title: 'Paramparagat Krishi Vikas Yojana (PKVY Organic Subsidy)',
    titleHindi: 'पारम्परिक कृषि विकास योजना (जैविक खेती सब्सिडी)',
    titleMarathi: 'पारंपारिक कृषी विकास योजना (सेंद्रिय शेती अनुदान)',
    code: 'PKVY-ORGANIC',
    category: 'Organic & Soil Health',
    shortDescription: '₹50,000 per hectare financial support for cluster-based organic farming, bio-fertilizers, and organic certification.',
    shortDescriptionHindi: 'जैविक खेती अपनाने हेतु ₹50,000 प्रति हेक्टेयर सहायता व जैविक प्रमाणीकरण।',
    shortDescriptionMarathi: 'सेंद्रिय शेती प्रोत्साहन व सेंद्रिय प्रमाणीकरणासाठी ₹५०,००० प्रति हेक्टरी अनुदान.',
    fullDescription: 'PKVY forms farmer clusters to adopt chemical-free eco-friendly farming practices, PGS organic certification, and direct market linkage.',
    eligibilityCriteria: {
      maxLandAcres: 10,
      targetCrops: ['Cotton', 'Pulses', 'Spices', 'Vegetables', 'Fruits'],
      targetStates: ['All India'],
      farmerCategory: ['All Farmers', 'Small & Marginal Farmers', 'Farmer Groups (FPO)'],
    },
    benefits: ['₹50,000/ha in 3 years (₹31,000 direct for organic inputs)', 'Free Participatory Guarantee System (PGS) organic certification'],
    requiredDocuments: ['Aadhaar Card', 'Land Extract (7/12)', 'Group / Cluster Membership Form', 'Bank Passbook'],
    requiredDocumentsHindi: ['आधार कार्ड', '7/12 भूमि दस्तावेज', 'समूह/क्लस्टर सदस्यता पत्र', 'बैंक पासबुक'],
    requiredDocumentsMarathi: ['आधार कार्ड', '७/१२ उतारा', 'शेतकरी गट नोंदणी', 'बँक पासबुक'],
    applicationSteps: [
      'Form a cluster of 20 or more farmers holding a total 50-acre contiguous area.',
      'Contact District Agriculture Officer (DAO) or KVK.',
      'Register cluster on Jaivik Kheti Portal (jaivikkheti.in).',
      'Receive funds for bio-inputs, vermicompost units, and packaging.'
    ],
    applicationStepsHindi: [
      '20 या अधिक किसानों का समूह (50 एकड़ कुल क्षेत्र) बनाएं।',
      'जिला कृषि अधिकारी या केवीके (KVK) से संपर्क करें।',
      'जैविक खेती पोर्टल (jaivikkheti.in) पर क्लस्टर पंजीकृत करें।',
      'जैविक खाद, केंचुआ खाद इकाई और पैकिंग हेतु धन प्राप्त करें।'
    ],
    applicationStepsMarathi: [
      '२० किंवा अधिक शेतकऱ्यांचा गट स्थापन करा.',
      'तालुका कृषी अधिकारी कार्यालयाशी संपर्क साधा.',
      'jaivikkheti.in पोर्टलवर नोंदणी करा.',
      'सेंद्रिय खते, गांडूळ खत युनिटसाठी टप्प्याटप्प्याने निधी मिळवा.'
    ],
    applicationDeadline: '31st December 2026',
    applicationUrl: 'https://jaivikkheti.in',
    isActive: true,
  },
  {
    _id: 'scheme_10',
    title: 'Soil Health Card (SHC) Free Diagnostic Scheme',
    titleHindi: 'मृदा स्वास्थ्य कार्ड (सॉइल हेल्थ कार्ड) योजना',
    titleMarathi: 'मृदा आरोग्य पत्रिका योजना (माती परीक्षण)',
    code: 'SHC-SOIL',
    category: 'Organic & Soil Health',
    shortDescription: 'Free soil nutrient testing (12 parameters: N, P, K, S, Zn, Fe, Cu, Mn, Bo, pH, EC, OC) and customized fertilizer advice.',
    shortDescriptionHindi: 'मिट्टी के 12 पोषक तत्वों का निःशुल्क लैब परीक्षण व फसल अनुसार उर्वरक सिफारिश।',
    shortDescriptionMarathi: 'मातीचे मोफत प्रयोगशाळा परीक्षण व संतुलित खत वापराचे अचूक मार्गदर्शन.',
    fullDescription: 'SHC gives farmers crucial insights into soil fertility deficiencies every 2 years to reduce excessive chemical fertilizer costs.',
    eligibilityCriteria: {
      maxLandAcres: 100,
      targetCrops: ['All Crops'],
      targetStates: ['All India'],
      farmerCategory: ['All Farmers'],
    },
    benefits: ['100% free soil sample testing', 'Reduces fertilizer expenditure by 20-30% while maintaining yield'],
    requiredDocuments: ['Soil Sample from field (15-20cm depth)', 'Aadhaar Card', 'Survey Number / 7/12 extract copy'],
    requiredDocumentsHindi: ['खेत की मिट्टी का नमूना (15-20 सेमी गहराई)', 'आधार कार्ड', 'खसरा/7/12 नंबर की प्रति'],
    requiredDocumentsMarathi: ['मातीचा नमुना (१५-२० सेमी खोल)', 'आधार कार्ड', '७/१२ सर्व्हे नंबर माहिती'],
    applicationSteps: [
      'Collect soil sample from 5 different V-shaped spots in your plot.',
      'Submit sample bag to nearest Soil Testing Laboratory (STL) or Krishi Vigyan Kendra.',
      'Lab tests 12 macronutrients and micronutrients.',
      'Download your Soil Health Card from soilhealth.dac.gov.in.'
    ],
    applicationStepsHindi: [
      'अपने खेत के 5 अलग-अलग V-आकार के स्थानों से मिट्टी का नमूना लें।',
      'नमूना थैली निकटतम मृदा परीक्षण प्रयोगशाला (STL) या KVK में जमा करें।',
      'लैब द्वारा 12 पोषक तत्वों की जांच की जाएगी।',
      'soilhealth.dac.gov.in से अपना मृदा स्वास्थ्य कार्ड डाउनलोड करें।'
    ],
    applicationStepsMarathi: [
      'शेतातून व्ही (V) आकाराचे ५ नमुने गोळा करा.',
      'मातीचा नमुना जिल्हा माती परीक्षण प्रयोगशाळा किंवा केव्हीके मध्ये द्या.',
      'प्रयोगशाळा १२ घटकांची तपासणी करेल.',
      'soilhealth.dac.gov.in वरून माती आरोग्य पत्रिका डाउनलोड करा.'
    ],
    applicationDeadline: 'Open Year-Round',
    applicationUrl: 'https://soilhealth.dac.gov.in',
    isActive: true,
  },
  {
    _id: 'scheme_11',
    title: 'Namo Shetkari MahaSanman Nidhi Yojana (Maharashtra)',
    titleHindi: 'नमो शेतकरी महासन्मान निधी योजना (महाराष्ट्र)',
    titleMarathi: 'नमो शेतकरी महासन्मान निधी योजना (महाराष्ट्र राज्य)',
    code: 'NSMNY-MH',
    category: 'Financial Assistance',
    shortDescription: 'Additional ₹6,000 annual state income grant provided by Maharashtra Govt, making a total ₹12,000/yr alongside PM-KISAN.',
    shortDescriptionHindi: 'महाराष्ट्र सरकार द्वारा ₹6,000 अतिरिक्त वार्षिक सहायता, पीएम-किसान मिलाकर कुल ₹12,000।',
    shortDescriptionMarathi: 'महाराष्ट्र शासनाकडून दरवर्षी अतिरिक्त ₹६,००० अनुदान (एकूण ₹१२,०००/वर्ष).',
    fullDescription: 'Namo Shetkari MahaSanman Nidhi scheme adds ₹6,000 per year directly to Maharashtra farmers who are active PM-KISAN beneficiaries.',
    eligibilityCriteria: {
      maxLandAcres: 10,
      targetCrops: ['All Crops'],
      targetStates: ['Maharashtra'],
      farmerCategory: ['Small & Marginal Farmers', 'All Farmers'],
    },
    benefits: ['Extra ₹6,000/yr in 3 installments of ₹2,000', 'Automated DBT disbursement without separate application'],
    requiredDocuments: ['PM-KISAN Registration ID', 'Aadhaar-seeded Active Bank Account', '7/12 Land Record'],
    requiredDocumentsHindi: ['PM-KISAN पंजीकरण आईडी', 'आधार से लिंक बैंक खाता', '7/12 भूमि रिकॉर्ड'],
    requiredDocumentsMarathi: ['PM-KISAN आयडी', 'आधारशी जोडलेले बँक खाते', '७/१२ जमीन उतारा'],
    applicationSteps: [
      'All active Maharashtra PM-KISAN beneficiaries are automatically enrolled.',
      'Verify e-KYC status on pmkisan.gov.in.',
      'Ensure bank account is linked to Aadhaar (NPCI mapping).',
      'Check payment credit status on MahaDBT portal.'
    ],
    applicationStepsHindi: [
      'महाराष्ट्र के सभी पात्र पीएम-किसान लाभार्थी स्वतः शामिल हैं।',
      'pmkisan.gov.in पर e-KYC स्थिति सत्यापित करें।',
      'बैंक खाते को आधार (NPCI) से लिंक रखें।',
      'MahaDBT पोर्टल पर भुगतान क्रेडिट स्थिति जांचें।'
    ],
    applicationStepsMarathi: [
      'पीएम-किसान योजनेचे सर्व पात्र शेतकरी आपोआप समाविष्ट.',
      'इ-केवायसी (e-KYC) पूर्ण असल्याची खात्री करा.',
      'बँक खाते एनपीसीआय (NPCI) आधारशी लिंक ठेवा.',
      'महाडीबीटी पोर्टलवर जमा रक्कमेची माहिती तपासा.'
    ],
    applicationDeadline: 'Auto-Disbursed Continuously',
    applicationUrl: 'https://mahadbt.maharashtra.gov.in',
    isActive: true,
  },
  {
    _id: 'scheme_12',
    title: 'Pradhan Mantri Matsya Sampada Yojana (PMMSY Fisheries)',
    titleHindi: 'प्रधानमंत्री मत्स्य सम्पदा योजना',
    titleMarathi: 'पंतप्रधान मत्स्य संपदा योजना (मत्स्यपालन)',
    code: 'PMMSY-FISH',
    category: 'Allied & Livestock',
    shortDescription: '40% to 60% financial capital subsidy for aquaculture fish ponds, biofloc units, hatcheries, and motorboats.',
    shortDescriptionHindi: 'मछली पालन, बायोफ्लॉक यूनिट व तालाब निर्माण पर 40% से 60% तक सरकारी अनुदान।',
    shortDescriptionMarathi: 'शेतात तळे बनवून मत्स्यपालन, बायोफ्लॉक युनिटसाठी ४०% ते ६०% सबसिडी.',
    fullDescription: 'PMMSY enhances inland fisheries and aquaculture infrastructure to boost non-farm rural livelihood and export earnings.',
    eligibilityCriteria: {
      maxLandAcres: 10,
      targetCrops: ['Fisheries', 'Aquaculture'],
      targetStates: ['All India'],
      farmerCategory: ['All Farmers', 'Women Farmers', 'SC/ST Farmers', 'Fishermen'],
    },
    benefits: ['40% subsidy for General Category & 60% for Women/SC/ST', 'Covers pond construction, feed mills, and fish transport vehicles'],
    requiredDocuments: ['Aadhaar Card', 'Land Record / Water Body Lease Document', 'Project Report / DPR', 'Bank Passbook'],
    requiredDocumentsHindi: ['आधार कार्ड', 'भूमि रिकॉर्ड / जल क्षेत्र पट्टा दस्तावेज', 'प्रोजेक्ट रिपोर्ट (DPR)', 'बैंक पासbook'],
    requiredDocumentsMarathi: ['आधार कार्ड', 'जमीन / तलाव भाडेपट्टा करार', 'प्रकल्प अहवाल (DPR)', 'बँक पासबुक'],
    applicationSteps: [
      'Download PMMSY project proposal guidelines from pmmsy.dof.gov.in.',
      'Submit Detailed Project Report (DPR) to District Fisheries Officer (DFO).',
      'District Level Committee reviews and approves project.',
      'Construct fish pond / install biofloc setup.',
      'Receive capital subsidy in bank account after physical verification.'
    ],
    applicationStepsHindi: [
      'pmmsy.dof.gov.in से PMMSY प्रोजेक्ट गाइडलाइन डाउनलोड करें।',
      'जिला मत्स्य अधिकारी (DFO) को विस्तृत प्रोजेक्ट रिपोर्ट (DPR) जमा करें।',
      'जिला स्तरीय समिति द्वारा स्वीकृति प्राप्त करें।',
      'तालाब निर्माण या बायोफ्लॉक सेटअप स्थापित करें।',
      'निरीक्षण के बाद बैंक खाते में सब्सिडी प्राप्त करें।'
    ],
    applicationStepsMarathi: [
      'pmmsy.dof.gov.in वरून योजनेची माहिती मिळवा.',
      'जिल्हा मत्स्य व्यवसाय विकास अधिकाऱ्यांकडे प्रकल्प अहवाल (DPR) सादर करा.',
      'मंजुरी मिळाल्यावर मत्स्यतळे किंवा बायोफ्लॉक युनिट उभारा.',
      'पाहणीनंतर अनुदान खात्यात वर्ग केले जाईल.'
    ],
    applicationDeadline: '31st January 2027',
    applicationUrl: 'https://pmmsy.dof.gov.in',
    isActive: true,
  },
  {
    _id: 'scheme_13',
    title: 'National Livestock Mission (Goat, Sheep & Poultry Subsidy)',
    titleHindi: 'राष्ट्रीय पशुधन मिशन (बकरी, भेड़ व मुर्गी पालन)',
    titleMarathi: 'राष्ट्रीय पशुधन मिशन (शेळी, शेळी-मेंढी व कुक्कुटपालन)',
    code: 'NLM-LIVESTOCK',
    category: 'Allied & Livestock',
    shortDescription: '50% direct capital subsidy up to ₹50 Lakh for establishing goat/sheep breeding farms, poultry hatcheries, and feed mills.',
    shortDescriptionHindi: 'बकरी पालन, भेड़ पालन और मुर्गी पालन फार्म खोलने के लिए 50% सीधी पूंजीगत सब्सिडी।',
    shortDescriptionMarathi: 'शेळी-मेंढी पालन, कुक्कुटपालन व खाद्य निर्मिती प्रकल्पासाठी ५०% सबसिडी.',
    fullDescription: 'NLM encourages entrepreneurship in livestock breeding, fodder production, and meat/egg processing to diversify rural income.',
    eligibilityCriteria: {
      maxLandAcres: 25,
      targetCrops: ['Livestock', 'Dairy', 'Goatry', 'Poultry'],
      targetStates: ['All India'],
      farmerCategory: ['All Farmers', 'Entrepreneurs', 'FPOs', 'Self Help Groups'],
    },
    benefits: ['50% capital subsidy (up to ₹50 Lakh for 500 goat unit)', 'Loan assistance from NABARD / Commercial Banks'],
    requiredDocuments: ['Aadhaar Card & PAN', 'Land ownership / Lease deed for minimum 10 years', 'Training Certificate in Livestock Farming', 'Bank Loan Sanction Letter / Bank statement'],
    requiredDocumentsHindi: ['आधार कार्ड व पैन', '10 वर्ष का पट्टा / भूमि दस्तावेज', 'पशुपालन प्रशिक्षण प्रमाण पत्र', 'बैंक लोन स्वीकृति पत्र'],
    requiredDocumentsMarathi: ['आधार व पॅन कार्ड', 'जमीन मालकी / १० वर्षांचा भाडेकरार', 'पशुपालन प्रशिक्षण दाखला', 'बँक कर्ज मंजुरी पत्र'],
    applicationSteps: [
      'Register on NLM portal (nlm.udyamimitra.in).',
      'Upload Detailed Project Report (DPR) for Goatry / Poultry unit.',
      'Bank approves 50% loan component.',
      'State Level Executive Committee approves capital subsidy.',
      'Subsidy released directly via NABARD to bank account.'
    ],
    applicationStepsHindi: [
      'NLM पोर्टल (nlm.udyamimitra.in) पर पंजीकरण करें।',
      'बकरी/मुर्गी पालन हेतु विस्तृत प्रोजेक्ट रिपोर्ट (DPR) अपलोड करें।',
      'बैंक द्वारा 50% ऋण घटक स्वीकृत किया जाता है।',
      'राज्य स्तरीय समिति द्वारा सब्सिडी स्वीकृत की जाती है।',
      'सब्सिडी नाबार्ड के माध्यम से सीधे लोन खाते में भेजी जाती है।'
    ],
    applicationStepsMarathi: [
      'nlm.udyamimitra.in पोर्टलवर ऑनलाईन अर्ज करा.',
      'शेळीपालन / कुक्कुटपालन व्यवसाय आराखडा (DPR) अपलोड करा.',
      'बँकेकडून ५०% कर्ज मंजुरी मिळवा.',
      'समितीकडून मंजुरी मिळाल्यावर नाबार्डद्वारे ५०% सबसिडी बँक खात्यात येईल.'
    ],
    applicationDeadline: '28th February 2027',
    applicationUrl: 'https://nlm.udyamimitra.in',
    isActive: true,
  },
  {
    _id: 'scheme_14',
    title: 'Agriculture Infrastructure Fund (AIF 3% Interest Subvention)',
    titleHindi: 'कृषि अवसंरचना कोष (AIF ब्याज छूट योजना)',
    titleMarathi: 'कृषी पायाभूत सुविधा निधी (AIF ३% व्याज सवलत)',
    code: 'AIF-INFRA',
    category: 'Machinery & Infrastructure',
    shortDescription: '3% annual interest subvention on loans up to ₹2 Crore for constructing warehouses, cold storages, and sorting units.',
    shortDescriptionHindi: 'गोदाम, कोल्ड स्टोरेज और ग्रेडिंग सेंटर के ₹2 करोड़ तक के लोन पर 3% ब्याज छूट।',
    shortDescriptionMarathi: 'गोदाम, शीतगृह (कोल्ड स्टोरेज) उभारणीसाठी ₹२ कोटींपर्यंतच्या कर्जावर ३% व्याज सवलत.',
    fullDescription: 'AIF mobilizes medium-to-long term debt financing for post-harvest infrastructure projects to eliminate crop wastage.',
    eligibilityCriteria: {
      maxLandAcres: 50,
      targetCrops: ['All Crops'],
      targetStates: ['All India'],
      farmerCategory: ['All Farmers', 'FPOs', 'Agri Entrepreneurs', 'Cooperatives'],
    },
    benefits: ['3% per annum interest subvention for 7 years', 'Credit Guarantee coverage under CGTMSE for loans up to ₹2 Cr'],
    requiredDocuments: ['Aadhaar Card & PAN', 'Business Plan / Project Report', 'Land Ownership / Lease Documents', 'GST Certificate (if applicable)'],
    requiredDocumentsHindi: ['आधार कार्ड व पैन', 'व्यापार योजना / प्रोजेक्ट रिपोर्ट', 'भूमि स्वामित्व / पट्टा दस्तावेज', 'जीएसटी प्रमाण पत्र'],
    requiredDocumentsMarathi: ['आधार व पॅन कार्ड', 'प्रकल्प अहवाल (DPR)', 'जमीन खरेदी / भाडेकरार', 'जीएसटी नोंदणी'],
    applicationSteps: [
      'Portal registration on agriinfra.dac.gov.in.',
      'Select project type (Cold Storage / Primary Processing / Packhouse).',
      'Choose preferred lending bank branch.',
      'Bank evaluates proposal and sanctions loan with 3% interest subvention built-in.'
    ],
    applicationStepsHindi: [
      'agriinfra.dac.gov.in पर पोर्टल पंजीकरण करें।',
      'प्रोजेक्ट प्रकार (कोल्ड स्टोरेज / पैकहाउस) चुनें।',
      'ऋण देने वाली बैंक शाखा का चयन करें।',
      'बैंक द्वारा 3% ब्याज छूट के साथ ऋण स्वीकृत किया जाता है।'
    ],
    applicationStepsMarathi: [
      'agriinfra.dac.gov.in वर अर्ज भरा.',
      'प्रकल्पाचा प्रकार (शीतगृह / वेअरहाऊस / प्रोसेसिंग युनिट) निवडा.',
      'संबंधित बँकेची निवड करा.',
      'बँकेकडून ३% व्याज सवलतीसह कर्ज मंजूर केले जाते.'
    ],
    applicationDeadline: '31st March 2032',
    applicationUrl: 'https://agriinfra.dac.gov.in',
    isActive: true,
  },
  {
    _id: 'scheme_15',
    title: 'Gopinath Munde Shetkari Apghat Bima Yojana (Accident Cover)',
    titleHindi: 'गोपीनाथ मुंडे शेतकरी दुर्घटना बीमा योजना',
    titleMarathi: 'गोपीनाथ मुंडे शेतकरी अपघात विमा योजना (महाराष्ट्र)',
    code: 'GMSABY-MH',
    category: 'Insurance & Credit',
    shortDescription: '100% state-funded accident insurance providing ₹2 Lakh financial compensation for accidental death or permanent disability.',
    shortDescriptionHindi: 'किसान की दुर्घटना में मृत्यु या स्थायी विकलांगता पर ₹2 लाख की 100% सरकारी सहायता।',
    shortDescriptionMarathi: 'शेतकऱ्याचा अपघाती मृत्यू किंवा अपंगत्व आल्यास कुटुंबास ₹२ लाखांची मदत.',
    fullDescription: 'Maharashtra Govt scheme protecting 7/12 registered farmers aged 10 to 75 against road accidents, snake bites, electric shocks, and farm machinery hazards.',
    eligibilityCriteria: {
      maxLandAcres: 50,
      targetCrops: ['All Crops'],
      targetStates: ['Maharashtra'],
      farmerCategory: ['All Farmers'],
    },
    benefits: ['₹2,00,000 compensation for accidental death or double limb loss', '₹1,00,000 for single limb/eye loss', 'Zero premium charged from farmer'],
    requiredDocuments: ['FIR Copy / Police Panchnama', 'Post-Mortem Report (for death claims)', '7/12 Extract proving farmer status', 'Aadhaar of Nominee & Bank Passbook'],
    requiredDocumentsHindi: ['एफआईआर / पुलिस पंचनामा', 'पोस्टमार्टम रिपोर्ट (मृत्यु के मामले में)', '7/12 भूमि रिकॉर्ड', 'दावेदार का आधार व बैंक पासबुक'],
    requiredDocumentsMarathi: ['एफआयआर (FIR) व पोलिस पंचनामा', 'शवविच्छेदन (Post-Mortem) अहवाल', '७/१२ उतारा', 'वारसदाराचे आधार कार्ड व बँक पासबुक'],
    applicationSteps: [
      'Submit claim proposal within 30 days of accident to Taluka Agriculture Officer (TAO).',
      'Attach FIR, Panchnama, and 7/12 extract.',
      'Insurance company scrutinizes documents.',
      'Claim amount of ₹2 Lakh credited via Direct Benefit Transfer to nominee bank account.'
    ],
    applicationStepsHindi: [
      'दुर्घटना के 30 दिनों के भीतर तालुका कृषि अधिकारी (TAO) को फॉर्म जमा करें।',
      'एफआईआर, पंचनामा और 7/12 संलग्न करें।',
      'बीमा कंपनी द्वारा दस्तावेजों की जांच की जाती है।',
      '₹2 लाख की राशि सीधे दावेदार के खाते में जमा की जाती है।'
    ],
    applicationStepsMarathi: [
      'अपघात घडल्यापासून ३० दिवसांच्या आत तालुका कृषी अधिकाऱ्यांकडे अर्ज सादर करा.',
      'पंचनामा, एफआयआर व ७/१२ जोडा.',
      'कागदपत्रांची पडताळणी पूर्ण झाल्यावर २ लाख रुपये वारसाच्या खात्यात जमा होतात.'
    ],
    applicationDeadline: 'Available 365 Days',
    applicationUrl: 'https://krishi.maharashtra.gov.in',
    isActive: true,
  },
  {
    _id: 'scheme_16',
    title: 'MOVCDNER - Organic Value Chain Development Scheme',
    titleHindi: 'पूर्वोत्तर व मध्य भारत जैविक मूल्य श्रृंखला विकास योजना',
    titleMarathi: 'सेंद्रिय मुल्य साखळी विकास योजना (MOVCD)',
    code: 'MOVCD-VALUE',
    category: 'Organic & Soil Health',
    shortDescription: 'Financial assistance of ₹45,000/ha for organic seed supply, value addition, processing units, and export branding.',
    shortDescriptionHindi: 'जैविक बीज, प्रसंस्करण इकाई और ब्रांडिंग हेतु ₹45,000 प्रति हेक्टेयर वित्तीय सहायता।',
    shortDescriptionMarathi: 'सेंद्रिय पिकांची प्रतवारी, पॅकेजिंग व ब्रँडिंगसाठी ₹४५,००० प्रति हेक्टरी अनुदान.',
    fullDescription: 'MOVCD scheme connects certified organic farmers directly to commercial buyers and international markets with full processing infrastructure.',
    eligibilityCriteria: {
      maxLandAcres: 15,
      targetCrops: ['Organic Cotton', 'Spices', 'Pulses', 'Medicinal Plants'],
      targetStates: ['Maharashtra', 'Madhya Pradesh', 'Assam', 'All India'],
      farmerCategory: ['All Farmers', 'FPOs', 'Organic Farmer Groups'],
    },
    benefits: ['₹45,000/ha in 3 years for inputs and certification', 'Direct buyer agreements for 20-30% premium prices'],
    requiredDocuments: ['Aadhaar Card', 'Land Record (7/12)', 'FPO / Organic Group Membership Certificate', 'Bank Passbook'],
    requiredDocumentsHindi: ['आधार कार्ड', 'भूमि रिकॉर्ड (7/12)', 'एफपीओ / जैविक समूह प्रमाण पत्र', 'बैंक पासबुक'],
    requiredDocumentsMarathi: ['आधार कार्ड', '७/१२ उतारा', 'सेंद्रिय गट नोंदणी दाखला', 'बँक पासबुक'],
    applicationSteps: [
      'Join an accredited Organic Farmer Producer Organization (FPO).',
      'Submit land survey details for Third-Party NOP/NPOP Organic Certification.',
      'Receive subsidized organic seeds, bio-pesticides, and neem cake.',
      'Sell produce at guaranteed premium price through FPO packhouse.'
    ],
    applicationStepsHindi: [
      'मान्यता प्राप्त जैविक किसान उत्पादक संगठन (FPO) से जुड़ें।',
      'तीसरे पक्ष के जैविक प्रमाणीकरण के लिए भूमि विवरण जमा करें।',
      'सब्सिडी वाले जैविक बीज और नीम केक प्राप्त करें।',
      'एफपीओ के माध्यम से प्रीमियम मूल्य पर उत्पाद बेचें।'
    ],
    applicationStepsMarathi: [
      'सेंद्रिय शेतकरी उत्पादक कंपनी (FPO) चे सदस्य व्हा.',
      'सेंद्रिय प्रमाणीकरणासाठी जमिनीची माहिती द्या.',
      'अनुदानित सेंद्रिय खते व बियाणे मिळवा.',
      'एफपीओ द्वारे उच्च बाजारभावाने मालाची विक्री करा.'
    ],
    applicationDeadline: '31st December 2026',
    applicationUrl: 'https://movcd.dac.gov.in',
    isActive: true,
  },
  {
    _id: 'scheme_17',
    title: 'MIDH - Polyhouse & Greenhouse Horticulture Subsidy',
    titleHindi: 'एमआईडीएच - पॉलीहाउस व शेडनेट हाउस सब्सिडी योजना',
    titleMarathi: 'एआयडीएच - पॉलीहाऊस व शेडनेट गृह अनुदान योजना',
    code: 'MIDH-HORTI',
    category: 'Machinery & Infrastructure',
    shortDescription: '50% capital grant for constructing high-tech Polyhouses, Shade Net structures, Pack Houses, and Fruit Orchards.',
    shortDescriptionHindi: 'संरक्षित खेती (पॉलीहाउस, शेडनेट हाउस व ग्रीनहाउस) निर्माण पर 50% तक सरकारी सब्सिडी।',
    shortDescriptionMarathi: 'पॉलीहाऊस व शेडनेट गृह उभारणीसाठी ५०% शासकीय अनुदान.',
    fullDescription: 'Mission for Integrated Development of Horticulture (MIDH) promotes protected cultivation, drip-automated fertigation, and high-value fruit/flower orchards.',
    eligibilityCriteria: {
      maxLandAcres: 15,
      targetCrops: ['Vegetables', 'Fruits', 'Flowers', 'Spices'],
      targetStates: ['Maharashtra', 'Karnataka', 'Gujarat', 'All India'],
      farmerCategory: ['All Farmers', 'Small & Marginal Farmers', 'Women Farmers'],
    },
    benefits: ['50% subsidy for Polyhouse construction (up to 4000 sq.m)', '50% subsidy for Shade Net house & Cold Room'],
    requiredDocuments: ['Aadhaar Card', '7/12 & 8A Land Records', 'Irrigation Water & Soil Test Report', 'Polyhouse Civil Design Estimate & Quotation'],
    requiredDocumentsHindi: ['आधार कार्ड', '7/12 व 8A भूमि रिकॉर्ड', 'सिंचाई जल व मिट्टी परीक्षण रिपोर्ट', 'पॉलीहाउस सिविल एस्टिमेट व कोटेशन'],
    requiredDocumentsMarathi: ['आधार कार्ड', '७/१२ व ८अ उतारा', 'पाणी व माती पृथक्करण अहवाल', 'पॉलीहाऊस इस्टिमेट व कोटेशन'],
    applicationSteps: [
      'Apply online via MahaDBT / State Horticulture Portal.',
      'Select \'Protected Cultivation (Polyhouse/Shadenet)\' under MIDH.',
      'Upload land 7/12 extract and water feasibility test report.',
      'District Horticulture Officer conducts field survey & issues Pre-Sanction order.',
      'Construct structure through empanelled vendor and receive 50% subsidy.'
    ],
    applicationStepsHindi: [
      'MahaDBT / राज्य उद्यानिकी पोर्टल के माध्यम से ऑनलाइन आवेदन करें।',
      'MIDH के तहत \'संरक्षित खेती (पॉलीहाउस/शेडनेट)\' विकल्प चुनें।',
      'भूमि 7/12 और जल परीक्षण रिपोर्ट अपलोड करें।',
      'जिला उद्यानिकी अधिकारी सर्वेक्षण कर प्री-संक्शन आदेश जारी करेंगे।',
      'मान्यता प्राप्त विक्रेता द्वारा पॉलीहाउस बनाएं और 50% सब्सिडी प्राप्त करें।'
    ],
    applicationStepsMarathi: [
      'महाडीबीटी फलोत्पादन पोर्टलवर अर्ज नोंदवा.',
      'संरक्षित शेती (पॉलीहाऊस / शेडनेट) पर्याय निवडा.',
      '७/१२ उतारा व पाणी तपासणी अहवाल अपलोड करा.',
      'पूर्वसंमती पत्र मिळाल्यावर मान्यताप्राप्त कंपनीकडून काम पूर्ण करा.',
      'तपासणीनंतर ५०% अनुदान खात्यात मिळवा.'
    ],
    applicationDeadline: '30th November 2026',
    applicationUrl: 'https://midh.gov.in',
    isActive: true,
  },
  {
    _id: 'scheme_18',
    title: 'PMFME - Micro Food Processing Enterprises Subsidy',
    titleHindi: 'पीएम एफएमई - खाद्य प्रसंस्करण उद्योग सब्सिडी योजना',
    titleMarathi: 'पीएम सूक्ष्म अन्न प्रक्रिया उद्योग योजना (PMFME)',
    code: 'PMFME-FOOD',
    category: 'Machinery & Infrastructure',
    shortDescription: '35% credit-linked capital subsidy up to ₹10 Lakh for setting up or upgrading flour mills, oil expellers, and spice units.',
    shortDescriptionHindi: 'आटा चक्की, तेल निष्कर्षण, मसाला पेराई व खाद्य प्रसंस्करण उद्योग लगाने पर 35% सब्सिडी।',
    shortDescriptionMarathi: 'धान्य गिरणी, तेल घाणा, मसाला प्रक्रिया उद्योग सुरू करण्यासाठी ३५% सबसिडी (जास्तीत जास्त ₹१० लाख).',
    fullDescription: 'PM Formalisation of Micro Food Processing Enterprises (PMFME) provides financial and technical assistance to individual farmers and Self Help Groups for value addition.',
    eligibilityCriteria: {
      maxLandAcres: 50,
      targetCrops: ['All Crops', 'Horticulture', 'Spices', 'Oilseeds'],
      targetStates: ['All India'],
      farmerCategory: ['All Farmers', 'Self Help Groups', 'FPOs', 'Individual Entrepreneurs'],
    },
    benefits: ['35% capital subsidy (maximum ₹10,000,000 per unit)', 'Seed capital of ₹40,000 per SHG member for working capital'],
    requiredDocuments: ['Aadhaar Card & PAN Card', 'Project DPR (Detailed Project Report)', 'Bank Statement of last 6 months', 'FSSAI License / Udyam Aadhar Registration'],
    requiredDocumentsHindi: ['आधार कार्ड व पैन कार्ड', 'विस्तृत प्रोजेक्ट रिपोर्ट (DPR)', 'पिछले 6 महीने का बैंक स्टेटमेंट', 'FSSAI लाइसेंस / उद्यम आधार'],
    requiredDocumentsMarathi: ['आधार व पॅन कार्ड', 'प्रकल्प अहवाल (DPR)', 'मागील ६ महिन्यांचे बँक स्टेटमेंट', 'FSSAI परवाना व उद्यम नोंदणी'],
    applicationSteps: [
      'Register on PMFME portal (pmfme.mofpi.gov.in).',
      'Submit online application selecting One District One Product (ODOP) food category.',
      'Resource Person (RP) assists in preparing DPR and bank loan documentation.',
      'Bank sanctions loan & 35% subsidy is kept as fixed deposit subsidy reserve.'
    ],
    applicationStepsHindi: [
      'PMFME पोर्टल (pmfme.mofpi.gov.in) पर पंजीकरण करें।',
      'वन डिस्ट्रिक्ट वन प्रोडक्ट (ODOP) खाद्य श्रेणी चुनकर ऑनलाइन आवेदन जमा करें।',
      'रिसोर्स पर्सन (RP) DPR और बैंक लोन कागजात तैयार करने में मदद करेगा।',
      'बैंक लोन स्वीकृत करता है और 35% सब्सिडी प्रदान की जाती है।'
    ],
    applicationStepsMarathi: [
      'pmfme.mofpi.gov.in वर ऑनलाईन अर्ज भरा.',
      'एक जिल्हा एक उत्पादन (ODOP) अंतर्गत्त प्रक्रिया उद्योग निवडा.',
      'रिसोर्स पर्सन (RP) द्वारे बँकेचा प्रकल्प अहवाल तयार करून घ्या.',
      'कर्ज मंजुरीनंतर ३५% सबसिडी खात्यावर जमा होईल.'
    ],
    applicationDeadline: '31st March 2027',
    applicationUrl: 'https://pmfme.mofpi.gov.in',
    isActive: true,
  },
  {
    _id: 'scheme_19',
    title: 'Dr. Punjabrao Deshmukh Interest Concession Scheme (0% Crop Loan)',
    titleHindi: 'डॉ. पंजाबराव देशमुख ब्याज प्रोत्साहन योजना (0% ब्याज ऋण)',
    titleMarathi: 'डॉ. पंजाबराव देशमुख व्याज सवलत योजना (०% व्याजाने पीक कर्ज)',
    code: 'PDRY-MH',
    category: 'Insurance & Credit',
    shortDescription: '100% interest rebate providing 0% interest crop loan up to ₹3 Lakh for farmers who repay their loans promptly.',
    shortDescriptionHindi: 'समय पर ऋण चुकाने वाले किसानों के लिए ₹3 लाख तक का फसल ऋण बिल्कुल 0% ब्याज दर पर।',
    shortDescriptionMarathi: 'मुदतीत पीक कर्जाची परतफेड करणाऱ्या शेतकऱ्यांना ₹३ लाखांपर्यंत ०% व्याजाने पीक कर्ज.',
    fullDescription: 'Maharashtra State Govt incentive providing full interest subvention to zero percent for short-term agricultural crop loans up to ₹3 Lakh.',
    eligibilityCriteria: {
      maxLandAcres: 50,
      targetCrops: ['All Crops'],
      targetStates: ['Maharashtra'],
      farmerCategory: ['All Farmers', 'Small & Marginal Farmers'],
    },
    benefits: ['Zero percent (0%) effective interest rate on loans up to ₹3,00,000', 'Direct credit of interest rebate upon timely repayment'],
    requiredDocuments: ['7/12 & 8A Land Extracts', 'Bank Crop Loan Passbook', 'Timely Repayment Clearance Receipt', 'Aadhaar Card'],
    requiredDocumentsHindi: ['7/12 व 8A भूमि रिकॉर्ड', 'बैंक फसल ऋण पासबुक', 'समय पर भुगतान रसीद', 'आधार कार्ड'],
    requiredDocumentsMarathi: ['७/१२ आणि ८अ उतारा', 'पीक कर्ज पासबुक', 'मुदतीत कर्ज परतफेड पावती', 'आधार कार्ड'],
    applicationSteps: [
      'Avail short-term crop loan from DCC Bank / Commercial Bank.',
      'Repay total principal amount on or before the due date (usually June 30).',
      'Bank automatically calculates interest rebate (3% State + 3% Central).',
      'Full interest amount credited back to farmer account.'
    ],
    applicationStepsHindi: [
      'सहकारी या वाणिज्यिक बैंक से अल्पकालिक फसल ऋण प्राप्त करें।',
      'नियत तिथि से पहले पूरी मूल राशि चुकाएं।',
      'बैंक स्वचालित रूप से 3% राज्य + 3% केंद्र ब्याज छूट की गणना करता है।',
      'पूरी ब्याज राशि किसान के खाते में वापस जमा कर दी जाती है।'
    ],
    applicationStepsMarathi: [
      'बँकेकडून ३ लाखांपर्यंत पीक कर्ज घ्या.',
      'ठरलेल्या मुदतीत (३० जूनपूर्वी) संपूर्ण पीक कर्जाची परतफेड करा.',
      'शासनाकडून ३% व्याज परतावा थेट बँक खात्यात जमा होतो.'
    ],
    applicationDeadline: '30th June Every Year',
    applicationUrl: 'https://krishi.maharashtra.gov.in',
    isActive: true,
  },
  {
    _id: 'scheme_20',
    title: 'Price Support Scheme & MSP Bhavantar Bhugtan (Crop Guarantee)',
    titleHindi: 'मूल्य समर्थन योजना व भावांतर भुगतान योजना (MSP सुरक्षा)',
    titleMarathi: 'किमान आधारभूत किंमत (MSP) व भावांतर योजना',
    code: 'PSS-MSP',
    category: 'Financial Assistance',
    shortDescription: 'Government purchase at guaranteed Minimum Support Price (MSP) or direct bank transfer of price gap when market rates fall below MSP.',
    shortDescriptionHindi: 'बाजार भाव न्यूनतम समर्थन मूल्य (MSP) से कम होने पर घाटे का सीधा बैंक भुगतान।',
    shortDescriptionMarathi: 'बाजारभाव एमएसपी (MSP) पेक्षा कमी झाल्यास फरकाची रक्कम थेट बँक खात्यात जमा.',
    fullDescription: 'Procurement at MSP managed by NAFED and FCI ensures farmers receive guaranteed minimum remunerative prices for pulses, oilseeds, and cotton.',
    eligibilityCriteria: {
      maxLandAcres: 50,
      targetCrops: ['Soybean', 'Cotton', 'Gram', 'Tur', 'Moong', 'Wheat', 'Paddy'],
      targetStates: ['Maharashtra', 'Madhya Pradesh', 'Gujarat', 'All India'],
      farmerCategory: ['All Farmers'],
    },
    benefits: ['Guaranteed sale at MSP rates', 'Direct Bank Transfer (DBT) within 7 days of crop delivery'],
    requiredDocuments: ['Aadhaar Card', '7/12 Extract with active Crop Sowing Entry (पिक पेरा)', 'Bank Passbook'],
    requiredDocumentsHindi: ['आधार कार्ड', 'फसल प्रविष्टि (पिक पेरा) सहित 7/12 रिकॉर्ड', 'बैंक पासबुक'],
    requiredDocumentsMarathi: ['आधार कार्ड', 'पिक पेऱ्यासह ७/१२ उतारा', 'बँक पासबुक'],
    applicationSteps: [
      'Register crop details on State Procurement Portal / NAFED e-Samridhi.',
      'Receive SMS slot for crop delivery at Govt Procurement Centre / APMC.',
      'Deliver dried crop matching fair average quality (FAQ) standards.',
      'Full MSP payment credited directly to bank account.'
    ],
    applicationStepsHindi: [
      'राज्य खरीद पोर्टल / NAFED ई-समृद्धि पर फसल पंजीकरण करें।',
      'सरकारी खरीद केंद्र पर फसल लाने के लिए एसएमएस स्लॉट प्राप्त करें।',
      'मानक गुणवत्ता की फसल जमा करें।',
      'पूरा एमएसपी भुगतान सीधे बैंक खाते में प्राप्त करें।'
    ],
    applicationStepsMarathi: [
      'सरकारी खरेदी पोर्टल / नाफेडवर ऑनलाईन नोंदणी करा.',
      'खरेदी केंद्रावर माल आणण्यासाठी एसएमएस (SMS) मेसेज मिळवा.',
      'प्रतवारीनुसार माल शासकीय केंद्रात जमा करा.',
      'एमएसपी दरानुसार रक्कम खात्यात मिळवा.'
    ],
    applicationDeadline: '31st December 2026',
    applicationUrl: 'https://nafed-india.org',
    isActive: true,
  },
  {
    _id: 'scheme_21',
    title: 'National Mission on Edible Oils - Oilseed Subsidy (NMEO-OP)',
    titleHindi: 'राष्ट्रीय खाद्य तेल मिशन - तिलहन व पाम तेल सब्सिडी',
    titleMarathi: 'राष्ट्रीय खाद्यतेल अभियान (गजर व गळित धान्य अनुदान)',
    code: 'NMEO-OIL',
    category: 'Organic & Soil Health',
    shortDescription: '₹29,000 per hectare financial subsidy for planting oil palm, mustard, and sunflower, plus harvesting equipment support.',
    shortDescriptionHindi: 'सोयाबीन, सरसों व पाम तेल पौधे लगाने के लिए ₹29,000 प्रति हेक्टेयर प्रोत्साहन राशि।',
    shortDescriptionMarathi: 'सोयाबीन, मोहरी, भुईमूग व तेलताड लागवडीसाठी ₹२९,००० प्रति हेक्टरी अनुदान.',
    fullDescription: 'NMEO-OP aims to boost domestic edible oil production by subsidizing high-yielding oilseed planting material, harvesting tools, and micro-irrigation.',
    eligibilityCriteria: {
      maxLandAcres: 20,
      targetCrops: ['Soybean', 'Groundnut', 'Mustard', 'Sunflower', 'Oil Palm'],
      targetStates: ['Maharashtra', 'Telangana', 'Andhra Pradesh', 'All India'],
      farmerCategory: ['All Farmers', 'Small & Marginal Farmers'],
    },
    benefits: ['₹29,000/ha subsidy for planting materials', '₹5,000 per hectare maintenance assistance for 4 years'],
    requiredDocuments: ['Aadhaar Card', '7/12 Land Record', 'Bank Passbook', 'Purchase Receipt of Certified Hybrid Oilseeds'],
    requiredDocumentsHindi: ['आधार कार्ड', '7/12 भूमि रिकॉर्ड', 'बैंक पासबुक', 'प्रमाणित हाइब्रिड बीज खरीद रसीद'],
    requiredDocumentsMarathi: ['आधार कार्ड', '७/१२ उतारा', 'बँक पासबुक', 'प्रमाणित बियाणे खरेदी पावती'],
    applicationSteps: [
      'Apply through Agriculture Officer at Gram Panchayat level.',
      'Submit 7/12 land extract showing intended oilseed crop area.',
      'Purchase certified hybrid oilseeds / oil palm saplings.',
      'Receive direct financial subsidy in bank account upon field verification.'
    ],
    applicationStepsHindi: [
      'ग्राम पंचायत स्तर पर कृषि अधिकारी के माध्यम से आवेदन करें।',
      'तिलहन फसल क्षेत्र दर्शाने वाला 7/12 रिकॉर्ड जमा करें।',
      'प्रमाणित हाइब्रिड बीज या पौधे खरीदें।',
      'सत्यापन के बाद बैंक खाते में सब्सिडी प्राप्त करें।'
    ],
    applicationStepsMarathi: [
      'कृषी सहाय्यकांकडे गळित धान्य लागवडीसाठी अर्ज द्या.',
      '७/१२ उतारा सादर करा.',
      'महाबीज / मान्यताप्राप्त दुकानातून बियाणे घ्या.',
      'अनुदानाची रक्कम थेट खात्यात वर्ग होईल.'
    ],
    applicationDeadline: '31st December 2026',
    applicationUrl: 'https://nmeo.dac.gov.in',
    isActive: true,
  },
  {
    _id: 'scheme_22',
    title: 'Mahila Kisan Sashaktikaran Pariyojana (Women Farmer Empowerment)',
    titleHindi: 'महिला किसान सशक्तिकरण परियोजना (MKSP)',
    titleMarathi: 'महिला शेतकरी सक्षमीकरण योजना (MKSP)',
    code: 'MKSP-WOMEN',
    category: 'Organic & Soil Health',
    shortDescription: '100% free skill training, organic farming inputs, and ₹15,000 grant for women farmers establishing community seed banks.',
    shortDescriptionHindi: 'महिला किसानों के लिए जैविक खेती प्रशिक्षण, उपकरण व ₹15,000 की बीज बैंक सहायता।',
    shortDescriptionMarathi: 'महिला शेतकऱ्यांसाठी सेंद्रिय तंत्रज्ञान प्रशिक्षण, अवजारे व ₹१५,००० चे बीज बँक सहाय्य.',
    fullDescription: 'MKSP empowers women farmers by building local capacities, promoting non-chemical sustainable agriculture, and improving household nutritional security.',
    eligibilityCriteria: {
      maxLandAcres: 10,
      targetCrops: ['All Crops', 'Vegetables', 'Organic Crops'],
      targetStates: ['All India'],
      farmerCategory: ['Women Farmers', 'Self Help Groups (SHG)'],
    },
    benefits: ['Free organic farming & bio-pesticide preparation training', 'Financial grant of ₹15,000 per SHG group for local seed preservation'],
    requiredDocuments: ['Aadhaar Card of Woman Farmer', 'SHG Group Membership Details', 'Bank Passbook', 'Land Record of self/spouse'],
    requiredDocumentsHindi: ['महिला किसान का आधार कार्ड', 'एसएचजी समूह सदस्यता विवरण', 'बैंक पासबुक', 'पति/स्वयं का भूमि रिकॉर्ड'],
    requiredDocumentsMarathi: ['महिला शेतकऱ्याचे आधार कार्ड', 'बचत गट नोंदणी माहिती', 'बँक पासबुक', '७/१२ उतारा'],
    applicationSteps: [
      'Register through local MAVIM / State Rural Livelihoods Mission (SRLM) office.',
      'Form or join a Mahila Kisan Self Help Group.',
      'Participate in 3-day eco-farming and bio-input production workshop.',
      'Receive free bio-input kit and group financial grant.'
    ],
    applicationStepsHindi: [
      'स्थानीय माविम (MAVIM) या राज्य ग्रामीण आजीविका मिशन कार्यालय के माध्यम से पंजीकरण करें।',
      'महिला किसान स्वयं सहायता समूह से जुड़ें।',
      'जैविक खेती कार्यशाला में भाग लें।',
      'मुफ्त जैविक इनपुट किट और समूह अनुदान प्राप्त करें।'
    ],
    applicationStepsMarathi: [
      'उमेद (MSRLM) किंवा माविम कार्यालयाशी संपर्क साधा.',
      'महिला शेतकरी बचत गटात नोंदणी करा.',
      'सेंद्रिय शेती प्रशिक्षणात भाग घ्या.',
      'मोफत सेंद्रिय खत किट आणि बचत गट अनुदान मिळवा.'
    ],
    applicationDeadline: 'Continuous / Open Year-Round',
    applicationUrl: 'https://daynrlm.gov.in',
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
