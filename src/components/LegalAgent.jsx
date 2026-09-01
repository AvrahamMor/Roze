import React, { useState, useEffect, useRef } from 'react';
import { 
  askGeminiAgent, 
  checkLiveLawUpdates, 
  getGeminiApiKey, 
  saveGeminiApiKey, 
  getGeminiModelMode, 
  saveGeminiModelMode 
} from '../services/geminiService';
import { 
  Bot, 
  Send, 
  Sparkles, 
  HelpCircle, 
  ShieldCheck, 
  AlertCircle, 
  Search, 
  RefreshCw, 
  CheckCircle2, 
  Key, 
  MessageSquare, 
  Lightbulb, 
  BookOpen, 
  ChevronDown, 
  ChevronUp,
  Sparkle,
  Trash2,
  Globe,
  Brain,
  Zap
} from 'lucide-react';

const QUICK_QUESTIONS = [
  '🔍 סרוק ובדוק עדכוני חוק ופסיקה אחרונים בישראל',
  '🏖️ איך לחשב ימי חופשה אם היא לוקחת שבוע חופש?',
  '🏥 מה החוק לגבי ימי מחלה וביטוח בריאות?',
  '💰 מתי וכמה משלמים דמי הבראה בשנה הראשונה?',
  '🛡️ איך מפרישים לפיצויים ופנסיה לפי החוק?',
  '📜 מהם הכללים של הודעה מוקדמת לסיום העסקה?'
];

