import React, { useState } from 'react';
import {
  Sparkles,
  FileText,
  Printer,
  Download,
  Save,
  CheckCircle2,
  RefreshCw,
  Copy,
  BookOpen,
  Send,
  AlertCircle
} from 'lucide-react';
import { DatabaseState, OfficialDocument, DocumentCategory, DocumentType } from '../../types';
import { generateDocumentAI } from '../../services/api';
import { KopSurat } from '../common/KopSurat';
import { exportDocumentToDocx } from '../../services/exportService';

interface GeneratorDokumenAIModuleProps {
  state: DatabaseState;
  onUpdateState: (newState: DatabaseState) => void;
  onNavigate: (module: string) => void;
}

export const GeneratorDokumenAIModule: React.FC<GeneratorDokumenAIModuleProps> = ({
  state,
  onUpdateState,
  onNavigate,
}) => {
  const currentAcademicYear = state.schoolProfile.activeAcademicYear;

  const [documentType, setDocumentType] = useState<string>('Surat Tugas Pembimbing / Guru');
  const [activityName, setActivityName] = useState('Pembinaan dan Pengiriman Kontingen FLS2N Tingkat Minahasa');
  const [personInCharge, setPersonInCharge] = useState(state.schoolProfile.vicePrincipalStudentAffairs);
  const [picRole, setPicRole] = useState('Wakasek Kesiswaan');
  const [dateStr, setDateStr] = useState(new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }));
  const [place, setPlace] = useState('Tondano, Kabupaten Minahasa');
  const [participants, setParticipants] = useState('Guru Pendamping dan 4 Siswa Peserta Lomba Seni');
  const [legalBasis, setLegalBasis] = useState('Surat Edaran Dinas Pendidikan Daerah Sulawesi Utara Cabdin Minahasa-Tomohon');
  const [purpose, setPurpose] = useState('Mewakili SMA Negeri 1 Kakas dan meraih prestasi di bidang seni vokal dan tari Minahasa');
  const [budget, setBudget] = useState('2500000');
  const [additionalNotes, setAdditionalNotes] = useState('Perhatikan keselamatan perjalanan dan dampingi siswa selama lomba berlangsung.');

  const [isLoading, setIsLoading] = useState(false);
  const [generatedDraft, setGeneratedDraft] = useState<string>('');
  const [generationSource, setGenerationSource] = useState<'gemini' | 'template' | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  // Quick Preset Selector
  const presets = [
    {
      label: 'Surat Tugas Pembimbing Lomba',
      type: 'Surat Tugas Pembimbing / Guru',
      activity: 'Pendampingan Peserta OSN Tingkat Kabupaten Minahasa',
      place: 'Tondano, Minahasa',
      target: '3 Siswa Binaan Tim Sains',
    },
    {
      label: 'SK Panitia Kegiatan Sekolah',
      type: 'SK Panitia MPLS',
      activity: 'Penyelenggaraan Classmeeting & Turnamen Olahraga Antar-Kelas',
      place: 'SMA Negeri 1 Kakas',
      target: 'Seluruh Siswa Kelas X, XI, XII',
    },
    {
      label: 'Surat Undangan Wali Siswa',
      type: 'Surat Undangan Resmi',
      activity: 'Sosialisasi Program Kesiswaan & Pencegahan Perundungan',
      place: 'Aula SMA Negeri 1 Kakas',
      target: 'Orang Tua / Wali Siswa Baru Kelas X',
    },
    {
      label: 'Proposal Kegiatan Kesiswaan',
      type: 'Proposal Kegiatan',
      activity: 'Aksi Bersih Danau Tondano (Pelajar Minahasa Hijau)',
      place: 'Pesisir Danau Tondano Wilayah Kakas',
      target: '120 Siswa dan Relawan Lingkungan',
    },
    {
      label: 'Laporan Pertanggungjawaban (LPJ)',
      type: 'Laporan Pertanggungjawaban (LPJ)',
      activity: 'Laporan Pelaksanaan Latihan Dasar Kepemimpinan Peserta Didik (LDKPD)',
      place: 'Kampus SMAN 1 Kakas',
      target: '40 Pengurus OSIS & MPK',
    },
  ];

  const applyPreset = (preset: typeof presets[0]) => {
    setDocumentType(preset.type);
    setActivityName(preset.activity);
    setPlace(preset.place);
    setParticipants(preset.target);
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setIsSaved(false);

    try {
      const result = await generateDocumentAI({
        documentType,
        schoolProfile: state.schoolProfile,
        academicYear: currentAcademicYear,
        semester: state.schoolProfile.activeSemester,
        activityName,
        personInCharge,
        date: dateStr,
        place,
        participants,
        legalBasis,
        purpose,
        budget: Number(budget) || 0,
        additionalNotes,
      });

      setGeneratedDraft(result.content);
      setGenerationSource(result.source);
    } catch (err) {
      console.error('Error generating document:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToDocuments = () => {
    if (!generatedDraft) return;

    let cat: DocumentCategory = 'Persuratan';
    if (documentType.includes('SK')) cat = 'SK & Penugasan';
    else if (documentType.includes('Proposal') || documentType.includes('Acara') || documentType.includes('Jadwal')) cat = 'Pelaksanaan';
    else if (documentType.includes('Laporan') || documentType.includes('LPJ')) cat = 'Evaluasi & Laporan';

    const newDoc: OfficialDocument = {
      id: 'doc-ai-' + Date.now(),
      documentNumber: `${state.schoolProfile.letterNumberPrefix}/${documentType.slice(0, 3).toUpperCase()}/${String(state.documents.length + 1).padStart(3, '0')}/${new Date().getFullYear()}`,
      title: `${documentType}: ${activityName}`,
      category: cat,
      documentType: documentType as DocumentType,
      academicYear: currentAcademicYear,
      semester: state.schoolProfile.activeSemester,
      date: dateStr,
      subject: activityName,
      bodyContent: generatedDraft,
      signatoryName: state.schoolProfile.principalName,
      signatoryTitle: 'Kepala Sekolah',
      signatoryNip: state.schoolProfile.principalNip,
      creatorName: state.schoolProfile.vicePrincipalStudentAffairs,
      status: 'Draf',
      tags: ['Draf AI', documentType, 'SMAN 1 Kakas'],
      revisionHistory: [
        {
          version: 1,
          date: new Date().toISOString().slice(0, 10),
          author: `${state.schoolProfile.vicePrincipalStudentAffairs} (AI Generator)`,
          note: `Draf naskah resmi dihasilkan via Generator Dokumen AI (${generationSource === 'gemini' ? 'Gemini 3.8 Flash' : 'Standar Tata Naskah Draf'})`,
        },
      ],
      isImportant: true,
      isDemo: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onUpdateState({
      ...state,
      documents: [newDoc, ...state.documents],
    });

    setIsSaved(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-950 to-indigo-900 text-white p-6 rounded-2xl shadow-xl border border-blue-800">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generator Dokumen Berbasis AI & Tata Naskah Baku</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Penyusun Naskah Dinas Kesiswaan Otomatis
            </h2>
            <p className="text-xs text-blue-200 leading-relaxed font-sans">
              Menghasilkan draf dokumen formal: Surat Keputusan (SK), Surat Tugas, Surat Undangan, Proposal Kegiatan, Berita Acara, dan LPJ dalam Bahasa Indonesia baku sesuai kaidah persuratan Kemdikbudristek.
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-blue-300 uppercase block font-semibold">Tahun Pelajaran:</span>
            <span className="text-base font-bold text-amber-300">{currentAcademicYear} (Semester {state.schoolProfile.activeSemester})</span>
          </div>
        </div>
      </div>

      {/* Preset Quick Chips */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <span className="text-xs font-bold text-slate-700 block mb-2">
          Pilihan Cepat Templat Kesiswaan:
        </span>
        <div className="flex flex-wrap gap-2">
          {presets.map((p, i) => (
            <button
              key={i}
              onClick={() => applyPreset(p)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-900 border border-slate-200 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-blue-900" />
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Generator Form & Result Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form (5 cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3.5 text-xs">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            1. Parameter Naskah Dinas
          </h3>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Jenis Dokumen Resmi *</label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 font-semibold text-slate-900"
            >
              <option value="Surat Tugas Pembimbing / Guru">Surat Tugas Pembimbing / Guru</option>
              <option value="SK Panitia MPLS">Surat Keputusan (SK) Panitia MPLS</option>
              <option value="SK Pembina OSIS">Surat Keputusan (SK) Pembina OSIS</option>
              <option value="SK Pengurus OSIS">Surat Keputusan (SK) Pengurus OSIS</option>
              <option value="SK Pembina Ekstrakurikuler">Surat Keputusan (SK) Pembina Ekstrakurikuler</option>
              <option value="Surat Undangan Resmi">Surat Undangan Resmi (Rapat / Orang Tua)</option>
              <option value="Surat Pemberitahuan Orang Tua">Surat Pemberitahuan Orang Tua</option>
              <option value="Surat Permohonan Izin / Rekomendasi">Surat Permohonan Izin / Rekomendasi</option>
              <option value="Proposal Kegiatan">Proposal Kegiatan Kesiswaan</option>
              <option value="Kerangka Acuan Kerja (TOR)">Kerangka Acuan Kerja (TOR / KAK)</option>
              <option value="Berita Acara Kegiatan">Berita Acara Kegiatan / Pemilihan</option>
              <option value="Laporan Pertanggungjawaban (LPJ)">Laporan Pertanggungjawaban (LPJ)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Nama Kegiatan / Agenda *</label>
            <input
              type="text"
              value={activityName}
              onChange={(e) => setActivityName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Tanggal Kegiatan</label>
              <input
                type="text"
                value={dateStr}
                onChange={(e) => setDateStr(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Tempat / Lokasi</label>
              <input
                type="text"
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Sasaran / Peserta</label>
            <input
              type="text"
              value={participants}
              onChange={(e) => setParticipants(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Dasar Hukum / Surat Rujukan</label>
            <textarea
              rows={2}
              value={legalBasis}
              onChange={(e) => setLegalBasis(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Tujuan Dokumen / Kegiatan</label>
            <textarea
              rows={2}
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Estimasi Anggaran (Rp)</label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Penanggung Jawab</label>
              <input
                type="text"
                value={personInCharge}
                onChange={(e) => setPersonInCharge(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-blue-900 to-indigo-900 hover:from-blue-800 hover:to-indigo-800 text-white font-bold rounded-lg text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                  <span>AI Sedang Menyusun Draf Resmi...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Hasilkan Draf Dokumen Formal</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Preview & Editor (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">2. Hasil Draf & Pratinjau Naskah</h3>
                <span className="text-[11px] text-slate-500">
                  {generationSource === 'gemini'
                    ? 'Dihasilkan oleh model AI Gemini 3.8 Flash'
                    : generationSource === 'template'
                    ? 'Dihasilkan menggunakan format tata naskah baku'
                    : 'Silakan isi parameter di sebelah kiri dan klik tombol hasilkan'}
                </span>
              </div>

              {generatedDraft && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveToDocuments}
                    disabled={isSaved}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isSaved
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                    }`}
                  >
                    {isSaved ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                    {isSaved ? 'Tersimpan di Dokumen' : 'Simpan ke Arsip'}
                  </button>

                  <button
                    onClick={() => window.print()}
                    className="px-3 py-1.5 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Cetak A4
                  </button>
                </div>
              )}
            </div>

            {/* Editable Draft Content Area */}
            {generatedDraft ? (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-slate-700">Editor Teks (Dapat Anda Sesuaikan Sebelum Dicetak/Disimpan):</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(generatedDraft);
                        alert('Teks berhasil disalin ke clipboard!');
                      }}
                      className="text-[11px] font-semibold text-blue-900 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" /> Salin Teks
                    </button>
                  </div>
                  <textarea
                    rows={12}
                    value={generatedDraft}
                    onChange={(e) => { setGeneratedDraft(e.target.value); setIsSaved(false); }}
                    className="w-full p-4 border border-slate-300 rounded-lg text-xs font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-900 bg-slate-50/50"
                  />
                </div>

                {/* Live A4 Print Simulation */}
                <div className="print-page border border-slate-200 rounded-xl p-8 bg-white shadow-xs font-serif text-slate-900 text-xs leading-relaxed space-y-4">
                  <KopSurat school={state.schoolProfile} />
                  <div className="whitespace-pre-line text-justify">
                    {generatedDraft}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center text-slate-400 space-y-3">
                <BookOpen className="w-10 h-10 mx-auto text-slate-300" />
                <p className="text-xs">
                  Pilih jenis dokumen, lengkapi parameter naskah di sebelah kiri, lalu klik <span className="font-bold text-slate-600">"Hasilkan Draf Dokumen Formal"</span>.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
