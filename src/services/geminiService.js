import { LEGAL_RULES } from '../data/legalRules';
import { CONTRACT_DATA } from '../data/contractData';

const STORAGE_KEY = 'roze_gemini_api_key';

// Get Gemini API Key from localStorage or environment
export function getGeminiApiKey() {
  return localStorage.getItem(STORAGE_KEY) || import.meta.env.VITE_GEMINI_API_KEY || '';
}

// Save Gemini API Key
export function saveGeminiApiKey(key) {
  if (key) {
    localStorage.setItem(STORAGE_KEY, key.trim());
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

// Comprehensive System Prompt tailored specifically to Bijili Joseph's contract & Israeli Labor Law
const SYSTEM_INSTRUCTION = `
אתה סוכן בינה מלאכותית מומחה ויועץ משפטי בכיר לדיני עבודה ועובדים זרים בענף הסיעוד בישראל.
תפקידך לסייע למעסיקה (מור רויטל) לנהל את כל זכויותיה, שכרה וחובותיה של המטפלת הסיעודית שלה (ביג'ילי ג'וזף).

פרטי העובדת וההסכם:
- שם העובדת: ביג'ילי ג'וזף (Bijili Joseph), אזרחית הודו.
- שם המעסיקה: מור רויטל (Mor Rvital).
- תאריך תחילת עבודה (השמה): 20/07/2026 (20 ביולי 2026).
- שכר חודשי ברוטו מוסכם (הסכם 2026): 6,443.85 ₪ (כולל 100 ₪ דמי כיס שבועיים / כ-433 ₪ בחודש).
- שכר מינימום בסיס במשק (2026): 5,880.02 ₪.
- תוספת עבור עבודה בשבת (מנוחה שבועית - 25 שעות): 440.00 ₪ לשבת (מעודכן לפי מסמך אפריל 2026 של תאגיד "איתני מור").
- תוספת עבור עבודה ביום חג נבחר: 440.00 ₪ ליום חג.
- מכסת ימי חג לשנת 2026 (חישוב יחסי מיולי 2026): 4 ימי חג בלבד (מתוך 9 שנתיים). משנת 2027: 9 ימי חג מלאים.
- צבירת ימי חופשה שנתית: 14 ימים בשנה (1.166 ימים לכל חודש עבודה).
- שווי כספי של יום חופשה לפדיון: 257.75 ₪ ליום (ברוטו 6,443.85 חלקי 25).
- דמי הבראה: 418.00 ₪ ליום (שנה 1: 5 ימים = 2,090 ₪, שנים 2-3: 6 ימים = 2,508 ₪). הזכאות נצברת ומשולמת רק לאחר השלמת שנת עבודה מלאה (20/07/2027).
- הפרשות סוציאליות מעסיק: פנסיה גמולים 6.5% משכר מינימום (382.20 ₪), פיצויי פיטורין 8.33% משכר ברוטו (536.77 ₪) או 6.0% בהתפטרות.
- ביטוח לאומי מעסיק: 3.6% משכר ברוטו (231.98 ₪).
- ניכויים מותרים משכר העובדת:
  1. ביטוח בריאות פרטי: עד מחצית מהעלות ועד מקסימום חוקי של 154.20 ₪.
  2. מגורים וחשבונות: מוסכם 300.00 ₪ (תקרה בחוק ~446.50 ₪).
  3. חלק עובדת לפנסיה: 6% משכר מינימום = 352.80 ₪ (מופקד לקופתה).
  4. דמי כיס שבועיים: 100 ₪ בשבוע שמקוזזים מהנטו החודשי.
- תאגיד סיעוד: "איתני מור" (דמי טיפול חודשיים: 70 ₪).

הנחיות לתשובות:
1. ענה תמיד בעברית ברורה, מקצועית, אדיבה וקולחת.
2. בסס את כל התשובות על החוקים המעודכנים בישראל (חוק עובדים זרים, צווי הרחבה לפנסיה והבראה, הנחיות רשות האוכלוסין וההגירה).
3. שלב חישובים מספריים מדויקים כשהשאלה נוגעת לכסף, ימי חופש או תשלומים.
4. השתמש בעיצוב Markdown נקי, הדגשות, טבלאות קצרות ואימוג'יס להקלת הקריאה.
5. תמיד הדגש את ההבדל בין חובה חוקית לבין זכות מעסיק.
`;

/**
 * Send query to Google Gemini API
 */
export async function askGeminiAgent(userMessage, chatHistory = []) {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error('לא נמצא מפתח Google Gemini API. אנא הגדר את המפתח בהגדרות.');
  }

  // Format contents array including previous conversation
  const formattedContents = [];

  // Add past conversation turns
  chatHistory.slice(-8).forEach((msg) => {
    formattedContents.push({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    });
  });

  // Add current message
  formattedContents.push({
    role: 'user',
    parts: [{ text: userMessage }]
  });

  // Call Gemini 2.0 Flash (or 1.5 Flash fallback)
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const payload = {
    contents: formattedContents,
    systemInstruction: {
      parts: [{ text: SYSTEM_INSTRUCTION }]
    },
    generationConfig: {
      temperature: 0.3,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 2048,
    }
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const errMsg = errData.error?.message || response.statusText;
      throw new Error(`שגיאה מ-Google Gemini API (${response.status}): ${errMsg}`);
    }

    const data = await response.json();
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!replyText) {
      throw new Error('התקבלה תשובה ריקה מ-Gemini.');
    }

    return replyText;
  } catch (error) {
    // If 2.0-flash failed with 404, fallback to 1.5-flash
    if (error.message.includes('404') || error.message.includes('not found')) {
      const fallbackEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      const fbResponse = await fetch(fallbackEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (fbResponse.ok) {
        const fbData = await fbResponse.json();
        return fbData.candidates?.[0]?.content?.parts?.[0]?.text || 'התקבלה תשובה ללא תוכן.';
      }
    }
    throw error;
  }
}

/**
 * Check for live legal & minimum wage updates in Israel
 */
export async function checkLiveLawUpdates() {
  const prompt = `
בצע סריקה ובדיקה עדכנית:
1. מהו שכר המינימום החוקי בישראל כיום לשנת 2026?
2. מהם תעריפי דמי הבראה לעובדים זרים בסיעוד כיום (418 ₪ ליום)?
3. האם פורסמו לאחרונה עדכונים, פסיקות או הנחיות חדשות של רשות האוכלוסין וההגירה או משרד העבודה הנוגעות להעסקת עובדים זרים בסיעוד?
4. תן תמצית מנהלים קצרה של המצב החוקי העדכני.
`;
  return await askGeminiAgent(prompt, []);
}
