import React from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  Briefcase,
  Calendar,
  FileText,
  UserCheck2,
  Users,
  Compass,
  HeartHandshake,
  Trophy,
  Sparkles,
  DollarSign,
  BarChart3,
  Archive,
  Shield,
  Settings,
  X,
  GraduationCap
} from 'lucide-react';
import { DatabaseState } from '../../types';

interface SidebarProps {
  currentModule: string;
  onNavigate: (module: string) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  state: DatabaseState;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentModule,
  onNavigate,
  isMobileOpen,
  onCloseMobile,
  state,
}) => {
  const currentAcademicYear = state.schoolProfile.activeAcademicYear;

  const countPrograms = state.workPrograms.filter(p => p.academicYear === currentAcademicYear).length;
  const countDocs = state.documents.filter(d => d.academicYear === currentAcademicYear).length;
  const countActivities = state.activities.filter(a => a.academicYear === currentAcademicYear).length;
  const countAchievements = state.achievements.filter(a => a.academicYear === currentAcademicYear).length;
  const countEkskul = state.extracurriculars.filter(e => e.active).length;

  const navSections = [
    {
      title: 'UTAMA',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'tahun-pelajaran', label: 'Tahun Pelajaran', icon: CalendarDays },
        { id: 'program-kerja', label: 'Program Kerja Wakasek', icon: Briefcase, count: countPrograms },
        { id: 'kalender', label: 'Kalender Kesiswaan', icon: Calendar, count: countActivities },
      ],
    },
    {
      title: 'DOKUMEN & PERSURATAN',
      items: [
        { id: 'dokumen', label: 'Dokumen & Surat', icon: FileText, count: countDocs },
        { id: 'generator-ai', label: 'Generator Dokumen AI', icon: Sparkles, badge: 'AI' },
        { id: 'arsip', label: 'Arsip Digital', icon: Archive },
      ],
    },
    {
      title: 'BIDANG & KESISWAAN',
      items: [
        { id: 'mpls', label: 'MPLS Ramah Anak', icon: UserCheck2 },
        { id: 'osis', label: 'OSIS & Pilketos', icon: Users },
        { id: 'ekskul', label: 'Ekstrakurikuler', icon: Compass, count: countEkskul },
        { id: 'karakter', label: 'Kedisiplinan & Karakter', icon: HeartHandshake },
        { id: 'prestasi', label: 'Prestasi Peserta Didik', icon: Trophy, count: countAchievements },
        { id: 'kegiatan', label: 'Kegiatan Khusus & PHBN', icon: GraduationCap },
      ],
    },
    {
      title: 'KEUANGAN & PELAPORAN',
      items: [
        { id: 'anggaran', label: 'Anggaran Kegiatan', icon: DollarSign },
        { id: 'laporan', label: 'Laporan Otomatis', icon: BarChart3 },
      ],
    },
    {
      title: 'SISTEM & HAK AKSES',
      items: [
        { id: 'pengguna', label: 'Pengguna & Akses', icon: Shield },
        { id: 'pengaturan', label: 'Pengaturan Sekolah', icon: Settings },
      ],
    },
  ];

  const handleSelect = (id: string) => {
    onNavigate(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden no-print"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 border-r border-slate-800 transition-transform duration-200 ease-in-out flex flex-col no-print ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand header in sidebar */}
        <div className="p-4 bg-slate-950 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 p-0.5 flex items-center justify-center shadow-xs border border-white/20">
              <img
                src={state.schoolProfile.logoUrl || "/assets/aistudio/WhatsApp_Image_2025-11-20_at_12.29.19-removebg-preview__1__c9a0a08a.png"}
                alt="Logo SMAN 1 Kakas"
                className="w-7 h-7 object-contain"
              />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-white tracking-wide leading-none">
                SIAKAS SMAN 1
              </h2>
              <p className="text-[10px] text-amber-400 font-medium leading-tight mt-0.5">
                Minahasa - Sulawesi Utara
              </p>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-1">
              <h3 className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                {section.title}
              </h3>
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentModule === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-blue-800 text-white shadow-xs font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-amber-300' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {item.badge && (
                        <span className="px-1.5 py-0.2 text-[9px] font-extrabold rounded bg-amber-400 text-blue-950 uppercase">
                          {item.badge}
                        </span>
                      )}
                      {typeof item.count === 'number' && (
                        <span className={`px-2 py-0.5 text-[10px] rounded-full font-bold ${
                          isActive ? 'bg-blue-900 text-amber-300' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {item.count}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer info in sidebar */}
        <div className="p-3 bg-slate-950/80 border-t border-slate-800 text-[11px] text-slate-400">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-300">Wakasek Kesiswaan</span>
            <span className="text-[10px] text-emerald-400 font-mono">v1.2 Online</span>
          </div>
          <p className="text-[10px] text-slate-500 truncate mt-0.5">
            {state.schoolProfile.vicePrincipalStudentAffairs}
          </p>
        </div>
      </aside>
    </>
  );
};
