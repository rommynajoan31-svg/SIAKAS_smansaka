import React, { useState } from 'react';
import {
  Archive,
  Search,
  Filter,
  Download,
  Eye,
  Star,
  FileText,
  Clock,
  Upload,
  Calendar,
  CheckCircle2,
  FileCheck
} from 'lucide-react';
import { DatabaseState, OfficialDocument } from '../../types';

interface ArsipModuleProps {
  state: DatabaseState;
  onUpdateState: (newState: DatabaseState) => void;
  onNavigate: (module: string) => void;
  onViewDocument: (doc: OfficialDocument) => void;
}

export const ArsipModule: React.FC<ArsipModuleProps> = ({
  state,
  onUpdateState,
  onNavigate,
  onViewDocument,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('Semua');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [onlyImportant, setOnlyImportant] = useState(false);

  const documents = state.documents;

  const filtered = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.documentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.creatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesYear = selectedYear === 'Semua' || doc.academicYear === selectedYear;
    const matchesCat = selectedCategory === 'Semua' || doc.category === selectedCategory;
    const matchesImportant = !onlyImportant || doc.isImportant;

    return matchesSearch && matchesYear && matchesCat && matchesImportant;
  });

  const toggleImportant = (docId: string) => {
    onUpdateState({
      ...state,
      documents: state.documents.map(d => 
        d.id === docId ? { ...d, isImportant: !d.isImportant } : d
      ),
    });
  };

  const handleSimulateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newDoc: OfficialDocument = {
      id: 'doc-upload-' + Date.now(),
      documentNumber: `${state.schoolProfile.letterNumberPrefix}/ARSIP/${String(state.documents.length + 1).padStart(3, '0')}/${new Date().getFullYear()}`,
      title: file.name.replace(/\.[^/.]+$/, ''),
      category: 'Pelaksanaan',
      documentType: 'Dokumen Lainnya',
      academicYear: state.schoolProfile.activeAcademicYear,
      semester: state.schoolProfile.activeSemester,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      subject: `Berkas unggahan digital: ${file.name}`,
      bodyContent: `Dokumen digital resmi telah diarsipkan ke dalam sistem SIAKAS.\nNama Berkas: ${file.name}\nUkuran: ${(file.size / 1024).toFixed(1)} KB\nTipe Berkas: ${file.type || 'Dokumen'}\nWaktu Unggah: ${new Date().toLocaleString('id-ID')}`,
      signatoryName: state.schoolProfile.principalName,
      signatoryTitle: 'Kepala Sekolah',
      signatoryNip: state.schoolProfile.principalNip,
      creatorName: state.schoolProfile.vicePrincipalStudentAffairs,
      status: 'Diarsipkan',
      tags: ['Unggahan Digital', file.type || 'File'],
      revisionHistory: [
        {
          version: 1,
          date: new Date().toISOString().slice(0, 10),
          author: state.schoolProfile.vicePrincipalStudentAffairs,
          note: `Unggah berkas digital ${file.name}`,
        },
      ],
      attachments: [{ name: file.name, size: `${(file.size / 1024).toFixed(1)} KB`, type: file.type }],
      isImportant: true,
      isDemo: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onUpdateState({
      ...state,
      documents: [newDoc, ...state.documents],
    });

    alert(`Berkas "${file.name}" berhasil diarsipkan ke SIAKAS!`);
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Archive className="w-5 h-5 text-blue-900" />
            <h2 className="text-lg font-bold text-slate-900">
              Pusat Arsip Digital & Pencarian Cepat
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Penyimpanan terstruktur dokumen SK, surat masuk/keluar, proposal, KAK, notulen, berita acara, dan laporan lintas tahun pelajaran.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="px-4 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors">
            <Upload className="w-4 h-4" />
            <span>Unggah Berkas Arsip</span>
            <input type="file" onChange={handleSimulateUpload} className="hidden" />
          </label>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex-1 min-w-[220px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari berdasarkan nomor arsip, judul dokumen, tag, atau kata kunci..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-600">Tahun:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white focus:outline-none"
            >
              <option value="Semua">Semua Tahun</option>
              {state.academicYears.map(y => (
                <option key={y.id} value={y.code}>{y.code}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-600">Kategori:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white focus:outline-none"
            >
              <option value="Semua">Semua Kategori</option>
              <option value="Perencanaan">Perencanaan</option>
              <option value="SK & Penugasan">SK & Penugasan</option>
              <option value="Persuratan">Persuratan</option>
              <option value="Pelaksanaan">Pelaksanaan</option>
              <option value="Evaluasi & Laporan">Evaluasi & Laporan</option>
            </select>
          </div>

          <button
            onClick={() => setOnlyImportant(!onlyImportant)}
            className={`px-3 py-1.5 rounded-lg border font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
              onlyImportant
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${onlyImportant ? 'fill-amber-500 text-amber-500' : ''}`} />
            <span>Dokumen Bintang</span>
          </button>
        </div>
      </div>

      {/* Archive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-3 bg-white p-12 text-center text-slate-400 rounded-xl border border-slate-200 text-xs">
            Tidak ada dokumen arsip yang sesuai dengan kriteria filter.
          </div>
        ) : (
          filtered.map((doc) => (
            <div
              key={doc.id}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                    {doc.category}
                  </span>
                  <button
                    onClick={() => toggleImportant(doc.id)}
                    className="p-1 text-slate-400 hover:text-amber-500 cursor-pointer"
                    title={doc.isImportant ? 'Hapus Bintang' : 'Tandai Dokumen Penting'}
                  >
                    <Star className={`w-4 h-4 ${doc.isImportant ? 'fill-amber-400 text-amber-500' : ''}`} />
                  </button>
                </div>

                <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                  {doc.title}
                </h3>

                <p className="text-[11px] font-mono text-blue-900 bg-blue-50/70 px-2 py-0.5 rounded inline-block">
                  {doc.documentNumber}
                </p>

                <p className="text-xs text-slate-500 line-clamp-2">
                  {doc.subject || doc.bodyContent.slice(0, 100) + '...'}
                </p>

                <div className="text-[11px] text-slate-400 pt-1 space-y-0.5">
                  <p>T.P. {doc.academicYear} • Semester {doc.semester}</p>
                  <p>Status: <span className="font-semibold text-slate-700">{doc.status}</span></p>
                  <p>Revisi: Versi {doc.revisionHistory.length}</p>
                </div>

                {doc.tags && doc.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {doc.tags.map((tag, idx) => (
                      <span key={idx} className="px-1.5 py-0.2 rounded text-[9px] bg-slate-100 text-slate-500">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => onViewDocument(doc)}
                  className="px-3 py-1.5 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" /> Buka Arsip
                </button>
                <span className="text-[10px] text-slate-400 font-mono">
                  {doc.date}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
