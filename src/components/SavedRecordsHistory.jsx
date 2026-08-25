import React, { useState, useEffect } from 'react';
import { getSalaryRecords, deleteSalaryRecord } from '../services/dbService';
import { Database, Calendar, DollarSign, Trash2, Printer, ExternalLink, RefreshCw, FileText, CheckCircle2, Clock, Cloud, Layers, Download, Upload } from 'lucide-react';

export default function SavedRecordsHistory({ onLoadRecordToCalculator, onSelectTab }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterQuery, setFilterQuery] = useState('');
  const [statusMsg, setStatusMsg] = useState(null);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const data = await getSalaryRecords();
      setRecords(data || []);
    } catch (err) {
      console.error('Error fetching records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleDelete = async (id, monthLabel) => {
    if (window.confirm(`האם אתה בטוח שברצונך למחוק את רשומת השכר של חודש "${monthLabel || id}"?`)) {
      try {
        await deleteSalaryRecord(id);
        setStatusMsg({ type: 'success', text: `רשומת ${monthLabel || id} נמחקה בהצלחה.` });
        setRecords(prev => prev.filter(r => r.id !== id));
      } catch (e) {
        setStatusMsg({ type: 'error', text: 'שגיאה במחיקת הרשומה.' });
      }
    }
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(records, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `roze_salaries_backup_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filteredRecords = records.filter(r => {
    if (!filterQuery) return true;
    const query = filterQuery.toLowerCase();
    return (
      (r.monthYear && r.monthYear.toLowerCase().includes(query)) ||
      (r.workerName && r.workerName.toLowerCase().includes(query)) ||
      (r.notes && r.notes.toLowerCase().includes(query))
    );
  });

  // Calculate cumulative stats
  const totalNetPaid = records.reduce((sum, r) => sum + (Number(r.netWorkerSalary) || 0), 0);
  const totalEmployerCost = records.reduce((sum, r) => sum + (Number(r.totalEmployerMonthlyCost) || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header Banner */}
      <div className="glass-card" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(59, 130, 246, 0.15))', borderColor: 'var(--accent-emerald)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Database style={{ color: 'var(--accent-emerald)' }} size={28} />
              היסטוריית תשלומים ותלושי שכר (Firebase Cloud)
            </h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
              מעקב מרוכז אחר כל חישובי השכר החודשיים שנשמרו בענן, פירוט עלויות מעסיק, ימי שבת/חג ששולמו ותלושים להדפסה.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={fetchRecords} className="btn-secondary" disabled={loading} style={{ padding: '8px 14px' }}>
              <RefreshCw size={16} className={loading ? 'spin-anim' : ''} /> {loading ? 'מרענן...' : 'רענן נתונים'}
            </button>
            <button onClick={handleExportJSON} className="btn-secondary" style={{ padding: '8px 14px' }} title="ייצוא גיבוי לקובץ">
              <Download size={16} /> ייצוא JSON
            </button>
          </div>
        </div>
      </div>

      {/* Cumulative Stats Cards */}
      {records.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <div className="stat-card">
            <span className="stat-label">סך חודשים שמורים</span>
            <span className="stat-value" style={{ color: 'var(--accent-indigo)' }}>{records.length} חודשים</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">סה"כ נטו ששולם לעובדת</span>
            <span className="stat-value" style={{ color: 'var(--accent-emerald)' }}>₪{totalNetPaid.toLocaleString('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">סה"כ עלות מעסיק מצטברת</span>
            <span className="stat-value" style={{ color: 'var(--accent-amber)' }}>₪{totalEmployerCost.toLocaleString('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </div>
      )}

      {/* Status alert */}
      {statusMsg && (
        <div style={{
          padding: '12px 16px',
          borderRadius: '10px',
          background: statusMsg.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          border: statusMsg.type === 'success' ? '1px solid var(--accent-emerald)' : '1px solid var(--accent-rose)',
          color: statusMsg.type === 'success' ? 'var(--accent-emerald)' : 'var(--accent-rose)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.9rem'
        }}>
          <CheckCircle2 size={18} />
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Search / Filter bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <input 
          type="text" 
          placeholder="חפש לפי חודש (למשל: 2026-04) או הערות..." 
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          style={{ maxWidth: '340px', width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: '#fff' }}
        />
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          מציג {filteredRecords.length} מתוך {records.length} רשומות
        </span>
      </div>

      {/* Records Table / List */}
      {loading ? (
        <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <RefreshCw size={32} className="spin-anim" style={{ margin: '0 auto 12px auto', display: 'block', color: 'var(--accent-indigo)' }} />
          <span>טוען רשומות שכר מ-Firebase Cloud...</span>
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="glass-card" style={{ padding: '50px 20px', textAlign: 'center' }}>
          <FileText size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 16px auto', opacity: 0.5 }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>אין רשומות שכר שמורות עדיין</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '480px', margin: '0 auto 20px auto', fontSize: '0.9rem' }}>
            כדי לשמור חודש, היכנס ללשונית "מחשבון שכר ועלויות" ולחץ על כפתור <strong>"שמור חישוב לחודש זה בענן"</strong>.
          </p>
          <button onClick={() => onSelectTab && onSelectTab('calculator')} className="btn-primary" style={{ margin: '0 auto' }}>
            מעבר למחשבון שכר
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredRecords.map((rec) => {
            const dateDisplay = rec.updatedAt ? new Date(rec.updatedAt).toLocaleDateString('he-IL', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-';
            return (
              <div key={rec.id} className="glass-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', transition: 'transform 0.2s ease, border-color 0.2s ease' }}>
                
                {/* Left details */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '1.1rem' }}>
                    📅
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>
                        {rec.monthLabel || rec.monthYear || 'חודש ללא שם'}
                      </h4>
                      <span className="badge badge-indigo" style={{ fontSize: '0.75rem' }}>
                        {rec.monthYear}
                      </span>
                      {rec.mode === 'cloud' || rec.timestamp ? (
                        <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>
                          <Cloud size={12} /> מסונכרן בענן
                        </span>
                      ) : (
                        <span className="badge badge-amber" style={{ fontSize: '0.7rem' }}>
                          שמור מקומית
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '16px', marginTop: '6px', fontSize: '0.84rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                      <span>שבתות ששולמו: <strong style={{ color: 'var(--text-main)' }}>{rec.saturdaysCount ?? 0}</strong></span>
                      <span>חגים ששולמו: <strong style={{ color: 'var(--text-main)' }}>{rec.holidaysCount ?? 0}</strong></span>
                      <span>עודכן: {dateDisplay}</span>
                    </div>

                    {rec.notes && (
                      <div style={{ marginTop: '6px', fontSize: '0.82rem', color: 'var(--accent-amber)', fontStyle: 'italic' }}>
                        📝 {rec.notes}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right financial metrics & actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                  
                  {/* Financials pill */}
                  <div style={{ display: 'flex', gap: '12px', background: 'var(--bg-subcard)', padding: '10px 16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <div>
                      <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)' }}>נטו לתשלום</span>
                      <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                        ₪{Number(rec.netWorkerSalary || 0).toLocaleString('he-IL', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div style={{ width: '1px', background: 'var(--border-color)', margin: '0 4px' }} />
                    <div>
                      <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)' }}>עלות מעסיק</span>
                      <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--accent-amber)' }}>
                        ₪{Number(rec.totalEmployerMonthlyCost || 0).toLocaleString('he-IL', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => {
                        if (onLoadRecordToCalculator) onLoadRecordToCalculator(rec);
                        if (onSelectTab) onSelectTab('calculator');
                      }}
                      className="btn-primary"
                      style={{ padding: '8px 14px', fontSize: '0.85rem' }}
                      title="טען נתונים אלו למחשבון שכר"
                    >
                      <Layers size={16} /> טען למחשבון
                    </button>

                    <button 
                      onClick={() => {
                        if (onLoadRecordToCalculator) onLoadRecordToCalculator(rec);
                        if (onSelectTab) onSelectTab('report');
                      }}
                      className="btn-secondary"
                      style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                      title="צפה בתלוש שכר להדפסה"
                    >
                      <Printer size={16} />
                    </button>

                    <button 
                      onClick={() => handleDelete(rec.id, rec.monthLabel || rec.monthYear)}
                      className="btn-secondary"
                      style={{ padding: '8px 12px', color: 'var(--accent-rose)' }}
                      title="מחק רשומה זו"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
