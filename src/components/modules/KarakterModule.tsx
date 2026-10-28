import React, { useState } from 'react';
import {
  HeartHandshake,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Plus,
  Users,
  AlertTriangle,
  BookOpen,
  Sparkles,
  Printer
} from 'lucide-react';
import { DatabaseState, CharacterCultureRecord } from '../../types';

interface KarakterModuleProps {
  state: DatabaseState;
  onUpdateState: (newState: DatabaseState) => void;
  onNavigate: (module: string) => void;
}

export const KarakterModule: React.FC<KarakterModuleProps> = ({
  state,
  onUpdateState,
  onNavigate,
}) => {
  const currentAcademicYear = state.schoolProfile.activeAcademicYear;

  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState<Partial<CharacterCultureRecord>>({
    programTitle: '',
    category: '7 Kebiasaan Anak Indonesia Hebat',
    date: new Date().toISOString().slice(0, 10),
    targetGroup: 'Seluruh Siswa SMA Negeri 1 Kakas',
    participantCount: 485,
    notes: '',
    followUpAction: '',
    coordinator: state.schoolProfile.vicePrincipalStudentAffairs,
    status: 'Terlaksana',
  });

  const records = state.characterRecords.filter(r => r.academicYear === currentAcademicYear);

  // The 7 Habits of Great Indonesian Children (7 Kebiasaan Anak Indonesia Hebat)
  const tujuhKebiasaan = [
    { num: 1, title: 'Bangun Pagi', desc: 'Membiasakan bangun sebelum fajar untuk mempersiapkan diri dan ibadah pagi dengan bugar.' },
    { num: 2, title: 'Beribadah Khidmat', desc: 'Menjalankan kewajiban agama dan berdoa sebelum maupun sesudah memulai pembelajaran.' },
    { num: 3, title: 'Berolahraga Teratur', desc: 'Senam kesegaran jasmani dan pembinaan fisik minimal 30 menit setiap pekan.' },
    { num: 4, title: 'Makan Makanan Sehat', desc: 'Konsumsi gizi seimbang, membawa bekal higienis, dan mengurangi konsumsi makanan cepat saji.' },
    { num: 5, title: 'Gemar Membaca & Literasi', desc: 'Membaca buku non-pelajaran 15 menit sebelum jam belajar pertama di pojok baca kelas.' },
    { num: 6, title: 'Bermasyarakat & Peduli', desc: 'Gotong royong membersihkan kelas, ramah kepada warga sekitar, dan santun bertutur kata.' },
    { num: 7, title: 'Istirahat & Tidur Cukup', desc: 'Menghindari begadang demi kesehatan mental, fokus belajar, dan daya tahan tubuh prima.' },
  ];

  const handleSaveRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.programTitle?.trim()) return;

    const newRec: CharacterCultureRecord = {
      id: 'char-' + Date.now(),
      academicYear: currentAcademicYear,
      semester: state.schoolProfile.activeSemester,
      programTitle: formData.programTitle || '',
      category: formData.category as any,
      date: formData.date || new Date().toISOString().slice(0, 10),
      targetGroup: formData.targetGroup || 'Data Agregat Pembinaan',
      participantCount: Number(formData.participantCount) || 1,
      notes: formData.notes || '',
      followUpAction: formData.followUpAction || '',
      coordinator: formData.coordinator || state.schoolProfile.vicePrincipalStudentAffairs,
      status: formData.status as any,
    };

    onUpdateState({
      ...state,
      characterRecords: [newRec, ...state.characterRecords],
    });

    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-blue-900" />
            <h2 className="text-lg font-bold text-slate-900">
              Modul Kedisiplinan, Karakter, dan Budaya Sekolah
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Berorientasi pada pembinaan positif, 7 Kebiasaan Anak Indonesia Hebat, Sekolah Ramah Anak, dan pencegahan kekerasan (TPPK).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('generator-ai')}
            className="px-3.5 py-2 text-xs font-bold text-blue-950 bg-amber-400 hover:bg-amber-500 rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-900" />
            Draf Tata Tertib & Komitmen
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Catat Program Pembinaan
          </button>
        </div>
      </div>

      {/* Ethical Governance & Data Privacy Banner (Strict Mandate from Section J & M) */}
      <div className="bg-slate-900 text-white p-5 rounded-xl border border-slate-800 shadow-xs space-y-2">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wide">
          <Lock className="w-4 h-4" />
          <span>Prinsip Perlindungan Privasi & Pendekatan Restoratif</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed font-sans">
          Sesuai ketentuan Permendikbudristek No. 46 Tahun 2023 dan pedoman etika kesiswaan, sistem SIAKAS <strong className="text-white">tidak membuat papan peringkat pelanggaran atau mempermalukan peserta didik</strong>. Seluruh laporan bersifat agregat dan anonymized. Pendekatan pembinaan mengedepankan bimbingan konseling restoratif bersama Guru BK, Wali Kelas, dan Kepala Sekolah tanpa kekerasan fisik maupun sanksi diskriminatif.
        </p>
      </div>

      {/* 7 Kebiasaan Anak Indonesia Hebat Grid */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Gerakan 7 Kebiasaan Anak Indonesia Hebat
            </h3>
            <p className="text-xs text-slate-500">
              Program pembiasaan karakter positif setiap hari di SMA Negeri 1 Kakas
            </p>
          </div>
          <span className="px-3 py-1 bg-amber-100 text-amber-900 font-bold text-xs rounded-full">
            Karakter Pelajar Pancasila
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {tujuhKebiasaan.map((k) => (
            <div key={k.num} className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5 hover:bg-blue-50/50 transition-colors">
              <div className="w-6 h-6 rounded-full bg-blue-900 text-white font-bold text-xs flex items-center justify-center">
                {k.num}
              </div>
              <h4 className="text-xs font-bold text-slate-900">{k.title}</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">{k.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Program Pembinaan & TPPK Records */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center text-xs">
          <span className="font-bold text-slate-900">Rekapitulasi Program Pembinaan Karakter & Sekolah Ramah Anak</span>
          <span className="text-slate-500">Data Agregat Terverifikasi</span>
        </div>

        <div className="divide-y divide-slate-100">
          {records.map((rec) => (
            <div key={rec.id} className="p-5 hover:bg-slate-50 transition-colors space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-900">
                    {rec.category}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">{rec.programTitle}</h4>
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  {rec.date} • Koordinator: {rec.coordinator}
                </span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed font-sans">{rec.notes}</p>

              <div className="p-3 bg-blue-50/70 rounded-lg text-xs space-y-1 border border-blue-100">
                <span className="font-bold text-blue-900 text-[11px]">Tindak Lanjut & Dampak Positif:</span>
                <p className="text-slate-700 text-[11px]">{rec.followUpAction}</p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>Sasaran Partisipan: {rec.targetGroup} ({rec.participantCount} orang)</span>
                <span className="font-semibold text-emerald-700">Status: {rec.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Add Character Record */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-lg w-full shadow-2xl border border-slate-200 p-5 space-y-3.5 text-xs animate-in fade-in max-h-[90vh] overflow-y-auto">
            <h3 className="text-sm font-bold text-slate-900">Catat Program / Bimbingan Karakter Baru</h3>
            <form onSubmit={handleSaveRecord} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Program / Kegiatan Pembinaan *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Sosialisasi Anti Perundungan Bersama Babinsa & Polsek Kakas"
                  value={formData.programTitle}
                  onChange={(e) => setFormData({ ...formData, programTitle: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Kategori Program</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                >
                  <option value="7 Kebiasaan Anak Indonesia Hebat">7 Kebiasaan Anak Indonesia Hebat</option>
                  <option value="Penguatan Karakter Pancasila">Penguatan Karakter Pancasila</option>
                  <option value="Pencegahan Perundungan (TPPK)">Pencegahan Perundungan (TPPK)</option>
                  <option value="Sekolah Ramah Anak">Sekolah Ramah Anak</option>
                  <option value="Konsultasi Bimbingan & Restoratif">Konsultasi Bimbingan & Restoratif</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tanggal</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jumlah Siswa Terlibat</label>
                  <input
                    type="number"
                    value={formData.participantCount}
                    onChange={(e) => setFormData({ ...formData, participantCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Sasaran / Kelompok Peserta (Data Agregat)</label>
                <input
                  type="text"
                  placeholder="Contoh: Seluruh Siswa Kelas X atau Data Agregat Kelas XI"
                  value={formData.targetGroup}
                  onChange={(e) => setFormData({ ...formData, targetGroup: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Uraian Pelaksanaan & Observasi</label>
                <textarea
                  rows={2}
                  placeholder="Catatan pelaksanaan, respon siswa, dan metode pembinaan positif..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Rencana Tindak Lanjut & Evaluasi</label>
                <textarea
                  rows={2}
                  placeholder="Pendampingan lanjutan, koordinasi orang tua, atau penguatan pembiasaan..."
                  value={formData.followUpAction}
                  onChange={(e) => setFormData({ ...formData, followUpAction: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-lg cursor-pointer"
                >
                  Simpan Catatan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
