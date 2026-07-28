// Contract & Caregiver Information extracted from user documents
export const CONTRACT_DATA = {
  caregiver: {
    fullName: "Bijili Joseph",
    hebName: "ביג'ילי ג'וזף",
    passportNumber: "AK578266",
    countryOfOrigin: "הודו (India)",
    dateOfBirth: "14/10/1988",
    placementDate: "20/07/2026",
    visaType: "עובד זר בסיעוד (ב-1)",
    workPermitValidUntil: "31/05/2030",
    permitNumber: "46137071"
  },
  employer: {
    fullName: "מור רויטל (Mor Rvital)",
    idNumber: "027922814",
    address: "השלושה 16, פתח תקווה",
    relationship: "מטופלת / מעסיקה"
  },
  agency: {
    name: "איתני מור מטפלים סיעודיים בע\"מ",
    licenseNumber: "8146",
    companyId: "513994640",
    address: "הירקון 76, תל אביב",
    phone: "073-2509000",
    fax: "03-5162107",
    placementFee: 2000, // 2000 ILS incl VAT
    annualRegistrationFee: 840, // 70 ILS / month
    agreementPeriod: "22/07/2026 עד 22/07/2027"
  },
  agreedRates: {
    saturdayExtraRate: 400, // 400 ILS per Saturday worked
    holidayExtraRate: 400,  // 400 ILS per Holiday worked
    defaultSaturdaysPerMonth: 1, // User agreed on 1 Saturday per month
    legalHolidaysQuota: 9   // Entitled to 9 paid holidays per year by Israeli law
  }
};
