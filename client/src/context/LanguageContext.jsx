import React, { createContext, useContext, useState } from 'react';

const translations = {
  en: {
    appTitle: 'KrishiSeva AI',
    tagline: 'Smart Soil Diagnostic & Multilingual Government Scheme Guidance',
    navHome: 'Dashboard',
    navSoil: 'Soil Quality Diagnostic',
    navSchemes: 'Government Schemes',
    navChat: 'AI Scheme Assistant',
    navAdmin: 'Admin Console',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    welcomeFarmer: 'Welcome, Farmer',
    soilHeader: 'Portable Soil Quality Analysis',
    soilDesc: 'Enter NPK, pH, and Moisture levels or pair your portable Bluetooth sensor to receive AI crop recommendations.',
    analyzeBtn: 'Analyze Soil & Get Crop Advice',
    schemesHeader: 'Government Welfare Schemes',
    schemesDesc: 'Explore subsidies, insurance, and financial grants curated for your farm.',
    aiChatHeader: 'Multilingual Scheme AI Advisor',
    aiChatDesc: 'Ask questions in Hindi, Marathi, Telugu, Tamil, or English via voice or text.',
  },
  hi: {
    appTitle: 'कृषिसेवा AI',
    tagline: 'स्मार्ट मिट्टी गुणवत्ता जांच एवं बहुभाषी सरकारी योजना मार्गदर्शन',
    navHome: 'डैशबोर्ड',
    navSoil: 'मिट्टी स्वास्थ्य जांच',
    navSchemes: 'सरकारी योजनाएं',
    navChat: 'AI योजना सहायक',
    navAdmin: 'एडमिन पैनल',
    login: 'लॉग इन',
    register: 'पंजीकरण',
    logout: 'लॉग आउट',
    welcomeFarmer: 'नमस्ते, किसान मित्र',
    soilHeader: 'पोर्टेबल मिट्टी गुणवत्ता विश्लेषण',
    soilDesc: 'NPK, pH और नमी मान दर्ज करें या फसल सिफारिशों के लिए ब्लूटूथ सेंसर कनेक्ट करें।',
    analyzeBtn: 'मिट्टी की जांच करें और सलाह पाएं',
    schemesHeader: 'सरकारी कल्याणकारी योजनाएं',
    schemesDesc: 'अपनी खेती के लिए सब्सिडी, फसल बीमा और वित्तीय अनुदान की जानकारी प्राप्त करें।',
    aiChatHeader: 'बहुभाषी AI योजना सहायक',
    aiChatDesc: 'आवाज या पाठ द्वारा हिंदी, मराठी, तेलुगु, तमिल या अंग्रेजी में सवाल पूछें।',
  },
  mr: {
    appTitle: 'कृषिसेवा AI',
    tagline: 'स्मार्ट माती गुणवत्ता तपासणी व बहुभाषिक शासकीय योजना मार्गदर्शन',
    navHome: 'डॅशबोर्ड',
    navSoil: 'माती आरोग्य तपासणी',
    navSchemes: 'शासकीय योजना',
    navChat: 'AI योजना सल्लागार',
    navAdmin: 'अ‍ॅडमिन पॅनेल',
    login: 'लॉग इन',
    register: 'नोंदणी करा',
    logout: 'लॉग आउट',
    welcomeFarmer: 'नमस्कार, शेतकरी मित्र',
    soilHeader: 'पोर्टेबल माती गुणवत्ता विश्लेषण',
    soilDesc: 'NPK, pH आणि आर्द्रता प्रविष्ट करा किंवा ब्लूटूथ सेन्सर कनेक्ट करा.',
    analyzeBtn: 'माती तपासा आणि पिकांचा सल्ला घ्या',
    schemesHeader: 'शासकीय योजना व सबसिडी',
    schemesDesc: 'कृषी सबसिडी, पिक विमा आणि अर्थसहाय्य योजनांची माहिती मिळवा.',
    aiChatHeader: 'बहुभाषिक AI योजना सहाय्यक',
    aiChatDesc: 'मराठी, हिंदी किंवा इंग्रजीत बोलून अथवा टाईप करून प्रश्न विचारा.',
  },
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('en');

  const t = (key) => {
    return translations[lang]?.[key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
