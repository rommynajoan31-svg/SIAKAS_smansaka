import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Eye,
  Sparkles,
  Download,
  Printer,
  Edit,
  Trash2,
  FileCheck,
  CheckCircle2,
  Clock,
  Archive,
  ArrowLeft
} from 'lucide-react';
import { DatabaseState, OfficialDocument, DocumentCategory, DocumentStatus, DocumentType } from '../../types';
import { OfficialDocumentViewer } from '../common/OfficialDocumentViewer';
import { ConfirmModal } from '../common/ConfirmModal';

interface DokumenModuleProps {
  state: DatabaseState;
  onUpdateState: (newState: DatabaseState) => void;
  onNavigate: (module: string) => void;
}

export const DokumenModule: React.FC<DokumenModuleProps> = ({
  state,
  onUpdateState,
  onNavigate,
}) => {
  const currentAcademicYear = state.schoolProfile.activeAcademicYear;

  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedStatus, setSelectedStatus] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<OfficialDocument | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDoc, setEditingDoc] = useState<OfficialDocument | null>(null);
  const [deleteDocId, setDeleteDocId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<OfficialDocument>>({
    title: '',
    documentNumber: '',
    category: 'Persuratan',
    documentType: 'Surat Undangan Resmi',
    date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
    subject: '',
    consideration: '',
    legalBasis: '',
    bodyContent: '',
    signatoryName: state.schoolProfile.principalName,
    signatoryTitle: 'Kepala Sekolah',
    signatoryNip: state.schoolProfile.principalNip,
    creatorName: state.schoolProfile.vicePrincipalStudentAffairs,
    status: 'Draf',
  });

  const allDocuments = state.documents.filter(d => d.academicYear === currentAcademicYear);

  const categories = [
    'Semua',
    'Perencanaan',
    'SK & Penugasan',
    'Persuratan',
    'Pelaksanaan',
    'Evaluasi & Laporan',
  ];

  const filteredDocuments = allDocuments.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.documentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.bodyContent.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'Semua' || doc.category === selectedCategory;
    const matchesStatus = selectedStatus === 'Semua' || doc.status === selectedStatus;
    return matchesSearch && matchesCat && matchesStatus;
  });

  const handleOpenAdd = () => {
    setEditingDoc(null);
    const newSeq = String(allDocuments.length + 1).padStart(3, '0');
    setFormData({
      title: 'Surat Undangan Rapat Koordinasi Kesiswaan',
      documentNumber: `${state.schoolProfile.letterNumberPrefix}/UND/${newSeq}/${new Date().getFullYear()}`,
      category: 'Persuratan',
      documentType: 'Surat Undangan Resmi',
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      subject: 'Koordinasi Program Kesiswaan Semester Ganjil',
      consideration: '',
      legalBasis: '',
      bodyContent: `Kepada Yth. Bapak/Ibu Dewan Guru & Pembina Kesiswaan\ndi Tempat\n\nDengan hormat,\n\nSehubungan dengan rencana pelaksanaan kegiatan kesiswaan, kami mengundang Bapak/Ibu untuk hadir pada:\n\nHari / Tanggal : Sabtu, 31 Oktober 2026\nWaktu          : Pukul 10.00 WITA\nTempat         : Ruang Rapat Guru SMAN 1 Kakas\nAcara          : Evaluasi Program Kesiswaan dan Persiapan PHBN\n\nDemikian undangan ini kami sampaikan, atas kerja sama yang baik diucapkan terima kasih.`,
      signatoryName: state.schoolProfile.vicePrincipalStudentAffairs,
      signatoryTitle: 'Wakil Kepala Sekolah Bidang Kesiswaan',
      signatoryNip: state.schoolProfile.vicePrincipalNip,
      creatorName: state.schoolProfile.vicePrincipalStudentAffairs,
      status: 'Draf',
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (doc: OfficialDocument) => {
    setEditingDoc(doc);
    setFormData({ ...doc });
    setShowAddModal(true);
  };

  const handleSaveDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim() || !formData.documentNumber?.trim()) return;

    if (editingDoc) {
      const updatedList = state.documents.map(d => {
        if (d.id === editingDoc.id) {
          const newHistory = [
            ...d.revisionHistory,
            {
              version: d.revisionHistory.length + 1,
              date: new Date().toISOString().slice(0, 10),
              author: state.schoolProfile.vicePrincipalStudentAffairs,
              note: 'Pembaruan isi naskah dokumen',
            },
          ];
          return {
            ...d,
            ...formData,
            revisionHistory: newHistory,
            updatedAt: new Date().toISOString(),
          } as OfficialDocument;
        }
        return d;
      });

      onUpdateState({ ...state, documents: updatedList });
      if (selectedDocument && selectedDocument.id === editingDoc.id) {
        setSelectedDocument({ ...selectedDocument, ...formData } as OfficialDocument);
      }
    } else {
      const newDoc: OfficialDocument = {
        id: 'doc-' + Date.now(),
        documentNumber: formData.documentNumber || '',
        title: formData.title || '',
        category: formData.category as DocumentCategory,
        documentType: formData.documentType as DocumentType,
        academicYear: currentAcademicYear,
        semester: state.schoolProfile.activeSemester,
        date: formData.date || new Date().toISOString().slice(0, 10),
        subject: formData.subject || '',
        consideration: formData.consideration || '',
        legalBasis: formData.legalBasis || '',
        decreeContent: formData.decreeContent || '',
        bodyContent: formData.bodyContent || '',
        signatoryName: formData.signatoryName || state.schoolProfile.principalName,
        signatoryTitle: formData.signatoryTitle || 'Kepala Sekolah',
        signatoryNip: formData.signatoryNip || state.schoolProfile.principalNip,
        creatorName: formData.creatorName || state.schoolProfile.vicePrincipalStudentAffairs,
        status: (formData.status as any) || 'Draf',
        tags: [formData.category || 'Dokumen', 'SMAN 1 Kakas'],
        revisionHistory: [
          {
            version: 1,
            date: new Date().toISOString().slice(0, 10),
            author: state.schoolProfile.vicePrincipalStudentAffairs,
            note: 'Draf dokumen baru dibuat',
          },
        ],
        isImportant: false,
        isDemo: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      onUpdateState({
        ...state,
        documents: [newDoc, ...state.documents],
      });
    }

    setShowAddModal(false);
  };

  const handleStatusChange = (docId: string, newStatus: DocumentStatus) => {
    const updated = state.documents.map(d => 
      d.id === docId ? { 
        ...d, 
        status: newStatus,
        revisionHistory: [
          ...d.revisionHistory,
          {
            version: d.revisionHistory.length + 1,
            date: new Date().toISOString().slice(0, 10),
            author: state.schoolProfile.vicePrincipalStudentAffairs,
            note: `Status diubah menjadi ${newStatus}`,
          },
        ],
      } : d
    );

    onUpdateState({ ...state, documents: updated });
    if (selectedDocument && selectedDocument.id === docId) {
      setSelectedDocument({ ...selectedDocument, status: newStatus });
    }
  };

  const handleDeleteDocument = () => {
    if (!deleteDocId) return;

    onUpdateState({
      ...state,
      documents: state.documents.filter(d => d.id !== deleteDocId),
    });

    if (selectedDocument && selectedDocument.id === deleteDocId) {
      setSelectedDocument(null);
    }
    setDeleteDocId(null);
  };

  return (
    <div className="space-y-6">
      {/* If a document is currently selected for full view */}
      {selectedDocument ? (
        <div className="space-y-4">
          <div className="no-print flex items-center justify-between">
            <button
              onClick={() => setSelectedDocument(null)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Kembali ke Daftar Dokumen
            </button>
            <span className="text-xs text-slate-500 font-medium">
              Pratinjau Tata Naskah Dinas Resmi (A4)
            </span>
          </div>

          <OfficialDocumentViewer
            document={selectedDocument}
            school={state.schoolProfile}
            canEdit={true}
            onEdit={(doc) => handleOpenEdit(doc)}
            onStatusChange={handleStatusChange}
          />
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-900" />
                <h2 className="text-lg font-bold text-slate-900">
                  Pusat Dokumen & Tata Naskah Kesiswaan
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                SK Kepala Sekolah, Surat Tugas, Undangan, Proposal, Daftar Hadir, Berita Acara, dan LPJ Kegiatan.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('generator-ai')}
                className="px-3.5 py-2 text-xs font-bold text-blue-950 bg-gradient-to-r from-amber-300 to-amber-400 hover:from-amber-400 hover:to-amber-500 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-900" />
                Generator Draf AI
              </button>
              <button
                onClick={handleOpenAdd}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Tulis Naskah Manual
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex overflow-x-auto gap-2 border-b border-slate-200 pb-2 text-xs font-semibold">
            {categories.map((cat) => {
              const count = cat === 'Semua' ? allDocuments.length : allDocuments.filter(d => d.category === cat).length;
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-blue-900 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isActive ? 'bg-blue-800 text-amber-300 font-bold' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search & Status Filter */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex-1 min-w-[220px] relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari judul dokumen, nomor surat, perihal, atau kata kunci isi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-600">Status Dokumen:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white focus:outline-none cursor-pointer"
              >
                <option value="Semua">Semua Status</option>
                <option value="Draf">Draf</option>
                <option value="Dalam Pemeriksaan">Dalam Pemeriksaan</option>
                <option value="Perlu Revisi">Perlu Revisi</option>
                <option value="Disetujui">Disetujui</option>
                <option value="Ditandatangani">Ditandatangani</option>
                <option value="Diarsipkan">Diarsipkan</option>
              </select>
            </div>
          </div>

          {/* Document Cards List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDocuments.length === 0 ? (
              <div className="col-span-2 bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500 text-xs">
                Tidak ada dokumen resmi yang ditemukan pada kategori ini.
              </div>
            ) : (
              filteredDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-900 border border-blue-100">
                        {doc.documentType}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        doc.status === 'Ditandatangani' ? 'bg-emerald-100 text-emerald-800' :
                        doc.status === 'Disetujui' ? 'bg-blue-100 text-blue-800' :
                        doc.status === 'Dalam Pemeriksaan' ? 'bg-amber-100 text-amber-800' :
                        doc.status === 'Perlu Revisi' ? 'bg-rose-100 text-rose-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {doc.status}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                      {doc.title}
                    </h3>

                    <p className="text-xs font-mono text-slate-600 bg-slate-50 px-2 py-1 rounded inline-block">
                      {doc.documentNumber}
                    </p>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {doc.subject || doc.bodyContent.slice(0, 120) + '...'}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1">
                      <span>Tanggal: {doc.date}</span>
                      <span>Penandatangan: {doc.signatoryTitle}</span>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => setSelectedDocument(doc)}
                      className="px-3 py-1.5 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Buka Dokumen Resmi
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(doc)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-blue-900 hover:bg-slate-100 cursor-pointer"
                        title="Edit Naskah Dokumen"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteDocId(doc.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                        title="Hapus Dokumen"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* Modal: Tambah / Edit Dokumen Naskah Manual */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                {editingDoc ? 'Edit Naskah Dinas Resmi' : 'Tulis Dokumen / Surat Baru'}
              </h3>
              <span className="text-xs text-blue-900 font-semibold">{currentAcademicYear}</span>
            </div>

            <form onSubmit={handleSaveDocument} className="p-5 space-y-3.5 text-xs overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Judul Dokumen Resmi *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Surat Keputusan Pembina OSIS Masa Bakti 2026/2027"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nomor Surat / Naskah *</label>
                  <input
                    type="text"
                    required
                    value={formData.documentNumber}
                    onChange={(e) => setFormData({ ...formData, documentNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kategori Dokumen</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as DocumentCategory })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none"
                  >
                    <option value="Perencanaan">Perencanaan</option>
                    <option value="SK & Penugasan">SK & Penugasan</option>
                    <option value="Persuratan">Persuratan</option>
                    <option value="Pelaksanaan">Pelaksanaan</option>
                    <option value="Evaluasi & Laporan">Evaluasi & Laporan</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tanggal Surat / Dokumen</label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Perihal / Subject</label>
                  <input
                    type="text"
                    placeholder="Contoh: Undangan Rapat Koordinasi Panitia MPLS"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Menimbang (Konsiderans, khusus SK / Keputusan jika ada)</label>
                  <textarea
                    rows={2}
                    placeholder="a. Bahwa dalam rangka...&#10;b. Bahwa demi kelancaran..."
                    value={formData.consideration}
                    onChange={(e) => setFormData({ ...formData, consideration: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none font-sans"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Mengingat (Dasar Hukum, jika ada)</label>
                  <textarea
                    rows={2}
                    placeholder="1. UU No. 20 Tahun 2003...&#10;2. Permendikbudristek No. 46 Tahun 2023..."
                    value={formData.legalBasis}
                    onChange={(e) => setFormData({ ...formData, legalBasis: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none font-sans"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Isi Dokumen / Batang Tubuh Surat *</label>
                  <textarea
                    rows={6}
                    required
                    placeholder="Ketik isi naskah lengkap surat, proposal, notulen, berita acara, atau laporan..."
                    value={formData.bodyContent}
                    onChange={(e) => setFormData({ ...formData, bodyContent: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none font-serif leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nama Pejabat Penandatangan</label>
                  <input
                    type="text"
                    value={formData.signatoryName}
                    onChange={(e) => setFormData({ ...formData, signatoryName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jabatan Penandatangan</label>
                  <input
                    type="text"
                    value={formData.signatoryTitle}
                    onChange={(e) => setFormData({ ...formData, signatoryTitle: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none"
                  />
                </div>
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
                  Simpan Dokumen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteDocId}
        title="Hapus Dokumen Resmi?"
        message="Dokumen ini akan dihapus dari arsip kesiswaan. Pastikan dokumen tidak sedang digunakan sebagai lampiran LPJ atau pertanggungjawaban dinas."
        confirmText="Ya, Hapus Dokumen"
        isDanger={true}
        onConfirm={handleDeleteDocument}
        onCancel={() => setDeleteDocId(null)}
      />
    </div>
  );
};
