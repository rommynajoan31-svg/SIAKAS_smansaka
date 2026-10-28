import React, { useState } from 'react';
import { 
  CalendarDays, 
  Plus, 
  Copy, 
  Archive, 
  CheckCircle2, 
  Clock, 
  BarChart2, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { DatabaseState, AcademicYear, WorkProgram } from '../../types';
import { ConfirmModal } from '../common/ConfirmModal';

interface TahunPelajaranModuleProps {
  state: DatabaseState;
  onUpdateState: (newState: DatabaseState) => void;
  onNavigate: (module: string) => void;
}

export const TahunPelajaranModule: React.FC<TahunPelajaranModuleProps> = ({
  state,
  onUpdateState,
  onNavigate,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [selectedSourceYear, setSelectedSourceYear] = useState('');
  const [selectedTargetYear, setSelectedTargetYear] = useState('');
  const [confirmArchiveId, setConfirmArchiveId] = useState<string | null>(null);

  // New Year Form
  const [newCode, setNewCode] = useState('');
  const [newStartDate, setNewStartDate] = useState('');
  const [newEndDate, setNewEndDate] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const activeYearCode = state.schoolProfile.activeAcademicYear;

  const handleSetActiveYear = (code: string) => {
    onUpdateState({
      ...state,
      schoolProfile: {
        ...state.schoolProfile,
        activeAcademicYear: code,
      },
      academicYears: state.academicYears.map(y => ({
        ...y,
        status: y.code === code ? 'Aktif' : (y.status === 'Aktif' ? 'Diarsipkan' : y.status),
      })),
    });
  };

  const handleSetSemester = (semester: 'Ganjil' | 'Genap') => {
    onUpdateState({
      ...state,
      schoolProfile: {
        ...state.schoolProfile,
        activeSemester: semester,
      },
      academicYears: state.academicYears.map(y => 
        y.code === activeYearCode ? { ...y, activeSemester: semester } : y
      ),
    });
  };

  const handleCreateYear = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;

    const newYearObj: AcademicYear = {
      id: 'ay-' + Date.now(),
      code: newCode.trim(),
      label: `Tahun Pelajaran ${newCode.trim()}`,
      status: 'Perencanaan',
      activeSemester: 'Ganjil',
      startDate: newStartDate || `${newCode.split('/')[0]}-07-13`,
      endDate: newEndDate || `${newCode.split('/')[1]}-06-25`,
      notes: newNotes || 'Tahun pelajaran baru dibuat.',
      createdAt: new Date().toISOString(),
    };

    onUpdateState({
      ...state,
      academicYears: [...state.academicYears, newYearObj],
    });

    setShowAddModal(false);
    setNewCode('');
    setNewStartDate('');
    setNewEndDate('');
    setNewNotes('');
  };

  const handleCopyPrograms = () => {
    if (!selectedSourceYear || !selectedTargetYear || selectedSourceYear === selectedTargetYear) {
      alert('Pilih tahun pelajaran asal dan tahun tujuan yang berbeda.');
      return;
    }

    const sourcePrograms = state.workPrograms.filter(p => p.academicYear === selectedSourceYear);
    if (sourcePrograms.length === 0) {
      alert(`Tidak ada program kerja pada tahun ${selectedSourceYear} untuk disalin.`);
      return;
    }

    const copiedPrograms: WorkProgram[] = sourcePrograms.map(p => ({
      ...p,
      id: 'prog-' + Math.random().toString(36).substring(2, 9),
      academicYear: selectedTargetYear,
      actualBudget: 0,
      status: 'Direncanakan',
      completenessStatus: 'Perlu Dilengkapi',
      evaluationNotes: `Disalin dari T.P. ${selectedSourceYear}. Silakan sesuaikan target dan anggaran sebelum digunakan.`,
      physicalProof: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    onUpdateState({
      ...state,
      workPrograms: [...state.workPrograms, ...copiedPrograms],
    });

    setShowCopyModal(false);
    alert(`Berhasil menyalin ${copiedPrograms.length} program kerja ke Tahun Pelajaran ${selectedTargetYear}!`);
  };

  const handleArchiveYear = () => {
    if (!confirmArchiveId) return;

    onUpdateState({
      ...state,
      academicYears: state.academicYears.map(y => 
        y.id === confirmArchiveId ? { ...y, status: 'Diarsipkan' } : y
      ),
    });

    setConfirmArchiveId(null);
  };

  // Comparison metrics between active year and previous year
  const yearsList = state.academicYears;

  return (
    <div className="space-y-6">
      {/* Header Module */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-blue-900" />
            <h2 className="text-lg font-bold text-slate-900">
              Modul Manajemen Tahun Pelajaran
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Kelola tahun pelajaran aktif, arsip tahun sebelumnya, salin program kerja, dan bandingkan target tahunan.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCopyModal(true)}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5 text-blue-900" />
            Salin Program Antar-Tahun
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Tambah Tahun Pelajaran
          </button>
        </div>
      </div>

      {/* Current Active Configuration Card */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-6 rounded-xl shadow-md border border-blue-800">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-amber-400 text-blue-950 uppercase">
              Tahun Berjalan
            </span>
            <h3 className="text-2xl font-black tracking-tight text-white mt-2">
              Tahun Pelajaran {activeYearCode}
            </h3>
            <p className="text-xs text-blue-200 mt-1">
              Data yang ditampilkan pada menu kesiswaan saat ini terhubung dengan tahun pelajaran ini.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-blue-950/60 p-3 rounded-xl border border-blue-800/80">
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-blue-300">Semester Aktif</p>
              <p className="text-base font-extrabold text-amber-300">Semester {state.schoolProfile.activeSemester}</p>
            </div>
            <div className="flex gap-1 bg-blue-900 p-1 rounded-lg">
              <button
                onClick={() => handleSetSemester('Ganjil')}
                className={`px-3 py-1 text-xs font-bold rounded cursor-pointer transition-colors ${
                  state.schoolProfile.activeSemester === 'Ganjil'
                    ? 'bg-amber-400 text-blue-950'
                    : 'text-blue-200 hover:text-white'
                }`}
              >
                Ganjil
              </button>
              <button
                onClick={() => handleSetSemester('Genap')}
                className={`px-3 py-1 text-xs font-bold rounded cursor-pointer transition-colors ${
                  state.schoolProfile.activeSemester === 'Genap'
                    ? 'bg-amber-400 text-blue-950'
                    : 'text-blue-200 hover:text-white'
                }`}
              >
                Genap
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* List of Academic Years Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {yearsList.map((ay) => {
          const isCurrent = ay.code === activeYearCode;
          const programCount = state.workPrograms.filter(p => p.academicYear === ay.code).length;
          const completedCount = state.workPrograms.filter(p => p.academicYear === ay.code && p.status === 'Selesai').length;
          const docCount = state.documents.filter(d => d.academicYear === ay.code).length;

          return (
            <div
              key={ay.id}
              className={`bg-white rounded-xl p-5 border transition-all ${
                isCurrent
                  ? 'border-blue-600 shadow-md ring-2 ring-blue-500/20'
                  : 'border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                  ay.status === 'Aktif' ? 'bg-emerald-100 text-emerald-800' :
                  ay.status === 'Diarsipkan' ? 'bg-purple-100 text-purple-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {ay.status}
                </span>

                {isCurrent && (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-blue-900">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Sedang Dipilih
                  </span>
                )}
              </div>

              <h3 className="text-lg font-bold text-slate-900">{ay.code}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{ay.notes}</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Periode: {ay.startDate} s.d. {ay.endDate}
              </p>

              <div className="my-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-slate-50 rounded-lg">
                  <span className="text-[10px] text-slate-500 block">Program Kerja</span>
                  <span className="font-bold text-slate-900">{programCount} ({completedCount} selesai)</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg">
                  <span className="text-[10px] text-slate-500 block">Dokumen Arsip</span>
                  <span className="font-bold text-slate-900">{docCount} berkas</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                {!isCurrent && (
                  <button
                    onClick={() => handleSetActiveYear(ay.code)}
                    className="flex-1 py-1.5 text-xs font-bold text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer text-center"
                  >
                    Aktifkan Tahun Ini
                  </button>
                )}

                {ay.status !== 'Diarsipkan' && !isCurrent && (
                  <button
                    onClick={() => setConfirmArchiveId(ay.id)}
                    className="p-1.5 text-slate-400 hover:text-purple-700 hover:bg-purple-50 rounded-lg cursor-pointer"
                    title="Arsipkan Tahun Pelajaran Ini"
                  >
                    <Archive className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Cross-Year Comparison Table */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-blue-900" />
            <h3 className="text-sm font-bold text-slate-900">Komparasi Rencana & Realisasi Antar-Tahun Pelajaran</h3>
          </div>
          <span className="text-xs text-slate-500">Data Historis Permanen</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 font-bold border-y border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Tahun Pelajaran</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Total Program</th>
                <th className="py-2.5 px-3">Program Tuntas</th>
                <th className="py-2.5 px-3">Persentase Capaian</th>
                <th className="py-2.5 px-3">Rencana Anggaran</th>
                <th className="py-2.5 px-3">Realisasi Anggaran</th>
                <th className="py-2.5 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {yearsList.map((ay) => {
                const yrProgs = state.workPrograms.filter(p => p.academicYear === ay.code);
                const count = yrProgs.length;
                const done = yrProgs.filter(p => p.status === 'Selesai').length;
                const pct = count > 0 ? Math.round((done / count) * 100) : 0;
                const plannedBud = yrProgs.reduce((s, p) => s + p.plannedBudget, 0);
                const actualBud = yrProgs.reduce((s, p) => s + p.actualBudget, 0);

                return (
                  <tr key={ay.id} className={ay.code === activeYearCode ? 'bg-blue-50/50' : 'hover:bg-slate-50'}>
                    <td className="py-3 px-3 font-bold text-slate-900">
                      {ay.code} {ay.code === activeYearCode && <span className="text-[10px] text-blue-700">(Aktif)</span>}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-slate-100 text-slate-700">
                        {ay.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold">{count}</td>
                    <td className="py-3 px-3 text-emerald-700 font-semibold">{done}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-blue-900 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="font-bold text-slate-700">{pct}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">Rp {plannedBud.toLocaleString('id-ID')}</td>
                    <td className="py-3 px-3 font-semibold text-slate-900">Rp {actualBud.toLocaleString('id-ID')}</td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => { handleSetActiveYear(ay.code); onNavigate('program-kerja'); }}
                        className="text-xs font-semibold text-blue-900 hover:underline cursor-pointer"
                      >
                        Buka Program →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Tambah Tahun Pelajaran Baru */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in">
            <form onSubmit={handleCreateYear}>
              <div className="p-5 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">Tambah Tahun Pelajaran Baru</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tahun baru akan dibuat dalam status perencanaan tanpa mengubah data tahun aktif saat ini.
                </p>
              </div>

              <div className="p-5 space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kode Tahun Pelajaran (Contoh: 2027/2028) *</label>
                  <input
                    type="text"
                    required
                    placeholder="2027/2028"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-900 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Tanggal Mulai</label>
                    <input
                      type="date"
                      value={newStartDate}
                      onChange={(e) => setNewStartDate(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Tanggal Selesai</label>
                    <input
                      type="date"
                      value={newEndDate}
                      onChange={(e) => setNewEndDate(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Catatan / Kebijakan Khusus</label>
                  <textarea
                    rows={2}
                    placeholder="Contoh: Fokus implementasi Kurikulum Nasional dan pembinaan sanggar kolintang"
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-lg cursor-pointer shadow-xs"
                >
                  Simpan Tahun Pelajaran
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Salin Program Antar-Tahun */}
      {showCopyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in">
            <div className="p-5 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Salin Program Kerja Antar-Tahun</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Salin seluruh matriks program kerja dari tahun sebelumnya ke tahun baru. Data realisasi dan evaluasi akan direset agar siap digunakan kembali.
              </p>
            </div>

            <div className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tahun Asal (Sumber Program):</label>
                <select
                  value={selectedSourceYear}
                  onChange={(e) => setSelectedSourceYear(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none"
                >
                  <option value="">-- Pilih Tahun Asal --</option>
                  {yearsList.map(y => (
                    <option key={y.id} value={y.code}>{y.code} ({y.status})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tahun Tujuan (Target Penerima):</label>
                <select
                  value={selectedTargetYear}
                  onChange={(e) => setSelectedTargetYear(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none"
                >
                  <option value="">-- Pilih Tahun Tujuan --</option>
                  {yearsList.map(y => (
                    <option key={y.id} value={y.code}>{y.code} ({y.status})</option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
                <AlertCircle className="w-4 h-4 text-amber-600 inline mr-1 -mt-0.5" />
                Program yang disalin berstatus "Direncanakan" dan realisasi anggaran dimulai dari Rp 0. Dokumen tahun asal tetap utuh dan tersimpan secara permanen.
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCopyModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-lg cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleCopyPrograms}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-lg cursor-pointer shadow-xs"
              >
                Salin Struktur Program
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Archive Modal */}
      <ConfirmModal
        isOpen={!!confirmArchiveId}
        title="Arsipkan Tahun Pelajaran?"
        message="Tahun pelajaran ini akan diarsipkan. Seluruh arsip dokumen, program kerja, dan laporan tetap tersimpan dan dapat dibuka kembali kapan saja."
        confirmText="Arsipkan Sekarang"
        onConfirm={handleArchiveYear}
        onCancel={() => setConfirmArchiveId(null)}
      />
    </div>
  );
};
