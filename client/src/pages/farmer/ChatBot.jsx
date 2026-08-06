import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  User,
  Sparkles,
  RefreshCw,
  ImagePlus,
  X,
  Globe,
  Trash2,
  Download,
  ChevronDown,
  Leaf,
  ShieldCheck,
  Droplets,
  Bug,
  Sprout,
  BookOpen,
  Copy,
  Check,
  MessageSquare,
  Camera,
} from 'lucide-react';
import API from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import { CameraModal } from '../../components/common/CameraModal';

// ─── AI Topic Suggestion Chips ───────────────────────────────────────────────
const TOPIC_SUGGESTIONS = {
  en: [
    { icon: '💰', label: 'PM-KISAN ₹6,000', query: 'How do I get PM-KISAN ₹6,000 yearly income support? What documents are needed?' },
    { icon: '🌾', label: 'Crop Insurance', query: 'Explain PM Fasal Bima Yojana crop insurance scheme and how to file a claim.' },
    { icon: '💧', label: 'Drip Subsidy', query: 'What is the subsidy percentage for drip irrigation under PMKSY scheme?' },
    { icon: '☀️', label: 'Solar Pump', query: 'How to get PM-KUSUM solar pump subsidy of 60% for my farm?' },
    { icon: '🧪', label: 'Soil pH Fix', query: 'My soil is acidic with pH 5.5. What should I apply to correct it?' },
    { icon: '🌱', label: 'Nitrogen Fix', query: 'My soybean leaves are turning yellow. How to fix nitrogen deficiency?' },
    { icon: '🐛', label: 'Pest Control', query: 'Cotton bollworm attacking my crop. What pesticide should I use and at what dose?' },
    { icon: '💧', label: 'Irrigation Tips', query: 'How much water does cotton need and at what critical growth stages?' },
    { icon: '🌾', label: 'Wheat Guide', query: 'Complete fertilizer and irrigation schedule for wheat crop per acre.' },
    { icon: '🌿', label: 'Organic Farming', query: 'How to increase organic carbon in my soil? Give me practical tips.' },
  ],
  hi: [
    { icon: '💰', label: 'PM-KISAN ₹6,000', query: 'पीएम-किसान ₹6,000 के लिए कौन से दस्तावेज चाहिए और कैसे आवेदन करें?' },
    { icon: '🌾', label: 'फसल बीमा', query: 'प्रधानमंत्री फसल बीमा योजना में कैसे दावा करें?' },
    { icon: '🧪', label: 'मिट्टी pH', query: 'मेरी मिट्टी का pH 5.5 है। इसे सुधारने के लिए क्या करें?' },
    { icon: '🌱', label: 'नाइट्रोजन कमी', query: 'सोयाबीन की पत्तियां पीली हो रही हैं। नाइट्रोजन कमी का उपाय बताएं।' },
    { icon: '☀️', label: 'सोलर पंप', query: 'PM-KUSUM सोलर पंप योजना में 60% सब्सिडी कैसे मिलती है?' },
    { icon: '🐛', label: 'कपास कीट', query: 'कपास में गुलाबी बोलवर्म का नियंत्रण कैसे करें?' },
  ],
  mr: [
    { icon: '💰', label: 'PM-KISAN ₹6,000', query: 'PM-KISAN ₹6,000 साठी कोणते कागदपत्रे लागतात आणि अर्ज कसा करावा?' },
    { icon: '🌾', label: 'पीक विमा', query: 'PM फसल बीमा योजनेत दावा कसा नोंदवावा?' },
    { icon: '🧪', label: 'माती pH', query: 'माझ्या मातीचा pH ५.५ आहे. सुधारण्यासाठी काय करावे?' },
    { icon: '☀️', label: 'सौर पंप', query: 'PM-KUSUM सौर पंप योजनेत ६०% अनुदान कसे मिळवावे?' },
    { icon: '💧', label: 'ठिबक अनुदान', query: 'PMKSY ठिबक सिंचन योजनेत किती टक्के अनुदान मिळते?' },
    { icon: '🐛', label: 'कापूस कीड', query: 'कापसावर गुलाबी बोंड अळीचे नियंत्रण कसे करावे?' },
  ],
};

