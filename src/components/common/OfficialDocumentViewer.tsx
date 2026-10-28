import React, { useState } from 'react';
import { Printer, Download, Copy, Check, Edit3, Archive, ShieldCheck, Tag, Clock } from 'lucide-react';
import { OfficialDocument, SchoolProfile, DocumentStatus } from '../../types';
import { KopSurat } from './KopSurat';
import { exportDocumentToDocx } from '../../services/exportService';

interface OfficialDocumentViewerProps {
  document: OfficialDocument;
  school: SchoolProfile;
  canEdit?: boolean;
  onEdit?: (doc: OfficialDocument) => void;
  onStatusChange?: (docId: string, newStatus: DocumentStatus) => void;
}

export const OfficialDocumentViewer: React.FC<OfficialDocumentViewerProps> = ({
  document: doc,
  school,
  canEdit = true,
  onEdit,
  onStatusChange,
}) => {
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleCopy = () => {
    const fullText = `${doc.title}\nNomor: ${doc.documentNumber}\nTanggal: ${doc.date}\n\n${doc.bodyContent}\n\n${doc.signatoryTitle}\n${doc.signatoryName}\nNIP. ${doc.signatoryNip}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadDocx = async () => {
    setIsExporting(true);
    try {
      await exportDocumentToDocx(doc, school);
    } catch (e) {
      console.error('Failed to export docx:', e);
    } finally {
      setIsExporting(false);
    }
  };

  const getStatusBadge = (status: DocumentStatus) => {
    switch (status) {
      case 'Ditandatangani':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Disetujui':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Dalam Pemeriksaan':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Perlu Revisi':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'Diarsipkan':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="space-y-4">
      {/* Action Toolbar (hidden on print) */}
      <div className="no-print bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(doc.status)}`}>
            Status: {doc.status}
          </span>
          <span className="text-xs text-slate-500 hidden sm:inline">
            T.P. {doc.academicYear} • Semester {doc.semester}
          </span>
          {doc.isDemo && (
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-amber-50 text-amber-700 border border-amber-200">
              DEMO
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {canEdit && onStatusChange && (
            <select
              value={doc.status}
              onChange={(e) => onStatusChange(doc.id, e.target.value as DocumentStatus)}
              className="text-xs font-medium bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 cursor-pointer"
              title="Ubah Status Administrasi Dokumen"
            >
              <option value="Draf">Set: Draf</option>
              <option value="Dalam Pemeriksaan">Set: Dalam Pemeriksaan</option>
              <option value="Perlu Revisi">Set: Perlu Revisi</option>
              <option value="Disetujui">Set: Disetujui</option>
              <option value="Ditandatangani">Set: Ditandatangani</option>
              <option value="Diarsipkan">Set: Diarsipkan</option>
            </select>
          )}

          {canEdit && onEdit && (
            <button
              onClick={() => onEdit(doc)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-blue-900" />
              Edit
            </button>
          )}

          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors cursor-pointer"
            title="Salin Teks Lengkap"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
            {copied ? 'Tersalin' : 'Salin Teks'}
          </button>

          <button
            onClick={handleDownloadDocx}
            disabled={isExporting}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors cursor-pointer"
            title="Unduh Berkas Microsoft Word (.docx)"
          >
            <Download className="w-3.5 h-3.5 text-blue-700" />
            {isExporting ? 'Memproses...' : 'Unduh DOCX'}
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg transition-colors shadow-xs cursor-pointer"
            title="Cetak Langsung atau Simpan sebagai PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            Cetak / PDF
          </button>
        </div>
      </div>

      {/* Formal A4 Document Preview */}
      <div className="print-page bg-white mx-auto max-w-4xl p-8 sm:p-14 shadow-lg border border-slate-200 rounded-xl font-serif text-slate-900 leading-relaxed text-sm">
        {/* Kop Surat Sekolah */}
        <KopSurat school={school} />

        {/* Header Dokumen */}
        <div className="text-center mb-6">
          <h2 className="text-base sm:text-lg font-bold text-slate-950 uppercase tracking-wide">
            {doc.title}
          </h2>
          <p className="text-xs sm:text-sm font-sans font-medium text-slate-800 mt-1">
            Nomor: <span className="font-semibold">{doc.documentNumber || '[Nomor Surat Belum Diisi]'}</span>
          </p>
          {doc.subject && (
            <p className="text-xs text-slate-600 font-sans italic mt-1">
              Perihal: {doc.subject}
            </p>
          )}
        </div>

        {/* Konsiderans (Menimbang & Mengingat) jika ada (SK / Keputusan) */}
        {doc.consideration && (
          <div className="mb-4 space-y-3">
            <div className="flex items-start gap-4">
              <span className="w-24 font-bold text-slate-900 flex-shrink-0">Menimbang</span>
              <div className="flex-1 whitespace-pre-line text-justify text-[13px] leading-relaxed">
                {doc.consideration}
              </div>
            </div>
          </div>
        )}

        {doc.legalBasis && (
          <div className="mb-4 space-y-3">
            <div className="flex items-start gap-4">
              <span className="w-24 font-bold text-slate-900 flex-shrink-0">Mengingat</span>
              <div className="flex-1 whitespace-pre-line text-justify text-[13px] leading-relaxed">
                {doc.legalBasis}
              </div>
            </div>
          </div>
        )}

        {doc.decreeContent && (
          <div className="my-5 p-4 bg-slate-50/70 rounded-lg border border-slate-100 text-[13px] whitespace-pre-line text-justify font-sans leading-relaxed">
            {doc.decreeContent}
          </div>
        )}

        {/* Batang Tubuh Dokumen */}
        <div className="my-6 whitespace-pre-line text-justify leading-relaxed text-[13px] sm:text-sm">
          {doc.bodyContent}
        </div>

        {/* Tanda Tangan & Pengesahan Resmi */}
        <div className="page-break-inside-avoid mt-12 flex justify-between items-end pt-4">
          {doc.checkerName ? (
            <div className="text-center font-sans">
              <p className="text-xs text-slate-500 mb-1">Telah Diperiksa & Diverifikasi:</p>
              <p className="text-xs font-semibold text-slate-700">Wakasek Bidang Kesiswaan</p>
              <div className="h-16 flex items-center justify-center">
                <span className="text-[10px] text-slate-400 border border-dashed border-slate-300 rounded px-2 py-0.5">
                  [Paraf Verifikasi]
                </span>
              </div>
              <p className="text-xs font-bold text-slate-900 underline">{doc.checkerName}</p>
            </div>
          ) : <div />}

          <div className="text-right font-sans min-w-[240px]">
            <p className="text-xs text-slate-800">
              Ditetapkan di Kakas, {doc.date}
            </p>
            <p className="text-xs font-bold text-slate-900 mt-1">
              {doc.signatoryTitle || school.principalName}
            </p>

            {/* Area Tanda Tangan & Cap Sekolah */}
            <div className="h-20 flex items-center justify-end relative my-1">
              {/* Cap Stempel Dinas */}
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-blue-800/40 text-blue-900/40 flex flex-col items-center justify-center text-[7px] font-bold text-center p-1 uppercase -rotate-12 pointer-events-none mr-4">
                <span>★ SMAN 1 KAKAS ★</span>
                <span>MINAHASA</span>
              </div>
              <div className="text-[11px] text-slate-400 italic">
                [Tanda Tangan & Cap]
              </div>
            </div>

            <p className="text-xs font-bold text-slate-950 underline">
              {doc.signatoryName || school.principalName}
            </p>
            <p className="text-xs text-slate-700">
              NIP. {doc.signatoryNip || school.principalNip}
            </p>
          </div>
        </div>

        {/* Metadata Footer */}
        <div className="mt-12 pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between text-[11px] text-slate-500 font-sans">
          <span>SIAKAS SMAN 1 Kakas • Klasifikasi: {school.archiveClassificationCode}</span>
          <span>Dibuat oleh: {doc.creatorName}</span>
        </div>
      </div>
    </div>
  );
};
