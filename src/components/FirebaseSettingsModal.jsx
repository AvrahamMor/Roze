import React, { useState, useEffect } from 'react';
import { Database, Cloud, CloudCheck, CloudOff, Key, CheckCircle2, AlertCircle, RefreshCw, X, HelpCircle, Copy, ExternalLink, Bot, Sparkles } from 'lucide-react';
import { getFirebaseConfig, initFirebase } from '../firebase/config';
import { testFirebaseConnection } from '../services/dbService';
import { getGeminiApiKey, saveGeminiApiKey } from '../services/geminiService';

export default function FirebaseSettingsModal({ isOpen, onClose, onConfigUpdated }) {
  const [configText, setConfigText] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [projectId, setProjectId] = useState('');
  const [authDomain, setAuthDomain] = useState('');
  const [storageBucket, setStorageBucket] = useState('');
  const [messagingSenderId, setMessagingSenderId] = useState('');
  const [appId, setAppId] = useState('');
  
  // Gemini AI Key
  const [geminiKey, setGeminiKey] = useState('');

  const [inputMode, setInputMode] = useState('paste'); // 'paste' | 'fields'
  const [statusMessage, setStatusMessage] = useState(null);
  const [isTesting, setIsTesting] = useState(false);
  const [currentConfig, setCurrentConfig] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadCurrentSettings();
    }
  }, [isOpen]);

  const loadCurrentSettings = () => {
    const config = getFirebaseConfig();
    setCurrentConfig(config);
    if (config) {
      setApiKey(config.apiKey || '');
      setProjectId(config.projectId || '');
      setAuthDomain(config.authDomain || '');
      setStorageBucket(config.storageBucket || '');
      setMessagingSenderId(config.messagingSenderId || '');
      setAppId(config.appId || '');
      setConfigText(JSON.stringify(config, null, 2));
    } else {
      setConfigText('');
      setApiKey('');
      setProjectId('');
      setAuthDomain('');
      setStorageBucket('');
      setMessagingSenderId('');
      setAppId('');
    }
    
    setGeminiKey(getGeminiApiKey());
    setStatusMessage(null);
  };

  if (!isOpen) return null;

  // Extract config from pasted JavaScript/JSON code
  const parsePastedConfig = (raw) => {
    try {
      return JSON.parse(raw);
    } catch (e) {
      const extractField = (field) => {
        const regex = new RegExp(`${field}["']?\\s*:\\s*["']([^"']+)["']`);
        const match = raw.match(regex);
        return match ? match[1] : '';
      };

      const extracted = {
        apiKey: extractField('apiKey'),
        authDomain: extractField('authDomain'),
        projectId: extractField('projectId'),
        storageBucket: extractField('storageBucket'),
        messagingSenderId: extractField('messagingSenderId'),
        appId: extractField('appId'),
      };

      if (extracted.projectId && extracted.apiKey) {
        return extracted;
      }
      return null;
    }
  };

  const handleSave = async () => {
    let finalConfig = null;

    if (inputMode === 'paste') {
      if (!configText.trim()) {
        setStatusMessage({ type: 'error', text: 'אנא הדבק את הגדרות הפרויקט מ-Firebase Console' });
        return;
      }
      finalConfig = parsePastedConfig(configText);
      if (!finalConfig || !finalConfig.projectId || !finalConfig.apiKey) {
        setStatusMessage({ 
          type: 'error', 
          text: 'פורמט לא תקין. ודא שהעתקת את אובייקט firebaseConfig המלא מ-Firebase Console (כולל apiKey ו-projectId).' 
        });
        return;
      }
    } else {
      if (!apiKey.trim() || !projectId.trim()) {
        setStatusMessage({ type: 'error', text: 'שדות API Key ו-Project ID הם שדות חובה!' });
        return;
      }
      finalConfig = {
        apiKey: apiKey.trim(),
        projectId: projectId.trim(),
        authDomain: authDomain.trim() || `${projectId.trim()}.firebaseapp.com`,
        storageBucket: storageBucket.trim() || `${projectId.trim()}.appspot.com`,
        messagingSenderId: messagingSenderId.trim(),
        appId: appId.trim()
      };
    }

    // Save Gemini Key
    saveGeminiApiKey(geminiKey);

    // Save Firebase to localStorage
    try {
      localStorage.setItem('roze_custom_firebase_config', JSON.stringify(finalConfig));
      initFirebase(finalConfig);
      setCurrentConfig(finalConfig);
      
      setStatusMessage({ 
        type: 'success', 
        text: 'הגדרות Firebase ו-Gemini AI נשמרו בהצלחה! בודק חיבור...' 
      });

      if (onConfigUpdated) onConfigUpdated(finalConfig);

      // Automatically test connection
      handleTestConnection(finalConfig);
    } catch (e) {
      setStatusMessage({ type: 'error', text: 'שגיאה בשמירת ההגדרות: ' + e.message });
    }
  };

  const handleTestConnection = async (cfg = currentConfig) => {
    setIsTesting(true);
    setStatusMessage(null);
    try {
      const result = await testFirebaseConnection();
      if (result.success) {
        setStatusMessage({
          type: 'success',
          text: `חיבור פעיל ומאומת! פרויקט "${result.projectId}" מחובר ל-Cloud Firestore.`
        });
      } else {
        setStatusMessage({
          type: 'error',
          text: 'בדיקת החיבור נכשלה: ' + (result.error || 'אנא ודא שיצרת מסד נתונים Firestore בפרויקט ב-Firebase Console.')
        });
      }
    } catch (e) {
      setStatusMessage({
        type: 'error',
        text: 'שגיאה בבדיקת חיבור: ' + e.message
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleClearConfig = () => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק את הגדרות ה-Firebase המקומיות?')) {
      localStorage.removeItem('roze_custom_firebase_config');
      initFirebase(null);
      setCurrentConfig(null);
      loadCurrentSettings();
      if (onConfigUpdated) onConfigUpdated(null);
      setStatusMessage({ type: 'info', text: 'ההגדרות אופסו.' });
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '16px'
    }}>
      <div className="glass-card" style={{
        maxWidth: '680px',
        width: '100%',
        maxHeight: '92vh',
        overflowY: 'auto',
        padding: '28px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        border: '1.5px solid var(--border-accent)',
        boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
      }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <Database size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0 }}>הגדרות ענן Firebase ו-Gemini AI</h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>סנכרון ענן ובינה מלאכותית למערכת</span>
            </div>
          </div>

          <button 
            type="button"
            onClick={onClose}
            className="btn-secondary"
            style={{ padding: '6px 10px', minHeight: '36px', borderRadius: '50%' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Current Connection Status Badge */}
        <div style={{
          padding: '12px 18px',
          borderRadius: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: currentConfig ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
          border: currentConfig ? '1px solid var(--accent-emerald)' : '1px solid var(--accent-amber)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {currentConfig ? (
              <CloudCheck size={24} style={{ color: 'var(--accent-emerald)' }} />
            ) : (
              <CloudOff size={24} style={{ color: 'var(--accent-amber)' }} />
            )}
            <div>
              <strong style={{ display: 'block', fontSize: '0.95rem', color: currentConfig ? 'var(--accent-emerald)' : 'var(--accent-amber)' }}>
                {currentConfig ? 'Firebase מוגדר ומחובר' : 'טרם הוגדר פרויקט ענן'}
              </strong>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {currentConfig ? `פרויקט: ${currentConfig.projectId}` : 'הנתונים נשמרים כרגע רק בזיכרון המקומי של הדפדפן'}
              </span>
            </div>
          </div>

          {currentConfig && (
            <button
              type="button"
              onClick={() => handleTestConnection()}
              disabled={isTesting}
              className="btn-secondary"
              style={{ fontSize: '0.8rem', padding: '6px 12px', minHeight: '34px', gap: '6px' }}
            >
              {isTesting ? <RefreshCw size={14} className="spin-anim" /> : <RefreshCw size={14} />}
              {isTesting ? 'בודק חיבור...' : 'בדוק חיבור עכשיו'}
            </button>
          )}
        </div>

        {/* Gemini AI Key Section */}
        <div style={{ background: 'var(--bg-subcard)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.9rem', marginBottom: '8px', color: 'var(--accent-purple)' }}>
            <Bot size={18} /> מפתח Google Gemini API (עבור סוכן חוק חי):
          </label>
          <input 
            type="password" 
            value={geminiKey} 
            onChange={(e) => setGeminiKey(e.target.value)} 
            placeholder="AQ.Ab8RN... או AIzaSy..."
            style={{ width: '100%', fontSize: '0.88rem' }}
          />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
            מפתח זה מפעיל את סוכן ה-AI בלשונית "סוכן חוק". מוגבל בתקרת 5 ₪ שהגדרת.
          </span>
        </div>

        {/* Status Alert */}
        {statusMessage && (
          <div style={{
            padding: '12px 16px',
            borderRadius: '8px',
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: statusMessage.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : statusMessage.type === 'error' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(59, 130, 246, 0.15)',
            border: statusMessage.type === 'success' ? '1px solid var(--accent-emerald)' : statusMessage.type === 'error' ? '1px solid var(--accent-rose)' : '1px solid var(--accent-blue)',
            color: statusMessage.type === 'success' ? 'var(--accent-emerald)' : statusMessage.type === 'error' ? 'var(--accent-rose)' : 'var(--accent-blue)'
          }}>
            {statusMessage.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Input Mode Toggle */}
        <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
          <button 
            type="button"
            onClick={() => setInputMode('paste')}
            className={inputMode === 'paste' ? 'btn-primary' : 'btn-secondary'}
            style={{ fontSize: '0.85rem', padding: '6px 14px' }}
          >
            📋 הדבקת קוד הגדרות Firebase
          </button>
          <button 
            type="button"
            onClick={() => setInputMode('fields')}
            className={inputMode === 'fields' ? 'btn-primary' : 'btn-secondary'}
            style={{ fontSize: '0.85rem', padding: '6px 14px' }}
          >
            ✏️ מילוי שדות ידני
          </button>
        </div>

        {/* Paste Mode Form */}
        {inputMode === 'paste' ? (
          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.88rem', marginBottom: '8px' }}>
              הדבק כאן את אובייקט ה-<code>firebaseConfig</code> מ-Firebase Console:
            </label>
            <textarea
              rows={6}
              placeholder={`const firebaseConfig = {\n  apiKey: "AIzaSy...",\n  authDomain: "rose-23001.firebaseapp.com",\n  projectId: "rose-23001",\n  storageBucket: "rose-23001.firebasestorage.app",\n  messagingSenderId: "86794850066",\n  appId: "1:86794850066:web:d75aec6ee602bb47d86dcb"\n};`}
              value={configText}
              onChange={(e) => setConfigText(e.target.value)}
              style={{
                width: '100%',
                fontFamily: 'monospace',
                fontSize: '0.82rem',
                padding: '12px',
                borderRadius: '8px',
                direction: 'ltr',
                textAlign: 'left'
              }}
            />
          </div>
        ) : (
          /* Manual Fields Mode */
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', direction: 'ltr', textAlign: 'left' }}>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>Firebase API Key *</label>
              <input 
                type="text" 
                value={apiKey} 
                onChange={(e) => setApiKey(e.target.value)} 
                placeholder="AIzaSy..." 
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>Project ID *</label>
              <input 
                type="text" 
                value={projectId} 
                onChange={(e) => setProjectId(e.target.value)} 
                placeholder="rose-23001" 
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>Auth Domain</label>
              <input 
                type="text" 
                value={authDomain} 
                onChange={(e) => setAuthDomain(e.target.value)} 
                placeholder="project.firebaseapp.com" 
              />
            </div>
          </div>
        )}

        {/* Modal Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', paddingTop: '16px', borderTop: '1px solid var(--border-color)', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            {currentConfig && (
              <button
                type="button"
                onClick={handleClearConfig}
                className="btn-secondary"
                style={{ color: 'var(--accent-rose)', borderColor: 'rgba(239, 68, 68, 0.3)', fontSize: '0.82rem' }}
              >
                איפוס הגדרות
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              type="button" 
              onClick={onClose} 
              className="btn-secondary"
              style={{ fontSize: '0.9rem' }}
            >
              סגור
            </button>
            
            <button 
              type="button" 
              onClick={handleSave} 
              className="btn-primary"
              style={{ fontSize: '0.9rem', padding: '8px 24px' }}
            >
              שמור הגדרות
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
