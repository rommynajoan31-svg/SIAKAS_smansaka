import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Building2,
  Users,
  Download,
  Upload,
  RefreshCw,
  Save,
  CheckCircle2,
  AlertTriangle,
  Lock,
  History
} from 'lucide-react';
import { DatabaseState, SchoolProfile, UserAccount, UserRole } from '../../types';
import { ConfirmModal } from '../common/ConfirmModal';

interface PengaturanPenggunaModuleProps {
  state: DatabaseState;
  onUpdateState: (newState: DatabaseState) => void;
  onNavigate: (module: string) => void;
}

export const PengaturanPenggunaModule: React.FC<PengaturanPenggunaModuleProps> = ({
  state,
  onUpdateState,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'sekolah' | 'pengguna' | 'audit' | 'data'>('sekolah');
  const [schoolForm, setSchoolForm] = useState<SchoolProfile>({ ...state.schoolProfile });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [confirmResetDemo, setConfirmResetDemo] = useState(false);

  // New User Form State
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newFullName, setNewFullName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('pembina');
  const [newRoleTitle, setNewRoleTitle] = useState('Pembina Ekstrakurikuler');
  const [newEmail, setNewEmail] = useState('');
  const [newNip, setNewNip] = useState('');

  const handleSaveSchoolProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateState({
      ...state,
      schoolProfile: schoolForm,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName.trim() || !newUsername.trim()) return;

    const newUser: UserAccount = {
      id: 'usr-' + Date.now(),
      username: newUsername.trim(),
      fullName: newFullName.trim(),
      role: newRole,
      roleTitle: newRoleTitle,
      email: newEmail.trim() || `${newUsername}@sman1kakas.sch.id`,
      nip: newNip.trim(),
      active: true,
    };

    onUpdateState({
      ...state,
      users: [...state.users, newUser],
    });

    setShowAddUserModal(false);
    setNewFullName('');
    setNewUsername('');
    setNewEmail('');
    setNewNip('');
  };

  const handleCleanDemoData = () => {
    // Retain only official configurations and non-demo records
    const cleanedPrograms = state.workPrograms.filter(p => !p.isDemo);
    const cleanedActivities = state.activities.filter(a => !a.isDemo);
    const cleanedDocs = state.documents.filter(d => !d.isDemo);

    onUpdateState({
      ...state,
      workPrograms: cleanedPrograms,
      activities: cleanedActivities,
      documents: cleanedDocs,
    });

    setConfirmResetDemo(false);
    alert('Seluruh data contoh berlabel DEMO berhasil dibersihkan! Sistem kini siap untuk input administrasi resmi sekolah.');
  };

  const handleExportBackup = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `SIAKAS_SMAN1Kakas_Backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-900" />
            <h2 className="text-lg font-bold text-slate-900">
              Pengaturan Sistem, Profil Sekolah & Manajemen Pengguna
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Konfigurasi identitas resmi SMA Negeri 1 Kakas, nomor surat, hak akses peran (RBAC), dan keamanan data.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportBackup}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-blue-900" />
            Unduh Cadangan Basis Data
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 text-xs font-bold">
        <button
          onClick={() => setActiveTab('sekolah')}
          className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'sekolah' ? 'border-blue-900 text-blue-900' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          Identitas & Konfigurasi Sekolah
        </button>
        <button
          onClick={() => setActiveTab('pengguna')}
          className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'pengguna' ? 'border-blue-900 text-blue-900' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          Manajemen Pengguna & Peran ({state.users.length})
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'audit' ? 'border-blue-900 text-blue-900' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          Log Audit & Rekam Aktivitas ({state.auditLogs.length})
        </button>
        <button
          onClick={() => setActiveTab('data')}
          className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'data' ? 'border-blue-900 text-blue-900' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          Pemeliharaan Data & Reset Demo
        </button>
      </div>

      {/* Tab 1: Identitas Sekolah Form */}
      {activeTab === 'sekolah' && (
        <form onSubmit={handleSaveSchoolProfile} className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4 text-xs">
          {savedSuccess && (
            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-900 flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Identitas sekolah dan konfigurasi penandatanganan berhasil diperbarui!</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Nama Satuan Pendidikan *</label>
              <input
                type="text"
                required
                value={schoolForm.name}
                onChange={(e) => setSchoolForm({ ...schoolForm, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 font-bold text-slate-900 text-sm"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Nomor Pokok Sekolah Nasional (NPSN) *</label>
              <input
                type="text"
                required
                value={schoolForm.npsn}
                onChange={(e) => setSchoolForm({ ...schoolForm, npsn: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Provinsi & Kabupaten</label>
              <input
                type="text"
                value={`${schoolForm.regency}, ${schoolForm.province}`}
                disabled
                className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-lg text-slate-600 font-medium"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Alamat Lengkap Satuan Pendidikan</label>
              <input
                type="text"
                value={schoolForm.address}
                onChange={(e) => setSchoolForm({ ...schoolForm, address: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Nomor Telepon Sekolah</label>
              <input
                type="text"
                value={schoolForm.phone}
                onChange={(e) => setSchoolForm({ ...schoolForm, phone: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Pos-el (Email) Resmi Sekolah</label>
              <input
                type="email"
                value={schoolForm.email}
                onChange={(e) => setSchoolForm({ ...schoolForm, email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Nama Kepala Sekolah & Gelar</label>
              <input
                type="text"
                value={schoolForm.principalName}
                onChange={(e) => setSchoolForm({ ...schoolForm, principalName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">NIP Kepala Sekolah</label>
              <input
                type="text"
                value={schoolForm.principalNip}
                onChange={(e) => setSchoolForm({ ...schoolForm, principalNip: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Nama Wakasek Bidang Kesiswaan</label>
              <input
                type="text"
                value={schoolForm.vicePrincipalStudentAffairs}
                onChange={(e) => setSchoolForm({ ...schoolForm, vicePrincipalStudentAffairs: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">NIP Wakasek Kesiswaan</label>
              <input
                type="text"
                value={schoolForm.vicePrincipalNip}
                onChange={(e) => setSchoolForm({ ...schoolForm, vicePrincipalNip: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Format Penomoran Surat / Naskah Dinas</label>
              <input
                type="text"
                value={schoolForm.letterNumberPrefix}
                onChange={(e) => setSchoolForm({ ...schoolForm, letterNumberPrefix: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Kode Klasifikasi Kearsipan Kesiswaan</label>
              <input
                type="text"
                value={schoolForm.archiveClassificationCode}
                onChange={(e) => setSchoolForm({ ...schoolForm, archiveClassificationCode: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-lg text-xs flex items-center gap-2 shadow-xs cursor-pointer transition-colors"
            >
              <Save className="w-4 h-4" />
              Simpan Perubahan Identitas Sekolah
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: User Management & RBAC */}
      {activeTab === 'pengguna' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-700">Daftar Pengguna & Hak Akses Administrasi:</span>
            <button
              onClick={() => setShowAddUserModal(true)}
              className="px-3.5 py-1.5 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-lg flex items-center gap-1 cursor-pointer"
            >
              <Users className="w-3.5 h-3.5" />
              Tambah Akun Pengguna
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden text-xs">
            {state.users.map((user) => (
              <div key={user.id} className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-950 text-amber-400 font-black flex items-center justify-center text-sm">
                    {user.fullName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{user.fullName}</h4>
                    <p className="text-slate-500 font-mono text-[11px]">{user.email} • Username: {user.username}</p>
                    {user.nip && <p className="text-slate-400 text-[10px]">NIP: {user.nip}</p>}
                  </div>
                </div>

                <div className="text-right">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                    user.role === 'wakasek' ? 'bg-blue-100 text-blue-900' :
                    user.role === 'kepsek' ? 'bg-amber-100 text-amber-900' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {user.roleTitle}
                  </span>
                  <p className="text-[10px] text-emerald-600 font-semibold mt-1">Status: Aktif</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Audit Trail Log */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden text-xs">
          <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-slate-900">
            Rekam Jejak Aktivitas Penting (Security Audit Trail)
          </div>

          <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
            {state.auditLogs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-slate-50 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-900">{log.action} ({log.category})</span>
                  <span className="text-slate-400 font-mono text-[10px]">{log.timestamp}</span>
                </div>
                <p className="text-slate-700">{log.details}</p>
                <p className="text-[10px] text-slate-400">Oleh: {log.user}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Pemeliharaan Data & Reset Demo */}
      {activeTab === 'data' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6 text-xs">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Cadangan & Pemulihan Basis Data</h3>
            <p className="text-slate-500 mb-3">
              Seluruh data tersimpan secara persisten pada server dan dicadangkan secara lokal. Anda dapat mengekspor atau memulihkan data kapan saja.
            </p>
            <button
              onClick={handleExportBackup}
              className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-lg cursor-pointer"
            >
              Unduh Berkas JSON Backup Sekarang
            </button>
          </div>

          <div className="pt-6 border-t border-slate-200">
            <h3 className="text-sm font-bold text-rose-700 flex items-center gap-1.5 mb-1">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              Pembersihan Data Contoh (DEMO Data Reset)
            </h3>
            <p className="text-slate-600 mb-3 leading-relaxed">
              Aplikasi ini dilengkapi data percontohan untuk memudahkan eksplorasi awal. Bila SMA Negeri 1 Kakas telah siap memulai pencatatan administrasi nyata yang murni, Anda dapat membersihkan data bertanda <strong>DEMO</strong> dengan satu klik tanpa menghapus konfigurasi identitas sekolah maupun data riil yang Anda masukkan.
            </p>
            <button
              onClick={() => setConfirmResetDemo(true)}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg cursor-pointer"
            >
              Bersihkan Semua Data Percontohan (DEMO)
            </button>
          </div>
        </div>
      )}

      {/* Modal Add User */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl border border-slate-200 p-5 space-y-3.5 text-xs animate-in fade-in">
            <h3 className="text-sm font-bold text-slate-900">Tambah Akun Pengguna Baru</h3>
            <form onSubmit={handleCreateUser} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Lengkap & Gelar *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Dra. Maria Raranta, M.Pd"
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Username Login *</label>
                <input
                  type="text"
                  required
                  placeholder="maria.raranta"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Peran Hak Akses</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                  >
                    <option value="admin">Administrator</option>
                    <option value="wakasek">Wakasek Kesiswaan</option>
                    <option value="kepsek">Kepala Sekolah</option>
                    <option value="staf">Staf Administrasi</option>
                    <option value="pembina">Pembina Ekskul/OSIS</option>
                    <option value="auditor">Pengawas / Auditor</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">NIP (Jika Ada)</label>
                  <input
                    type="text"
                    placeholder="1980..."
                    value={newNip}
                    onChange={(e) => setNewNip(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Jabatan / Role Title</label>
                <input
                  type="text"
                  value={newRoleTitle}
                  onChange={(e) => setNewRoleTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="nama@guru.sma.belajar.id"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-lg cursor-pointer"
                >
                  Simpan Pengguna
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Demo Modal */}
      <ConfirmModal
        isOpen={confirmResetDemo}
        title="Bersihkan Data Contoh (DEMO)?"
        message="Tindakan ini akan menghapus seluruh data contoh berlabel DEMO. Data resmi sekolah, konfigurasi profil, akun pengguna, dan data baru yang Anda tambahkan tidak akan dihapus."
        confirmText="Ya, Bersihkan Data Demo"
        isDanger={true}
        onConfirm={handleCleanDemoData}
        onCancel={() => setConfirmResetDemo(false)}
      />
    </div>
  );
};
