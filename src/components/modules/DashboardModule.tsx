import React from 'react';
import {
  Briefcase,
  Calendar,
  FileText,
  AlertTriangle,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award,
  CheckCircle2,
  Users2
} from 'lucide-react';
import { DatabaseState } from '../../types';

interface DashboardModuleProps {
  state: DatabaseState;
  onNavigate: (module: string) => void;
}

export const DashboardModule: React.FC<DashboardModuleProps> = ({ state, onNavigate }) => {
  const currentAcademicYear = state.schoolProfile.activeAcademicYear;

  // Filter current academic year data
  const programs = state.workPrograms.filter(p => p.academicYear === currentAcademicYear);
  const activities = state.activities.filter(a => a.academicYear === currentAcademicYear);
  const documents = state.documents.filter(d => d.academicYear === currentAcademicYear);
  const achievements = state.achievements.filter(a => a.academicYear === currentAcademicYear);

  // Statistics
  const totalPrograms = programs.length;
  const plannedActivities = activities.filter(a => a.status === 'Persiapan').length;
  const ongoingActivities = activities.filter(a => a.status === 'Sedang Berlangsung').length;
  const completedActivities = activities.filter(a => a.status === 'Selesai').length;

  const totalDocuments = documents.length;
  const needCompletionDocs = documents.filter(d => d.status === 'Draf' || d.status === 'Perlu Revisi').length;

  // Pending reports (finished activities whose report is not done)
  const pendingReports = activities.filter(a => a.status === 'Selesai' && a.reportStatus !== 'Selesai');

  // Next upcoming agendas
  const upcomingAgendas = [...activities]
    .filter(a => a.status !== 'Dibatalkan')
    .sort((a, b) => new Date(a.dateStart).getTime() - new Date(b.dateStart).getTime())
    .slice(0, 5);

  // Financial summary
  const totalPlannedBudget = programs.reduce((sum, p) => sum + p.plannedBudget, 0);
  const totalActualBudget = programs.reduce((sum, p) => sum + p.actualBudget, 0);
  const budgetRealizationPct = totalPlannedBudget > 0 ? Math.round((totalActualBudget / totalPlannedBudget) * 100) : 0;

  // Category distribution
  const categories = [
    'MPLS',
    'OSIS & MPK',
    'Ekstrakurikuler',
    'Karakter & Disiplin',
    'Prestasi & Lomba',
    'Kegiatan Khusus & PHBN',
    'Layanan & Bimbingan',
  ];

  const categoryStats = categories.map(cat => ({
    name: cat,
    count: programs.filter(p => p.category === cat).length,
    completed: programs.filter(p => p.category === cat && p.status === 'Selesai').length,
  }));

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-blue-900/60 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tahun Pelajaran {currentAcademicYear} • Semester {state.schoolProfile.activeSemester}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Pusat Administrasi Kesiswaan {state.schoolProfile.name}
          </h2>
          <p className="text-sm text-blue-200/90 leading-relaxed font-sans">
            Selamat datang, <span className="font-bold text-white">{state.schoolProfile.vicePrincipalStudentAffairs}</span>. Kelola seluruh perencanaan, dokumen resmi, SK panitia, kalender, ekstrakurikuler, pembinaan karakter, dan evaluasi dalam satu portal terpadu.
          </p>
          <div className="pt-3 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('generator-ai')}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-blue-950 font-bold rounded-lg text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-blue-900" />
              Buat Dokumen Draf AI
            </button>
            <button
              onClick={() => onNavigate('program-kerja')}
              className="px-4 py-2 bg-blue-800/80 hover:bg-blue-800 text-white font-semibold rounded-lg text-xs border border-blue-700 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Briefcase className="w-4 h-4 text-blue-300" />
              Kelola Program Kerja
            </button>
            <button
              onClick={() => onNavigate('laporan')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-blue-100 font-semibold rounded-lg text-xs border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              Cetak Laporan Otomatis
            </button>
          </div>
        </div>

        {/* Decorative background circle */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 rounded-full bg-blue-800/20 blur-3xl pointer-events-none" />
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Program Kerja */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Program Kerja</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-900">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{totalPrograms}</div>
          <p className="text-[11px] text-slate-500 mt-1">
            {programs.filter(p => p.status === 'Selesai').length} program tuntas ({Math.round((programs.filter(p => p.status === 'Selesai').length / (totalPrograms || 1)) * 100)}%)
          </p>
        </div>

        {/* Card 2: Kegiatan Terjadwal */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Status Kegiatan</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{activities.length}</span>
            <span className="text-xs text-amber-600 font-bold">({ongoingActivities} aktif)</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {plannedActivities} persiapan • {completedActivities} selesai
          </p>
        </div>

        {/* Card 3: Dokumen & Surat */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Dokumen Administrasi</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{totalDocuments}</div>
          <p className="text-[11px] text-emerald-700 font-medium mt-1">
            {needCompletionDocs} perlu dilengkapi / draf
          </p>
        </div>

        {/* Card 4: Prestasi Siswa */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Prestasi Siswa</span>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-700">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{achievements.length}</div>
          <p className="text-[11px] text-purple-700 font-medium mt-1">
            Tingkat Kab, Sulut & Nasional
          </p>
        </div>
      </div>

      {/* Realisasi Anggaran Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Realisasi Anggaran Kesiswaan T.P. {currentAcademicYear}</h3>
            <p className="text-xs text-slate-500">Alokasi dana BOS Reguler, BOS Kinerja, Komite, dan Swadana</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-500 font-medium">Total Realisasi: </span>
            <span className="text-base font-black text-blue-950">
              Rp {totalActualBudget.toLocaleString('id-ID')}
            </span>
            <span className="text-xs text-slate-400"> / Rp {totalPlannedBudget.toLocaleString('id-ID')} ({budgetRealizationPct}%)</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-700 to-indigo-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(budgetRealizationPct, 100)}%` }}
          />
        </div>
      </div>

      {/* Main Grid: Agenda & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Agenda Terdekat & Status Kelengkapan Program */}
        <div className="lg:col-span-2 space-y-6">
          {/* Agenda Kesiswaan Terdekat */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-900" />
                <h3 className="text-sm font-bold text-slate-900">Agenda Kegiatan Terdekat</h3>
              </div>
              <button
                onClick={() => onNavigate('kalender')}
                className="text-xs font-semibold text-blue-900 hover:underline flex items-center gap-1 cursor-pointer"
              >
                Lihat Kalender Penuh <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {upcomingAgendas.map((item) => (
                <div key={item.id} className="py-3 flex items-start justify-between gap-3 hover:bg-slate-50/80 px-2 rounded-lg transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                        item.status === 'Selesai' ? 'bg-emerald-100 text-emerald-800' :
                        item.status === 'Sedang Berlangsung' ? 'bg-amber-100 text-amber-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {item.status}
                      </span>
                      <span className="text-xs font-bold text-slate-900">{item.title}</span>
                    </div>
                    <p className="text-xs text-slate-500 font-sans">
                      {item.dateStart} • {item.time} • Lokasi: {item.location}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      PJ: {item.personInCharge} • Peserta: {item.participantCount} orang
                    </p>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="text-[11px] font-semibold text-slate-600 block">
                      Tenggat LPJ:
                    </span>
                    <span className="text-xs font-bold text-rose-600">
                      {item.reportDeadline}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Program Distribution per Bidang */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">Realisasi Program per Bidang Kesiswaan</h3>
              <button
                onClick={() => onNavigate('program-kerja')}
                className="text-xs font-semibold text-blue-900 hover:underline cursor-pointer"
              >
                Buka Matriks Program
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categoryStats.map((cat) => {
                const pct = cat.count > 0 ? Math.round((cat.completed / cat.count) * 100) : 0;
                return (
                  <div key={cat.name} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-800 mb-1">
                      <span className="truncate pr-2">{cat.name}</span>
                      <span className="text-slate-500 font-semibold">{cat.completed}/{cat.count}</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden mb-1">
                      <div
                        className="bg-blue-900 h-2 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-500">{pct}% selesai</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Notifications, Pending LPJ, Quick Links */}
        <div className="space-y-6">
          {/* Laporan & LPJ Belum Selesai */}
          <div className="bg-white p-5 rounded-xl border border-amber-200 shadow-xs">
            <div className="flex items-center gap-2 mb-3 text-amber-900 font-bold text-sm">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h4>Tenggat Laporan Kegiatan ({pendingReports.length})</h4>
            </div>

            {pendingReports.length === 0 ? (
              <p className="text-xs text-slate-500 py-3 text-center">
                Semua kegiatan yang telah selesai sudah memiliki laporan pertanggungjawaban (LPJ).
              </p>
            ) : (
              <div className="space-y-2.5">
                {pendingReports.map((item) => (
                  <div key={item.id} className="p-3 bg-amber-50/60 rounded-lg border border-amber-100 text-xs space-y-1">
                    <div className="font-bold text-slate-900">{item.title}</div>
                    <div className="flex justify-between items-center text-[11px] text-slate-600">
                      <span>Batas Waktu:</span>
                      <span className="font-bold text-rose-600">{item.reportDeadline}</span>
                    </div>
                    <button
                      onClick={() => onNavigate('generator-ai')}
                      className="mt-1 text-[11px] font-bold text-blue-900 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      Buat Draf LPJ Kegiatan Ini →
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Access to Main Modules */}
          <div className="bg-slate-900 text-white p-5 rounded-xl shadow-xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Akses Cepat Administrasi
            </h4>
            <div className="space-y-1.5 text-xs font-medium">
              <button
                onClick={() => onNavigate('mpls')}
                className="w-full text-left p-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-between cursor-pointer"
              >
                <span>Administrasi MPLS Ramah Anak</span>
                <span className="text-[10px] text-blue-400 font-mono">Modul 06</span>
              </button>
              <button
                onClick={() => onNavigate('osis')}
                className="w-full text-left p-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-between cursor-pointer"
              >
                <span>OSIS & Pemilihan Ketua OSIS</span>
                <span className="text-[10px] text-blue-400 font-mono">Modul 07</span>
              </button>
              <button
                onClick={() => onNavigate('ekskul')}
                className="w-full text-left p-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-between cursor-pointer"
              >
                <span>Ekstrakurikuler & Absensi</span>
                <span className="text-[10px] text-blue-400 font-mono">Modul 08</span>
              </button>
              <button
                onClick={() => onNavigate('karakter')}
                className="w-full text-left p-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-between cursor-pointer"
              >
                <span>7 Kebiasaan Anak Indonesia Hebat & TPPK</span>
                <span className="text-[10px] text-blue-400 font-mono">Modul 09</span>
              </button>
              <button
                onClick={() => onNavigate('prestasi')}
                className="w-full text-left p-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-between cursor-pointer"
              >
                <span>Database Prestasi & Surat Tugas</span>
                <span className="text-[10px] text-blue-400 font-mono">Modul 10</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
