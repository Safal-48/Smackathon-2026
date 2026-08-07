import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey && apiKey !== 'your_gemini_api_key_here' ? new GoogleGenerativeAI(apiKey) : null;

// ─── Comprehensive Agricultural Knowledge Base ──────────────────────────────
const AGRI_KNOWLEDGE_BASE = `
=== GOVERNMENT SCHEMES ===

1. PM-KISAN (Pradhan Mantri Kisan Samman Nidhi):
   - Benefit: ₹6,000/year in 3 equal installments of ₹2,000 directly into farmer bank accounts.
   - Eligibility: All landholding farmer families.
   - Documents: Aadhaar Card, Bank Passbook (Aadhaar-linked), 7/12 extract / Khatauni.
   - Apply: pmkisan.gov.in or nearest CSC center.

2. PMFBY (Pradhan Mantri Fasal Bima Yojana):
   - Benefit: Crop insurance against drought, flood, pest attack, unseasonal rain.
   - Premium: 2% Kharif / 1.5% Rabi / 5% Commercial/Horticulture.
   - Documents: Aadhaar, Sowing Certificate, Land Record, Bank Passbook.
   - Claim: Within 72 hours of damage via 1800-180-1551 or Crop Insurance App.

3. PM Krishi Sinchayee Yojana (PMKSY – Per Drop More Crop):
   - Benefit: 45–55% subsidy on Drip and Sprinkler irrigation systems.
   - Eligibility: Any farmer with verifiable land and water source.

4. PM-KUSUM (Solar Agriculture Pump):
   - Benefit: 60% subsidy (30% Central + 30% State) on standalone solar pumps.
   - HP range: 3HP to 7.5HP off-grid solar pumps eligible.

5. Soil Health Card Scheme:
   - Benefit: Free soil testing every 2 years with printed soil health card.
   - Contains: NPK levels, pH, Micronutrients, custom fertilizer recommendations.

6. Kisan Credit Card (KCC):
   - Benefit: Revolving credit up to ₹3 lakh at 4% interest (after 2% subvention).
   - Covers: Crop cultivation, post-harvest expenses, allied activities.

7. eNAM (National Agriculture Market):
   - Benefit: Online pan-India trading platform. Farmers get price discovery from across India.
   - Registration: Required Aadhaar, Bank, ReSC certificate.

=== SOIL HEALTH & NUTRIENT MANAGEMENT ===

NPK Deficiency Symptoms:
- Nitrogen (N): Yellowing of older leaves from bottom, stunted growth.
  Fix: Apply Urea (46% N) at 25–30 kg/acre as top dressing.
- Phosphorus (P): Purple/red discoloration of leaf undersides, poor root growth.
  Fix: Apply DAP (18:46:0) at 20–25 kg/acre as basal dose.
- Potassium (K): Leaf edge browning, weak stems, poor fruit set.
  Fix: Apply MOP (Muriate of Potash, 60% K) at 15–20 kg/acre.

Soil pH Correction:
- Acidic (pH < 6): Apply Agricultural Lime (CaCO3) at 1–2 tons/acre.
- Alkaline (pH > 8): Apply Gypsum at 500kg/acre or elemental sulfur.

Organic Carbon Improvement:
- Apply FYM (Farm Yard Manure) at 4–5 tons/acre.
- Use vermicompost, green manuring (Dhaincha/Sunnhemp), crop residue incorporation.
- Target organic carbon > 0.75% for healthy soil.

=== CROP MANAGEMENT & SELECTION ===

Kharif Season (June–October): Cotton, Soybean, Paddy, Maize, Tur (Pigeon Pea), Bajra.
Rabi Season (October–March): Wheat, Chickpea, Linseed, Mustard, Garlic, Onion.
Zaid Season (March–June): Watermelon, Muskmelon, Cucumber, Moong.

Crop Rotation Best Practices:
- Cotton → Chickpea (Harbhara) → Reduce nematodes, improve N fixation.
- Paddy → Wheat → Lentils → Sustainable nutrient cycling.
- Avoid growing same family crops (Solanaceae) back-to-back.

=== IRRIGATION & WATER MANAGEMENT ===

Critical Water Requirements (liters per plant/day):
- Cotton: 5–8 liters. Critical stage: Squaring and Boll Development.
- Wheat: 3–5 liters. Critical stage: Crown root initiation + heading.
- Paddy: Field saturation + 5cm standing water. Total: 1200–1400mm/season.
- Soybean: 4–6 liters. Critical: Pod formation stage.

Drip Irrigation Benefit: Saves 40–50% water, increases yield by 25–35%.
Mulching: Black polythene mulch reduces evaporation by 60%, suppresses weeds.

=== PEST CONTROL & DISEASE MANAGEMENT ===

Common Pests:
- Cotton Pink Bollworm: Pheromone traps + Spinosad spray (0.45ml/l). Max 3 sprays.
- Soybean Girdle Beetle: Endosulfan 35 EC (700ml/acre) or Quinalphos. Remove stubble.
- Wheat Yellow Rust: Propiconazole 25% EC spray at first sign.
- Paddy Brown Plant Hopper (BPH): Imidacloprid 17.8 SL (100ml/acre). Alternate flooding.

Integrated Pest Management (IPM):
- Use sticky yellow traps for whitefly and thrips monitoring.
- Neem Oil (5%) spray for early pest control.
- Preserve natural predators (ladybugs, spiders, parasitoid wasps).

=== FERTILIZER DOSAGE GUIDE ===

Cotton (per acre): Basal: 20kg DAP + 10kg MOP. Top dressing at 30 days: 30kg Urea. Foliar: 2% DAP spray at flowering.
Soybean (per acre): Basal: 20kg DAP + 15kg MOP. No top dressing N (nodulation). Apply Rhizobium seed treatment.
Wheat (per acre): Basal: 25kg DAP + 15kg MOP. 1st top: 40kg Urea at 21 days. 2nd top: 25kg Urea at 45 days.
Paddy (per acre): Basal: 20kg DAP + 20kg MOP. Urea: 35kg at 15 days after transplanting, 30kg at 45 days.

=== FARMING BEST PRACTICES ===

Seed Treatment:
- Treat seeds with Trichoderma viride (5g/kg) for root rot protection.
- Rhizobium inoculant for legumes (soybean, chickpea, moong).
- Captan 75 WP (3g/kg) for fungal seed-borne diseases.

Post-Harvest Management:
- Dry crops to safe moisture (12–14% for grains) before storage.
- Use hermetic bags (Purdue Improved Crop Storage) to prevent storage pests.
- Register on eNAM for direct market sale at best price.

Climate-Smart Agriculture:
- Practice Zero Tillage for wheat to save water and fuel.
- Sow drought-tolerant varieties (e.g., BDN 711 Soybean, Bhawani Cotton).
- Ridge and furrow system for moisture conservation in rain-fed areas.

=== KRISHIMITRA / KRISHISEVA PLATFORM & WEBSITE KNOWLEDGE ===
- Platform Name: KrishiMitra AI (KrishiSeva AI)
- Mission: Empowering farmers with Precision Soil Diagnostics, Multilingual AI Guidance, and Direct Welfare Schemes.
- Portable Soil Quality Diagnostic Tool: Allows farmers to input Nitrogen (N), Phosphorus (P), Potassium (K), pH, Moisture, and Organic Carbon values or pair an IoT Bluetooth NPK sensor to get custom fertilizer dosage & crop recommendations.
- Government Schemes Explorer: Search and filter 10+ verified state and central schemes (PM-KISAN, PMFBY, PMKSY Drip, PM-KUSUM Solar Pump, KCC loan, etc.) with step-by-step document guides.
- Multilingual Voice & AI Advisor: Supports English, Hindi (हिंदी), and Marathi (मराठी) with text and automatic voice readout capabilities.
- Contact & Support: Email krushimitra.work@gmail.com, Call/WhatsApp +91 7875648995 / 7875648995, Office: KrishiMitra AgTech Hub, Krishi Bhavan Road, Nagpur, Maharashtra - 440001. Kisan Helpline: 1800-180-1551 (Toll-Free).
`;

// ─── Image Analysis Knowledge Base ─────────────────────────────────────────
const IMAGE_ANALYSIS_KB = `
When analyzing a crop/soil image:
1. Identify: Crop type, growth stage, any visible discoloration, spots, lesions, wilting.
2. Diagnose: Possible nutrient deficiency, pest attack, fungal disease, or drought stress.
3. Recommend: Immediate corrective action, spray schedule, and contact nearest agriculture extension officer if severe.
`;