// ─── AI Persona Configuration ────────────────────────────────────────────────
const PERSONA = {
  name: 'KrishiSeva AI',
  nameHindi: 'कृषिसेवा AI',
  nameMarathi: 'कृषिसेवा AI',
  tagline: {
    en: 'Expert AI Advisor for Indian Agriculture & Government Schemes',
    hi: 'भारतीय कृषि एवं सरकारी योजनाओं के लिए विशेषज्ञ AI सलाहकार',
    mr: 'भारतीय शेती व सरकारी योजनांसाठी तज्ज्ञ AI सल्लागार',
  },
  welcome: {
    en: `**Namaste! I am your KrishiSeva AI Agricultural Assistant! 🌾**\n\nI can expertly help you with:\n• 🏛️ **Government Schemes** — PM-KISAN, PMFBY, Solar Pump, Drip Subsidy\n• 🌱 **Soil Health** — NPK diagnosis, pH correction, organic carbon\n• 🐛 **Pest Control** — Integrated Pest Management, spray schedule\n• 💧 **Irrigation** — Water scheduling, drip systems, moisture management\n• 🌾 **Crop Management** — Cotton, Wheat, Soybean, Paddy cultivation\n• 💊 **Fertilizer Advice** — Dosage recommendations per acre\n\nType your question below, use 🎤 voice input, or 📷 upload a crop photo for visual diagnosis!`,
    hi: `**नमस्ते! मैं आपका कृषिसेवा AI सहायक हूँ! 🌾**\n\nमैं इन विषयों पर सहायता कर सकता हूँ:\n• 🏛️ **सरकारी योजनाएं** — PM-KISAN, PMFBY, सोलर पंप, ड्रिप सब्सिडी\n• 🌱 **मिट्टी स्वास्थ्य** — NPK निदान, pH सुधार\n• 🐛 **कीट नियंत्रण** — IPM रणनीति, छिड़काव कार्यक्रम\n• 💧 **सिंचाई** — पानी की मात्रा, ड्रिप सिस्टम\n• 🌾 **फसल प्रबंधन** — कपास, गेहूं, सोयाबीन\n\nनीचे प्रश्न टाइप करें, 🎤 बोलकर पूछें, या 📷 फसल फोटो अपलोड करें!`,
    mr: `**नमस्कार! मी तुमचा कृषिसेवा AI शेती सहाय्यक आहे! 🌾**\n\nमी या विषयांवर मदत करू शकतो:\n• 🏛️ **शासकीय योजना** — PM-KISAN, PMFBY, सौर पंप, ठिबक अनुदान\n• 🌱 **मृदा आरोग्य** — NPK निदान, pH सुधारणा\n• 🐛 **कीड नियंत्रण** — IPM धोरण, फवारणी वेळापत्रक\n• 💧 **सिंचन** — पाण्याचे वेळापत्रक, ठिबक प्रणाली\n• 🌾 **पीक व्यवस्थापन** — कापूस, गहू, सोयाबीन\n\nखाली प्रश्न टाइप करा, 🎤 बोलून विचारा, किंवा 📷 पीकाचा फोटो अपलोड करा!`,
  },
};

