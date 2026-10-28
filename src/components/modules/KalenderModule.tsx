import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  MapPin,
  AlertTriangle,
  FileCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Filter,
  User,
  AlertCircle
} from 'lucide-react';
import { DatabaseState, Activity, ProgramCategory } from '../../types';
import { ConfirmModal } from '../common/ConfirmModal';

interface KalenderModuleProps {
  state: DatabaseState;
  onUpdateState: (newState: DatabaseState) => void;
  onNavigate: (module: string) => void;
}

export const KalenderModule: React.FC<KalenderModuleProps> = ({
  state,
  onUpdateState,
  onNavigate,
}) => {
  const currentAcademicYear = state.schoolProfile.activeAcademicYear;

  const [viewMode, setViewMode] = useState<'month' | 'list'>('month');
  const [currentDate, setCurrentDate] = useState(new Date(2026, 9, 1)); // October 2026 default
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [cancelActivityId, setCancelActivityId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Activity>>({
    title: '',
    category: 'Kegiatan Khusus & PHBN',
    dateStart: '2026-10-28',
    dateEnd: '2026-10-28',
    time: '08.00 - 12.00 WITA',
    location: 'SMA Negeri 1 Kakas',
    description: '',
    personInCharge: state.schoolProfile.vicePrincipalStudentAffairs,
    status: 'Persiapan',
    reportDeadline: '2026-11-04',
    budgetPlanned: 1500000,
    participantCount: 100,
    requiredDocs: ['Proposal', 'Daftar Hadir', 'LPJ'],
  });

  const activities = state.activities.filter(a => a.academicYear === currentAcademicYear);

  const filteredActivities = activities.filter(a => {
    return selectedCategory === 'Semua' || a.category === selectedCategory;
  });

  // Calendar calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0 - 11
  const monthName = currentDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Schedule conflict detection helper
  const getConflicts = () => {
    const conflicts: { date: string; items: Activity[] }[] = [];
    const dateMap: { [date: string]: Activity[] } = {};

    filteredActivities.forEach(act => {
      if (act.status !== 'Dibatalkan') {
        dateMap[act.dateStart] = dateMap[act.dateStart] || [];
        dateMap[act.dateStart].push(act);
      }
    });

    Object.entries(dateMap).forEach(([date, acts]) => {
      if (acts.length > 1) {
        conflicts.push({ date, items: acts });
      }
    });

    return conflicts;
  };

  const conflictList = getConflicts();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleOpenAdd = () => {
    setEditingActivity(null);
    setFormData({
      title: '',
      category: 'Kegiatan Khusus & PHBN',
      dateStart: new Date().toISOString().slice(0, 10),
      dateEnd: new Date().toISOString().slice(0, 10),
      time: '08.00 - 12.00 WITA',
      location: 'SMA Negeri 1 Kakas',
      description: '',
      personInCharge: state.schoolProfile.vicePrincipalStudentAffairs,
      status: 'Persiapan',
      reportDeadline: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
      budgetPlanned: 1000000,
      participantCount: 50,
      requiredDocs: ['Proposal', 'Daftar Hadir', 'LPJ'],
    });
    setShowAddModal(true);
  };

  const handleSaveActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) return;

    if (editingActivity) {
      const updated = state.activities.map(a => 
        a.id === editingActivity.id ? { ...a, ...formData } as Activity : a
      );
      onUpdateState({ ...state, activities: updated });
    } else {
      const newAct: Activity = {
        id: 'act-' + Date.now(),
        academicYear: currentAcademicYear,
        semester: state.schoolProfile.activeSemester,
        title: formData.title || '',
        category: formData.category as ProgramCategory,
        dateStart: formData.dateStart || '',
        dateEnd: formData.dateEnd || formData.dateStart || '',
        time: formData.time || '08.00 WITA',
        location: formData.location || 'SMA Negeri 1 Kakas',
        description: formData.description || '',
        personInCharge: formData.personInCharge || state.schoolProfile.vicePrincipalStudentAffairs,
        status: (formData.status as any) || 'Persiapan',
        reportDeadline: formData.reportDeadline || '',
        reportStatus: 'Belum Dibuat',
        budgetPlanned: Number(formData.budgetPlanned) || 0,
        budgetRealized: 0,
        committeeCount: 10,
        participantCount: Number(formData.participantCount) || 50,
        requiredDocs: formData.requiredDocs || ['Proposal', 'LPJ'],
        completedDocs: ['Proposal'],
        isDemo: false,
        createdAt: new Date().toISOString(),
      };

      onUpdateState({
        ...state,
        activities: [newAct, ...state.activities],
      });
    }

    setShowAddModal(false);
  };

  const handleCancelActivity = () => {
    if (!cancelActivityId) return;

    onUpdateState({
      ...state,
      activities: state.activities.map(a => 
        a.id === cancelActivityId ? { ...a, status: 'Dibatalkan' } : a
      ),
    });

    setCancelActivityId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-blue-900" />
            <h2 className="text-lg font-bold text-slate-900">
              Kalender & Agenda Kesiswaan
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Penjadwalan kegiatan harian, mingguan, bulanan, deteksi benturan, dan tenggat pelaporan.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 font-semibold rounded-md transition-all cursor-pointer ${
                viewMode === 'month' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Tampilan Kalender
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 font-semibold rounded-md transition-all cursor-pointer ${
                viewMode === 'list' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Daftar Agenda
            </button>
          </div>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Tambah Agenda
          </button>
        </div>
      </div>

      {/* Schedule Conflict Warning if any */}
      {conflictList.length > 0 && (
        <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-3 text-xs text-amber-900 animate-in fade-in">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-bold">Peringatan Benturan Jadwal Terdeteksi!</h4>
            <p className="mt-0.5 text-amber-800">
              Terdapat lebih dari satu kegiatan kesiswaan pada tanggal yang sama:
            </p>
            <ul className="mt-1 list-disc list-inside space-y-0.5 font-medium">
              {conflictList.map(c => (
                <li key={c.date}>
                  Tanggal <span className="font-bold">{c.date}</span>: {c.items.map(i => i.title).join(' DAN ')}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Month Navigation & Category Filter */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevMonth}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 text-slate-700" />
          </button>
          <span className="text-sm font-bold text-slate-900 min-w-[150px] text-center">
            {monthName}
          </span>
          <button
            onClick={handleNextMonth}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4 text-slate-700" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-600">Filter Bidang:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white focus:outline-none cursor-pointer"
          >
            <option value="Semua">Semua Kategori</option>
            <option value="MPLS">MPLS</option>
            <option value="OSIS & MPK">OSIS & MPK</option>
            <option value="Ekstrakurikuler">Ekstrakurikuler</option>
            <option value="Karakter & Disiplin">Karakter & Disiplin</option>
            <option value="Prestasi & Lomba">Prestasi & Lomba</option>
            <option value="Kegiatan Khusus & PHBN">Kegiatan Khusus & PHBN</option>
            <option value="Layanan & Bimbingan">Layanan & Bimbingan</option>
          </select>
        </div>
      </div>

      {viewMode === 'month' ? (
        /* Monthly Calendar Grid */
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 bg-slate-900 text-white text-center py-2 text-xs font-bold">
            <span className="text-rose-300">Minggu</span>
            <span>Senin</span>
            <span>Selasa</span>
            <span>Rabu</span>
            <span>Kamis</span>
            <span>Jumat</span>
            <span className="text-amber-300">Sabtu</span>
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 border-t border-slate-200 divide-x divide-y divide-slate-100 text-xs">
            {/* Empty cells before month start */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} className="min-h-[100px] bg-slate-50/50 p-1.5 text-slate-300" />
            ))}

            {/* Days in Month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNumber = i + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
              const dayActivities = filteredActivities.filter(a => a.dateStart === dateStr);

              const isConflict = dayActivities.filter(a => a.status !== 'Dibatalkan').length > 1;

              return (
                <div
                  key={dayNumber}
                  className={`min-h-[110px] p-2 hover:bg-blue-50/30 transition-colors flex flex-col justify-between ${
                    isConflict ? 'bg-amber-50/50' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-bold ${dayNumber === 1 || dayNumber === daysInMonth ? 'text-blue-900' : 'text-slate-700'}`}>
                      {dayNumber}
                    </span>
                    {isConflict && (
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" title="Benturan Jadwal" />
                    )}
                  </div>

                  <div className="space-y-1 flex-1 overflow-y-auto max-h-[80px]">
                    {dayActivities.map(act => (
                      <div
                        key={act.id}
                        onClick={() => { setEditingActivity(act); setFormData(act); setShowAddModal(true); }}
                        className={`p-1 rounded text-[10px] leading-tight font-semibold cursor-pointer truncate ${
                          act.status === 'Selesai' ? 'bg-emerald-100 text-emerald-900 border border-emerald-200' :
                          act.status === 'Sedang Berlangsung' ? 'bg-amber-100 text-amber-900 border border-amber-200' :
                          act.status === 'Dibatalkan' ? 'bg-slate-100 text-slate-400 line-through' :
                          'bg-blue-100 text-blue-900 border border-blue-200'
                        }`}
                        title={`${act.title} (${act.time} - ${act.location})`}
                      >
                        {act.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
          {filteredActivities.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              Belum ada agenda kesiswaan pada kategori ini.
            </div>
          ) : (
            filteredActivities.map(act => (
              <div key={act.id} className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                <div className="space-y-1.5 flex-1 min-w-[280px]">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      act.status === 'Selesai' ? 'bg-emerald-100 text-emerald-800' :
                      act.status === 'Sedang Berlangsung' ? 'bg-amber-100 text-amber-800' :
                      act.status === 'Dibatalkan' ? 'bg-rose-100 text-rose-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {act.status}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {act.category}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">{act.title}</h3>
                  </div>

                  <p className="text-xs text-slate-600">{act.description}</p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1 text-slate-700 font-medium">
                      <Clock className="w-3.5 h-3.5 text-blue-900" />
                      {act.dateStart} • {act.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {act.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      PJ: {act.personInCharge}
                    </span>
                  </div>
                </div>

                <div className="text-right flex-shrink-0 space-y-2">
                  <div className="text-xs">
                    <span className="text-slate-500 block text-[11px]">Tenggat LPJ:</span>
                    <span className="font-bold text-rose-600">{act.reportDeadline}</span>
                  </div>

                  <div className="flex items-center gap-2 justify-end">
                    <button
                      onClick={() => { setEditingActivity(act); setFormData(act); setShowAddModal(true); }}
                      className="px-2.5 py-1 text-xs font-semibold text-blue-900 bg-blue-50 hover:bg-blue-100 rounded cursor-pointer"
                    >
                      Ubah
                    </button>
                    {act.status !== 'Dibatalkan' && (
                      <button
                        onClick={() => setCancelActivityId(act.id)}
                        className="px-2.5 py-1 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded cursor-pointer"
                      >
                        Batalkan
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal: Tambah / Edit Agenda */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                {editingActivity ? 'Edit Agenda Kesiswaan' : 'Tambah Agenda Kegiatan Baru'}
              </h3>
              <span className="text-xs text-blue-900 font-semibold">{currentAcademicYear}</span>
            </div>

            <form onSubmit={handleSaveActivity} className="p-4 space-y-3.5 text-xs overflow-y-auto">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Kegiatan *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Upacara Hari Pahlawan & Tabur Bunga Kakas"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kategori</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as ProgramCategory })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                  >
                    <option value="MPLS">MPLS</option>
                    <option value="OSIS & MPK">OSIS & MPK</option>
                    <option value="Ekstrakurikuler">Ekstrakurikuler</option>
                    <option value="Karakter & Disiplin">Karakter & Disiplin</option>
                    <option value="Prestasi & Lomba">Prestasi & Lomba</option>
                    <option value="Kegiatan Khusus & PHBN">Kegiatan Khusus & PHBN</option>
                    <option value="Layanan & Bimbingan">Layanan & Bimbingan</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status Persiapan</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                  >
                    <option value="Persiapan">Persiapan</option>
                    <option value="Sedang Berlangsung">Sedang Berlangsung</option>
                    <option value="Selesai">Selesai</option>
                    <option value="Dibatalkan">Dibatalkan</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tanggal Mulai</label>
                  <input
                    type="date"
                    required
                    value={formData.dateStart}
                    onChange={(e) => setFormData({ ...formData, dateStart: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Waktu / Pukul</label>
                  <input
                    type="text"
                    placeholder="08.00 - 12.00 WITA"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Lokasi Kegiatan</label>
                <input
                  type="text"
                  placeholder="Contoh: Lapangan Utama SMA Negeri 1 Kakas"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Penanggung Jawab</label>
                  <input
                    type="text"
                    value={formData.personInCharge}
                    onChange={(e) => setFormData({ ...formData, personInCharge: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tenggat Laporan (LPJ)</label>
                  <input
                    type="date"
                    value={formData.reportDeadline}
                    onChange={(e) => setFormData({ ...formData, reportDeadline: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Keterangan / Deskripsi</label>
                <textarea
                  rows={2}
                  placeholder="Detail rencana teknis kegiatan..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-lg cursor-pointer"
                >
                  Simpan Agenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      <ConfirmModal
        isOpen={!!cancelActivityId}
        title="Batalkan Agenda Kegiatan?"
        message="Status agenda ini akan diubah menjadi 'Dibatalkan'. Catatan pembatalan akan disimpan dalam rekam jejak kegiatan kesiswaan."
        confirmText="Ya, Batalkan Kegiatan"
        isDanger={true}
        onConfirm={handleCancelActivity}
        onCancel={() => setCancelActivityId(null)}
      />
    </div>
  );
};