export default function LegalAgent() {
  const [apiKey, setApiKey] = useState(getGeminiApiKey());
  const [isEditingKey, setIsEditingKey] = useState(false);
  const [tempKey, setTempKey] = useState(apiKey);
  const [modelMode, setModelMode] = useState(getGeminiModelMode());
  
  // Chat state
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('roze_agent_chat_history');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'welcome-1',
        sender: 'model',
        text: `שלום מור! 👋\nאני סוכן הבינה המלאכותית המשפטי שלך הפועל במצב **Gemini 3.7 Flash - High Thinking (חשיבה עמוקה ומקסימום דיוק)** 🧠✨\n\nאני מכיר את כל פרטי ההסכם של המטפלת **ביג'ילי ג'וזף** (תאריך כניסה: **20/07/2026**, שכר ברוטו: **6,443.85 ₪**, שבת/חג: **440 ₪**, ניכויים ועתודה), ומבצע חשיבה מעמיקה וניתוח משפטי וחשבונאי מלא לכל שאלה.\n\nאיך אוכל לסייע לך היום? תוכל לשאול כל שאלה חופשית או לבחור מהשאלות המהירות למטה.`
      }
    ];
  });

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const chatEndRef = useRef(null);

  // Save chat history to localStorage
  useEffect(() => {
    localStorage.setItem('roze_agent_chat_history', JSON.stringify(messages));
  }, [messages]);

  // Scroll to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Refresh key from env / localStorage on mount
  useEffect(() => {
    const currentKey = getGeminiApiKey();
    if (currentKey) {
      setApiKey(currentKey);
      setTempKey(currentKey);
    }
  }, []);

  const handleSaveKey = () => {
    saveGeminiApiKey(tempKey);
    setApiKey(tempKey);
    setIsEditingKey(false);
  };

  const handleToggleMode = (newMode) => {
    setModelMode(newMode);
    saveGeminiModelMode(newMode);
  };

  const handleSendMessage = async (queryText = inputQuery) => {
    const query = queryText.trim();
    if (!query || isLoading) return;

    setInputQuery('');
    setErrorMsg(null);

    const userMessageObj = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessageObj]);
    setIsLoading(true);

    try {
      let replyText = '';
      if (query.includes('סרוק ובדוק עדכוני חוק')) {
        replyText = await checkLiveLawUpdates();
      } else {
        replyText = await askGeminiAgent(query, messages, modelMode);
      }

      const modelMessageObj = {
        id: (Date.now() + 1).toString(),
        sender: 'model',
        text: replyText,
        timestamp: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, modelMessageObj]);
    } catch (err) {
      setErrorMsg(err.message || 'שגיאה בקבלת תשובה מ-Gemini.');
      const errorMessageObj = {
        id: (Date.now() + 1).toString(),
        sender: 'model',
        text: `⚠️ **שגיאה בתקשורת עם סוכן ה-AI:**\n${err.message}\n\n*אנא ודא שמפתח ה-API תקין ומוגדר כראוי.*`,
        timestamp: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMessageObj]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    const defaultWelcome = [
      {
        id: 'welcome-1',
        sender: 'model',
        text: `שלום מור! שיחת הצ'אט אופסה. סוכן Gemini 3.7 Flash במצב High Thinking מוכן לשאלותיך.`
      }
    ];
    setMessages(defaultWelcome);
    localStorage.removeItem('roze_agent_chat_history');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header Banner - Gemini 3.7 Flash Status */}
      <div className="glass-card" style={{ 
        padding: '24px 28px', 
        background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.16), rgba(59, 130, 246, 0.16))', 
        borderColor: 'rgba(168, 85, 247, 0.35)' 
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 4px 20px rgba(168, 85, 247, 0.45)' }}>
                <Brain size={26} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <h2 style={{ fontSize: '1.65rem', fontWeight: 800, margin: 0 }}>
                    סוכן חוק וזכויות AI חי | <span className="text-gradient-purple">Gemini 3.7 Flash</span>
                  </h2>
                  <span className="badge badge-purple" style={{ fontSize: '0.78rem', padding: '4px 12px' }}>
                    <Brain size={13} /> High Thinking Mode (חשיבה עמוקה)
                  </span>
                </div>
                <p style={{ color: 'var(--text-muted)', marginTop: '4px', fontSize: '0.88rem' }}>
                  סוכן AI מומחה ברמת High Reasoning לניתוח מעמיק ומדויק של החוזה של <strong>ביג'ילי ג'וזף</strong> ודיני עבודה בסיעוד בישראל.
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {/* Reasoning Mode Selector */}
            <div style={{ display: 'flex', background: 'var(--bg-subcard)', padding: '3px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <button
                onClick={() => handleToggleMode('high-thinking')}
                style={{
                  padding: '5px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: modelMode === 'high-thinking' ? 'var(--gradient-purple)' : 'transparent',
                  color: modelMode === 'high-thinking' ? '#fff' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                title="מצב חשיבה עמוקה וניתוח אנליטי מלא"
              >
                <Brain size={13} /> חשיבה עמוקה (High)
              </button>

              <button
                onClick={() => handleToggleMode('standard')}
                style={{
                  padding: '5px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: modelMode === 'standard' ? 'var(--gradient-brand)' : 'transparent',
                  color: modelMode === 'standard' ? '#fff' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                title="מענה מהיר סטנדרטי"
              >
                <Zap size={13} /> מענה מהיר
              </button>
            </div>

            <button 
              type="button" 
              onClick={() => setIsEditingKey(!isEditingKey)}
              className="btn-secondary"
              style={{ padding: '6px 14px', fontSize: '0.82rem', gap: '6px' }}
            >
              <Key size={14} /> {isEditingKey ? 'סגור מפתח' : 'מפתח API'}
            </button>
          </div>
        </div>

        {/* API Key Inline Configuration Drawer */}
        {isEditingKey && (
          <div style={{ marginTop: '18px', paddingTop: '16px', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Google Gemini API Key:</span>
            <input 
              type="password" 
              value={tempKey} 
              onChange={(e) => setTempKey(e.target.value)}
              placeholder="הזן מפתח API של גוגל..."
              style={{ maxWidth: '380px', padding: '6px 12px', fontSize: '0.85rem', height: '38px' }}
            />
            <button 
              type="button" 
              onClick={handleSaveKey} 
              className="btn-primary" 
              style={{ padding: '6px 16px', fontSize: '0.85rem', minHeight: '38px' }}
            >
              שמור מפתח
            </button>
          </div>
        )}
      </div>

      {/* Main Chat Area */}
      <div className="glass-card" style={{ 
        padding: '0', 
        display: 'flex', 
        flexDirection: 'column', 
        height: '640px', 
        background: 'var(--bg-card)',
        overflow: 'hidden' 
      }}>
        
        {/* Chat Header Toolbar */}
        <div style={{ 
          padding: '12px 20px', 
          borderBottom: '1px solid var(--border-color)', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          background: 'var(--bg-subcard)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', fontWeight: 700 }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent-emerald)', boxShadow: '0 0 8px var(--accent-emerald)' }} />
            שיחה חיה עם סוכן החוק של ביג'ילי (Gemini 3.7 High Thinking)
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={handleClearHistory} 
              className="btn-secondary" 
              style={{ padding: '4px 10px', fontSize: '0.78rem', gap: '4px', minHeight: '30px' }}
              title="נקה היסטוריית שיחה"
            >
              <Trash2 size={13} /> נקה שיחה
            </button>
          </div>
        </div>

        {/* Chat Messages Stream */}
        <div style={{ 
          flex: 1, 
          overflowY: 'auto', 
          padding: '20px', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '16px' 
        }}>
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: msg.sender === 'user' ? 'flex-start' : 'flex-end',
                maxWidth: '85%',
                alignSelf: msg.sender === 'user' ? 'flex-start' : 'flex-end'
              }}
            >
              <div style={{ 
                padding: '14px 18px', 
                borderRadius: '16px', 
                background: msg.sender === 'user' ? 'var(--gradient-brand)' : 'var(--bg-subcard)', 
                color: msg.sender === 'user' ? '#fff' : 'var(--text-main)', 
                border: msg.sender === 'user' ? 'none' : '1px solid var(--border-color)',
                boxShadow: msg.sender === 'user' ? '0 4px 14px rgba(99, 102, 241, 0.25)' : 'var(--shadow-sm)',
                lineHeight: '1.65',
                fontSize: '0.94rem',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}>
                {msg.text}
              </div>
              {msg.timestamp && (
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px', paddingRight: '4px' }}>
                  {msg.timestamp}
                </span>
              )}
            </div>
          ))}

          {/* AI Thinking Spinner Indicator */}
          {isLoading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 18px', borderRadius: '16px', background: 'var(--bg-subcard)', alignSelf: 'flex-end', border: '1px solid var(--border-color)' }}>
              <Brain size={18} className="spin-anim" style={{ color: 'var(--accent-purple)' }} />
              <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                Gemini 3.7 מבצע חשיבה עמוקה וניתוח משפטי (High Reasoning)...
              </span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Quick Question Chips */}
        <div style={{ 
          padding: '10px 16px', 
          borderTop: '1px solid var(--border-color)', 
          background: 'var(--bg-subcard)', 
          display: 'flex', 
          gap: '8px', 
          overflowX: 'auto',
          scrollbarWidth: 'none'
        }}>
          {QUICK_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(q)}
              disabled={isLoading}
              className="btn-secondary"
              style={{ 
                padding: '6px 12px', 
                fontSize: '0.78rem', 
                whiteSpace: 'nowrap', 
                borderRadius: '20px', 
                background: 'rgba(255, 255, 255, 0.04)',
                minHeight: '32px'
              }}
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Box Bar */}
        <div style={{ 
          padding: '16px 20px', 
          borderTop: '1px solid var(--border-color)', 
          background: 'var(--bg-card)', 
          display: 'flex', 
          gap: '12px', 
          alignItems: 'center' 
        }}>
          <input 
            type="text" 
            placeholder="שאל את הסוכן כל שאלה משפטית, חישוב שכר או זכויות..." 
            value={inputQuery} 
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={isLoading}
            style={{ flex: 1, minHeight: '44px' }}
          />

          <button 
            type="button" 
            onClick={() => handleSendMessage()} 
            disabled={isLoading || !inputQuery.trim()}
            className="btn-primary"
            style={{ padding: '10px 22px', minHeight: '44px', gap: '6px' }}
          >
            {isLoading ? <Brain size={18} className="spin-anim" /> : <Send size={18} />}
            <span>שלח</span>
          </button>
        </div>

      </div>

      {/* Static Legal Reference Cards / FAQ */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <BookOpen size={20} style={{ color: 'var(--accent-cyan)' }} />
            מאגר מידע מקומי מהיר (שאלות ותשובות נפוצות)
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
          
          <div style={{ background: 'var(--bg-subcard)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-purple)', marginBottom: '6px' }}>
              🇮🇳 מהי מכסת החגים המגיעה לביג'ילי לשנת 2026?
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              מכיוון שהיא נכנסה לעבודה ב-<strong>20/07/2026</strong>, מגיעים לה <strong>4 ימי חג בלבד</strong> לשנת 2026 (חישוב יחסי עבור 5.3 חודשים). החל מ-2027 מגיעים לה 9 ימים מלאים.
            </p>
          </div>

          <div style={{ background: 'var(--bg-subcard)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-emerald)', marginBottom: '6px' }}>
              🏖️ מתי ואיך זכאית ביג'ילי לדמי הבראה?
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              הזכאות לדמי הבראה מתחילה <strong>רק לאחר השלמת שנת עבודה מלאה (20/07/2027)</strong>. עבור השנה הראשונה מגיעים לה 5 ימי הבראה בתעריף 418 ₪ ליום (סה"כ <strong>2,090 ₪</strong>).
            </p>
          </div>

          <div style={{ background: 'var(--bg-subcard)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-amber)', marginBottom: '6px' }}>
              💰 מהו התעריף עבור עבודה בשבת או בחג?
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              לפי מסמך תנאי העסקה המעודכן מאפריל 2026, התעריף ליום שבת (25 שעות מנוחה) או ליום חג נבחר שעובדים בו הוא <strong>440.00 ₪</strong>.
            </p>
          </div>

          <div style={{ background: 'var(--bg-subcard)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '6px' }}>
              🛡️ מהן הפרשות המעסיק לפנסיה ופיצויים?
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              מעסיק מפריש <strong>6.5% לפנסיה</strong> מתוך שכר מינימום (382.20 ₪) ו-<strong>8.33% לפיצויי פיטורין</strong> מתוך שכר ברוטו מלא (536.77 ₪). סה"כ להפקדה חודשית: <strong>918.97 ₪</strong>.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
