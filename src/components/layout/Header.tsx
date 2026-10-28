import React, { useState } from 'react';
import { 
  Building2, 
  Calendar, 
  UserCheck, 
  Download, 
  Upload, 
  Menu, 
  Bell, 
  Sparkles,
  ChevronDown,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { DatabaseState, UserRole } from '../../types';

interface HeaderProps {
  state: DatabaseState;
  onUpdateState: (newState: DatabaseState) => void;
  onToggleMobileSidebar: () => void;
  onNavigate: (module: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  state,
  onUpdateState,
  onToggleMobileSidebar,
  onNavigate,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const activeUser = state.users.find(u => u.id === state.activeUserId) || state.users[1];
  const activeYear = state.academicYears.find(y => y.code === state.schoolProfile.activeAcademicYear) || state.academicYears[1];

  // Calculate pending items for notification
  const pendingReports = state.activities.filter(a => a.status === 'Selesai' && a.reportStatus !== 'Selesai');
  const incompletePrograms = state.workPrograms.filter(p => p.completenessStatus === 'Perlu Dilengkapi');
  const draftDocs = state.documents.filter(d => d.status === 'Draf' || d.status === 'Perlu Revisi');

  const totalNotifications = pendingReports.length + incompletePrograms.length + draftDocs.length;

  const handleRoleChange = (userId: string) => {
    onUpdateState({
      ...state,
      activeUserId: userId,
    });
    setShowUserMenu(false);
  };

  const handleAcademicYearChange = (yearCode: string) => {
    onUpdateState({
      ...state,
      schoolProfile: {
        ...state.schoolProfile,
        activeAcademicYear: yearCode,
      },
    });
  };

  const handleSemesterChange = (semester: 'Ganjil' | 'Genap') => {
    onUpdateState({
      ...state,
      schoolProfile: {
        ...state.schoolProfile,
        activeSemester: semester,
      },
    });
  };

  const handleExportBackup = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `SIAKAS_Backup_SMAN1Kakas_${state.schoolProfile.activeAcademicYear.replace('/', '-')}_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.schoolProfile && parsed.workPrograms) {
          onUpdateState(parsed);
          alert('Data backup SIAKAS berhasil dipulihkan!');
        } else {
          alert('Format berkas backup tidak valid.');
        }
      } catch (err) {
        alert('Gagal membaca file JSON backup.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <header className="sticky top-0 z-30 bg-blue-950 text-white shadow-md border-b border-blue-900/60 no-print">
      <div className="px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
        {/* Left: Mobile trigger & School branding */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-blue-900 focus:outline-none cursor-pointer"
            title="Buka Navigasi"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/10 p-0.5 flex items-center justify-center shadow-xs border border-white/20">
              <img
                src={state.schoolProfile.logoUrl || "/assets/aistudio/WhatsApp_Image_2025-11-20_at_12.29.19-removebg-preview__1__c9a0a08a.png"}
                alt="Logo SMAN 1 Kakas"
                className="w-8 h-8 object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-white leading-tight">
                  SIAKAS
                </h1>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-bold bg-amber-400 text-blue-950 rounded">
                  SMAN 1 KAKAS
                </span>
                <span className="text-[11px] text-blue-300 hidden md:inline">
                  NPSN: {state.schoolProfile.npsn}
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-blue-200/80 leading-none">
                Sistem Informasi Administrasi Kesiswaan
              </p>
            </div>
          </div>
        </div>

        {/* Center: Academic Year & Semester Pill */}
        <div className="hidden md:flex items-center gap-2 bg-blue-900/70 border border-blue-800/80 rounded-lg p-1 text-xs">
          <div className="flex items-center gap-1.5 px-2 py-0.5 text-blue-200">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold text-white">T.P.:</span>
          </div>

          <select
            value={state.schoolProfile.activeAcademicYear}
            onChange={(e) => handleAcademicYearChange(e.target.value)}
            className="bg-blue-950 text-amber-300 font-semibold px-2 py-1 rounded text-xs border border-blue-700 focus:outline-none cursor-pointer"
          >
            {state.academicYears.map((ay) => (
              <option key={ay.id} value={ay.code} className="bg-slate-900 text-white">
                {ay.code} {ay.status === 'Aktif' ? '(Aktif)' : `(${ay.status})`}
              </option>
            ))}
          </select>

          <div className="flex bg-blue-950 rounded p-0.5 border border-blue-800">
            <button
              onClick={() => handleSemesterChange('Ganjil')}
              className={`px-2 py-0.5 text-[11px] font-semibold rounded cursor-pointer transition-colors ${
                state.schoolProfile.activeSemester === 'Ganjil'
                  ? 'bg-amber-400 text-blue-950'
                  : 'text-blue-300 hover:text-white'
              }`}
            >
              Ganjil
            </button>
            <button
              onClick={() => handleSemesterChange('Genap')}
              className={`px-2 py-0.5 text-[11px] font-semibold rounded cursor-pointer transition-colors ${
                state.schoolProfile.activeSemester === 'Genap'
                  ? 'bg-amber-400 text-blue-950'
                  : 'text-blue-300 hover:text-white'
              }`}
            >
              Genap
            </button>
          </div>
        </div>

        {/* Right: Actions, Notifications & Role Switcher */}
        <div className="flex items-center gap-2">
          {/* AI Generator Quick Link */}
          <button
            onClick={() => onNavigate('generator-ai')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-950 bg-gradient-to-r from-amber-300 to-amber-400 hover:from-amber-400 hover:to-amber-500 rounded-lg shadow-xs transition-all cursor-pointer"
            title="Buka Generator Dokumen Resmi AI"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-900" />
            <span>Draf AI</span>
          </button>

          {/* Backup & Restore quick menu */}
          <div className="hidden xl:flex items-center gap-1 border-r border-blue-800/80 pr-2 mr-1">
            <button
              onClick={handleExportBackup}
              className="p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-blue-900 text-xs flex items-center gap-1 cursor-pointer"
              title="Unduh Cadangan Basis Data (JSON)"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Backup</span>
            </button>
            <label
              className="p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-blue-900 text-xs flex items-center gap-1 cursor-pointer"
              title="Pulihkan Basis Data dari JSON"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Restore</span>
              <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
            </label>
          </div>

          {/* Notification Drawer Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg text-blue-200 hover:text-white hover:bg-blue-900 relative cursor-pointer"
              title="Notifikasi & Tindak Lanjut"
            >
              <Bell className="w-4 h-4" />
              {totalNotifications > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                  {totalNotifications}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 text-slate-900 overflow-hidden z-50 animate-in fade-in">
                <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider">Perhatian & Tenggat</h4>
                  <span className="text-[10px] bg-blue-600 px-2 py-0.5 rounded-full font-semibold">
                    {totalNotifications} tertunda
                  </span>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 p-2 text-xs">
                  {pendingReports.length > 0 && (
                    <div className="p-2 bg-amber-50 rounded-lg mb-2">
                      <div className="flex items-center gap-1.5 font-bold text-amber-900 mb-1">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Laporan Belum Selesai ({pendingReports.length}):</span>
                      </div>
                      <ul className="space-y-1 text-slate-700">
                        {pendingReports.map(a => (
                          <li key={a.id} className="flex justify-between items-center text-[11px]">
                            <span className="truncate pr-2">• {a.title}</span>
                            <span className="text-rose-600 font-semibold flex-shrink-0">Tenggat {a.reportDeadline}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {incompletePrograms.length > 0 && (
                    <div className="p-2 bg-blue-50 rounded-lg mb-2">
                      <div className="flex items-center gap-1.5 font-bold text-blue-900 mb-1">
                        <AlertCircle className="w-3.5 h-3.5 text-blue-600" />
                        <span>Dokumen Perlu Dilengkapi ({incompletePrograms.length}):</span>
                      </div>
                      <ul className="space-y-1 text-slate-700 text-[11px]">
                        {incompletePrograms.slice(0, 3).map(p => (
                          <li key={p.id} className="truncate">• {p.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {draftDocs.length > 0 && (
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <div className="flex items-center gap-1.5 font-bold text-purple-900 mb-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                        <span>Draf Dokumen ({draftDocs.length}):</span>
                      </div>
                      <ul className="space-y-1 text-slate-700 text-[11px]">
                        {draftDocs.slice(0, 3).map(d => (
                          <li key={d.id} className="truncate">• {d.title}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {totalNotifications === 0 && (
                    <div className="p-4 text-center text-slate-500">
                      Seluruh administrasi, LPJ kegiatan, dan program telah lengkap!
                    </div>
                  )}
                </div>

                <div className="p-2 bg-slate-50 border-t border-slate-100 text-center">
                  <button
                    onClick={() => { setShowNotifications(false); onNavigate('dokumen'); }}
                    className="text-xs font-semibold text-blue-900 hover:underline cursor-pointer"
                  >
                    Buka Pusat Dokumen & Laporan →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Active User & Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1.5 rounded-lg bg-blue-900/60 hover:bg-blue-800 text-left border border-blue-800 transition-colors cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-amber-400 text-blue-950 font-extrabold flex items-center justify-center text-xs flex-shrink-0">
                {activeUser.fullName.charAt(0)}
              </div>
              <div className="hidden lg:block text-left pr-1">
                <p className="text-xs font-bold text-white leading-tight truncate max-w-[150px]">
                  {activeUser.fullName}
                </p>
                <p className="text-[10px] text-amber-300 leading-tight">
                  {activeUser.roleTitle}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-blue-300" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 text-slate-900 overflow-hidden z-50 animate-in fade-in">
                <div className="p-3 bg-slate-100 border-b border-slate-200">
                  <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Pengguna Saat Ini</p>
                  <p className="text-xs font-bold text-slate-900">{activeUser.fullName}</p>
                  <p className="text-[11px] text-slate-600">{activeUser.email}</p>
                  {activeUser.nip && (
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">NIP: {activeUser.nip}</p>
                  )}
                </div>

                <div className="p-2">
                  <p className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1 tracking-wider">
                    Ganti Peran / Hak Akses:
                  </p>
                  {state.users.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => handleRoleChange(u.id)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                        u.id === activeUser.id
                          ? 'bg-blue-50 text-blue-950 font-bold'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div>
                        <p>{u.fullName}</p>
                        <p className="text-[10px] text-slate-500 font-normal">{u.roleTitle}</p>
                      </div>
                      {u.id === activeUser.id && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-900" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="p-2 bg-slate-50 border-t border-slate-200">
                  <button
                    onClick={() => { setShowUserMenu(false); onNavigate('pengaturan'); }}
                    className="w-full text-center text-xs font-semibold text-blue-900 py-1 hover:underline cursor-pointer"
                  >
                    Kelola Pengaturan Sekolah & Profil
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