// ─── Message Bubble Component ─────────────────────────────────────────────────
const MessageBubble = ({ msg, onSpeak, onCopy, isSpeaking }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(msg.text.replace(/[*#]/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
    onCopy();
  };

  // Render markdown-style bold + bullet formatting
  const renderText = (text) => {
    const lines = text.split('\n');
    return lines.map((line, i) => {
      if (!line.trim()) return <br key={i} />;
      const boldParsed = line.replace(/\*\*(.+?)\*\*/g, '<strong class="text-emerald-300">$1</strong>');
      return (
        <p
          key={i}
          className={`leading-relaxed ${line.startsWith('•') || line.startsWith('-') ? 'pl-2' : ''}`}
          dangerouslySetInnerHTML={{ __html: boldParsed }}
        />
      );
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={`flex gap-3 group ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      {/* AI Avatar */}
      {msg.sender === 'ai' && (
        <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 text-slate-950 flex items-center justify-center shrink-0 mt-1 shadow-lg shadow-amber-950/30">
          <Bot className="w-5 h-5 stroke-[2.5]" />
        </div>
      )}

      <div className={`max-w-xl space-y-2 ${msg.sender === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
        {/* Image Preview (if attached) */}
        {msg.imagePreview && (
          <img
            src={msg.imagePreview}
            alt="Uploaded crop"
            className="rounded-2xl border border-slate-700 max-h-48 w-auto object-cover shadow-md"
          />
        )}

        {/* Chat Bubble */}
        <div
          className={`px-5 py-4 rounded-3xl text-sm leading-relaxed ${
            msg.sender === 'user'
              ? 'bg-gradient-to-br from-emerald-600 to-green-600 text-white rounded-tr-none shadow-lg shadow-emerald-950/40'
              : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none space-y-1.5'
          }`}
        >
          {msg.sender === 'ai' ? renderText(msg.text) : <span className="font-medium">{msg.text}</span>}
        </div>

        {/* AI Message Toolbar */}
        {msg.sender === 'ai' && (
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onSpeak(msg.text)}
              className={`flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-lg border transition-all font-semibold ${
                isSpeaking
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-amber-400'
              }`}
            >
              {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              {isSpeaking ? 'Stop' : 'Listen'}
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-lg border bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-100 transition-all font-semibold"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <span className="text-[10px] text-slate-500">{msg.time}</span>
          </div>
        )}

        {/* User timestamp */}
        {msg.sender === 'user' && (
          <span className="text-[10px] text-slate-500 self-end">{msg.time}</span>
        )}
      </div>

      {/* User Avatar */}
      {msg.sender === 'user' && (
        <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-500 to-green-400 text-slate-950 flex items-center justify-center shrink-0 mt-1 shadow-lg shadow-emerald-950/30">
          <User className="w-5 h-5 stroke-[2.5]" />
        </div>
      )}
    </motion.div>
  );
};

// ─── Typing Indicator ─────────────────────────────────────────────────────────
const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
    className="flex gap-3 items-center"
  >
    <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 text-slate-950 flex items-center justify-center shrink-0 shadow-lg shadow-amber-950/30">
      <RefreshCw className="w-4 h-4 animate-spin stroke-[2.5]" />
    </div>
    <div className="bg-slate-900 border border-slate-800 px-5 py-3.5 rounded-3xl rounded-tl-none flex items-center gap-2">
      <span className="text-xs text-slate-400 font-medium">KrishiSeva AI is analyzing</span>
      <div className="flex gap-1 items-end">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-amber-400 rounded-full"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
    </div>
  </motion.div>
);

// ─── Main ChatBot Component ───────────────────────────────────────────────────
export const ChatBot = () => {
  const { lang, setLang, t } = useLanguage();

  const getTimestamp = () =>
    new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: PERSONA.welcome.en,
      time: getTimestamp(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoVoiceMode, setAutoVoiceMode] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [cameraModalOpen, setCameraModalOpen] = useState(false);

  const handleCameraCapture = (imageDataUrl) => {
    setImagePreview(imageDataUrl);
    setImageBase64(imageDataUrl.includes(',') ? imageDataUrl.split(',')[1] : imageDataUrl);
    setImageFile({ name: 'camera_capture.jpg' });
  };
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeConversation, setActiveConversation] = useState('chat_1');
  const [conversationHistory, setConversationHistory] = useState([
    { id: 'chat_1', title: 'Current Session', count: 1 },
  ]);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Update welcome message on language change
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].sender === 'ai') {
        return [{ ...prev[0], text: PERSONA.welcome[lang] || PERSONA.welcome.en }];
      }
      return prev;
    });
  }, [lang]);

  // ─── Voice Speech-to-Text ──────────────────────────────────────────────────
  const toggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice input is not supported in your browser. Please use Chrome or Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    const langCodes = { hi: 'hi-IN', mr: 'mr-IN', en: 'en-IN' };
    recognition.lang = langCodes[lang] || 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          setInput(event.results[i][0].transcript);
        }
      }
      if (finalTranscript) {
        setInput(finalTranscript);
        setIsListening(false);
      }
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  };

  // ─── Text-to-Speech ────────────────────────────────────────────────────────
  const speakText = (text) => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#•]/g, '').replace(/\n+/g, '. ');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    const langCodes = { hi: 'hi-IN', mr: 'mr-IN', en: 'en-IN' };
    utterance.lang = langCodes[lang] || 'en-IN';
    utterance.rate = 0.95;
    utterance.pitch = 1.05;

    // Pick best available voice for language
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find((v) => v.lang === utterance.lang || v.lang.startsWith(utterance.lang.slice(0, 2)));
    if (matchingVoice) utterance.voice = matchingVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  // ─── Image Upload Handler ──────────────────────────────────────────────────
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    const preview = URL.createObjectURL(file);
    setImagePreview(preview);

    const reader = new FileReader();
    reader.onloadend = () => setImageBase64(reader.result);
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setImageBase64(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ─── Send Message ──────────────────────────────────────────────────────────
  const handleSend = async (e, quickQuery = null) => {
    e?.preventDefault();
    const userMsg = quickQuery || input.trim();
    if (!userMsg || loading) return;

    setInput('');
    setShowSuggestions(false);

    const userMsgObj = {
      id: Date.now(),
      sender: 'user',
      text: userMsg,
      imagePreview: imagePreview || null,
      time: getTimestamp(),
    };

    setMessages((prev) => [...prev, userMsgObj]);
    const capturedImage = imageBase64;
    clearImage();
    setLoading(true);

    try {
      const res = await API.post('/schemes/chat', {
        prompt: userMsg,
        language: lang,
        imageBase64: capturedImage || undefined,
      });

      if (res.data.success) {
        const aiMsgObj = {
          id: Date.now() + 1,
          sender: 'ai',
          text: res.data.answer,
          time: getTimestamp(),
        };
        setMessages((prev) => [...prev, aiMsgObj]);

        // Auto-speak response if Voice Assistant mode is ON
        if (autoVoiceMode) {
          speakText(res.data.answer);
        }

        // Update conversation history
        setConversationHistory((prev) =>
          prev.map((c) =>
            c.id === activeConversation
              ? { ...c, count: c.count + 1, title: userMsg.slice(0, 30) + '…' }
              : c
          )
        );
      }
    } catch (err) {
      const fallbackText = `I apologize — I'm having trouble connecting to my knowledge servers right now. Please check your internet connection and try again. You can also contact your local Krishi Vigyan Kendra (KVK) for immediate assistance.`;
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: fallbackText,
          time: getTimestamp(),
        },
      ]);
      if (autoVoiceMode) speakText(fallbackText);
    } finally {
      setLoading(false);
    }
  };

  // ─── Download Chat History ─────────────────────────────────────────────────
  const downloadChat = () => {
    const chatText = messages
      .map((m) => `[${m.time}] ${m.sender.toUpperCase()}: ${m.text.replace(/[*#]/g, '')}`)
      .join('\n\n');
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `KrishiSeva_AI_Chat_${new Date().toLocaleDateString()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ─── Clear Chat ────────────────────────────────────────────────────────────
  const clearChat = () => {
    setMessages([
      {
        id: Date.now(),
        sender: 'ai',
        text: PERSONA.welcome[lang] || PERSONA.welcome.en,
        time: getTimestamp(),
      },
    ]);
    setShowSuggestions(true);
  };

  const topics = TOPIC_SUGGESTIONS[lang] || TOPIC_SUGGESTIONS.en;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-5rem)] flex flex-col gap-4">

      {/* Header Banner */}
      <div className="glass-panel p-4 sm:p-5 rounded-3xl border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xl shrink-0 gpu-layer">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-950/40">
              <Bot className="w-7 h-7 stroke-[2.5]" />
            </div>
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-950 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black text-slate-100">{PERSONA.name}</h1>
              <span className="text-[10px] font-bold uppercase text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                LIVE AI
              </span>
            </div>
            <p className="text-xs text-slate-400">{PERSONA.tagline[lang] || PERSONA.tagline.en}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
          {/* Voice Assistant Mode Toggle */}
          <button
            onClick={() => {
              setAutoVoiceMode(!autoVoiceMode);
              if (isSpeaking) {
                window.speechSynthesis.cancel();
                setIsSpeaking(false);
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              autoVoiceMode
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-md shadow-amber-950/20'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle Auto Voice Assistant Readout"
          >
            {autoVoiceMode ? <Volume2 className="w-4 h-4 text-amber-400 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden xs:inline">{autoVoiceMode ? 'Voice Assistant ON' : 'Voice Assistant OFF'}</span>
          </button>

          {/* Speaking Sound Wave Indicator */}
          {isSpeaking && (
            <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-xl">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Speaking</span>
              <div className="flex items-end gap-0.5 h-3">
                {[0, 1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-amber-400 rounded-full"
                    animate={{ height: ['20%', '100%', '30%'] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1, ease: 'easeInOut' }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Language Switcher */}
          <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-800 p-1 rounded-xl">
            <Globe className="w-3.5 h-3.5 text-amber-400 ml-1.5" />
            {[
              { code: 'en', label: 'EN' },
              { code: 'hi', label: 'हिं' },
              { code: 'mr', label: 'मरा' },
            ].map(({ code, label }) => (
              <button
                key={code}
                onClick={() => setLang(code)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  lang === code ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <button
            onClick={downloadChat}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-100 transition-all"
            title="Download Chat"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={clearChat}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 transition-all"
            title="Clear Chat"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chat Body */}
      <div className="flex-1 flex gap-4 overflow-hidden min-h-0">

        {/* Messages Area */}
        <div className="flex-1 flex flex-col glass-panel rounded-3xl border border-slate-800 overflow-hidden">

          {/* Message Scroll Container */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 scrollbar-thin scrollbar-track-slate-950 scrollbar-thumb-slate-800">

            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                msg={msg}
                onSpeak={speakText}
                onCopy={() => {}}
                isSpeaking={isSpeaking}
              />
            ))}

            <AnimatePresence>
              {loading && <TypingIndicator key="typing" />}
            </AnimatePresence>

            <div ref={messagesEndRef} />
          </div>

          {/* AI Suggestion Chips */}
          <AnimatePresence>
            {showSuggestions && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-slate-800 px-4 py-3 overflow-x-auto"
              >
                <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  Suggested Questions
                </p>
                <div className="flex gap-2 flex-nowrap pb-1">
                  {topics.map((topic, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(null, topic.query)}
                      className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 hover:bg-amber-500/5 text-slate-300 hover:text-amber-300 text-[11px] font-semibold transition-all whitespace-nowrap"
                    >
                      <span>{topic.icon}</span>
                      {topic.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Image Preview Strip */}
          <AnimatePresence>
            {imagePreview && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-slate-800 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <img src={imagePreview} alt="Selected" className="h-16 w-20 object-cover rounded-xl border border-slate-700" />
                  <div className="flex-1 text-xs text-slate-300">
                    <span className="font-bold block">📷 Crop image attached</span>
                    <span className="text-slate-400">{imageFile?.name}</span>
                  </div>
                  <button onClick={clearImage} className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[10px] text-amber-400 mt-1.5 font-semibold">
                  AI will visually diagnose this crop/soil image. Add your question below and send.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Listening Speech-to-Text Banner */}
          <AnimatePresence>
            {isListening && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-rose-500/30 bg-rose-500/10 px-4 py-2.5 flex items-center justify-between"
              >
                <div className="flex items-center gap-2 text-xs font-semibold text-rose-300">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                  <span>🎤 {t('voiceListening')} Speak your question clearly...</span>
                </div>
                <button
                  type="button"
                  onClick={toggleListening}
                  className="text-[10px] uppercase font-bold text-rose-400 bg-rose-500/20 px-2 py-0.5 rounded hover:bg-rose-500/30"
                >
                  Stop
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input Toolbar */}
          <div className="border-t border-slate-800 p-3 sm:p-4">
            <form onSubmit={handleSend} className="flex items-end gap-2">

              {/* Image Upload from File */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="chat-image-input"
              />
              <label
                htmlFor="chat-image-input"
                className="shrink-0 p-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-amber-400 hover:border-amber-500/40 cursor-pointer transition-all"
                title={t('uploadCropPhoto')}
              >
                <ImagePlus className="w-5 h-5" />
              </label>

              {/* Live Camera Snap */}
              <button
                type="button"
                onClick={() => setCameraModalOpen(true)}
                className="shrink-0 p-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/40 cursor-pointer transition-all"
                title={t('takeLivePhotoChat')}
              >
                <Camera className="w-5 h-5" />
              </button>

              {/* Live Camera Modal */}
              <CameraModal
                isOpen={cameraModalOpen}
                onClose={() => setCameraModalOpen(false)}
                onCapture={handleCameraCapture}
              />

              {/* Voice Input */}
              <button
                type="button"
                onClick={toggleListening}
                className={`shrink-0 p-3 rounded-2xl border transition-all ${
                  isListening
                    ? 'bg-rose-500/15 border-rose-500 text-rose-400 animate-pulse'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-amber-400 hover:border-amber-500/40'
                }`}
                title={isListening ? 'Click to stop listening' : 'Click to speak your question'}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              {/* Text Input */}
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(e);
                  }
                }}
                placeholder={
                  isListening
                    ? t('voiceListening')
                    : imagePreview
                    ? t('uploadCropPhoto')
                    : t('chatPlaceholder')
                }
                rows={1}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-amber-500 resize-none transition-all max-h-28 overflow-y-auto"
              />

              {/* Send Button */}
              <button
                type="submit"
                disabled={loading || (!input.trim() && !imagePreview)}
                className="shrink-0 p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold shadow-lg shadow-amber-950/40 transition-all"
                title="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>

            {/* Status Bar */}
            <div className="flex items-center justify-between mt-2 px-1">
              <span className="text-[10px] text-slate-500">
                {isListening ? (
                  <span className="text-rose-400 font-semibold animate-pulse">🔴 Voice Recognition Active — Speak Now</span>
                ) : (
                  `${messages.filter((m) => m.sender !== 'ai' || messages.indexOf(m) > 0).length} messages in session`
                )}
              </span>
              <span className="text-[10px] text-slate-600 font-mono">
                Powered by Gemini 1.5 Flash + KrishiSeva KB
              </span>
            </div>
          </div>

        </div>

        {/* Right Capability Panel (hidden on mobile) */}
        <div className="hidden lg:flex w-64 shrink-0 flex-col gap-4">

          {/* Capability Cards */}
          <div className="glass-panel rounded-3xl border border-slate-800 p-4 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-2">
              AI Capabilities
            </h4>
            {[
              { icon: Leaf, label: 'Soil & Crop Advice', color: 'text-emerald-400', desc: 'NPK, pH, organic carbon' },
              { icon: ShieldCheck, label: 'Govt Scheme Guide', color: 'text-cyan-400', desc: 'PM-KISAN, PMFBY, subsidies' },
              { icon: Bug, label: t('pestDiagnosisTitle'), color: 'text-rose-400', desc: 'IPM, spray schedule' },
              { icon: Droplets, label: t('irrigationPlanningTitle'), color: 'text-blue-400', desc: 'Water scheduling, drip tips' },
              { icon: Sprout, label: t('fertilizerDosageTitle'), color: 'text-amber-400', desc: 'Per-acre recommendations' },
              { icon: BookOpen, label: t('farmingPracticesTitle'), color: 'text-purple-400', desc: 'Best practices, crop calendar' },
            ].map(({ icon: Icon, label, color, desc }, i) => (
              <div key={i} className="flex items-start gap-3 p-2 rounded-xl hover:bg-slate-900/60 transition-all cursor-default">
                <Icon className={`w-5 h-5 ${color} shrink-0 mt-0.5`} />
                <div>
                  <span className="text-xs font-semibold text-slate-200 block">{label}</span>
                  <span className="text-[10px] text-slate-500">{desc}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Voice & Image Guide */}
          <div className="glass-panel rounded-3xl border border-slate-800 p-4 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-2">
              {t('inputMethods')}
            </h4>
            <div className="space-y-2.5 text-[11px] text-slate-400">
              <div className="flex gap-2 items-start">
                <Mic className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong className="text-slate-300">{t('voiceInputInfo')}</strong> — Click 🎤 and speak your question in English, Hindi, or Marathi</span>
              </div>
              <div className="flex gap-2 items-start">
                <Volume2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong className="text-slate-300">{t('voiceOutputInfo')}</strong> — Hover over AI replies and click "Listen" for audio readout</span>
              </div>
              <div className="flex gap-2 items-start">
                <ImagePlus className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong className="text-slate-300">{t('imageDiagnosisInfo')}</strong> — Upload crop or soil photos for AI visual analysis</span>
              </div>
              <div className="flex gap-2 items-start">
                <Globe className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong className="text-slate-300">{t('multilingualInfo')}</strong> — Switch EN / हिं / मरा for responses in your language</span>
              </div>
            </div>
          </div>

          {/* Emergency Contacts */}
          <div className="glass-panel rounded-3xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-2">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">{t('kisanHelplines')}</h4>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">PM-KISAN Helpline:</span>
                <span className="font-bold text-amber-300">155261</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Crop Insurance:</span>
                <span className="font-bold text-amber-300">1800-180-1551</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Kisan Call Center:</span>
                <span className="font-bold text-amber-300">1800-180-1551</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Soil Health Card:</span>
                <span className="font-bold text-amber-300">1800-180-1551</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
