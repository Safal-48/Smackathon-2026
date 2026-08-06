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
You are "KrishiSeva AI" (कृषिसेवा AI), an expert agricultural advisor fluent in Indian farming practices and government welfare schemes.
Respond ALWAYS in ${targetLang}. Use clear bullet points and simple language suitable for farmers.

Knowledge Base:
${AGRI_KNOWLEDGE_BASE}

${imageBase64 ? IMAGE_ANALYSIS_KB : ''}
`;

      let parts = [
        {
          text: systemContext + `\n\nFarmer's Question: "${userPrompt}"\n\nProvide a helpful, accurate, and empathetic response with specific actionable advice.`,
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
            text: systemContext + `\n\nFarmer uploaded a crop/soil image with this query: "${userPrompt}"\n\nAnalyze the image carefully and provide diagnosis and recommendations in ${targetLang}.`,
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

// ─── Comprehensive Offline Fallback ─────────────────────────────────────────
function buildFallbackResponse(query, lang) {
  const q = query.toLowerCase();

  const responses = {
    // Financial Schemes
    'pm.?kisan|6000|income.?support|hap.ta|किसान|शेतकरी': {
      en: `**PM-KISAN Scheme (₹6,000/year):**\n\n• **Who gets it:** All landholder farmer families\n• **Amount:** ₹2,000 every 4 months (3 installments)\n• **Documents:** Aadhaar, Land Record (7/12), Bank Passbook\n• **Apply:** Visit your nearest CSC center or pmkisan.gov.in\n• **Status Check:** pmkisan.gov.in → "Beneficiary Status" using Aadhaar/Mobile`,
      hi: `**पीएम-किसान योजना (₹6,000/वर्ष):**\n\n• **पात्रता:** सभी भूमिधारक किसान\n• **लाभ:** ₹2,000 हर 4 महीने, 3 किश्तों में सीधे बैंक खाते में\n• **दस्तावेज:** आधार कार्ड, 7/12 भूमि रिकॉर्ड, बैंक पासबुक\n• **आवेदन:** pmkisan.gov.in या नजदीकी CSC केंद्र`,
      mr: `**पीएम-किसान योजना (₹६,०००/वर्ष):**\n\n• **पात्रता:** सर्व भूमिधारक शेतकरी कुटुंबे\n• **लाभ:** ₹२,००० प्रत्येक ४ महिन्यांनी थेट बँक खात्यात\n• **कागदपत्रे:** आधार कार्ड, ७/१२ उतारा, बँक पासबुक\n• **अर्ज:** pmkisan.gov.in किंवा जवळच्या CSC केंद्रावर`,
    },
    'insurance|bima|crop.?loss|fasal|विमा|नुकसान|पीक': {
      en: `**PM Fasal Bima Yojana (Crop Insurance):**\n\n• **Coverage:** Drought, flood, unseasonal rain, hail, pest attack\n• **Premium:** Only 2% for Kharif / 1.5% for Rabi crops\n• **Claim:** Report damage within 72 hours → Call 1800-180-1551\n• **Documents:** Aadhaar, Sowing Certificate, Land Record, Bank Account\n• **App:** Download "Fasal Bima" or "Crop Insurance" official app`,
      hi: `**प्रधानमंत्री फसल बीमा योजना:**\n\n• **कवरेज:** सूखा, बाढ़, ओलावृष्टि, कीट हमले से पूरी सुरक्षा\n• **प्रीमियम:** खरीफ: मात्र 2% | रबी: 1.5%\n• **क्लेम:** नुकसान के 72 घंटे में 1800-180-1551 पर रिपोर्ट करें`,
      mr: `**पीएम पीक विमा योजना:**\n\n• **संरक्षण:** दुष्काळ, पूर, गारपीट, कीड यामुळे नुकसानीस पूर्ण संरक्षण\n• **प्रीमियम:** खरीप: केवळ २% | रबी: १.५%\n• **दावा:** नुकसानीनंतर ७२ तासात 1800-180-1551 वर नोंदवा`,
    },
    'drip|sprinkler|irrigation|sinchayee|सिंचाई|ठिबक|पाणी': {
      en: `**PM Krishi Sinchayee Yojana (Drip & Sprinkler Subsidy):**\n\n• **Subsidy:** 45% for General / 55% for Small & Marginal farmers\n• **Benefits:** Saves 40–50% water, 25–35% yield increase\n• **Eligible Crops:** Cotton, Sugarcane, Vegetables, Horticulture\n• **Apply:** District Agriculture Office or mahadbt.maharashtra.gov.in\n• **Pro Tip:** Install black polythene mulch with drip for maximum water saving`,
      hi: `**PM कृषि सिंचाई योजना (ड्रिप सब्सिडी):**\n\n• **सब्सिडी:** सामान्य किसान: 45% | लघु/सीमांत: 55%\n• **फायदा:** 40-50% पानी बचत, 25-35% अधिक उपज\n• **आवेदन:** जिला कृषि कार्यालय या pmksy.gov.in`,
      mr: `**पीएम कृषी सिंचन योजना (ठिबक अनुदान):**\n\n• **अनुदान:** सामान्य शेतकरी: ४५% | लहान/अल्पभूधारक: ५५%\n• **फायदा:** ४०-५०% पाण्याची बचत, उत्पन्नात २५-३५% वाढ\n• **अर्ज:** जिल्हा कृषी कार्यालय किंवा mahadbt.maharashtra.gov.in`,
    },
    'solar|kusum|pump|सोलर|पंप': {
      en: `**PM-KUSUM Solar Pump Scheme:**\n\n• **Subsidy:** 60% total (30% Central + 30% State Government)\n• **HP Options:** 3HP, 5HP, 7.5HP standalone solar pumps\n• **Benefit:** Zero electricity bill + daytime reliable irrigation\n• **Documents:** Aadhaar, Land Record, DISCOM No-Dues Certificate\n• **Apply:** pmkusum.mnre.gov.in or State Agriculture Dept`,
      hi: `**PM-KUSUM सोलर पंप योजना:**\n\n• **सब्सिडी:** कुल 60% (30% केंद्र + 30% राज्य)\n• **लाभ:** शून्य बिजली बिल + दिन में निरंतर सिंचाई\n• **आवेदन:** pmkusum.mnre.gov.in`,
      mr: `**पीएम-कुसुम सौर पंप योजना:**\n\n• **अनुदान:** एकूण ६०% (३०% केंद्र + ३०% राज्य)\n• **फायदा:** शून्य वीज बिल + दिवसभर सिंचन\n• **अर्ज:** pmkusum.mnre.gov.in किंवा राज्य कृषी विभाग`,
    },
    'nitrogen|urea|yellow.?leaf|nit|नत्र|पिवळी': {
      en: `**Nitrogen Deficiency Diagnosis & Treatment:**\n\n• **Symptoms:** Yellowing of older (bottom) leaves, stunted growth, pale green color\n• **Fix:** Apply Urea (46% N) at 25–30 kg/acre as top dressing\n• **Foliar Spray:** 2% Urea solution (200g/10 liters water) on leaves\n• **Organic Option:** Apply FYM (Farm Yard Manure) 3–5 tons/acre\n• **Timing:** Apply urea in evening or after rain for best absorption`,
      hi: `**नाइट्रोजन की कमी - उपचार:**\n\n• **लक्षण:** पुरानी (नीचे की) पत्तियां पीली, बढ़त रुकी हुई\n• **उपाय:** 25–30 किग्रा यूरिया/एकड़ टॉप ड्रेसिंग\n• **फोलियर:** 2% यूरिया घोल पत्तियों पर छिड़कें`,
      mr: `**नत्राची कमतरता - उपचार:**\n\n• **लक्षण:** जुन्या (खालच्या) पानांचे पिवळे पडणे\n• **उपाय:** युरिया २५-३० किलो/एकर टॉप ड्रेसिंग\n• **फोलियर:** २% युरिया द्रावण पानांवर फवारा`,
    },
    'pest|insect|bug|bollworm|spray|कीड|फवारणी': {
      en: `**Pest Control - Integrated Pest Management (IPM):**\n\n**Cotton Pink Bollworm:**\n• Install pheromone traps (5/acre) for early detection\n• Spray Spinosad 45 SC (0.45ml/liter water) — max 3 sprays\n• Destroy crop stubble after harvest to break pest cycle\n\n**Soybean Girdle Beetle:**\n• Quinalphos 25 EC (800ml/acre) or Chlorpyrifos 20 EC\n• Early morning scouting for adult beetle damage\n\n**General IPM:**\n• Neem Oil 5% spray for soft-bodied pests\n• Yellow sticky traps for whitefly, thrips monitoring\n• Preserve ladybugs & spiders as natural predators`,
      hi: `**कीट नियंत्रण - IPM:**\n\n• पीला चिपचिपा जाल (Yellow Sticky Trap) लगाएं\n• नीम तेल 5% का छिड़काव शुरुआती अवस्था में करें\n• रासायनिक कीटनाशक केवल आर्थिक देहली (ETL) पार होने पर उपयोग करें`,
      mr: `**कीड नियंत्रण - IPM:**\n\n• पिवळे चिकट सापळे वापरा (पांढरी माशी, तुडतुडे)\n• कडुलिंब तेल ५% फवारणी प्रथम अवस्थेत करा\n• रासायनिक कीडनाशक ETL ओलांडल्यावरच वापरा`,
    },
    'soil|ph|organic|carbon|health|card|मृदा|माती': {
      en: `**Soil Health Management:**\n\n**pH Correction:**\n• Acidic Soil (pH < 6.5): Apply Agricultural Lime at 500kg–1ton/acre\n• Alkaline Soil (pH > 7.5): Apply Gypsum 400–500kg/acre\n\n**Organic Carbon Improvement:**\n• Apply FYM at 4–5 tons/acre before sowing\n• Practice Green Manuring: Sow Dhaincha / Sunnhemp, plow at 45 days\n• Use crop residue as mulch instead of burning\n\n**Free Soil Testing:**\n• Apply for Soil Health Card at nearest Agriculture/KVK office\n• Test once every 2 years for nutrient monitoring`,
      hi: `**मिट्टी स्वास्थ्य प्रबंधन:**\n\n• pH सुधार: अम्लीय मिट्टी में चूना (500kg/एकड़), क्षारीय में जिप्सम (500kg)\n• जैव कार्बन: 4–5 टन/एकड़ गोबर खाद डालें\n• हरित खाद: ढैंचा या सनई बोकर 45 दिन में पलट दें`,
      mr: `**मृदा आरोग्य व्यवस्थापन:**\n\n• pH सुधारणा: आम्लीय मातीत चुना (५०० किग्रा/एकर), क्षारीय मातीत जिप्सम\n• सेंद्रिय कार्बन: शेणखत ४–५ टन/एकर टाका\n• हिरवळीचे खत: ढेंचा/सनई ४५ दिवसांनी गाडा`,
    },
    'wheat|gehu|गेहूं|गहू': {
      en: `**Wheat Cultivation Guide:**\n\n**Sowing:** Mid-October to mid-November (Timely sown = HD 2967, WH 1105)\n**Seed Rate:** 40–45 kg/acre\n**Fertilizer:** 25kg DAP + 15kg MOP at sowing. 40kg Urea at 21 days. 25kg Urea at 45 days.\n**Irrigation:** 6–7 irrigations. Critical: Crown root initiation (21 days), Tillering, Heading.\n**Harvest:** Golden yellow, avoid rain during harvest (aflatoxin risk)`,
      hi: `**गेहूं खेती मार्गदर्शन:**\n\n• बुवाई: अक्टूबर मध्य से नवंबर मध्य\n• बीज दर: 40–45 किग्रा/एकड़\n• खाद: 25किग्रा DAP + 15किग्रा MOP (बेसल) + यूरिया टॉप ड्रेसिंग\n• सिंचाई: 21 दिन पर पहली (जड़ स्थापना महत्वपूर्ण)`,
      mr: `**गहू लागवड मार्गदर्शन:**\n\n• पेरणी: ऑक्टोबर मध्य ते नोव्हेंबर मध्य\n• बियाणे: ४०–४५ किलो/एकर\n• खत: २५ किलो DAP + १५ किलो MOP (मूलभूत) + युरिया\n• पाणी: ७–८ पाण्याच्या पाळ्या (मुळ्या स्थापनेवेळी महत्त्वाचे)`,
    },
    'cotton|kapas|कपास|कापूस': {
      en: `**Cotton Crop Management:**\n\n**Varieties:** Bt Cotton hybrids (NHH 44, MECH 162 Bt)\n**Sowing:** Mid-June (150 days crop)\n**Spacing:** 90cm × 45cm (Row × Plant)\n**Fertilizer:** 20kg DAP + 10kg MOP (basal) + 30kg Urea at 30 days\n**Key Pests:** Pink Bollworm, Whitefly, Thrips, Mealybug\n**Harvest:** 3–4 pickings at 7–10 day intervals when bolls open`,
      hi: `**कपास प्रबंधन:**\n\n• बुवाई: जून मध्य (150 दिन की फसल)\n• दूरी: 90×45 सेमी\n• खाद: 20किग्रा DAP + 10किग्रा MOP (बेसल) + 30किग्रा यूरिया\n• मुख्य कीट: गुलाबी बोलवर्म, सफेद मक्खी`,
      mr: `**कापूस पीक व्यवस्थापन:**\n\n• पेरणी: जून मध्य (१५० दिवसांचे पीक)\n• अंतर: ९०×४५ सेमी\n• खते: २० किलो DAP + १० किलो MOP (मूलभूत) + ३० किलो युरिया\n• मुख्य कीड: गुलाबी बोंड अळी, तेलकट किडा`,
    },
  };

  // Match response against patterns
  for (const [pattern, langResponses] of Object.entries(responses)) {
    const regex = new RegExp(pattern, 'i');
    if (regex.test(q)) {
      return langResponses[lang] || langResponses['en'];
    }
  }

  // Generic fallback
  const generic = {
    en: `**KrishiSeva AI Assistant is here to help! 🌾**\n\nYou can ask me about:\n• 🏛️ **Government Schemes**: PM-KISAN, PMFBY, PMKSY, PM-KUSUM, KCC\n• 🌱 **Soil Health**: NPK levels, pH correction, organic matter improvement\n• 🌾 **Crop Management**: Cotton, Wheat, Soybean, Paddy cultivation tips\n• 💧 **Irrigation**: Drip systems, water scheduling, sprinkler subsidy\n• 🐛 **Pest Control**: IPM strategies, spray calendar, disease identification\n• 🔬 **Fertilizer Advice**: Dosage guide for any crop\n\nType your farming question and I'll provide expert guidance! You can also upload a crop image for visual diagnosis.`,
    hi: `**कृषिसेवा AI - आपका कृषि सहायक! 🌾**\n\nआप मुझसे पूछ सकते हैं:\n• 🏛️ सरकारी योजनाएं: PM-KISAN, PMFBY, सोलर पंप, ड्रिप सब्सिडी\n• 🌱 मिट्टी स्वास्थ्य: NPK, pH सुधार, जैव कार्बन\n• 🌾 फसल प्रबंधन: कपास, गेहूं, सोयाबीन, धान\n• 🐛 कीट नियंत्रण: IPM, कीटनाशक, रोग पहचान\n\nअपना कृषि प्रश्न टाइप करें!`,
    mr: `**कृषिसेवा AI - आपला शेती सहाय्यक! 🌾**\n\nआपण मला विचारू शकता:\n• 🏛️ शासकीय योजना: PM-KISAN, PMFBY, सौर पंप, ठिबक अनुदान\n• 🌱 मृदा आरोग्य: NPK, pH सुधारणा, सेंद्रिय कार्बन\n• 🌾 पीक व्यवस्थापन: कापूस, गहू, सोयाबीन, भात\n• 🐛 कीड नियंत्रण: IPM, फवारणी वेळापत्रक\n\nआपला शेती प्रश्न टाइप करा!`,
  };

  return generic[lang] || generic['en'];
}
