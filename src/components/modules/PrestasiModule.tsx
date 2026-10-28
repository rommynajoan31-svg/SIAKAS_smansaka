import React, { useState } from 'react';
import {
  Trophy,
  Plus,
  Search,
  Filter,
  FileSpreadsheet,
  Printer,
  Award,
  Sparkles,
  Calendar,
  User,
  GraduationCap
} from 'lucide-react';
import { DatabaseState, StudentAchievement } from '../../types';
import { exportAchievementsToExcel } from '../../services/exportService';

interface PrestasiModuleProps {
  state: DatabaseState;
  onUpdateState: (newState: DatabaseState) => void;
  onNavigate: (module: string) => void;
}

export const PrestasiModule: React.FC<PrestasiModuleProps> = ({
  state,
  onUpdateState,
  onNavigate,
}) => {
  const currentAcademicYear = state.schoolProfile.activeAcademicYear;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedField, setSelectedField] = useState('Semua');
  const [selectedLevel, setSelectedLevel] = useState('Semua');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<StudentAchievement>>({
    studentName: '',
    studentNis: '',
    classRoom: 'XI MIPA 1',
    competitionName: '',
    field: 'Akademik',
    level: 'Kabupaten Minahasa',
    organizer: '',
    date: new Date().toISOString().slice(0, 10),
    rankOrAward: 'Juara 1 (Medali Emas)',
    coachTeacher: state.schoolProfile.vicePrincipalStudentAffairs,
    certificateNumber: '',
    assignmentLetterNumber: `${state.schoolProfile.letterNumberPrefix}/ST-LOMBA/0${state.achievements.length + 1}/2026`,
  });

  const allAchievements = state.achievements.filter(a => a.academicYear === currentAcademicYear);

  const filtered = allAchievements.filter(a => {
    const matchesSearch = a.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.competitionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.organizer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesField = selectedField === 'Semua' || a.field === selectedField;
    const matchesLevel = selectedLevel === 'Semua' || a.level === selectedLevel;
    return matchesSearch && matchesField && matchesLevel;
  });

  const handleSaveAchievement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentName?.trim() || !formData.competitionName?.trim()) return;

    const newAch: StudentAchievement = {
      id: 'ach-' + Date.now(),
      studentName: formData.studentName || '',
      studentNis: formData.studentNis || '-',
      classRoom: formData.classRoom || 'XI',
      competitionName: formData.competitionName || '',
      field: formData.field as any,
      level: formData.level as any,
      organizer: formData.organizer || 'Dinas Pendidikan',
      date: formData.date || new Date().toISOString().slice(0, 10),
      rankOrAward: formData.rankOrAward || 'Juara 1',
      coachTeacher: formData.coachTeacher || state.schoolProfile.vicePrincipalStudentAffairs,
      certificateNumber: formData.certificateNumber || 'SERT/' + Date.now(),
      assignmentLetterNumber: formData.assignmentLetterNumber || '',
      academicYear: currentAcademicYear,
      semester: state.schoolProfile.activeSemester,
    };

    onUpdateState({
      ...state,
      achievements: [newAch, ...state.achievements],
    });

    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-bold text-slate-900">
              Basis Data Prestasi & Rekapitulasi Keikutsertaan Lomba
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pencatatan prestasi peserta didik SMA Negeri 1 Kakas pada ajang akademik, seni budaya, olahraga, sains, dan keagamaan.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportAchievementsToExcel(filtered, currentAcademicYear)}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg flex items-center gap-1.5 cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
            Ekspor Excel
          </button>
          <button
            onClick={() => onNavigate('generator-ai')}
            className="px-3.5 py-2 text-xs font-bold text-blue-950 bg-amber-400 hover:bg-amber-500 rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-900" />
            Buat Surat Tugas Lomba
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Catat Prestasi Baru
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Total Prestasi T.P. Ini</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{allAchievements.length}</span>
          <span className="text-[10px] text-emerald-700 font-semibold">Tercatat di SIM Kesiswaan</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Tingkat Minahasa</span>
          <span className="text-2xl font-black text-blue-900 mt-1 block">
            {allAchievements.filter(a => a.level === 'Kabupaten Minahasa').length}
          </span>
          <span className="text-[10px] text-slate-400">FLS2N, OSN-K, PBVSI</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Tingkat Sulawesi Utara</span>
          <span className="text-2xl font-black text-amber-600 mt-1 block">
            {allAchievements.filter(a => a.level === 'Provinsi Sulawesi Utara').length}
          </span>
          <span className="text-[10px] text-slate-400">Balai Bahasa, Kesenian</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Siswa Berprestasi</span>
          <span className="text-2xl font-black text-purple-700 mt-1 block">
            {new Set(allAchievements.map(a => a.studentName)).size}
          </span>
          <span className="text-[10px] text-slate-400">Penerima Penghargaan</span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex-1 min-w-[220px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari nama siswa, nama lomba, atau instansi penyelenggara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-600">Bidang:</span>
          <select
            value={selectedField}
            onChange={(e) => setSelectedField(e.target.value)}
            className="px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white focus:outline-none"
          >
            <option value="Semua">Semua Bidang</option>
            <option value="Akademik">Akademik</option>
            <option value="Seni & Budaya">Seni & Budaya</option>
            <option value="Olahraga">Olahraga</option>
            <option value="Pramuka / Paskibra">Pramuka / Paskibra</option>
            <option value="Riset & Bahasa">Riset & Bahasa</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-600">Tingkat:</span>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white focus:outline-none"
          >
            <option value="Semua">Semua Tingkat</option>
            <option value="Kecamatan Kakas">Kecamatan Kakas</option>
            <option value="Kabupaten Minahasa">Kabupaten Minahasa</option>
            <option value="Provinsi Sulawesi Utara">Provinsi Sulawesi Utara</option>
            <option value="Tingkat Nasional">Tingkat Nasional</option>
          </select>
        </div>
      </div>

      {/* Table of Achievements */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-900 text-white font-bold">
              <tr>
                <th className="py-3 px-3 text-center w-10">No</th>
                <th className="py-3 px-3">Nama Siswa & Kelas</th>
                <th className="py-3 px-4">Nama Lomba / Kompetisi</th>
                <th className="py-3 px-3">Bidang & Tingkat</th>
                <th className="py-3 px-3">Hasil / Prestasi</th>
                <th className="py-3 px-3">Penyelenggara & Tanggal</th>
                <th className="py-3 px-3">Guru Pembimbing</th>
                <th className="py-3 px-3">No. Sertifikat & Surat Tugas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    Belum ada data prestasi yang sesuai dengan kriteria filter.
                  </td>
                </tr>
              ) : (
                filtered.map((ach, idx) => (
                  <tr key={ach.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 text-center font-bold text-slate-500">{idx + 1}</td>
                    <td className="py-3 px-3">
                      <p className="font-bold text-slate-900">{ach.studentName}</p>
                      <p className="text-[11px] text-slate-500">NIS: {ach.studentNis} • Kelas: {ach.classRoom}</p>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900 max-w-[220px]">
                      {ach.competitionName}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-900 block w-max">
                        {ach.field}
                      </span>
                      <span className="text-[11px] text-slate-600 block mt-0.5">
                        {ach.level}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 inline-flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-amber-600" />
                        {ach.rankOrAward}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-700">
                      <p className="font-medium">{ach.organizer}</p>
                      <p className="text-[10px] text-slate-400">{ach.date}</p>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-800">
                      {ach.coachTeacher}
                    </td>
                    <td className="py-3 px-3 text-[11px] text-slate-600 font-mono">
                      <p className="truncate max-w-[140px]" title={ach.certificateNumber}>Sertifikat: {ach.certificateNumber}</p>
                      {ach.assignmentLetterNumber && (
                        <p className="text-[10px] text-blue-900 truncate max-w-[140px]" title={ach.assignmentLetterNumber}>
                          ST: {ach.assignmentLetterNumber}
                        </p>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Menampilkan {filtered.length} prestasi siswa</span>
          <button
            onClick={() => window.print()}
            className="text-xs font-semibold text-blue-900 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" /> Cetak Piagam / Rekapitulasi
          </button>
        </div>
      </div>

      {/* Modal Add Achievement */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-lg w-full shadow-2xl border border-slate-200 p-5 space-y-3.5 text-xs animate-in fade-in max-h-[90vh] overflow-y-auto">
            <h3 className="text-sm font-bold text-slate-900">Catat Prestasi Peserta Didik Baru</h3>
            <form onSubmit={handleSaveAchievement} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Siswa / Tim *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Chelsea Mandagi"
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">NIS Siswa</label>
                  <input
                    type="text"
                    placeholder="242510042"
                    value={formData.studentNis}
                    onChange={(e) => setFormData({ ...formData, studentNis: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kelas</label>
                  <input
                    type="text"
                    placeholder="XI MIPA 1"
                    value={formData.classRoom}
                    onChange={(e) => setFormData({ ...formData, classRoom: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Lomba / Kompetisi *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: FLS2N Jenjang SMA Tingkat Minahasa"
                  value={formData.competitionName}
                  onChange={(e) => setFormData({ ...formData, competitionName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Bidang Lomba</label>
                  <select
                    value={formData.field}
                    onChange={(e) => setFormData({ ...formData, field: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                  >
                    <option value="Akademik">Akademik</option>
                    <option value="Seni & Budaya">Seni & Budaya</option>
                    <option value="Olahraga">Olahraga</option>
                    <option value="Pramuka / Paskibra">Pramuka / Paskibra</option>
                    <option value="Riset & Bahasa">Riset & Bahasa</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tingkat</label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                  >
                    <option value="Kecamatan Kakas">Kecamatan Kakas</option>
                    <option value="Kabupaten Minahasa">Kabupaten Minahasa</option>
                    <option value="Provinsi Sulawesi Utara">Provinsi Sulawesi Utara</option>
                    <option value="Tingkat Nasional">Tingkat Nasional</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hasil / Peringkat</label>
                  <input
                    type="text"
                    placeholder="Contoh: Juara 1 (Medali Emas)"
                    value={formData.rankOrAward}
                    onChange={(e) => setFormData({ ...formData, rankOrAward: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tanggal</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Instansi Penyelenggara</label>
                <input
                  type="text"
                  placeholder="Contoh: Balai Pengembangan Talenta Indonesia (BPTI)"
                  value={formData.organizer}
                  onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Guru Pembimbing</label>
                  <input
                    type="text"
                    value={formData.coachTeacher}
                    onChange={(e) => setFormData({ ...formData, coachTeacher: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nomor Sertifikat / Piagam</label>
                  <input
                    type="text"
                    placeholder="Contoh: 0482/FLS2N/MIN/2026"
                    value={formData.certificateNumber}
                    onChange={(e) => setFormData({ ...formData, certificateNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                  />
                </div>
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
                  Simpan Prestasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