// ─── Main AI Response Generator ─────────────────────────────────────────────
export const generateFarmerAIResponse = async (userPrompt, language = 'en', imageBase64 = null, schemesList = []) => {
  const languageNames = {
    hi: 'Hindi (हिंदी)',
    mr: 'Marathi (मराठी)',
    en: 'English',
  };
  const targetLang = languageNames[language] || 'English';

  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const systemContext = `
You are "KrishiSeva AI" (KrishiMitra AI), an expert AI assistant dedicated EXCLUSIVELY to Indian agriculture, crop cultivation, soil health, government welfare schemes, and the KrishiMitra web platform.

IDENTITY & INTRODUCTIONS:
- If the user asks "tell me about yourself", "who are you", "what can you do", "introduce yourself", "tum kaun ho", "apne bare me batao", "तुझ्याबद्दल सांग" or similar identity questions:
  Introduce yourself warmly as KrishiSeva AI (KrishiMitra AI). Explain that you are an intelligent agricultural assistant built to support Indian farmers with crop management, soil health diagnostics, government welfare scheme guidance, pest control strategies, and website support (in English, Hindi, and Marathi with text and voice).

STRICT DOMAIN BOUNDARY & OUT-OF-SCOPE GUARDRAILS:
1. You MUST ONLY answer questions related to:
   a) KrishiSeva AI identity, capabilities, and KrishiMitra platform support (krushimitra.work@gmail.com, 7875648995).
   b) Agriculture, crops, soil health, fertilizers, pest control, irrigation, weather, farming techniques, livestock.
   c) Government agricultural schemes, subsidies, loans, crop insurance (PM-KISAN, PMFBY, PM-KUSUM, KCC, PMKSY, Soil Health Card, etc.).
2. IF THE USER ASKS ABOUT ANYTHING UNRELATED TO AGRICULTURE, GOVERNMENT SCHEMES, OR KRISHIMITRA WEBSITE (such as movies, actors, coding/programming, sports, general entertainment, non-agricultural politics, general history, homework, stocks, video games, etc.):
   You MUST STRICTLY AND POLITELY DECLINE AND RESPOND IN ${targetLang}:
   - English: "I am sorry! I am KrishiMitra AI, dedicated exclusively to agriculture, crops, government welfare schemes, and our farming platform. Please ask me any question related to farming or KrishiMitra!"
   - Hindi: "क्षमा करें! मैं कृषिसेवा AI (KrishiMitra AI) हूँ और केवल कृषि, फसलों, मृदा स्वास्थ्य, सरकारी योजनाओं और हमारे प्लेटफॉर्म से संबंधित प्रश्नों का उत्तर दे सकता हूँ। कृपया खेती या कृषि योजनाओं से जुड़ा प्रश्न पूछें!"
   - Marathi: "क्षमस्व! मी कृषिसेवा AI (KrishiMitra AI) असून फक्त शेती, पिके, माती आरोग्य, शासकीय योजना आणि आमच्या प्लॅटफॉर्मशी संबंधित प्रश्नांची उत्तरे देऊ शकतो. कृपया शेती किंवा शासकीय योजनांबाबत प्रश्न विचारा!"
3. Respond ALWAYS in ${targetLang}. Use clear bullet points and simple language suitable for farmers.

Knowledge Base:
${AGRI_KNOWLEDGE_BASE}

${imageBase64 ? IMAGE_ANALYSIS_KB : ''}
`;

      let parts = [
        {
          text: systemContext + `\n\nUser Question: "${userPrompt}"\n\nProvide a helpful, accurate, and empathetic response in ${targetLang}.`,
        },
      ];

      // Add image if uploaded
      if (imageBase64) {
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
        const mimeType = imageBase64.startsWith('data:image/png') ? 'image/png' : 'image/jpeg';
        parts = [
          {
            inlineData: {
              data: base64Data,
              mimeType,
            },
          },
          {
            text: systemContext + `\n\nUser uploaded a crop/soil image with this query: "${userPrompt}"\n\nAnalyze the image carefully and provide diagnosis and recommendations in ${targetLang}.`,
          },
        ];
      }

      const result = await model.generateContent(parts);
      const response = await result.response;
      return response.text();
    } catch (err) {
      console.warn('Gemini API Error → Fallback triggered:', err.message);
    }
  }

  // ─── Smart Offline Fallback Engine ─────────────────────────────────────
  return buildFallbackResponse(userPrompt, language);
};

// Keep legacy export for scheme controller backward compatibility
export const generateSchemeAIResponse = async (userPrompt, language = 'en', schemesList = []) => {
  return generateFarmerAIResponse(userPrompt, language, null, schemesList);
};

