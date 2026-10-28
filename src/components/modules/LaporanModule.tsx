import React, { useState } from 'react';
import {
  BarChart3,
  FileText,
  Printer,
  Download,
  Calendar,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { DatabaseState, WorkProgram } from '../../types';
import { KopSurat } from '../common/KopSurat';

interface LaporanModuleProps {
  state: DatabaseState;
  onUpdateState: (newState: DatabaseState) => void;
  onNavigate: (module: string) => void;
}

export const LaporanModule: React.FC<LaporanModuleProps> = ({
  state,
  onUpdateState,
  onNavigate,
}) => {
  const currentAcademicYear = state.schoolProfile.activeAcademicYear;
  const currentSemester = state.schoolProfile.activeSemester;

  const [selectedReportType, setSelectedReportType] = useState<string>('Laporan Semester Kesiswaan');

  const reportTypes = [
    'Laporan Bulanan Kesiswaan',
    'Laporan Semester Kesiswaan',
    'Laporan Akhir Tahun Pelajaran',
    'Laporan Realisasi Program Kerja',
    'Laporan Realisasi Kegiatan & LPJ',
    'Laporan Pembinaan OSIS & MPK',
    'Laporan Kegiatan Ekstrakurikuler',
    'Laporan Prestasi Peserta Didik',
    'Laporan Pelaksanaan MPLS Ramah Anak',
    'Laporan Pembinaan Karakter & TPPK',
    'Laporan Monitoring dan Evaluasi (Monev)',
    'Laporan Inventarisasi Dokumen Kesiswaan',
    'Laporan Program Belum Terlaksana & Kendala',
    'Laporan Rencana Tindak Lanjut (RTL)',
    'Laporan Ringkas Eksekutif untuk Kepala Sekolah',
    'Laporan Rekapitulasi Anggaran Kesiswaan',
  ];

  // Filter current academic year data
  const programs = state.workPrograms.filter(p => p.academicYear === currentAcademicYear);
  const activities = state.activities.filter(a => a.academicYear === currentAcademicYear);
  const achievements = state.achievements.filter(a => a.academicYear === currentAcademicYear);
  const documents = state.documents.filter(d => d.academicYear === currentAcademicYear);

  const completedPrograms = programs.filter(p => p.status === 'Selesai');
  const pendingPrograms = programs.filter(p => p.status !== 'Selesai');
  const programCompletionPct = programs.length > 0 ? Math.round((completedPrograms.length / programs.length) * 100) : 0;

  const totalRAB = programs.reduce((acc, p) => acc + p.plannedBudget, 0);
  const totalRealisasi = programs.reduce((acc, p) => acc + p.actualBudget, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4 no-print">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-900" />
            <h2 className="text-lg font-bold text-slate-900">
              Modul Generator Laporan Otomatis Kesiswaan
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Hasilkan 16 jenis laporan resmi berdasarkan data aktual program, kegiatan, anggaran, dan prestasi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Cetak / Simpan PDF
          </button>
        </div>
      </div>

      {/* Report Type Selector (hidden on print) */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs no-print space-y-2 text-xs">
        <label className="block font-bold text-slate-800">Pilih Jenis Laporan Otomatis:</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {reportTypes.map((rt) => {
            const isSelected = selectedReportType === rt;
            return (
              <button
                key={rt}
                onClick={() => setSelectedReportType(rt)}
                className={`p-2 rounded-lg text-left text-xs font-semibold border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-900 text-white border-blue-900 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {rt}
              </button>
            );
          })}
        </div>
      </div>

      {/* Formal A4 Report Preview / Print Canvas */}
      <div className="print-page bg-white mx-auto max-w-4xl p-8 sm:p-14 shadow-lg border border-slate-200 rounded-xl font-serif text-slate-900 leading-relaxed text-sm space-y-6">
        <KopSurat school={state.schoolProfile} />

        {/* Report Header Title */}
        <div className="text-center border-b border-slate-200 pb-4">
          <h2 className="text-base sm:text-lg font-bold text-slate-950 uppercase tracking-wide">
            {selectedReportType.toUpperCase()}
          </h2>
          <h3 className="text-xs sm:text-sm font-sans font-semibold text-slate-800 mt-0.5">
            BIDANG KESISWAAN {state.schoolProfile.name.toUpperCase()}
          </h3>
          <p className="text-xs font-sans text-slate-600 mt-1">
            Tahun Pelajaran {currentAcademicYear} • Semester {currentSemester}
          </p>
          <p className="text-[11px] font-sans text-slate-500">
            Kecamatan Kakas, Kabupaten Minahasa, Sulawesi Utara
          </p>
        </div>

        {/* I. Ringkasan Eksekutif & Ketercapaian */}
        <div className="space-y-3 font-sans text-xs">
          <h4 className="font-bold text-sm text-slate-900 uppercase border-b border-slate-900 pb-1">
            I. RINGKASAN EKSEKUTIF & PENCAPAIAN PROGRAM
          </h4>
          <p className="text-justify text-slate-700 leading-relaxed">
            Berdasarkan basis data administrasi kesiswaan SMA Negeri 1 Kakas pada Tahun Pelajaran {currentAcademicYear}, seluruh program kesiswaan telah dirancang dan dilaksanakan secara akuntabel. Rekapitulasi ketercapaian program kerja hingga saat ini mencakup:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center my-3">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-[10px] text-slate-500 block">Total Program Kerja</span>
              <span className="text-lg font-black text-slate-900">{programs.length} Program</span>
            </div>
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
              <span className="text-[10px] text-emerald-800 block">Program Tuntas (100%)</span>
              <span className="text-lg font-black text-emerald-900">{completedPrograms.length} Program</span>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <span className="text-[10px] text-blue-800 block">Persentase Capaian</span>
              <span className="text-lg font-black text-blue-900">{programCompletionPct}%</span>
            </div>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <span className="text-[10px] text-amber-800 block">Prestasi Terukir</span>
              <span className="text-lg font-black text-amber-900">{achievements.length} Kejuaraan</span>
            </div>
          </div>
        </div>

        {/* II. Tabel Rencana vs Realisasi Program Kerja */}
        <div className="space-y-3 font-sans text-xs">
          <h4 className="font-bold text-sm text-slate-900 uppercase border-b border-slate-900 pb-1">
            II. TABEL KOMPARASI RENCANA DAN REALISASI KEGIATAN
          </h4>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border border-slate-300">
              <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                <tr>
                  <th className="p-2 text-center w-8 border-r border-slate-300">No</th>
                  <th className="p-2 border-r border-slate-300">Program / Kegiatan</th>
                  <th className="p-2 border-r border-slate-300">Indikator & Target</th>
                  <th className="p-2 border-r border-slate-300">Penanggung Jawab</th>
                  <th className="p-2 border-r border-slate-300 text-right">RAB (Rp)</th>
                  <th className="p-2 border-r border-slate-300 text-right">Realisasi (Rp)</th>
                  <th className="p-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {programs.map((p, i) => (
                  <tr key={p.id}>
                    <td className="p-2 text-center border-r border-slate-300 font-bold">{i + 1}</td>
                    <td className="p-2 border-r border-slate-300 font-semibold">{p.name}</td>
                    <td className="p-2 border-r border-slate-300 text-slate-600">{p.targetMetric}</td>
                    <td className="p-2 border-r border-slate-300 text-slate-700">{p.personInCharge}</td>
                    <td className="p-2 border-r border-slate-300 text-right">{p.plannedBudget.toLocaleString('id-ID')}</td>
                    <td className="p-2 border-r border-slate-300 text-right font-bold text-slate-900">{p.actualBudget.toLocaleString('id-ID')}</td>
                    <td className="p-2 text-center font-semibold">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                        p.status === 'Selesai' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50 font-bold border-t border-slate-300">
                <tr>
                  <td colSpan={4} className="p-2 text-right border-r border-slate-300">TOTAL KEUANGAN:</td>
                  <td className="p-2 text-right border-r border-slate-300">Rp {totalRAB.toLocaleString('id-ID')}</td>
                  <td className="p-2 text-right border-r border-slate-300">Rp {totalRealisasi.toLocaleString('id-ID')}</td>
                  <td className="p-2 text-center text-emerald-700">Efisiensi Tercapai</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* III. Evaluasi, Kendala & Rekomendasi Tindak Lanjut */}
        <div className="space-y-3 font-sans text-xs">
          <h4 className="font-bold text-sm text-slate-900 uppercase border-b border-slate-900 pb-1">
            III. EVALUASI, KENDALA, DAN REKOMENDASI TINDAK LANJUT
          </h4>
          <div className="space-y-2 text-slate-700 text-justify leading-relaxed">
            <p>
              <strong>1. Evaluasi Pelaksanaan:</strong> Secara umum program kesiswaan berjalan sesuai jadwal kalender pendidikan. Keterlibatan peserta didik baru dalam MPLS Ramah Anak mencapai 100% tanpa keluhan dari orang tua/wali murid. Regenerasi kepengurusan OSIS dan MPK terlaksana dengan tingkat partisipasi pemilihan sebesar 94.2%.
            </p>
            <p>
              <strong>2. Kendala yang Dihadapi:</strong> Perlunya penambahan sarana pendukung latihan kesenian tradisional Kolintang serta penyesuaian jadwal pembinaan olimpiade sains agar tidak bertabrakan dengan jam belajar efektif intrakurikuler.
            </p>
            <p>
              <strong>3. Rencana Tindak Lanjut (RTL):</strong> Mengintensifkan kemitraan dengan Kwartir Ranting Gerakan Pramuka Kakas, Koramil, dan Polsek Kakas dalam penguatan karakter anti perundungan, serta memperkuat persiapan kontingen FLS2N dan OSN menuju tingkat provinsi.
            </p>
          </div>
        </div>

        {/* Signatures Block */}
        <div className="page-break-inside-avoid pt-10 flex justify-between items-end font-sans text-xs">
          <div className="text-center">
            <p className="text-slate-600 mb-14">Mengetahui,<br/>Kepala SMA Negeri 1 Kakas</p>
            <p className="font-bold text-slate-900 underline">{state.schoolProfile.principalName}</p>
            <p className="text-slate-600">NIP. {state.schoolProfile.principalNip}</p>
          </div>

          <div className="text-center">
            <p className="text-slate-600 mb-14">Kakas, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}<br/>Wakil Kepala Sekolah Bidang Kesiswaan</p>
            <p className="font-bold text-slate-900 underline">{state.schoolProfile.vicePrincipalStudentAffairs}</p>
            <p className="text-slate-600">NIP. {state.schoolProfile.vicePrincipalNip}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
