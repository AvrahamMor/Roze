import { db, isConfigured, initFirebase } from '../firebase/config';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  deleteDoc, 
  query, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';

const LOCAL_STORAGE_SALARIES_KEY = 'roze_local_salary_records';
const LOCAL_STORAGE_HOLIDAYS_KEY = 'roze_local_holiday_selections';
const LOCAL_STORAGE_RESERVE_KEY = 'roze_local_reserve_fund';

// --- SALARY RECORDS (חישובי שכר חודשיים) ---

export async function saveSalaryRecord(record) {
  const currentDb = db || initFirebase().db;
  const enrichedRecord = {
    ...record,
    updatedAt: new Date().toISOString(),
    id: record.monthYear || `record_${Date.now()}`
  };

  // 1. Always save to LocalStorage for instant UI access and backup
  try {
    const existing = getLocalSalaryRecords();
    const updated = [enrichedRecord, ...existing.filter(r => r.id !== enrichedRecord.id)];
    localStorage.setItem(LOCAL_STORAGE_SALARIES_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save to local storage', e);
  }

  // 2. Save to Firestore if configured
  if (currentDb) {
    try {
      const docRef = doc(currentDb, 'salary_records', enrichedRecord.id);
      await setDoc(docRef, {
        ...enrichedRecord,
        timestamp: serverTimestamp()
      }, { merge: true });
      return { success: true, mode: 'cloud', record: enrichedRecord };
    } catch (error) {
      console.warn('Firestore save failed, saved locally instead:', error);
      return { success: true, mode: 'local_fallback', record: enrichedRecord, warning: error.message };
    }
  }

  return { success: true, mode: 'local', record: enrichedRecord };
}

export async function getSalaryRecords() {
  const currentDb = db || initFirebase().db;
  
  if (currentDb) {
    try {
      const colRef = collection(currentDb, 'salary_records');
      const q = query(colRef);
      const snapshot = await getDocs(q);
      
      const records = [];
      snapshot.forEach((docSnap) => {
        records.push({ id: docSnap.id, ...docSnap.data() });
      });

      // Sort by monthYear descending or updatedAt descending
      records.sort((a, b) => (b.monthYear || '').localeCompare(a.monthYear || '') || (b.updatedAt || '').localeCompare(a.updatedAt || ''));
      
      // Update local storage backup
      if (records.length > 0) {
        localStorage.setItem(LOCAL_STORAGE_SALARIES_KEY, JSON.stringify(records));
      }
      return records;
    } catch (error) {
      console.warn('Firestore fetch failed, loading from local storage:', error);
    }
  }

  return getLocalSalaryRecords();
}

export async function deleteSalaryRecord(recordId) {
  const currentDb = db || initFirebase().db;

  // 1. Remove from local storage
  try {
    const existing = getLocalSalaryRecords();
    const filtered = existing.filter(r => r.id !== recordId);
    localStorage.setItem(LOCAL_STORAGE_SALARIES_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error('Local delete failed', e);
  }

  // 2. Remove from Firestore
  if (currentDb) {
    try {
      const docRef = doc(currentDb, 'salary_records', recordId);
      await deleteDoc(docRef);
      return { success: true, mode: 'cloud' };
    } catch (error) {
      console.warn('Firestore delete failed:', error);
      return { success: true, mode: 'local_only', warning: error.message };
    }
  }

  return { success: true, mode: 'local' };
}

function getLocalSalaryRecords() {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_SALARIES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

// --- HOLIDAY SELECTIONS (סימוני חגים וימי עבודה) ---

export async function saveHolidaySelections(selections) {
  const currentDb = db || initFirebase().db;
  
  // Local storage save
  try {
    localStorage.setItem(LOCAL_STORAGE_HOLIDAYS_KEY, JSON.stringify(selections));
  } catch (e) {
    console.error('Local holiday save failed', e);
  }

  if (currentDb) {
    try {
      const docRef = doc(currentDb, 'app_settings', 'holiday_selections');
      await setDoc(docRef, {
        selections,
        updatedAt: serverTimestamp()
      }, { merge: true });
      return { success: true, mode: 'cloud' };
    } catch (error) {
      console.warn('Firestore holiday save failed:', error);
      return { success: true, mode: 'local' };
    }
  }

  return { success: true, mode: 'local' };
}

export async function getHolidaySelections() {
  const currentDb = db || initFirebase().db;

  if (currentDb) {
    try {
      const docRef = doc(currentDb, 'app_settings', 'holiday_selections');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && docSnap.data().selections) {
        const cloudSelections = docSnap.data().selections;
        localStorage.setItem(LOCAL_STORAGE_HOLIDAYS_KEY, JSON.stringify(cloudSelections));
        return cloudSelections;
      }
    } catch (error) {
      console.warn('Firestore holiday fetch failed, loading local:', error);
    }
  }

  try {
    const local = localStorage.getItem(LOCAL_STORAGE_HOLIDAYS_KEY);
    return local ? JSON.parse(local) : {};
  } catch (e) {
    return {};
  }
}

// --- RESERVE FUND (קופת עתודה - מעקב הפקדות) ---

export async function saveReserveFundData(data) {
  const currentDb = db || initFirebase().db;

  try {
    localStorage.setItem(LOCAL_STORAGE_RESERVE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Local reserve save failed', e);
  }

  if (currentDb) {
    try {
      const docRef = doc(currentDb, 'app_settings', 'reserve_fund');
      await setDoc(docRef, {
        data,
        updatedAt: serverTimestamp()
      }, { merge: true });
      return { success: true, mode: 'cloud' };
    } catch (error) {
      console.warn('Firestore reserve save failed:', error);
      return { success: true, mode: 'local' };
    }
  }

  return { success: true, mode: 'local' };
}

export async function getReserveFundData() {
  const currentDb = db || initFirebase().db;

  if (currentDb) {
    try {
      const docRef = doc(currentDb, 'app_settings', 'reserve_fund');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && docSnap.data().data) {
        return docSnap.data().data;
      }
    } catch (error) {
      console.warn('Firestore reserve fetch failed:', error);
    }
  }

  try {
    const local = localStorage.getItem(LOCAL_STORAGE_RESERVE_KEY);
    return local ? JSON.parse(local) : null;
  } catch (e) {
    return null;
  }
}

// --- TEST & DIAGNOSTICS ---

export async function testFirebaseConnection() {
  const { db: currentDb, isConfigured: configured } = initFirebase();
  if (!configured || !currentDb) {
    return { 
      success: false, 
      message: 'טרם הוגדרו פרטי חיבור תקינים (API Key ו-Project ID).' 
    };
  }

  try {
    // Attempt writing and reading a test ping document
    const pingRef = doc(currentDb, 'app_settings', '_ping_test');
    await setDoc(pingRef, { 
      pingAt: serverTimestamp(), 
      testMessage: 'חיבור Firebase Firestore תקין!' 
    });
    const snap = await getDoc(pingRef);
    if (snap.exists()) {
      return { 
        success: true, 
        message: 'החיבור ל-Firebase Cloud Firestore פעיל ומסונכרן בהצלחה!' 
      };
    }
    return { success: false, message: 'המסמך לא נקרא בחזרה מ-Firestore.' };
  } catch (error) {
    return { 
      success: false, 
      message: `שגיאת תקשורת עם Firestore: ${error.message}` 
    };
  }
}
