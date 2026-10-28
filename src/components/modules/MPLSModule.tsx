import React, { useState } from 'react';
import {
  UserCheck2,
  Calendar,
  Users,
  ShieldCheck,
  FileText,
  Printer,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Award,
  BookOpen
} from 'lucide-react';
import { DatabaseState, MPLSData, MPLSSession } from '../../types';
import { KopSurat } from '../common/KopSurat';

interface MPLSModuleProps {
  state: DatabaseState;
  onUpdateState: (newState: DatabaseState) => void;
  onNavigate: (module: string) => void;
}

export const MPLSModule: React.FC<MPLSModuleProps> = ({
  state,
  onUpdateState,
  onNavigate,
}) => {
  const currentAcademicYear = state.schoolProfile.activeAcademicYear;
  const mpls = state.mplsData;

  const [activeTab, setActiveTab] = useState<'jadwal' | 'panitia' | 'materi' | 'evaluasi'>('jadwal');
  const [showAddSession, setShowAddSession] = useState(false);

  // New session state
  const [newTopic, setNewTopic] = useState('');
  const [newSpeaker, setNewSpeaker] = useState('');
  const [newDay, setNewDay] = useState('Hari ke-1');
  const [newTime, setNewTime] = useState('08.00 - 10.00 WITA');
  const [newLocation, setNewLocation] = useState('Aula SMAN 1 Kakas');
  const [newCategory, setNewCategory] = useState<MPLSSession['category']>('Budaya Aman & Nyaman');

  const handleAddSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopic.trim()) return;

    const newSess: MPLSSession = {
      id: 'mpls-s-' + Date.now(),
      day: newDay,
      date: '2026-07-16',
      time: newTime,
      topic: newTopic,
      speaker: newSpeaker,
      location: newLocation,
      category: newCategory,
    };

    onUpdateState({
      ...state,
      mplsData: {
        ...mpls,
        sessions: [...mpls.sessions, newSess],
      },
    });

    setShowAddSession(false);
    setNewTopic('');
    setNewSpeaker('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <UserCheck2 className="w-5 h-5 text-blue-900" />
            <h2 className="text-lg font-bold text-slate-900">
              Modul Masa Pengenalan Lingkungan Satuan Pendidikan (MPLS)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Penyelenggaraan MPLS Ramah Anak Tahun Pelajaran <span className="font-semibold text-slate-800">{mpls.academicYear}</span> sesuai Permendikbudristek No. 46 Tahun 2023.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('generator-ai')}
            className="px-3.5 py-2 text-xs font-bold text-blue-950 bg-amber-400 hover:bg-amber-500 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-900" />
            Draf SK Panitia MPLS
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Cetak Laporan MPLS
          </button>
        </div>
      </div>

      {/* Summary Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white p-6 rounded-xl shadow-md border border-blue-800">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-400 text-blue-950 uppercase">
              Status: {mpls.status}
            </span>
            <h3 className="text-xl font-black text-white">
              "{mpls.theme}"
            </h3>
            <p className="text-xs text-blue-200">
              Waktu: {mpls.dateStart} s.d. {mpls.dateEnd} • Kampus SMA Negeri 1 Kakas
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center bg-blue-950/60 p-3 rounded-xl border border-blue-800/80">
            <div>
              <p className="text-[10px] uppercase font-bold text-blue-300">Total Siswa Baru</p>
              <p className="text-xl font-black text-amber-300">{mpls.participantCount}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-blue-300">Laki-Laki</p>
              <p className="text-xl font-black text-white">{mpls.maleParticipants}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-blue-300">Perempuan</p>
              <p className="text-xl font-black text-white">{mpls.femaleParticipants}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Anti-Violence Guarantee Notice */}
      <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between gap-3 text-xs text-emerald-900">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div>
            <h4 className="font-bold">Komitmen Zona Satuan Pendidikan Ramah Anak & Bebas Kekerasan</h4>
            <p className="text-[11px] text-emerald-800 mt-0.5">
              MPLS SMAN 1 Kakas dilaksanakan tanpa unsur perpeloncoan, tugas yang membebani fisik, atau senioritas. Terintegrasi dengan Tim Pencegahan dan Penanganan Kekerasan (TPPK).
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-block px-2.5 py-1 text-[10px] font-bold bg-emerald-200 text-emerald-900 rounded-md">
          100% Edukatif
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 text-xs font-bold">
        <button
          onClick={() => setActiveTab('jadwal')}
          className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'jadwal' ? 'border-blue-900 text-blue-900' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Jadwal & Sesi Materi ({mpls.sessions.length})
        </button>
        <button
          onClick={() => setActiveTab('panitia')}
          className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'panitia' ? 'border-blue-900 text-blue-900' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Susunan Panitia ({mpls.committeeList.length})
        </button>
        <button
          onClick={() => setActiveTab('materi')}
          className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'materi' ? 'border-blue-900 text-blue-900' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Materi Budaya Sekolah ({mpls.materials.length})
        </button>
        <button
          onClick={() => setActiveTab('evaluasi')}
          className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'evaluasi' ? 'border-blue-900 text-blue-900' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Ringkasan Evaluasi & LPJ
        </button>
      </div>

      {/* Tab 1: Jadwal */}
      {activeTab === 'jadwal' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-700">Agenda Sesi Pembekalan Siswa Baru:</span>
            <button
              onClick={() => setShowAddSession(true)}
              className="px-3 py-1.5 text-xs font-semibold text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-lg cursor-pointer"
            >
              + Tambah Sesi Materi
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
            {mpls.sessions.map((sess, idx) => (
              <div key={sess.id} className="p-4 flex flex-wrap items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-900">
                      {sess.day}
                    </span>
                    <span className="text-xs font-bold text-slate-900">{sess.topic}</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Narasumber: <span className="font-semibold text-slate-800">{sess.speaker}</span>
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Waktu: {sess.time} • Tempat: {sess.location} • Kategori: {sess.category}
                  </p>
                </div>

                <div className="text-right">
                  <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-slate-100 text-slate-700">
                    Sesi {idx + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Panitia */}
      {activeTab === 'panitia' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center text-xs">
            <span className="font-bold text-slate-900">Susunan Panitia MPLS SMAN 1 Kakas (Berdasarkan SK Kepala Sekolah)</span>
            <span className="text-slate-500">Ketua Panitia: {mpls.chairman}</span>
          </div>

          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4 w-12 text-center">No</th>
                <th className="py-2.5 px-4">Nama Lengkap & Gelar</th>
                <th className="py-2.5 px-4">Tugas / Peran</th>
                <th className="py-2.5 px-4">Divisi Kerja</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mpls.committeeList.map((c, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="py-3 px-4 text-center font-bold text-slate-500">{i + 1}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{c.name}</td>
                  <td className="py-3 px-4 font-semibold text-blue-900">{c.role}</td>
                  <td className="py-3 px-4 text-slate-600">{c.division}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Materi */}
      {activeTab === 'materi' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mpls.materials.map((m, i) => (
            <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                {m.category}
              </span>
              <h4 className="text-sm font-bold text-slate-900 leading-snug">{m.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{m.summary}</p>
              <p className="text-[11px] font-semibold text-slate-400 pt-2 border-t border-slate-100">
                Penyaji: {m.speaker}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Evaluasi & LPJ */}
      {activeTab === 'evaluasi' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4 text-xs font-sans">
          <h3 className="text-sm font-bold text-slate-900 uppercase border-b border-slate-200 pb-2">
            Ringkasan Evaluasi Pelaksanaan MPLS
          </h3>
          <p className="text-slate-700 leading-relaxed text-justify">
            {mpls.evaluationSummary}
          </p>

          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 space-y-2">
            <h4 className="font-bold text-blue-900">Tindak Lanjut Pembinaan Pasca-MPLS:</h4>
            <ul className="list-disc list-inside space-y-1 text-slate-700">
              <li>Pemilihan pengurus kelas dan pengenalan ekstrakurikuler peminatan.</li>
              <li>Pemberian pendampingan khusus oleh Tim Bimbingan Konseling dan Wali Kelas.</li>
              <li>Pemantauan pembiasaan 7 Kebiasaan Anak Indonesia Hebat secara berkala.</li>
            </ul>
          </div>
        </div>
      )}

      {/* Modal Add Session */}
      {showAddSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl border border-slate-200 p-5 space-y-3.5 text-xs animate-in fade-in">
            <h3 className="text-sm font-bold text-slate-900">Tambah Sesi Materi MPLS</h3>
            <form onSubmit={handleAddSession} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Topik Materi *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pengenalan Budaya Positif & Ekosistem Sekolah"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Narasumber / Pemateri</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Dra. Selvie Tumangkeng"
                  value={newSpeaker}
                  onChange={(e) => setNewSpeaker(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hari</label>
                  <input
                    type="text"
                    value={newDay}
                    onChange={(e) => setNewDay(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Waktu</label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddSession(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-lg cursor-pointer"
                >
                  Simpan Sesi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
