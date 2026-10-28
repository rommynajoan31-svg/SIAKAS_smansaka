import React, { useState } from 'react';
import {
  Users,
  Vote,
  FileText,
  Calendar,
  Sparkles,
  Printer,
  CheckCircle2,
  Award,
  Plus,
  ChevronRight
} from 'lucide-react';
import { DatabaseState, OSISData, OSISCandidate } from '../../types';

interface OSISModuleProps {
  state: DatabaseState;
  onUpdateState: (newState: DatabaseState) => void;
  onNavigate: (module: string) => void;
}

export const OSISModule: React.FC<OSISModuleProps> = ({
  state,
  onUpdateState,
  onNavigate,
}) => {
  const osis = state.osisData;
  const [activeTab, setActiveTab] = useState<'struktur' | 'pilketos' | 'notulen'>('struktur');

  // Voting simulation helper
  const handleVoteCandidate = (candidateNum: number) => {
    const updatedCandidates = osis.pilketos.candidates.map(c => 
      c.number === candidateNum ? { ...c, votes: c.votes + 1 } : c
    );

    onUpdateState({
      ...state,
      osisData: {
        ...osis,
        pilketos: {
          ...osis.pilketos,
          votesCounted: osis.pilketos.votesCounted + 1,
          candidates: updatedCandidates,
        },
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-900" />
            <h2 className="text-lg font-bold text-slate-900">
              Modul Organisasi Siswa Intra Sekolah (OSIS & MPK)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Kepengurusan Masa Bakti <span className="font-semibold text-slate-900">{osis.period}</span> • SMA Negeri 1 Kakas
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('generator-ai')}
            className="px-3.5 py-2 text-xs font-bold text-blue-950 bg-amber-400 hover:bg-amber-500 rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-900" />
            Draf SK Pelantikan OSIS
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Cetak Profil OSIS
          </button>
        </div>
      </div>

      {/* Leadership Card */}
      <div className="bg-gradient-to-r from-blue-950 to-indigo-900 text-white p-6 rounded-xl shadow-md border border-blue-900">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-400 text-blue-950 uppercase">
              Pengurus Inti Terpilih
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              {osis.ketuaOsis}
            </h3>
            <p className="text-xs text-blue-200">
              Wakil Ketua: <span className="font-bold text-white">{osis.wakilKetua}</span> • Sekretaris: <span className="font-bold text-white">{osis.sekretaris}</span> • Bendahara: <span className="font-bold text-white">{osis.bendahara}</span>
            </p>
            <p className="text-[11px] text-blue-300">
              Pembina OSIS: {osis.pembinaUtama} • Pendamping: {osis.pembinaPendamping}
            </p>
          </div>

          <div className="p-4 bg-blue-900/60 rounded-xl border border-blue-800 text-center min-w-[160px]">
            <p className="text-[10px] uppercase font-bold text-blue-300">Total Suara Pilketos</p>
            <p className="text-2xl font-black text-amber-300">{osis.pilketos.votesCounted} / {osis.pilketos.totalVoters}</p>
            <p className="text-[10px] text-emerald-400 font-semibold mt-1">Partisipasi 94.2%</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 text-xs font-bold">
        <button
          onClick={() => setActiveTab('struktur')}
          className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'struktur' ? 'border-blue-900 text-blue-900' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Seksi Bidang & Anggota ({osis.structure.length} Sekbid)
        </button>
        <button
          onClick={() => setActiveTab('pilketos')}
          className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'pilketos' ? 'border-blue-900 text-blue-900' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Pemilihan Ketua OSIS (Pilketos)
        </button>
        <button
          onClick={() => setActiveTab('notulen')}
          className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'notulen' ? 'border-blue-900 text-blue-900' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Notulen Rapat Kerja ({osis.meetingNotes.length})
        </button>
      </div>

      {/* Tab 1: Struktur Sekbid */}
      {activeTab === 'struktur' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {osis.structure.map((sekbid, i) => (
            <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-blue-900">{sekbid.division}</span>
                <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold">
                  {sekbid.programCount} Program
                </span>
              </div>

              <div className="text-xs">
                <span className="text-slate-500 block text-[11px]">Koordinator:</span>
                <span className="font-bold text-slate-900">{sekbid.head}</span>
              </div>

              <div className="text-xs pt-2 border-t border-slate-100">
                <span className="text-[11px] text-slate-500 block mb-1">Anggota Sekbid:</span>
                <div className="flex flex-wrap gap-1.5">
                  {sekbid.members.map((m, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-slate-50 text-slate-700 rounded border border-slate-200 text-[11px]">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Pilketos */}
      {activeTab === 'pilketos' && (
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 flex items-center justify-between gap-3 text-xs text-blue-950">
            <div>
              <h4 className="font-bold text-sm">Hasil Rekapitulasi Pemilihan Ketua OSIS 2026/2027</h4>
              <p className="text-blue-800 text-[11px] mt-0.5">
                Pemungutan suara langsung, umum, bebas, rahasia, jujur, dan adil pada tanggal {osis.pilketos.electionDate}.
              </p>
            </div>
            <span className="px-3 py-1 font-bold text-xs bg-emerald-600 text-white rounded-full">
              Status: {osis.pilketos.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {osis.pilketos.candidates.map((cand) => {
              const pct = Math.round((cand.votes / (osis.pilketos.votesCounted || 1)) * 100);
              const isWinner = cand.number === 1;

              return (
                <div
                  key={cand.number}
                  className={`bg-white rounded-xl p-6 border transition-all ${
                    isWinner ? 'border-amber-400 ring-2 ring-amber-400/30 shadow-md' : 'border-slate-200 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-8 h-8 rounded-full bg-blue-900 text-white font-black flex items-center justify-center text-sm">
                      {cand.number}
                    </span>
                    {isWinner && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                        <Award className="w-3.5 h-3.5" /> Paslon Terpilih
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{cand.name}</h3>
                  <p className="text-xs text-slate-500 font-semibold mb-3">Kelas: {cand.classRoom}</p>

                  <div className="my-3 p-3 bg-slate-50 rounded-lg text-xs space-y-1.5">
                    <p className="font-bold text-slate-800">Visi:</p>
                    <p className="text-slate-600 italic">"{cand.vision}"</p>
                    <p className="font-bold text-slate-800 pt-1">Misi Unggulan:</p>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-600 text-[11px]">
                      {cand.mission.map((m, idx) => (
                        <li key={idx}>{m}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    <div className="flex justify-between items-center text-xs font-bold mb-1">
                      <span>Perolehan Suara: {cand.votes} suara</span>
                      <span className="text-blue-900 text-sm">{pct}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                      <div className="bg-blue-900 h-3 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Notulen Rapat */}
      {activeTab === 'notulen' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden text-xs">
          {osis.meetingNotes.map((note) => (
            <div key={note.id} className="p-5 hover:bg-slate-50 transition-colors space-y-1.5">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-sm text-slate-900">{note.title}</h4>
                <span className="text-slate-500 font-medium">{note.date} • Hadir: {note.attendees} orang</span>
              </div>
              <p className="text-slate-700 leading-relaxed">{note.summary}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
