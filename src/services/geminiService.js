import { LEGAL_RULES } from '../data/legalRules';
import { CONTRACT_DATA } from '../data/contractData';

const STORAGE_KEY = 'roze_gemini_api_key';
const MODEL_STORAGE_KEY = 'roze_gemini_model_mode';

// Get Gemini API Key from localStorage or environment
export function getGeminiApiKey() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved && saved.trim()) return saved.trim();
  const envKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (envKey && envKey.trim()) return envKey.trim();
  return '';
}

// Save Gemini API Key
export function saveGeminiApiKey(key) {
  if (key && key.trim()) {
    localStorage.setItem(STORAGE_KEY, key.trim());
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

// Get Selected Model Mode (defaults to 'high-thinking')
export function getGeminiModelMode() {
  return localStorage.getItem(MODEL_STORAGE_KEY) || 'high-thinking';
}

// Save Selected Model Mode
export function saveGeminiModelMode(mode) {
  localStorage.setItem(MODEL_STORAGE_KEY, mode);
}

// Comprehensive Expert System Prompt with High Reasoning & Precision
const HIGH_REASONING_SYSTEM_INSTRUCTION = `
אתה סוכן AI מומחה בכיר ביותר (Senior Legal Counsel & Certified Payroll Auditor) לדיני עבודה ועובדים זרים בענף הסיעוד בישראל.
רמת החשיבה שלך היא: **HIGH THINKING / MAXIMUM REASONING (חשיבה עמוקה, אנליטית ומדויקת ביותר)**.

עליך לבצע חשיבה מעמיקה, ניתוח חוקי קפדני וחישובים מתמטיים מדויקים עד לרמת האגורה לפני כל תשובה.

נתוני העובדת וההסכם (Single Source of Truth):
- שם העובדת: ביג'ילי ג'וזף (Bijili Joseph), אזרחית הודו.
- שם המעסיקה: מור רויטל (Mor Rvital).
- תאריך תחילת עבודה (השמה רשמית): 20/07/2026 (20 ביולי 2026).
- שכר חודשי ברוטו מוסכם (הסכם 2026): 6,443.85 ₪ (כולל 100 ₪ מקדמה שבועית במזומן / כ-433 ₪ בחודש).
- שכר מינימום בסיס במשק (2026): 5,880.02 ₪.
- תוספת עבור עבודה בשבת (מנוחה שבועית - 25 שעות): 440.00 ₪ לשבת (מעודכן לפי מסמך אפריל 2026 של תאגיד "איתני מור", מחליף את ה-400 ₪ הישן).
- תוספת עבור עבודה ביום חג נבחר: 440.00 ₪ ליום חג.
- מכסת ימי חג לשנת 2026 (פרו-רטה יחסית מיולי 2026): בדיוק 4 ימי חג בלבד ((5.33 חודשים / 12) * 9 = 4 ימים). החל משנת 2027: 9 ימי חג שנתיים מלאים.
- צבירת ימי חופשה שנתית: 14 ימים בשנה (1.166 ימים לכל חודש עבודה מלא).
- שווי כספי של יום חופשה לפדיון: 257.75 ₪ ליום (ברוטו 6,443.85 ₪ חלקי 25 ימי עבודה).
- דמי הבראה: 418.00 ₪ ליום. עבור שנה ראשונה: 5 ימים = 2,090.00 ₪. הזכאות משולמת אך ורק לאחר השלמת שנת עבודה מלאה (20/07/2027). שנים 2-3: 6 ימים = 2,508.00 ₪.
- הפרשות סוציאליות מעסיק: פנסיה גמולים 6.5% משכר מינימום (382.20 ₪), פיצויי פיטורין 8.33% משכר ברוטו מלא (536.77 ₪) או 6.0% בהתפטרות. סה"כ להפקדה חודשית: 918.97 ₪.
- ביטוח לאומי מעסיק: 3.6% משכר ברוטו (231.98 ₪).
- ניכויים מותרים משכר העובדת (תקרות חוקיות):
  1. ביטוח בריאות פרטי: עד מחצית מהעלות ועד תקרה חוקית של 154.20 ₪.
  2. מגורים והוצאות נלוות: מוסכם 300.00 ₪ (תקרה בחוק כ-446.50 ₪).
  3. חלק עובדת לפנסיה: 6% משכר מינימום = 352.80 ₪ (מופקד לקופתה).
  4. מקדמה שבועית (דמי כיס): 100 ₪ במזומן בכל שבוע, שמקוזזים מהתשלום החודשי בסוף החודש.
- תאגיד סיעוד מלווה: "איתני מור" (דמי טיפול חודשיים: 70 ₪).

עקרונות המענה שלך (High Intelligence):
1. **דיוק מוחלט:** אל תנחש. בצע תמיד את החישוב המתמטי והמשפטי המלא.
2. **הסבר הגיון חוקי (Reasoning):** הסבר לא רק *מה* התוצאה, אלא *למה* החוק קובע כך (הבדל בין חובת מעסיק לזכות מעסיק).
3. **עברית רהוטה וברורה:** כתוב בצורה מסודרת, עם הדגשות, סעיפים וטבלאות קצרות כשצריך.
4. **ייעוץ מגן למעסיק:** הגן על המעסיקה מפני טעויות תשלום, חובות עתידיים או הפרות של חוק הגנת השכר.
`;

/**
 * Send query to Google Gemini API with High Thinking reasoning cascade
 */
export async function askGeminiAgent(userMessage, chatHistory = [], modelMode = 'high-thinking') {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error('לא נמצא מפתח Google Gemini API. אנא הזן את מפתח ה-API בראש המסך או בהגדרות.');
  }

  // Format contents array including past turns
  const formattedContents = [];
  chatHistory.slice(-10).forEach((msg) => {
    formattedContents.push({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    });
  });

  formattedContents.push({
    role: 'user',
    parts: [{ text: userMessage }]
  });

  // Candidate models verified on Google API in order of priority
  const candidateModels = [
    'gemini-3.7-flash',
    'gemini-3.6-flash',
    'gemini-3.5-flash',
    'gemini-flash-latest',
    'gemini-3.1-flash-lite'
  ];

  const payload = {
    contents: formattedContents,
    systemInstruction: {
      parts: [{ text: HIGH_REASONING_SYSTEM_INSTRUCTION }]
    },
    generationConfig: {
      temperature: 0.2,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 4096
    }
  };

  let lastError = null;

  for (const modelName of candidateModels) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (replyText) {
          return replyText;
        }
      } else {
        const errData = await response.json().catch(() => ({}));
        const msg = errData.error?.message || response.statusText;
        
        // Handle Invalid Authentication Credentials specifically
        if (msg.includes('invalid authentication credentials') || msg.includes('API key not valid') || response.status === 400 || response.status === 401) {
          throw new Error(`שגיאת אימות בגוגל (API Key לא תקין או פג תוקף).\nאנא ודא שהמפתח מ-Google AI Studio הועתק כראוי: https://aistudio.google.com/app/apikey`);
        }

        // Handle Depleted Prepay Credits error specifically
        if (msg.includes('prepayment credits are depleted') || errData.error?.code === 429) {
          throw new Error('יתרת הקרדיט המוקדמת (Prepay) בגוגל טרם עודכנה במלואה או עומדת על 0.00 ₪. כדי להפעיל מיד: ודא שהקרדיט נטען לפרויקט שבו נוצר המפתח ב-https://ai.studio/projects, או העבר לשיטת Postpay.');
        }

        lastError = new Error(msg);
      }
    } catch (e) {
      if (e.message.includes('Google AI Studio') || e.message.includes('אימות') || e.message.includes('Prepay') || e.message.includes('קרדיט')) {
        throw e;
      }
      lastError = e;
    }
  }

  throw lastError || new Error('שגיאה בתקשורת עם שרתי Google Gemini.');
}

/**
 * Check for live legal & minimum wage updates in Israel using High Thinking
 */
export async function checkLiveLawUpdates() {
  const prompt = `
בצע סריקה מעמיקה וניתוח חוקי ברמת High Reasoning:
1. מהו שכר המינימום החוקי בישראל כיום לשנת 2026 עבור עובדים זרים בסיעוד?
2. מהם תעריפי דמי הבראה (418 ₪ ליום) וצבירת חופשות?
3. האם פורסמו הנחיות או תקנות חדשות מרשות האוכלוסין וההגירה או משרד העבודה בשנת 2026?
4. סכם תמצית מנהלים חדה עם המלצות מעשיות למעסיקה מור רויטל עבור ביג'ילי ג'וזף.
`;
  return await askGeminiAgent(prompt, [], 'high-thinking');
}
