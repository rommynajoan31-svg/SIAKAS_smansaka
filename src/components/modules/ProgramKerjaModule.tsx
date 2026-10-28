import React, { useState } from 'react';
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  Download,
  Printer,
  Edit,
  Trash2,
  FileSpreadsheet,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Eye,
  Sparkles
} from 'lucide-react';
import { DatabaseState, WorkProgram, ProgramCategory, BudgetSource, ProgramStatus } from '../../types';
import { exportProgramsToExcel } from '../../services/exportService';
import { ConfirmModal } from '../common/ConfirmModal';
import { KopSurat } from '../common/KopSurat';

interface ProgramKerjaModuleProps {
  state: DatabaseState;
  onUpdateState: (newState: DatabaseState) => void;
  onNavigate: (module: string) => void;
}

export const ProgramKerjaModule: React.FC<ProgramKerjaModuleProps> = ({
  state,
  onUpdateState,
  onNavigate,
}) => {
  const currentAcademicYear = state.schoolProfile.activeAcademicYear;

  const [activeTab, setActiveTab] = useState<'table' | 'book'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedStatus, setSelectedStatus] = useState<string>('Semua');

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState<WorkProgram | null>(null);
  const [deleteProgramId, setDeleteProgramId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<WorkProgram>>({
    name: '',
    category: 'MPLS',
    purpose: '',
    targetAudience: '',
    indicator: '',
    targetMetric: '',
    implementationTime: '',
    month: 7,
    personInCharge: state.schoolProfile.vicePrincipalStudentAffairs,
    picRole: 'Wakasek Kesiswaan',
    budgetSource: 'BOS Reguler',
    plannedBudget: 0,
    actualBudget: 0,
    status: 'Direncanakan',
    physicalProof: '',
    evaluationNotes: '',
    completenessStatus: 'Lengkap',
  });

  const allPrograms = state.workPrograms.filter(p => p.academicYear === currentAcademicYear);

  const filteredPrograms = allPrograms.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.personInCharge.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.purpose.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Semua' || p.category === selectedCategory;
    const matchesStatus = selectedStatus === 'Semua' || p.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories: ProgramCategory[] = [
    'MPLS',
    'OSIS & MPK',
    'Ekstrakurikuler',
    'Karakter & Disiplin',
    'Prestasi & Lomba',
    'Kegiatan Khusus & PHBN',
    'Layanan & Bimbingan',
  ];

  const handleOpenAdd = () => {
    setEditingProgram(null);
    setFormData({
      name: '',
      category: 'OSIS & MPK',
      purpose: '',
      targetAudience: 'Siswa SMA Negeri 1 Kakas',
      indicator: '',
      targetMetric: '',
      implementationTime: '',
      month: 8,
      personInCharge: state.schoolProfile.vicePrincipalStudentAffairs,
      picRole: 'Wakasek Kesiswaan',
      budgetSource: 'BOS Reguler',
      plannedBudget: 1000000,
      actualBudget: 0,
      status: 'Direncanakan',
      physicalProof: '',
      evaluationNotes: '',
      completenessStatus: 'Perlu Dilengkapi',
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (p: WorkProgram) => {
    setEditingProgram(p);
    setFormData({ ...p });
    setShowAddModal(true);
  };

  const handleSaveProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) return;

    if (editingProgram) {
      // Update
      const updatedList = state.workPrograms.map(p => 
        p.id === editingProgram.id ? { 
          ...p, 
          ...formData, 
          updatedAt: new Date().toISOString() 
        } as WorkProgram : p
      );
      onUpdateState({
        ...state,
        workPrograms: updatedList,
      });
    } else {
      // Add new
      const newProgram: WorkProgram = {
        id: 'prog-' + Date.now(),
        academicYear: currentAcademicYear,
        semester: state.schoolProfile.activeSemester,
        category: formData.category as ProgramCategory,
        name: formData.name || '',
        purpose: formData.purpose || '',
        targetAudience: formData.targetAudience || '',
        indicator: formData.indicator || '',
        targetMetric: formData.targetMetric || '',
        implementationTime: formData.implementationTime || '',
        month: Number(formData.month) || 7,
        personInCharge: formData.personInCharge || state.schoolProfile.vicePrincipalStudentAffairs,
        picRole: formData.picRole || 'Penanggung Jawab',
        budgetSource: formData.budgetSource as BudgetSource,
        plannedBudget: Number(formData.plannedBudget) || 0,
        actualBudget: Number(formData.actualBudget) || 0,
        status: formData.status as ProgramStatus,
        physicalProof: formData.physicalProof || '',
        evaluationNotes: formData.evaluationNotes || '',
        completenessStatus: (formData.completenessStatus as any) || 'Lengkap',
        isDemo: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      onUpdateState({
        ...state,
        workPrograms: [newProgram, ...state.workPrograms],
      });
    }

    setShowAddModal(false);
  };

  const handleDeleteProgram = () => {
    if (!deleteProgramId) return;

    onUpdateState({
      ...state,
      workPrograms: state.workPrograms.filter(p => p.id !== deleteProgramId),
    });

    setDeleteProgramId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-900" />
            <h2 className="text-lg font-bold text-slate-900">
              Program Kerja Tahunan Wakil Kepala Sekolah Bidang Kesiswaan
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Tahun Pelajaran <span className="font-semibold text-slate-900">{currentAcademicYear}</span> • SMA Negeri 1 Kakas
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setActiveTab('table')}
              className={`px-3 py-1 font-semibold rounded-md transition-all cursor-pointer ${
                activeTab === 'table' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Matriks Tabel
            </button>
            <button
              onClick={() => setActiveTab('book')}
              className={`px-3 py-1 font-semibold rounded-md transition-all cursor-pointer ${
                activeTab === 'book' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Buku Dokumen Program (20 Bab)
            </button>
          </div>

          <button
            onClick={() => exportProgramsToExcel(filteredPrograms, currentAcademicYear, 'xlsx')}
            className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg flex items-center gap-1.5 cursor-pointer"
            title="Ekspor ke Excel (.xlsx)"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
            <span className="hidden sm:inline">Ekspor Excel</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Program</span>
          </button>
        </div>
      </div>

      {activeTab === 'table' ? (
        <>
          {/* Filters & Search Toolbar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex-1 min-w-[220px] relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari nama kegiatan, tujuan, atau penanggung jawab..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-600">Bidang:</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white focus:outline-none cursor-pointer"
                >
                  <option value="Semua">Semua Bidang</option>
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-600">Status:</span>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white focus:outline-none cursor-pointer"
                >
                  <option value="Semua">Semua Status</option>
                  <option value="Direncanakan">Direncanakan</option>
                  <option value="Sedang Berjalan">Sedang Berjalan</option>
                  <option value="Selesai">Selesai</option>
                  <option value="Ditunda">Ditunda</option>
                  <option value="Belum Terlaksana">Belum Terlaksana</option>
                </select>
              </div>
            </div>
          </div>

          {/* 15-Column Educational Administration Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse min-w-[1200px]">
                <thead className="bg-slate-900 text-white font-semibold">
                  <tr>
                    <th className="py-3 px-2.5 text-center w-10">No</th>
                    <th className="py-3 px-3">Bidang Program</th>
                    <th className="py-3 px-3">Nama Kegiatan</th>
                    <th className="py-3 px-3">Tujuan & Sasaran</th>
                    <th className="py-3 px-3">Indikator & Target</th>
                    <th className="py-3 px-2.5">Waktu</th>
                    <th className="py-3 px-3">Penanggung Jawab</th>
                    <th className="py-3 px-2.5">Sumber Dana</th>
                    <th className="py-3 px-2.5 text-right">RAB (Rp)</th>
                    <th className="py-3 px-2.5 text-right">Realisasi</th>
                    <th className="py-3 px-2.5 text-center">Status</th>
                    <th className="py-3 px-3">Bukti Fisik</th>
                    <th className="py-3 px-3">Evaluasi</th>
                    <th className="py-3 px-3 text-center sticky right-0 bg-slate-900">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPrograms.length === 0 ? (
                    <tr>
                      <td colSpan={14} className="py-8 text-center text-slate-500">
                        Tidak ada program kerja yang sesuai dengan kriteria pencarian.
                      </td>
                    </tr>
                  ) : (
                    filteredPrograms.map((p, idx) => (
                      <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-2.5 text-center font-bold text-slate-500">
                          {idx + 1}
                        </td>
                        <td className="py-3 px-3 font-semibold text-blue-900">
                          <span className="px-2 py-0.5 rounded bg-blue-50 text-[11px]">
                            {p.category}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-bold text-slate-900 max-w-[200px]">
                          {p.name}
                          {p.isDemo && (
                            <span className="ml-1 text-[9px] font-bold text-amber-700 bg-amber-100 px-1 rounded">
                              DEMO
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 max-w-[180px] text-slate-600">
                          <p className="line-clamp-2">{p.purpose}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">Sasaran: {p.targetAudience}</p>
                        </td>
                        <td className="py-3 px-3 max-w-[180px] text-slate-600">
                          <p className="line-clamp-2">{p.indicator}</p>
                          <p className="text-[10px] font-semibold text-slate-700 mt-0.5">Target: {p.targetMetric}</p>
                        </td>
                        <td className="py-3 px-2.5 text-slate-700 whitespace-nowrap">
                          {p.implementationTime}
                        </td>
                        <td className="py-3 px-3 text-slate-800">
                          <p className="font-semibold">{p.personInCharge}</p>
                          <p className="text-[10px] text-slate-500">{p.picRole}</p>
                        </td>
                        <td className="py-3 px-2.5 text-slate-700 whitespace-nowrap">
                          {p.budgetSource}
                        </td>
                        <td className="py-3 px-2.5 text-right font-medium text-slate-700 whitespace-nowrap">
                          {p.plannedBudget.toLocaleString('id-ID')}
                        </td>
                        <td className="py-3 px-2.5 text-right font-bold text-blue-950 whitespace-nowrap">
                          {p.actualBudget.toLocaleString('id-ID')}
                        </td>
                        <td className="py-3 px-2.5 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap ${
                            p.status === 'Selesai' ? 'bg-emerald-100 text-emerald-800' :
                            p.status === 'Sedang Berjalan' ? 'bg-amber-100 text-amber-800' :
                            p.status === 'Direncanakan' ? 'bg-blue-100 text-blue-800' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-[11px] text-slate-600 max-w-[140px] truncate" title={p.physicalProof}>
                          {p.physicalProof || '-'}
                        </td>
                        <td className="py-3 px-3 text-[11px] text-slate-600 max-w-[150px] truncate" title={p.evaluationNotes}>
                          {p.evaluationNotes || '-'}
                        </td>
                        <td className="py-3 px-3 text-center sticky right-0 bg-white/95 backdrop-blur-xs">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleOpenEdit(p)}
                              className="p-1 rounded text-slate-500 hover:text-blue-900 hover:bg-slate-100 cursor-pointer"
                              title="Edit Program"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteProgramId(p.id)}
                              className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                              title="Hapus Program"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Menampilkan {filteredPrograms.length} dari {allPrograms.length} program kerja</span>
              <button
                onClick={() => window.print()}
                className="text-xs font-semibold text-blue-900 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                Cetak Matriks Halaman Ini
              </button>
            </div>
          </div>
        </>
      ) : (
        /* 20-Chapter Program Kerja Tahunan Document Viewer */
        <div className="bg-white p-8 sm:p-12 rounded-xl border border-slate-200 shadow-lg max-w-4xl mx-auto font-serif text-slate-900 text-sm leading-relaxed space-y-8">
          <KopSurat school={state.schoolProfile} />

          {/* Halaman Judul & Pengesahan */}
          <div className="text-center py-6 border-b border-slate-200">
            <h1 className="text-xl sm:text-2xl font-black uppercase text-blue-950 font-serif">
              PROGRAM KERJA TAHUNAN
            </h1>
            <h2 className="text-base sm:text-lg font-bold uppercase text-slate-800 mt-1">
              WAKIL KEPALA SEKOLAH BIDANG KESISWAAN
            </h2>
            <h3 className="text-sm font-semibold text-slate-700 uppercase mt-0.5 font-sans">
              {state.schoolProfile.name} • TAHUN PELAJARAN {currentAcademicYear}
            </h3>
            <p className="text-xs font-sans text-slate-500 mt-2">
              Kecamatan Kakas, Kabupaten Minahasa, Provinsi Sulawesi Utara
            </p>
          </div>

          {/* Lembar Pengesahan */}
          <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 text-xs font-sans space-y-4">
            <h3 className="font-bold text-slate-900 text-sm uppercase text-center border-b border-slate-200 pb-2">
              LEMBAR PENGESAHAN PROGRAM KERJA
            </h3>
            <p className="text-justify text-slate-700 leading-relaxed">
              Program Kerja Tahunan Wakil Kepala Sekolah Bidang Kesiswaan SMA Negeri 1 Kakas Tahun Pelajaran {currentAcademicYear} telah disusun melalui musyawarah dewan guru, analisis kebutuhan peserta didik, dan selaras dengan arah kebijakan Penguatan Karakter Pelajar Pancasila di Provinsi Sulawesi Utara.
            </p>

            <div className="flex justify-between items-end pt-6">
              <div className="text-center">
                <p className="text-slate-600 mb-12">Disusun Oleh,</p>
                <p className="font-bold text-slate-900 underline">{state.schoolProfile.vicePrincipalStudentAffairs}</p>
                <p className="text-slate-500">Wakasek Bidang Kesiswaan</p>
                <p className="text-[10px] text-slate-400">NIP. {state.schoolProfile.vicePrincipalNip}</p>
              </div>

              <div className="text-center">
                <p className="text-slate-600 mb-12">Mengesahkan,<br/>Kepala SMA Negeri 1 Kakas</p>
                <p className="font-bold text-slate-900 underline">{state.schoolProfile.principalName}</p>
                <p className="text-slate-500">Kepala Satuan Pendidikan</p>
                <p className="text-[10px] text-slate-400">NIP. {state.schoolProfile.principalNip}</p>
              </div>
            </div>
          </div>

          {/* Ringkasan Bab-Bab Dokumen */}
          <div className="space-y-6 text-xs font-sans">
            <div>
              <h3 className="font-bold text-slate-900 text-sm uppercase border-b border-blue-900 pb-1 mb-2">
                I. PENDAHULUAN & LATAR BELAKANG
              </h3>
              <p className="text-justify text-slate-700 leading-relaxed">
                Manajemen kesiswaan di SMA Negeri 1 Kakas diarahkan untuk memberikan pelayanan prima dalam pembinaan kepribadian, kepemimpinan, penalaran akademik, bakat minat seni budaya lokal Minahasa, serta olahraga. Kegiatan kesiswaan dilaksanakan berlandaskan prinsip Sekolah Ramah Anak, tanpa diskriminasi, dan bebas dari segala bentuk perundungan.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 text-sm uppercase border-b border-blue-900 pb-1 mb-2">
                II. LANDASAN HUKUM
              </h3>
              <ol className="list-decimal list-inside space-y-1 text-slate-700 leading-relaxed">
                <li>Undang-Undang Nomor 20 Tahun 2003 tentang Sistem Pendidikan Nasional;</li>
                <li>Peraturan Menteri Pendidikan Nasional Nomor 39 Tahun 2008 tentang Pembinaan Kesiswaan;</li>
                <li>Permendikbudristek Nomor 46 Tahun 2023 tentang Pencegahan dan Penanganan Kekerasan di Lingkungan Satuan Pendidikan;</li>
                <li>Surat Keputusan Kepala Dinas Pendidikan Daerah Provinsi Sulawesi Utara tentang Kalender Pendidikan Tahun Pelajaran {currentAcademicYear}.</li>
              </ol>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 text-sm uppercase border-b border-blue-900 pb-1 mb-2">
                III. MATRIKS PROGRAM KERJA STRATEGIS T.P. {currentAcademicYear}
              </h3>
              <p className="text-slate-600 mb-2">
                Tercatat sebanyak {allPrograms.length} program kerja kesiswaan terstruktur dalam 7 pilar pembinaan.
              </p>
              <div className="space-y-2">
                {allPrograms.map((p, i) => (
                  <div key={p.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex justify-between items-center font-bold text-slate-900">
                      <span>{i + 1}. {p.name}</span>
                      <span className="text-blue-900 font-semibold">{p.implementationTime}</span>
                    </div>
                    <p className="text-slate-600 text-[11px] mt-1">{p.purpose}</p>
                    <div className="mt-2 flex flex-wrap gap-4 text-[10px] text-slate-500 font-medium">
                      <span>PJ: {p.personInCharge}</span>
                      <span>Target: {p.targetMetric}</span>
                      <span>Anggaran: Rp {p.plannedBudget.toLocaleString('id-ID')} ({p.budgetSource})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="no-print pt-4 text-center">
              <button
                onClick={() => window.print()}
                className="px-6 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-lg text-xs shadow-md cursor-pointer inline-flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Cetak Dokumen Lengkap Program Kerja (A4)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Tambah / Edit Program Kerja */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {editingProgram ? 'Edit Program Kerja Kesiswaan' : 'Tambah Program Kerja Baru'}
              </h3>
              <span className="text-xs text-blue-900 font-semibold">T.P. {currentAcademicYear}</span>
            </div>

            <form onSubmit={handleSaveProgram} className="overflow-y-auto p-5 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Nama Kegiatan / Program Kerja *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Gelar Seni Kolintang Pelajar Kakas"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Bidang / Kategori</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as ProgramCategory })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none"
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status Pelaksanaan</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as ProgramStatus })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none"
                  >
                    <option value="Direncanakan">Direncanakan</option>
                    <option value="Sedang Berjalan">Sedang Berjalan</option>
                    <option value="Selesai">Selesai</option>
                    <option value="Ditunda">Ditunda</option>
                    <option value="Belum Terlaksana">Belum Terlaksana</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Tujuan Kegiatan</label>
                  <textarea
                    rows={2}
                    placeholder="Tujuan edukatif dan pembinaan kesiswaan..."
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sasaran Peserta</label>
                  <input
                    type="text"
                    placeholder="Contoh: Siswa Kelas X dan XI"
                    value={formData.targetAudience}
                    onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Indikator Keberhasilan</label>
                  <input
                    type="text"
                    placeholder="Contoh: Kehadiran siswa 100% dan terlaksana tertib"
                    value={formData.indicator}
                    onChange={(e) => setFormData({ ...formData, indicator: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Capaian</label>
                  <input
                    type="text"
                    placeholder="Contoh: 180 Siswa Tuntas"
                    value={formData.targetMetric}
                    onChange={(e) => setFormData({ ...formData, targetMetric: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Waktu Pelaksanaan</label>
                  <input
                    type="text"
                    placeholder="Contoh: 15 - 17 Juli 2026"
                    value={formData.implementationTime}
                    onChange={(e) => setFormData({ ...formData, implementationTime: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Penanggung Jawab (Nama)</label>
                  <input
                    type="text"
                    value={formData.personInCharge}
                    onChange={(e) => setFormData({ ...formData, personInCharge: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Peran / Jabatan Panitia</label>
                  <input
                    type="text"
                    placeholder="Contoh: Wakasek Kesiswaan / Pembina"
                    value={formData.picRole}
                    onChange={(e) => setFormData({ ...formData, picRole: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sumber Dana</label>
                  <select
                    value={formData.budgetSource}
                    onChange={(e) => setFormData({ ...formData, budgetSource: e.target.value as BudgetSource })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none"
                  >
                    <option value="BOS Reguler">BOS Reguler</option>
                    <option value="BOS Kinerja">BOS Kinerja</option>
                    <option value="Komite Sekolah">Komite Sekolah</option>
                    <option value="Swadana / Sponsor">Swadana / Sponsor</option>
                    <option value="Tanpa Biaya">Tanpa Biaya</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Rencana Anggaran (Rp)</label>
                    <input
                      type="number"
                      value={formData.plannedBudget}
                      onChange={(e) => setFormData({ ...formData, plannedBudget: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Realisasi (Rp)</label>
                    <input
                      type="number"
                      value={formData.actualBudget}
                      onChange={(e) => setFormData({ ...formData, actualBudget: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Bukti Fisik / Digital Dokumen</label>
                  <input
                    type="text"
                    placeholder="Contoh: SK Panitia, Proposal, Presensi, Foto Kegiatan, LPJ"
                    value={formData.physicalProof}
                    onChange={(e) => setFormData({ ...formData, physicalProof: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Catatan Evaluasi / Rekomendasi</label>
                  <textarea
                    rows={2}
                    placeholder="Evaluasi kendala, saran perbaikan untuk tahun depan..."
                    value={formData.evaluationNotes}
                    onChange={(e) => setFormData({ ...formData, evaluationNotes: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-lg cursor-pointer shadow-xs"
                >
                  {editingProgram ? 'Simpan Perubahan' : 'Tambahkan ke Program Kerja'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteProgramId}
        title="Hapus Program Kerja?"
        message="Program kerja ini akan dihapus dari tahun pelajaran aktif. Tindakan ini memerlukan persetujuan dan akan dicatat dalam log audit administrasi."
        confirmText="Hapus Program"
        isDanger={true}
        onConfirm={handleDeleteProgram}
        onCancel={() => setDeleteProgramId(null)}
      />
    </div>
  );
};
