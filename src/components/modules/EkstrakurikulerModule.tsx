import React, { useState } from 'react';
import {
  Compass,
  Plus,
  Users,
  Calendar,
  Award,
  CheckCircle2,
  Printer,
  Sparkles,
  MapPin,
  Clock,
  UserCheck
} from 'lucide-react';
import { DatabaseState, Extracurricular } from '../../types';

interface EkstrakurikulerModuleProps {
  state: DatabaseState;
  onUpdateState: (newState: DatabaseState) => void;
  onNavigate: (module: string) => void;
}

export const EkstrakurikulerModule: React.FC<EkstrakurikulerModuleProps> = ({
  state,
  onUpdateState,
  onNavigate,
}) => {
  const currentAcademicYear = state.schoolProfile.activeAcademicYear;

  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEkskul, setSelectedEkskul] = useState<Extracurricular | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Extracurricular>>({
    name: '',
    category: 'Olahraga',
    advisor: state.schoolProfile.vicePrincipalStudentAffairs,
    coach: '',
    scheduleDay: 'Sabtu',
    scheduleTime: '15.00 - 17.00 WITA',
    location: 'Lapangan SMAN 1 Kakas',
    memberCount: 30,
    semesterGoal: '',
    achievements: [],
    isMandatory: false,
    active: true,
  });

  const extracurriculars = state.extracurriculars;

  const filteredEkskul = extracurriculars.filter(e => {
    return selectedCategory === 'Semua' || e.category === selectedCategory;
  });

  const categories = [
    'Semua',
    'Kepramukaan',
    'Seni & Budaya Minahasa',
    'Olahraga',
    'Paskibra & Kedisiplinan',
    'Akademik / Sains',
    'PMR & Kemanusiaan',
  ];

  const handleSaveEkskul = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) return;

    const newEkskul: Extracurricular = {
      id: 'ekskul-' + Date.now(),
      name: formData.name || '',
      category: formData.category as any,
      advisor: formData.advisor || state.schoolProfile.vicePrincipalStudentAffairs,
      coach: formData.coach || '',
      scheduleDay: formData.scheduleDay || 'Sabtu',
      scheduleTime: formData.scheduleTime || '15.00 WITA',
      location: formData.location || 'Kampus SMAN 1 Kakas',
      memberCount: Number(formData.memberCount) || 20,
      semesterGoal: formData.semesterGoal || 'Pembinaan bakat dan minat peserta didik',
      achievements: [],
      isMandatory: !!formData.isMandatory,
      active: true,
      recentSessions: [
        { date: new Date().toISOString().slice(0, 10), topic: 'Latihan perdana & konsolidasi anggota', attendanceCount: Number(formData.memberCount) || 20 }
      ],
    };

    onUpdateState({
      ...state,
      extracurriculars: [...state.extracurriculars, newEkskul],
    });

    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-blue-900" />
            <h2 className="text-lg font-bold text-slate-900">
              Modul Pembinaan Kegiatan Ekstrakurikuler
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pengelolaan kepramukaan, seni budaya Minahasa, olahraga, sains, Paskibra, dan PMR di SMA Negeri 1 Kakas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('generator-ai')}
            className="px-3.5 py-2 text-xs font-bold text-blue-950 bg-amber-400 hover:bg-amber-500 rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-900" />
            Draf SK Pembina Ekskul
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Tambah Ekstrakurikuler
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex overflow-x-auto gap-2 border-b border-slate-200 pb-2 text-xs font-semibold">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-900 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Ekstrakurikuler Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEkskul.map((e) => (
          <div
            key={e.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-900">
                  {e.category}
                </span>
                {e.isMandatory && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                    Ekskul Wajib
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold text-slate-900 leading-snug">
                {e.name}
              </h3>

              <div className="text-xs space-y-1 text-slate-600">
                <p>Pembina: <span className="font-semibold text-slate-800">{e.advisor}</span></p>
                {e.coach && <p>Pelatih: <span className="font-semibold text-slate-800">{e.coach}</span></p>}
              </div>

              <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-1 border border-slate-100">
                <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-blue-900" />
                  <span>{e.scheduleDay}, {e.scheduleTime}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{e.location}</span>
                </div>
              </div>

              <div className="text-xs text-slate-600">
                <span className="text-[11px] font-bold text-slate-700 block">Target Semester Ini:</span>
                <p className="italic text-[11px]">{e.semesterGoal}</p>
              </div>

              {e.achievements.length > 0 && (
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-amber-800 flex items-center gap-1">
                    <Award className="w-3 h-3 text-amber-600" /> Prestasi Terkini:
                  </span>
                  <ul className="list-disc list-inside text-[11px] text-slate-700 mt-1">
                    {e.achievements.map((ach, idx) => (
                      <li key={idx} className="truncate">{ach}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="font-bold text-blue-900 flex items-center gap-1">
                <Users className="w-3.5 h-3.5" /> {e.memberCount} Siswa
              </span>

              <button
                onClick={() => setSelectedEkskul(e)}
                className="text-xs font-semibold text-blue-900 hover:underline cursor-pointer"
              >
                Lihat Presensi Latihan →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Ekskul Presensi Modal */}
      {selectedEkskul && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-lg w-full shadow-2xl border border-slate-200 p-5 space-y-4 animate-in fade-in">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">{selectedEkskul.name}</h3>
                <p className="text-xs text-slate-500">Jurnal Presensi & Materi Latihan Mingguan</p>
              </div>
              <button
                onClick={() => setSelectedEkskul(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <p className="font-bold text-slate-700">Daftar Sesi Latihan Terkini:</p>
              {selectedEkskul.recentSessions.map((sess, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-900">{sess.topic}</span>
                    <span className="text-[11px] text-slate-500 block">Tanggal: {sess.date}</span>
                  </div>
                  <span className="px-2.5 py-1 font-bold text-emerald-800 bg-emerald-100 rounded-full text-xs">
                    {sess.attendanceCount} Hadir
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedEkskul(null)}
                className="px-4 py-2 bg-blue-900 text-white font-bold rounded-lg text-xs cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Add Ekskul */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl border border-slate-200 p-5 space-y-3.5 text-xs animate-in fade-in max-h-[90vh] overflow-y-auto">
            <h3 className="text-sm font-bold text-slate-900">Tambah Ekstrakurikuler Baru</h3>
            <form onSubmit={handleSaveEkskul} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Ekstrakurikuler *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Klub Debat Bahasa Inggris SMAN 1 Kakas"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Bidang / Kategori</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                >
                  <option value="Kepramukaan">Kepramukaan</option>
                  <option value="Seni & Budaya Minahasa">Seni & Budaya Minahasa</option>
                  <option value="Olahraga">Olahraga</option>
                  <option value="Paskibra & Kedisiplinan">Paskibra & Kedisiplinan</option>
                  <option value="Akademik / Sains">Akademik / Sains</option>
                  <option value="PMR & Kemanusiaan">PMR & Kemanusiaan</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Pembina Guru</label>
                  <input
                    type="text"
                    value={formData.advisor}
                    onChange={(e) => setFormData({ ...formData, advisor: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Pelatih Luar (Opsional)</label>
                  <input
                    type="text"
                    placeholder="Nama pelatih luar"
                    value={formData.coach}
                    onChange={(e) => setFormData({ ...formData, coach: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hari Latihan</label>
                  <input
                    type="text"
                    placeholder="Contoh: Jumat"
                    value={formData.scheduleDay}
                    onChange={(e) => setFormData({ ...formData, scheduleDay: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Waktu Latihan</label>
                  <input
                    type="text"
                    placeholder="15.30 - 17.30 WITA"
                    value={formData.scheduleTime}
                    onChange={(e) => setFormData({ ...formData, scheduleTime: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Semester</label>
                <textarea
                  rows={2}
                  placeholder="Target pencapaian kemampuan / lomba..."
                  value={formData.semesterGoal}
                  onChange={(e) => setFormData({ ...formData, semesterGoal: e.target.value })}
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
                  Simpan Ekstrakurikuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