// ─── Comprehensive Offline Fallback Engine (30 Agriculture Topics) ──────────
function buildFallbackResponse(query, lang) {
  const q = query.toLowerCase();

  // Out-of-scope non-agriculture check
  const nonAgriKeywords = [
    'movie', 'film', 'actor', 'actress', 'song', 'music', 'game', 'code', 'python', 'javascript',
    'java', 'c++', 'react', 'html', 'css', 'programming', 'cricket', 'football', 'ipl', 'politics',
    'election', 'president', 'prime minister', 'capital of', 'math', 'algebra', 'physics',
    'chemistry', 'bitcoin', 'crypto', 'stock market', 'nifty', 'sensex', 'gossip', 'bollywood', 'hollywood'
  ];

  const agriMatch = /(crop|soil|farm|fertilizer|pest|water|irrigation|scheme|kisan|subsid|pmkisan|pmfby|seed|yield|cotton|wheat|soybean|paddy|sugarcane|tomato|krishi|krushimitra|contact|email|phone|help|number|test|npk|ph|bima|baza|mandi|about|yourself|who are you|who r u|introduce|tum kaun|kaun ho|kaun hai|apne bare|tuzhya|tujhya|tujha|chya baddal|namaste|hello|hi)/i.test(q);

  if (!agriMatch && nonAgriKeywords.some((kw) => q.includes(kw))) {
    const refusal = {
      en: `I am sorry! I am KrishiMitra AI, dedicated exclusively to agriculture, crops, government welfare schemes, and our farming platform. Please ask me any question related to farming or KrishiMitra!`,
      hi: `क्षमा करें! मैं कृषिसेवा AI (KrishiMitra AI) हूँ और केवल कृषि, फसलों, मृदा स्वास्थ्य, सरकारी योजनाओं और हमारे प्लेटफॉर्म से संबंधित प्रश्नों का उत्तर दे सकता हूँ। कृपया खेती या कृषि योजनाओं से जुड़ा प्रश्न पूछें!`,
      mr: `क्षमस्व! मी कृषिसेवा AI (KrishiMitra AI) असून फक्त शेती, पिके, माती आरोग्य, शासकीय योजना आणि आमच्या प्लॅटफॉर्मशी संबंधित प्रश्नांची उत्तरे देऊ शकतो. कृपया शेती किंवा शासकीय योजनांबाबत प्रश्न विचारा!`,
    };
    return refusal[lang] || refusal['en'];
  }

  const responses = {
    // 1. Self-Introduction / Identity
    '(about yourself|who are you|who r u|tell me about yourself|what can you do|what is your name|tum kaun ho|apne bare|तु कोण|तुझ्याबद्दल|introduce|who created you)': {
      en: `**Namaste! I am KrishiSeva AI (KrishiMitra AI) 🌾**\n\nI am your dedicated Agricultural & Government Scheme Assistant built specifically to empower Indian farmers.\n\n**Here is what I can do for you:**\n• 🌾 **Crop Guidance:** Best practices, fertilizer schedules & pest control for Cotton, Wheat, Soybean, Paddy, Sugarcane & Vegetables.\n• 🧪 **Soil Health & Diagnostics:** Advice on NPK levels, soil pH correction, organic carbon & soil health cards.\n• 🏛️ **Government Welfare Schemes:** Information & application steps for PM-KISAN (₹6,000), PMFBY Crop Insurance, PM-KUSUM Solar Pump, PMKSY Drip Subsidy, KCC Loan, etc.\n• 🎙️ **Text & Voice Support:** Ask me in English, Hindi, or Marathi using text or voice!\n• 🌐 **Platform Support:** Guidance on KrishiMitra soil testing tools and support (krushimitra.work@gmail.com | 7875648995).\n\nFeel free to ask me any farming or scheme question!`,
      hi: `**नमस्ते! मैं कृषिसेवा AI (KrishiMitra AI) हूँ! 🌾**\n\nमैं विशेष रूप से भारतीय किसानों की सहायता के लिए बनाया गया एक एआई कृषि और सरकारी योजना सहायक हूँ।\n\n**मैं आपकी इन विषयों में मदद कर सकता हूँ:**\n• 🌾 **फसल मार्गदर्शन:** कपास, गेहूं, सोयाबीन, धान, गन्ना व सब्जियों के लिए उर्वरक खुराक एवं कीट नियंत्रण।\n• 🧪 **मिट्टी स्वास्थ्य:** NPK स्तर, pH सुधार, जैविक कार्बन और मृदा परीक्षण।\n• 🏛️ **सरकारी योजनाएं:** PM-KISAN (₹6,000), फसल बीमा (PMFBY), सोलर पंप (PM-KUSUM), ड्रिप सब्सिडी (PMKSY), KCC लोन आदि की पूरी जानकारी।\n• 🎙️ **पाठ एवं आवाज सुविधा:** आप मुझसे हिंदी, मराठी या अंग्रेजी में बोलकर या लिखकर सवाल पूछ सकते हैं!\n• 🌐 **वेबसाइट सहायता:** संपर्क सहायता (krushimitra.work@gmail.com | 7875648995)।\n\nआप मुझसे खेती से जुड़ा कोई भी सवाल पूछ सकते हैं!`,
      mr: `**नमस्कार! मी कृषिसेवा AI (KrishiMitra AI) आहे! 🌾**\n\nमी खास भारतीय शेतकऱ्यांना मदत करण्यासाठी बनवलेला AI शेती व शासकीय योजना सल्लागार आहे.\n\n**मी तुम्हाला खालील गोष्टींमध्ये मदत करू शकतो:**\n• 🌾 **पीक मार्गदर्शन:** कापूस, गहू, सोयाबीन, भात, ऊस व भाजीपाला खत नियोजन व कीड नियंत्रण.\n• 🧪 **माती आरोग्य:** NPK प्रमाण, pH सुधारणा, सेंद्रिय कार्बन व माती परीक्षण.\n• 🏛️ **शासकीय योजना:** PM-KISAN (₹६,०००), पीक विमा, सौर पंप (PM-KUSUM), ठिबक अनुदान, KCC कर्ज इत्यादी माहिती.\n• 🎙️ **मजकूर व आवाज सुविधा:** तुम्ही मला मराठी, हिंदी किंवा इंग्रजीत बोलून किंवा लिहून प्रश्न विचारू शकता!\n• 🌐 **वेबसाईट मदत:** संपर्क (krushimitra.work@gmail.com | 7875648995).\n\nमला कोणताही शेतीविषयक प्रश्न विचारा!`,
    },

    // 2. Platform & Support
    '(krushi.?mitra|krishi.?seva|website|contact|email|phone|support|number|संपर्क|ईमेल|फोन)': {
      en: `**KrishiMitra AI Platform & Contact Info:**\n\n• **Email Support:** krushimitra.work@gmail.com\n• **Phone / WhatsApp:** +91 7875648995 / 7875648995\n• **Office Address:** KrishiMitra AgTech Hub, Krishi Bhavan Road, Nagpur, Maharashtra - 440001\n• **Kisan Helpline:** 1800-180-1551 (Toll-Free)\n• **Key Features:** Portable NPK Soil Testing, 10+ Welfare Schemes, Multilingual Voice Assistant (English, Hindi, Marathi).`,
      hi: `**कृषिसेवा AI प्लेटफॉर्म व संपर्क विवरण:**\n\n• **ईमेल सहायता:** krushimitra.work@gmail.com\n• **फोन व व्हाट्सएप:** +91 7875648995 / 7875648995\n• **कार्यालय:** कृषिसेवा एगटेक हब, कृषि भवन रोड, नागपुर, महाराष्ट्र - 440001\n• **किसान हेल्पलाइन:** 1800-180-1551 (टोल-फ्री)\n• **मुख्य सेवाएं:** मिट्टी जांच टूल, सरकारी योजनाएं, बहुभाषी वॉयस एआई सहायक।`,
      mr: `**कृषिसेवा AI प्लॅटफॉर्म व संपर्क माहिती:**\n\n• **ईमेल सहाय्य:** krushimitra.work@gmail.com\n• **फोन व व्हॉट्सॲप:** +91 7875648995 / 7875648995\n• **कार्यालय:** कृषिसेवा अ‍ॅगटेक हब, कृषी भवन रोड, नागपूर, महाराष्ट्र - ४४०००१\n• **शेतकरी हेल्पलाइन:** 1800-180-1551 (टोल-फ्री)\n• **वैशिष्ट्ये:** माती तपासणी, शासकीय योजना, बहुभाषिक व्हॉइस AI सहाय्यक.`,
    },

    // 3. PM-KISAN Scheme
    '(pm.?kisan|6000|income.?support|hap.ta|किसान|शेतकरी|samman)': {
      en: `**PM-KISAN Scheme (₹6,000/year):**\n\n• **Who gets it:** All landholder farmer families\n• **Amount:** ₹2,000 every 4 months (3 installments directly via DBT)\n• **Documents Required:** Aadhaar Card, Land Record (7/12 & 8A / Khatauni), Aadhaar-linked Bank Passbook\n• **How to Apply:** Visit pmkisan.gov.in or nearest CSC center\n• **Status Check:** Go to pmkisan.gov.in → "Know Your Status" using Aadhaar/Registration ID`,
      hi: `**पीएम-किसान योजना (₹6,000/वर्ष):**\n\n• **पात्रता:** सभी भूमिधारक किसान परिवार\n• **लाभ:** ₹2,000 हर 4 महीने, 3 किश्तों में सीधे बैंक खाते में (DBT)\n• **दस्तावेज:** आधार कार्ड, 7/12 भूमि रिकॉर्ड, आधार-लिंक बैंक पासबुक\n• **आवेदन:** pmkisan.gov.in या नजदीकी CSC केंद्र`,
      mr: `**पीएम-किसान योजना (₹६,०००/वर्ष):**\n\n• **पात्रता:** सर्व भूमिधारक शेतकरी कुटुंबे\n• **लाभ:** ₹२,००० प्रत्येक ४ महिन्यांनी थेट बँक खात्यात\n• **कागदपत्रे:** आधार कार्ड, ७/१२ उतारा, बँक पासबुक\n• **अर्ज:** pmkisan.gov.in किंवा जवळच्या CSC केंद्रावर`,
    },

    // 4. PMFBY Crop Insurance
    '(insurance|bima|crop.?loss|fasal.?bima|विमा|नुकसान|पीक विमा)': {
      en: `**PM Fasal Bima Yojana (PMFBY Crop Insurance):**\n\n• **Coverage:** Drought, flood, unseasonal rain, hail, pest attack\n• **Nominal Premium:** 2% for Kharif crops | 1.5% for Rabi crops | 5% for Commercial/Horticulture\n• **Claim Deadline:** Report damage within 72 hours via Toll-Free 1800-180-1551 or Crop Insurance App\n• **Documents Needed:** Aadhaar, Crop Sowing Certificate (Pik Pera), 7/12 Extract, Bank Passbook`,
      hi: `**प्रधानमंत्री फसल बीमा योजना (PMFBY):**\n\n• **कवरेज:** सूखा, बाढ़, बेमौसम बारिश, कीट हमले से पूरी सुरक्षा\n• **प्रीमियम:** खरीफ: मात्र 2% | रबी: 1.5%\n• **क्लेम समय:** नुकसान के 72 घंटे में 1800-180-1551 पर दर्ज करें`,
      mr: `**पीएम पीक विमा योजना:**\n\n• **संरक्षण:** दुष्काळ, पूर, अवकाळी पाऊस, कीड नुकसानीस पूर्ण संरक्षण\n• **प्रीमियम:** खरीप: केवळ २% | रबी: १.५%\n• **दावा:** नुकसानीनंतर ७२ तासात 1800-180-1551 वर नोंदवा`,
    },

    // 5. PMKSY Drip & Sprinkler Subsidy
    '(drip|sprinkler|irrigation|sinchayee|सिंचाई|ठिबक|पाणी|तुषार)': {
      en: `**PM Krishi Sinchayee Yojana (Drip & Sprinkler Subsidy):**\n\n• **Subsidy:** 45% for General Farmers | 55% for Small & Marginal Farmers\n• **Benefits:** Saves 40–50% water while boosting crop yield by 25–35%\n• **Eligible Crops:** Cotton, Sugarcane, Vegetables, Banana, Pomegranate\n• **How to Apply:** Apply through State Agriculture Portal (e.g. MahaDBT in MH) or District Agri Office`,
      hi: `**PM कृषि सिंचाई योजना (ड्रिप सब्सिडी):**\n\n• **सब्सिडी:** सामान्य किसान: 45% | लघु/सीमांत किसान: 55%\n• **फायदा:** 40-50% पानी बचत, 25-35% अधिक पैदावार\n• **आवेदन:** जिला कृषि कार्यालय या राज्य DBT पोर्टल (जैसे MahaDBT)`,
      mr: `**पीएम कृषी सिंचन योजना (ठिबक अनुदान):**\n\n• **अनुदान:** सामान्य शेतकरी: ४५% | लहान/अल्पभूधारक: ५५%\n• **फायदा:** ४०-५०% पाण्याची बचत, उत्पन्नात २५-३५% वाढ\n• **अर्ज:** जिल्हा कृषी कार्यालय किंवा mahadbt.maharashtra.gov.in`,
    },

    // 6. PM-KUSUM Solar Pump
    '(solar|kusum|pump|सोलर|पंप|सौर)': {
      en: `**PM-KUSUM Solar Agriculture Pump Scheme:**\n\n• **Subsidy:** Up to 60% total capital subsidy (30% Central + 30% State Govt)\n• **Options Available:** 3HP, 5HP, 7.5HP off-grid standalone solar pumps\n• **Key Benefit:** Zero electricity bills + guaranteed daytime irrigation\n• **Documents:** Aadhaar Card, 7/12 Land Extract, No-Electricity Connection Proof, Bank Passbook\n• **Apply:** pmkusum.mnre.gov.in or State Renewable Energy Agency (e.g. MEDA)`,
      hi: `**PM-KUSUM सोलर पंप योजना:**\n\n• **सब्सिडी:** कुल 60% (30% केंद्र + 30% राज्य)\n• **लाभ:** शून्य बिजली बिल + दिन में निर्बाध सिंचाई\n• **आवेदन:** pmkusum.mnre.gov.in या राज्य ऊर्जा एजेंसी`,
      mr: `**पीएम-कुसुम सौर पंप योजना:**\n\n• **अनुदान:** एकूण ६०% (३०% केंद्र + ३०% राज्य)\n• **फायदा:** शून्य वीज बिल + दिवसा सिंचन\n• **अर्ज:** pmkusum.mnre.gov.in किंवा महाऊर्जा (MEDA)`,
    },

    // 7. Kisan Credit Card (KCC) Loan
    '(kcc|credit card|loan|bank loan|कर्ज|लोन|ब्याज|interest)': {
      en: `**Kisan Credit Card (KCC) Agri Loan:**\n\n• **Credit Limit:** Up to ₹3 Lakh at concessional interest rate\n• **Effective Interest Rate:** Only 4% per annum (after 3% prompt repayment incentive)\n• **Collateral-Free Loan:** No land collateral required up to ₹1.6 Lakh\n• **Covers:** Crop seeds, fertilizers, pesticides, harvesting & allied activities (dairy/poultry)\n• **Apply:** Visit any Commercial Bank, RRB, or District Co-operative Bank with 7/12 extract & Aadhaar`,
      hi: `**किसान क्रेडिट कार्ड (KCC) लोन:**\n\n• **ऋण सीमा:** ₹3 लाख तक आसान ब्याज दर पर\n• **प्रभावी ब्याज:** केवल 4% प्रति वर्ष (समय पर भुगतान पर 3% छूट)\n• **बिना गारंटी लोन:** ₹1.60 लाख तक बिना जमीन बंधक रखे लोन\n• **आवेदन:** नजदीकी राष्ट्रीयकृत या सहकारी बैंक शाखा में संपर्क करें`,
      mr: `**किसान क्रेडिट कार्ड (KCC) पीक कर्ज:**\n\n• **कर्ज मर्यादा:** ₹३ लाखांपर्यंत अत्यंत कमी व्याजात\n• **प्रभावी व्याजदर:** केवळ ४% दरवर्षी (मुदतीत परतफेड केल्यास)\n• **विना तारण कर्ज:** ₹१.६० लाखांपर्यंत जमीन गहाण न ठेवता कर्ज\n• **अर्ज:** जवळच्या बँकेत ७/१२ उतारा व आधार कार्डसह अर्ज करा`,
    },

    // 8. Soil Health Card & Testing
    '(soil.*test|soil.*card|health card|lab test|मृदा.*कार्ड|माती.*तपासणी)': {
      en: `**Soil Health Card Scheme & Free Soil Testing:**\n\n• **Coverage:** Tests 12 parameters (N, P, K, S, Zn, Fe, Cu, Mn, Bo, pH, EC, Organic Carbon)\n• **Cost:** 100% Free soil testing every 2 years\n• **Benefits:** Prevents over-fertilization, saves 20–30% fertilizer cost\n• **How to test:** Collect V-shape soil samples (15-20cm depth) from 5 spots in field, submit to nearest KVK or Soil Testing Lab\n• **Download Card:** soilhealth.dac.gov.in`,
      hi: `**मृदा स्वास्थ्य कार्ड एवं निःशुल्क जांच:**\n\n• **जांच:** 12 प्रमुख पोषक तत्वों का लैब परीक्षण (NPK, pH, सूक्ष्म पोषक तत्व)\n• **लागत:** 100% मुफ्त परीक्षण हर 2 साल में\n• **लाभ:** संतुलित उर्वरक उपयोग, 20-30% खाद लागत की बचत\n• **कार्ड डाउनलोड:** soilhealth.dac.gov.in`,
      mr: `**मृदा आरोग्य पत्र मोफत माती तपासणी:**\n\n• **तपासणी:** १२ घटकांची प्रयोगशाळा तपासणी (NPK, pH, सेंद्रिय कार्बन)\n• **खर्च:** १००% मोफत माती तपासणी\n• **फायदा:** खतांचा संतुलित वापर व खर्चात बचत\n• **पत्रिका डाउनलोड:** soilhealth.dac.gov.in`,
    },

    // 9. Soil pH Correction
    '(ph|acidic|alkaline|chuna|lime|gypsum|जिप्सम|चूना|अम्लीय|क्षारीय)': {
      en: `**Soil pH Diagnosis & Correction:**\n\n• **Ideal Soil pH:** 6.5 to 7.5 for most field crops\n• **Acidic Soil (pH < 6.0):** Causes phosphorus lockup. Fix by applying Agricultural Lime (CaCO3) at 500kg–1 ton/acre before sowing.\n• **Alkaline Soil (pH > 8.0):** Causes micronutrient deficiency. Fix by applying Agricultural Gypsum at 400–500kg/acre or elemental sulfur with organic manure.\n• **Organic Soil Amendment:** Adding FYM / Vermicompost acts as a natural pH buffer.`,
      hi: `**मिट्टी pH सुधार का उपाय:**\n\n• **आदर्श pH:** 6.5 से 7.5\n• **अम्लीय मिट्टी (pH < 6.0):** बुआई से पहले 500किग्रा-1टन/एकड़ कृषि चूना (Lime) मिलाएं।\n• **क्षारीय मिट्टी (pH > 8.0):** 400-500किग्रा/एकड़ जिप्सम (Gypsum) और गोबर खाद डालें।`,
      mr: `**माती pH सुधारणा उपाय:**\n\n• **योग्य pH:** ६.५ ते ७.५\n• **आम्लीय माती (pH < ६.०):** पेरणीपूर्वी ५०० किलो-१ टन/एकर कृषी चुना टाका.\n• **क्षारीय माती (pH > ८.०):** ४००-५०० किलो/एकर जिप्सम आणि शेणखत वापरा.`,
    },

    // 10. Nitrogen & Urea Dosage
    '(nitrogen|urea|yellow.*leaf|yellownest|नत्र|यूरिया|पीली पत्ती|पिवळी पान)': {
      en: `**Nitrogen Deficiency & Urea Management:**\n\n• **Symptoms:** Bottom (older) leaves turning pale yellow starting from leaf tips, stunted growth\n• **Correction:** Apply Urea (46% N) at 25–30 kg/acre as top dressing (split in 2 doses)\n• **Foliar Spray:** 2% Nano Urea or 2% Sprayable Urea solution (200g in 10L water)\n• **Best Practice:** Apply top-dressing Urea during late afternoon in moist soil (never in dry or flooded field)`,
      hi: `**नाइट्रोजन की कमी - लक्षण व उपचार:**\n\n• **लक्षण:** पुरानी नीचे की पत्तियां पीली पड़ना, फसल की बढ़त रुकना\n• **उपचार:** 25-30 किग्रा यूरिया/एकड़ टॉप ड्रेसिंग (2 खुराक में)\n• **छिड़काव:** 2% नैनो यूरिया या 200 ग्राम यूरिया प्रति 10 लीटर पानी में मिलाकर स्प्रे करें`,
      mr: `**नत्राची कमतरता व युरिया व्यवस्थापन:**\n\n• **लक्षणे:** खालची जुनी पाने पिवळी पडणे, वाढ खुंटणे\n• **उपाय:** २५-३० किलो युरिया/एकर टॉप ड्रेसिंग करा\n• **फवारणी:** २% नॅनो युरिया किंवा २०० ग्रॅम युरिया १० लिटर पाण्यात मिसळून फवारा`,
    },

    // 11. Phosphorus & Potassium Deficiencies
    '(dap|mop|phosphorus|potassium|npk|पोटॅश|स्फुरद|पालाश)': {
      en: `**Phosphorus (P) & Potassium (K) Management:**\n\n• **Phosphorus Deficiency:** Purple/reddish tint on leaf undersides, delayed root development.\n  *Fix:* Apply DAP (18:46:0) at 25kg/acre as basal dose at sowing.\n• **Potassium Deficiency:** Scorched brown margins on leaf edges, weak stems, poor grain fill.\n  *Fix:* Apply MOP (Muriate of Potash 60% K) at 15–20 kg/acre.\n• **Foliar Boost:** Spray NPK 19:19:19 or NPK 0:52:34 at 75g per 15L pump during flowering.`,
      hi: `**फॉस्फोरस (P) एवं पोटाश (K) प्रबंधन:**\n\n• **फॉस्फोरस कमी:** पत्तियों के नीचे बैंगनी रंग, कमजोर जड़ें। उपाय: 25किग्रा DAP/एकड़ बुआई समय।\n• **पोटाश कमी:** पत्तियों के किनारे झुलसे भूरे। उपाय: 15-20किग्रा MOP/एकड़।\n• **स्प्रे:** फूल आने पर NPK 19:19:19 (75 ग्राम/पंप) छिड़कें।`,
      mr: `**स्फुरद (P) व पालाश (K) व्यवस्थापन:**\n\n• **स्फुरद कमतरता:** पानांच्या मागे जांभळट रंग. उपाय: २५ किलो DAP/एकर पेरणीवेळी.\n• **पालाश कमतरता:** पानांच्या कडा करपल्यासारख्या दिसणे. उपाय: १५-२० किलो MOP/एकर.\n• **फवारणी:** फुलोरा अवस्थेत NPK १९:१९:१९ फवारा.`,
    },

    // 12. Organic Carbon & Composting
    '(organic carbon|vermicompost|fym|manure|जैविक carbon|गोबर|शेणखत|गांडूळ)': {
      en: `**Soil Organic Carbon & Carbon Improvement:**\n\n• **Target:** Healthy soil should have > 0.75% Organic Carbon\n• **How to Improve:**\n  1. Apply Well-rotted Farm Yard Manure (FYM) at 4–5 tons/acre before land preparation.\n  2. Apply Vermicompost at 1–2 tons/acre.\n  3. Practice Green Manuring: Sow Dhaincha or Sunnhemp and plow into soil at 45 days.\n  4. Incorporate crop stubble instead of burning.`,
      hi: `**मिट्टी में जैविक कार्बन बढ़ाएं:**\n\n• **लक्ष्य:** > 0.75% जैविक कार्बन\n• **उपाय:** 4-5 टन/एकड़ अच्छी सड़ी गोबर खाद या 1-2 टन केंचुआ खाद (वर्मीकंपोस्ट) डालें। खेत में ढैंचा बोकर 45 दिन बाद जोत दें।`,
      mr: `**मातीत सेंद्रिय कार्बन वाढवा:**\n\n• **लक्ष्य:** > ०.७५% सेंद्रिय कार्बन\n• **उपाय:** ४-५ टन/एकर चांगले कुजलेले शेणखत किंवा १-२ टन गांडूळ खत वापरा. ढेंचा पेरून ४५ दिवसांनी जमिनीत गाडा.`,
    },

    // 13. Cotton Pink Bollworm & Pests
    '(cotton|bollworm|spinosad|कपास|कापूस|गुलाबी बोंड|कीड)': {
      en: `**Cotton Pink Bollworm & Pest Management:**\n\n• **Pheromone Traps:** Install 5 traps per acre at 45 days for pest monitoring\n• **ETL Trigger:** If 8 adult moths caught per trap for 3 consecutive days:\n  *Spray:* Spinosad 45% SC (0.45 ml/liter water) or Profenofos 50 EC (2 ml/liter water)\n• **Neem Oil Spray:** Spray 5% Neem Seed Kernel Extract (NSKE) at squaring stage\n• **Post-Harvest:** Destroy crop residue to end pest lifecycle`,
      hi: `**कपास में गुलाबी बोलवर्म नियंत्रण:**\n\n• फेरोमोन ट्रैप 5 प्रति एकड़ लगाएं।\n• प्रकोप होने पर स्पिनोसैड 45 SC (0.45 मिली/लीटर) या प्रोफेनोफॉस (2 मिली/लीटर) का छिड़काव करें।\n• शुरुआती चरण में 5% नीम तेल का छिड़काव करें।`,
      mr: `**कापसावरील गुलाबी बोंड अळी नियंत्रण:**\n\n• कामगंध सापळे ५ प्रति एकरी लावा.\n• प्रादुर्भाव झाल्यास स्पिनोसॅड ४५ SC (०.४५ मिली/लिटर) किंवा प्रोफेनोफॉस फवारा.\n• सुरुवातीला ५% कडुनिंब अर्काची फवारणी करा.`,
    },

    // 14. Soybean Girdle Beetle & Cultivation
    '(soybean|girdle beetle|stem fly|सोयाबीन|चक्री भुंगा)': {
      en: `**Soybean Crop & Pest Management:**\n\n• **Sowing Window:** Mid-June to 1st week of July with 30kg seeds/acre\n• **Fertilizer:** 20kg DAP + 15kg MOP as basal dose. Treat seeds with Rhizobium inoculant.\n• **Girdle Beetle Control:** Spray Chlorantraniliprole 18.5 SC (3 ml / 10L water) or Quinalphos 25 EC (2 ml/L water) at initial stem ring damage symptoms.\n• **Fungicide Spray:** Spray Tebucinazole 25.9 EC for leaf spot protection.`,
      hi: `**सोयाबीन फसल व चक्री भुंगा (Girdle Beetle) नियंत्रण:**\n\n• **उर्वरक:** 20किग्रा DAP + 15किग्रा MOP बुआई पर। राइज़ोबियम से बीज उपचारित करें।\n• **कीट नियंत्रण:** गर्डल बीटल दिखे तो क्लोरेंट्रानिलिप्रोल 18.5 SC (3 मिली/10 लीटर) का छिड़काव करें।`,
      mr: `**सोयाबीन पीक व चक्री भुंगा नियंत्रण:**\n\n• **खते:** २० किलो DAP + १५ किलो MOP पेरणीवेळी. रायझोबियम बीजप्रक्रिया करा.\n• **कीड नियंत्रण:** चक्री भुंग्याचा प्रादुर्भाव दिसल्यास क्लोरँट्रानिलिप्रोल (३ मिली/१० लिटर) फवारा.`,
    },

    // 15. Wheat Cultivation Guide
    '(wheat|yellow rust|gehu|गेहूं|गहू|तांबेरा)': {
      en: `**Wheat Cultivation & Disease Guide:**\n\n• **Sowing Period:** October 25 to November 25 (Seed rate: 40–45 kg/acre)\n• **Fertilizer Schedule:** Basal: 25kg DAP + 15kg MOP. 1st Top Dressing: 40kg Urea at 21 days (Crown Root Initiation stage). 2nd Top: 25kg Urea at 45 days.\n• **Yellow Rust Control:** If yellow stripes appear on leaves, spray Propiconazole 25% EC (1ml/liter water).\n• **Irrigation:** 5 to 6 critical irrigations.`,
      hi: `**गेहूं खेती व पीला रतुआ (Yellow Rust) उपचार:**\n\n• **बुआई:** 25 अक्टूबर से 25 नवंबर (40-45 किग्रा बीज/एकड़)\n• **खाद:** 25किग्रा DAP + 15किग्रा MOP बेसल। 21 दिन पर 40किग्रा यूरिया पहली सिंचाई पर।\n• **पीला रतुआ नियंत्रण:** प्रोपिकोनाज़ोल 25% EC (1 मिली/लीटर) छिड़कें।`,
      mr: `**गहू लागवड व पिवळा तांबेरा उपाय:**\n\n• **पेरणी:** २५ ऑक्टोबर ते २५ नोव्हेंबर (४०-४५ किलो बियाणे/एकर)\n• **खत:** २५ किलो DAP + १५ किलो MOP मूलभूत. २१ दिवसांनी ४० किलो युरिया.\n• **तांबेरा नियंत्रण:** प्रोपिकोनाझोल २५% EC (१ मिली/लिटर) फवारा.`,
    },

    // 16. Paddy Brown Plant Hopper & Cultivation
    '(paddy|rice|bph|brown plant hopper|धान|भात|तुडतुडे)': {
      en: `**Paddy (Rice) Management & Brown Plant Hopper (BPH):**\n\n• **Water Management:** Maintain saturation stage. Alternate wetting and drying (AWD) reduces BPH pest attack.\n• **Fertilizer:** 20kg DAP + 20kg MOP (basal) + 35kg Urea 15 days post transplanting.\n• **BPH Control:** Spray Imidacloprid 17.8 SL (0.5 ml/liter water) or Pymetrozine 50 WDG (0.6g/liter) directly towards crop base.\n• **Avoid:** Excessive Nitrogen application which attracts BPH.`,
      hi: `**धान (चावल) व भूरा पौधा फुदका (BPH) प्रबंधन:**\n\n• **सिंचाई:** खेत सुखाकर बारी-बारी से पानी दें ताकि BPH कीट न पनपे।\n• **BPH नियंत्रण:** इमिडाक्लोप्रिड 17.8 SL (0.5 मिली/लीटर) फसल के तने के निचले हिस्से पर छिड़कें।`,
      mr: `**भात पीक व तुडतुडे (BPH) नियंत्रण:**\n\n• **पाणी:** शेतात आलटून-पालटून पाणी सुकवून द्या.\n• **तुडतुडे नियंत्रण:** इमिडाक्लोप्रिड १७.८ SL (०.५ मिली/लिटर) पिकाच्या बुडाकडे फवारा.`,
    },

    // 17. Sugarcane Cultivation
    '(sugarcane|ganna|ऊस|गन्ना)': {
      en: `**Sugarcane Cultivation & Nutrient Guide:**\n\n• **Planting Season:** Adsali (July-August), Pre-seasonal (Oct-Nov), Suru (Jan-Feb)\n• **Fertilizer per Acre:** Basal: 50kg DAP + 30kg MOP + 10kg Zinc. 1st Top: 50kg Urea at 45 days. 2nd Top: 50kg Urea at earthing up (120 days).\n• **Trash Mulching:** Spread sugarcane trash between rows to retain soil moisture and prevent weeds.\n• **Drip Irrigation:** Drip system saves 45% water & boosts cane yield by 30 tons/acre.`,
      hi: `**गन्ना खेती व उर्वरक प्रबंधन:**\n\n• **खाद:** 50किग्रा DAP + 30किग्रा MOP बुआई पर। 45 दिन पर 50किग्रा यूरिया। मिट्टी चढ़ाते समय 50किग्रा यूरिया।\n• **ड्रिप सिंचाई:** ड्रिप से 45% पानी बचत व 30 टन/एकड़ पैदावार वृद्धि होती है।`,
      mr: `**ऊस लागवड व खत व्यवस्थापन:**\n\n• **खत:** ५० किलो DAP + ३० किलो MOP लागवडीवेळी. ४५ दिवसांनी ५० किलो युरिया. बांधणीवेळी ५० किलो युरिया.\n• **ठिबक सिंचन:** ठिबकमुळे ४५% पाण्याची बचत व उसाचे उत्पन्न वाढते.`,
    },

    // 18. Tomato & Vegetable Pests
    '(tomato|vegetable|fruit borer|leaf curl|टमाटर|टोमॅटो|सब्जी|भाजीपाला)': {
      en: `**Tomato & Vegetable Pest & Disease Management:**\n\n• **Leaf Curl Virus (Whitefly Vector):** Install Yellow Sticky Traps (10/acre). Spray Imidacloprid (0.3ml/L water) or Dimethoate to kill whiteflies.\n• **Fruit Borer Insect:** Spray Chlorantraniliprole 18.5 SC (0.4ml/L water) or Emamectin Benzoate 5% SG (0.5g/L water).\n• **Early/Late Blight Fungus:** Spray Mancozeb 75 WP (2g/L water) or Copper Oxychloride.`,
      hi: `**टमाटर व सब्जी कीट एवं रोग प्रबंधन:**\n\n• **लीफ कर्ल वायरस (सफेद मक्खी):** पीला चिपचिपा ट्रैप लगाएं। इमिडाक्लोप्रिड (0.3 मिली/लीटर) छिड़कें।\n• **फल छेदक कीट:** इमामेक्टिन बेंजोएट 5% SG (0.5 ग्राम/लीटर) छिड़कें।`,
      mr: `**टोमॅटो व भाजीपाला कीड-रोग उपाय:**\n\n• **पर्णगुच्छ रोग (पांढरी माशी):** पिवळे चिकट सापळे लावा. इमिडाक्लोप्रिड फवारा.\n• **फळ पोखरणारी अळी:** इमामेक्टिन बेंझोएट ५% SG (०.५ ग्रॅम/लिटर) फवारा.`,
    },

    // 19. Crop Rotation & Seasons
    '(crop rotation|kharif|rabi|zaid|खरीफ|रबी|फसल चक्र|पीक बदल)': {
      en: `**Crop Rotation & Seasonal Calendar:**\n\n• **Kharif (June–Oct):** Cotton, Soybean, Paddy, Maize, Tur (Pigeon pea)\n• **Rabi (Oct–March):** Wheat, Chickpea (Harbhara), Mustard, Onion\n• **Zaid (March–June):** Watermelon, Cucumber, Groundnut, Green Gram (Moong)\n• **Rotation Benefits:** Rotated legumes (Chickpea/Moong) fix atmospheric nitrogen into soil, reduce nematode build-up, and increase succeeding crop yield by 15–20%.`,
      hi: `**फसल चक्र एवं ऋतु कैलेंडर:**\n\n• **खरीफ (जून-अक्टूबर):** कपास, सोयाबीन, धान, मक्का\n• **रबी (अक्टूबर-मार्च):** गेहूं, चना, सरसों, प्याज\n• **जायद (मार्च-जून):** तरबूज, मूंग, मूंगफली\n• **फायदा:** दलहनी फसल चक्र से जमीन में नाइट्रोजन बढ़ता है।`,
      mr: `**पीक फेरपालट व हंगाम वेळापत्रक:**\n\n• **खरीप (जून-ऑक्टोबर):** कापूस, सोयाबीन, भात, मका\n• **रबी (ऑक्टोबर-मार्च):** गहू, हरभरा, कांदा, मोहरी\n• **उन्हाळी (मार्च-जून):** टरबूज, मूग, भुईमूग\n• **फायदा:** कडधान्य पिकांमुळे मातीत नत्र स्थिर होते.`,
    },

    // 20. Seed Treatment
    '(seed treatment|trichoderma|rhizobium|बीज उपचार|बियाणे प्रक्रिया)': {
      en: `**Scientific Seed Treatment (FIR Method):**\n\n• **F - Fungicide:** Treat seeds with Carboxin + Thiram or Trichoderma viride (5g/kg seed) against root rot & wilt.\n• **I - Insecticide:** Treat with Imidacloprid 70 WS (5g/kg seed) against sucking pests.\n• **R - Rhizobium / Azotobacter:** Inoculate pulse/legume seeds with Rhizobium culture (20g/kg seed) for nitrogen fixation.\n• **Order:** Always follow Fungicide → Insecticide → Rhizobium sequence!`,
      hi: `**वैज्ञानिक बीज उपचार (FIR तकनीक):**\n\n1. **फफूंदनाशक (F):** ट्राइकोडर्मा विरिडी (5 ग्राम/किग्रा) से फफूंद से सुरक्षा।\n2. **कीटनाशक (I):** इमिडाक्लोप्रिड (5 ग्राम/किग्रा) से रस चूसक कीटों से सुरक्षा।\n3. **राइज़ोबियम (R):** राइज़ोबियम कल्चर (20 ग्राम/किग्रा) दलहन फसलों के लिए।`,
      mr: `**शास्त्रीय बियाणे प्रक्रिया (FIR पद्धत):**\n\n१. **बुरशीनाशक (F):** ट्रायकोडर्मा (५ ग्रॅम/किग्रॅ) बुरशीपासून संरक्षणासाठी.\n२. **कीटकनाशक (I):** इमिडाक्लोप्रिड (५ ग्रॅम/किग्रॅ) कीडींपासून संरक्षणासाठी.\n३. **रायरझोबियम (R):** रायरझोबियम जिवाणू संवर्धन (२० ग्रॅम/किग्रॅ) नत्र स्थिरीकरणासाठी.`,
    },

    // 21. Post-Harvest Management & eNAM
    '(storage|enam|mandi|grain moisture|भंडारण|अनाज|बिक्री)': {
      en: `**Post-Harvest Storage & Market Direct Sale:**\n\n• **Moisture Level:** Dry grains to 12% moisture level before bagging to prevent mold/fungus.\n• **Hermetic Bags:** Use PICS (Purdue Improved Crop Storage) hermetic bags for chemical-free zero-pest storage up to 1 year.\n• **eNAM Portal:** Register on enam.gov.in to sell produce directly to buyers across India at best competitive MSP prices.`,
      hi: `**फसल कटाई बाद भंडारण एवं ई-नाम (eNAM) बिक्री:**\n\n• **नमी:** अनाज को 12% नमी तक सुखाकर ही भंडारण करें।\n• **ई-नाम (eNAM):** enam.gov.in पर पंजीकरण करके पूरे देश के खरीदारों को अपनी फसल सर्वोत्तम मूल्य पर बेचें।`,
      mr: `**पिक काढणीपश्चात साठवणूक व ई-नाम विक्री:**\n\n• **ओलावा:** धान्य १२% ओलाव्यापर्यंत वाळवून साठवणूक करा.\n• **eNAM पोर्टल:** enam.gov.in वर नोंदणी करून देशातील व्यापाऱ्यांना सर्वाधिक दराने माल विका.`,
    },

    // 22. Organic Farming (PKVY)
    '(organic farming|pkvy|vermicompost|जैविक खेती|सेंद्रिय शेती)': {
      en: `**Paramparagat Krishi Vikas Yojana (PKVY Organic Subsidy):**\n\n• **Financial Subsidy:** ₹50,000 per hectare over 3 years for organic farming clusters\n• **Direct Benefit:** ₹31,000 direct for organic fertilizers, vermicompost units & bio-inputs\n• **Organic Certification:** Free Participatory Guarantee System (PGS-India) certification\n• **Apply:** Form a cluster of 20+ farmers (50 acres) and contact District Agri Officer or jaivikkheti.in`,
      hi: `**परम्परागत कृषि विकास योजना (जैविक खेती सब्सिडी):**\n\n• **सब्सिडी:** ₹50,000 प्रति हेक्टेयर 3 साल में जैविक क्लस्टर के लिए।\n• **प्रमाणिकरण:** मुफ्त PGS-India जैविक प्रमाण पत्र।\n• **आवेदन:** jaivikkheti.in या जिला कृषि अधिकारी से संपर्क करें।`,
      mr: `**पारंपारिक कृषी विकास योजना (सेंद्रिय शेती अनुदान):**\n\n• **अनुदान:** ₹५०,००० प्रति हेक्टरी ३ वर्षात सेंद्रिय गटासाठी.\n• **प्रमाणपत्र:** मोफत PGS-India सेंद्रिय प्रमाणपत्र.\n• **अर्ज:** jaivikkheti.in किंवा तालुका कृषी अधिकारी.`,
    },

    // 23. Mulching & Water Efficiency
    '(mulching|water saving|drip mulch|मल्चिंग|पाणी बचत)': {
      en: `**Mulching & Advanced Water Conservation:**\n\n• **Plastic Mulching:** Lay 25-micron Silver-Black polythene mulch film over drip lines.\n• **Benefits:** Reduces soil evaporation by 65%, suppresses 90% weed growth, keeps soil root zone warm.\n• **Organic Mulching:** Spread straw, crop residues, or dry leaves (3-inch layer) around crop stem.`,
      hi: `**मल्चिंग एवं जल संरक्षण तकनीक:**\n\n• **सिल्वर-ब्लैक मल्चिंग:** ड्रिप लाइन पर 25-माइक्रोन प्लास्टिक मल्च बिछाएं।\n• **फायदे:** 65% पानी वाष्पीकरण रुकता है, 90% खरपतवार नियंत्रण होता है।`,
      mr: `**मल्चिंग व पाणी बचत तंत्रज्ञान:**\n\n• **प्लास्टिक मल्चिंग:** २५-मायक्रॉन सिल्व्हर-ब्लॅक मल्चिंग पेपर वापरा.\n• **फायदे:** ६५% पाण्याची वाफ होणे थांबते व तण नियंत्रण होते.`,
    },

    // 24. Climate-Smart & Drought Management
    '(drought|climate|rainless|सूखा|दुष्काळ|पाऊस)': {
      en: `**Drought Resilience & Climate-Smart Farming:**\n\n• **Ridge & Furrow Planting:** Sowing crops on ridges conserves rainwater in furrows during dry spells.\n• **Protective Foliar Spray:** Spray 1% Potassium Nitrate (KNO3) or 2% DAP during dry spells to mitigate drought stress.\n• **Drought Resistant Varieties:** Sow BDN 711 Soybean, Phule Yashoda Jowar, Bhawani Cotton.`,
      hi: `**सूखा प्रबंधन व जलवायु अनुकूल खेती:**\n\n• **कूंड़ व मेढ़ विधि (Ridge & Furrow):** बारिश के पानी का अधिकतम संचयन।\n• **सूखा रोधी स्प्रे:** बेमौसम सूखे में 1% पोटेशियम नाइट्रेट (KNO3) का छिड़काव करें।`,
      mr: `**दुष्काळ व्यवस्थापन व हवामानानुकूल शेती:**\n\n• **सरी-वरंबा पद्धत:** पावसाचे पाणी शेतात जिरवण्यासाठी प्रभावी.\n• **संरक्षक फवारणी:** ताण सहन करण्यासाठी १% पोटॅशियम नायट्रेट फवारा.`,
    },

    // 25. KrishiMitra Soil Tool Usage
    '(soil tool|npk tool|calculator|मिट्टी टूल|माती साधन)': {
      en: `**KrishiMitra Portable Soil Testing Tool Guide:**\n\n• **How to use:** Navigate to the Soil Analysis page on our website.\n• **Inputs:** Enter Nitrogen, Phosphorus, Potassium (in kg/ha), pH, and Organic Carbon values (or connect Bluetooth NPK sensor).\n• **Output:** Instant AI calculation of exact fertilizer bag dosage (Urea, DAP, MOP) required for your target yield!`,
      hi: `**कृषिसेवा मिट्टी जांच टूल उपयोग निर्देश:**\n\n• **उपयोग विधि:** वेबसाइट के Soil Analysis पेज पर जाएं।\n• **विवरण भरें:** N, P, K मान, pH एवं कार्बन प्रविष्ट करें या ब्लूटूथ NPK सेंसर कनेक्ट करें।\n• **परिणाम:** AI तुरंत आपके लिए सटीक खाद की बोरी (यूरिया, DAP, पोटाश) की गणना करेगा!`,
      mr: `**कृषिसेवा माती तपासणी टूल मार्गदर्शन:**\n\n• **वापर:** वेबसाईटवरील Soil Analysis पेजवर जा.\n• **माहिती भरा:** N, P, K प्रमाण, pH प्रविष्ट करा किंवा ब्लूटूथ NPK सेन्सर कनेक्ट करा.\n• **निकाल:** AI लगेच तुम्हाला लागणाऱ्या खतांच्या गोण्यांची (युरिया, DAP) अचूक माहिती देईल!`,
    },

    // 26. Namo Shetkari Scheme (Maharashtra)
    '(namo shetkari|namo|mahasanman|नमो शेतकरी)': {
      en: `**Namo Shetkari MahaSanman Nidhi Yojana (Maharashtra):**\n\n• **State Benefit:** Additional ₹6,000 per year given by Govt of Maharashtra to state farmers.\n• **Total Income:** Combined with PM-KISAN (₹6,000), Maharashtra farmers receive ₹12,000 total per year!\n• **Auto-Enrollment:** All active Maharashtra PM-KISAN beneficiaries with complete e-KYC are automatically enrolled.`,
      hi: `**नमो शेतकरी महासन्मान निधि (महाराष्ट्र):**\n\n• **लाभ:** महाराष्ट्र सरकार द्वारा ₹6,000 अतिरिक्त वार्षिक सहायता।\n• **कुल सहायता:** पीएम-किसान मिलाकर कुल ₹12,000 प्रति वर्ष!\n• **पात्रता:** सभी पीएम-किसान लाभार्थी स्वतः शामिल हैं।`,
      mr: `**नमो शेतकरी महासन्मान निधी योजना (महाराष्ट्र राज्य):**\n\n• **शासकीय मदत:** महाराष्ट्र शासनाकडून दरवर्षी अतिरिक्त ₹६,००० अनुदान.\n• **एकूण मदत:** PM-KISAN चे ₹६,००० मिळून वर्षाला एकूण ₹१२,००० मिळतात!\n• **पात्रता:** PM-KISAN चे सर्व पात्र शेतकरी आपोआप समाविष्ट होतात.`,
    },

    // 27. Magel Tyala Shettale Farm Pond
    '(shettale|farm pond|pond|तालाब|शेततळे)': {
      en: `**Magel Tyala Shettale (Farm Pond Subsidy Scheme):**\n\n• **Financial Assistance:** Direct grant up to ₹50,000 into bank account for farm pond excavation\n• **Purpose:** Storing rainwater for protective irrigation during dry months\n• **Eligibility:** Farmers having minimum 0.60 hectare land in Maharashtra\n• **Apply:** Submit online application on MahaDBT Farmer Portal (mahadbt.maharashtra.gov.in)`,
      hi: `**मागेल उसको खेत तालाब (शेततळे) योजना:**\n\n• **सहायता:** खेत में तालाब खोदने के लिए ₹50,000 की सीधी वित्तीय सब्सिडी।\n• **उद्देश्य:** वर्षा जल संचयन व सूखे के समय सिंचाई।\n• **आवेदन:** MahaDBT किसान पोर्टल पर ऑनलाइन आवेदन करें।`,
      mr: `**मागेल त्याला शेततळे योजना:**\n\n• **अनुदान:** शेततळे खोदकामासाठी रु. ५०,००० पर्यंत थेट बँक खात्यात अनुदान.\n• **उद्देश:** पावसाचे पाणी साठवून दुष्काळी काळात पिकांना संरक्षित पाणी देणे.\n• **अर्ज:** महाडीबीटी (mahadbt.maharashtra.gov.in) वर अर्ज करा.`,
    },

    // 28. Agricultural Machinery Subsidy (SMAM)
    '(machinery|tractor|rotavator|smam|ट्रैक्टर|अवजार|यंत्र|ट्रॅक्टर)': {
      en: `**SMAM Agricultural Machinery Subsidy Scheme:**\n\n• **Subsidies:** 40% to 50% capital subsidy on Tractors, Rotavators, Power Tillers, Seed Drills, Harvesters\n• **Custom Hiring Centre:** Up to 80% subsidy for setting up village Custom Hiring Centres (CHC)\n• **Apply:** Register on agrimachinery.nic.in or State MahaDBT portal with 7/12 & dealer quotation`,
      hi: `**कृषि यांत्रिकीकरण (SMAM) ट्रैक्टर व उपकरण सब्सिडी:**\n\n• **सब्सिडी:** ट्रैक्टर, रोटावेटर, पावर टिलर खरीद पर 40% से 50% सरकारी सब्सिडी।\n• **कस्टम हायरिंग:** सीएचसी केंद्र खोलने पर 80% तक सब्सिडी।\n• **आवेदन:** agrimachinery.nic.in या महाडीबीटी पर।`,
      mr: `**कृषी यांत्रिकीकरण (SMAM) ट्रॅक्टर व अवजारे अनुदान:**\n\n• **अनुदान:** ट्रॅक्टर, रोटाव्हेटर, पॉवर टिलर खरेदीवर ४०% ते ५०% शासकीय अनुदान.\n• **कस्टम हायरिंग:** शेतकरी गटांना ८०% अनुदान.\n• **अर्ज:** agrimachinery.nic.in किंवा महाडीबीटीवर नोंदणी करा.`,
    },

    // 29. Minimum Support Price (MSP) & NAFED Procurement
    '(msp|nafed|bhavantar|support price|एमएसपी|न्यूनतम मूल्य|खरेदी केंद्र)': {
      en: `**Minimum Support Price (MSP) & NAFED Purchase:**\n\n• **Guarantee:** Govt purchases pulses, oilseeds, cotton & grains at guaranteed MSP rates.\n• **Payment:** Direct Bank Transfer (DBT) within 7 days of crop delivery at APMC/NAFED center.\n• **Registration:** Register crop sowing (Pik Pera) on State Procurement Portal / NAFED e-Samridhi before harvest.`,
      hi: `**न्यूनतम समर्थन मूल्य (MSP) एवं सरकारी खरीद:**\n\n• **गारंटी:** दलहन, तिलहन व कपास की एमएसपी दर पर शत-प्रतिशत सरकारी खरीद।\n• **भुगतान:** सरकारी केंद्र पर जमा करने के 7 दिनों में सीधा बैंक भुगतान।\n• **पंजीकरण:** फसल बुआई का विवरण NAFED ई-समृद्धि पर दर्ज करें।`,
      mr: `**किमान आधारभूत किंमत (MSP) व नाफेड खरेदी:**\n\n• **हमी भाव:** कडधान्ये, गळित धान्य व कापसाची शासकीय दराने खरेदी.\n• **रक्कम:** खरेदी केंद्रात माल दिल्यानंतर ७ दिवसात थेट बँक खात्यात जमा.\n• **नोंदणी:** नाफेड ई-समृद्धी पोर्टलवर नोंदणी करा.`,
    },

    // 30. Animal Husbandry & Dairy Farming
    '(dairy|cow|buffalo|livestock|animal|पशुपालन|गाय|भैंस|दूध|दुग्ध)': {
      en: `**Animal Husbandry & Dairy Farming KCC Extension:**\n\n• **KCC Loan for Dairy:** Farmers can get up to ₹2 Lakh KCC working capital loan for cows & buffaloes at 4% interest rate.\n• **Subsidies:** Up to 50% subsidy for establishing small dairy units (2 to 10 cows) under National Livestock Mission (NLM).\n• **Veterinary Helpline:** Contact 1924 for livestock health & artificial insemination support.`,
      hi: `**पशुपालन एवं डेयरी लोन (KCC):**\n\n• **डेयरी KCC:** गाय व भैंस पालन हेतु 4% रियायती ब्याज दर पर ₹2 लाख तक का KCC वर्किंग कैपिटल लोन।\n• **राष्ट्रीय पशुधन मिशन:** डेयरी इकाई स्थापित करने पर 50% तक की सब्सिडी।`,
      mr: `**पशुसंवर्धन व दुग्ध व्यवसाय KCC कर्ज:**\n\n• **डेयरी KCC:** गाय-म्हैस पालनासाठी ४% व्याजाने ₹२ लाखांपर्यंत KCC कर्ज उपलब्ध.\n• **अनुदान:** राष्ट्रीय पशुधन अभियानांतर्गत ५०% पर्यंत अनुदान.\n• **हेल्पलाइन:** पशु आरोग्यासाठी १९२४ वर संपर्क साधा.`,
    },
  };

  // Match response against patterns
  for (const [pattern, langResponses] of Object.entries(responses)) {
    const regex = new RegExp(pattern, 'i');
    if (regex.test(q)) {
      return langResponses[lang] || langResponses['en'];
    }
  }

  // Generic Agri fallback response when specific pattern not matched
  const genericAgri = {
    en: `**KrishiSeva AI Assistant 🌾**\n\nThank you for your question! Here is how I can best assist you:\n\n• 🌾 **Crop Guidance:** Best fertilizer, spray, and irrigation schedules for Cotton, Wheat, Soybean, Paddy, Sugarcane, and Vegetables.\n• 🧪 **Soil Health:** NPK ratio calculation, soil pH correction (Lime/Gypsum), organic carbon advice.\n• 🏛️ **Government Schemes:** Step-by-step application guidance for PM-KISAN (₹6,000), PMFBY Crop Insurance, PM-KUSUM Solar Pump, PMKSY Drip Subsidy, and KCC Loans.\n• 📞 **Contact Support:** Email krushimitra.work@gmail.com or Call/WhatsApp +91 7875648995.\n\nPlease clarify your question or specify your crop/scheme!`,
    hi: `**कृषिसेवा AI सहायक 🌾**\n\nआपके प्रश्न के लिए धन्यवाद! मैं आपकी इस प्रकार सहायता कर सकता हूँ:\n\n• 🌾 **फसल मार्गदर्शन:** कपास, गेहूं, सोयाबीन, धान, गन्ना व सब्जियों के लिए उर्वरक, स्प्रे और सिंचाई शेड्यूल।\n• 🧪 **मिट्टी स्वास्थ्य:** NPK मात्रा, pH सुधार (चूना/जिप्सम) और जैविक कार्बन।\n• 🏛️ **सरकारी योजनाएं:** PM-KISAN (₹6,000), फसल बीमा (PMFBY), सोलर पंप (PM-KUSUM), ड्रिप सब्सिडी (PMKSY) और KCC लोन।\n• 📞 **संपर्क:** krushimitra.work@gmail.com या फोन +91 7875648995।\n\nकृपया अपनी फसल या योजना का नाम बताएं!`,
    mr: `**कृषिसेवा AI सहाय्यक 🌾**\n\nआपल्या प्रश्नाबद्दल धन्यवाद! मी तुम्हाला खालीलप्रमाणे मदत करू शकतो:\n\n• 🌾 **पीक मार्गदर्शन:** कापूस, गहू, सोयाबीन, भात, ऊस व भाजीपाल्यासाठी खत व फवारणी नियोजन.\n• 🧪 **माती आरोग्य:** NPK प्रमाण, pH सुधारणा (चुना/जिप्सम) व सेंद्रिय खते.\n• 🏛️ **शासकीय योजना:** PM-KISAN (₹६,०००), पीक विमा, सौर पंप (PM-KUSUM), ठिबक अनुदान व KCC कर्ज.\n• 📞 **संपर्क:** krushimitra.work@gmail.com किंवा फोन +91 7875648995.\n\nकृपया आपल्या पिकाचे किंवा योजनेचे नाव स्पष्ट सांगा!`,
  };

  return genericAgri[lang] || genericAgri['en'];
}

