import * as XLSX from 'xlsx';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { OfficialDocument, SchoolProfile, WorkProgram, StudentAchievement, BudgetRecord } from '../types';

// Helper to trigger browser download
function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// 1. Export Document to Genuine DOCX
export async function exportDocumentToDocx(doc: OfficialDocument, school: SchoolProfile): Promise<void> {
  const docxFile = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: 'PEMERINTAH PROVINSI SULAWESI UTARA',
            alignment: AlignmentType.CENTER,
            style: 'HeaderLine1',
          }),
          new Paragraph({
            text: 'DINAS PENDIDIKAN DAERAH',
            alignment: AlignmentType.CENTER,
            style: 'HeaderLine2',
          }),
          new Paragraph({
            text: school.name.toUpperCase(),
            alignment: AlignmentType.CENTER,
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({
            text: `${school.address} | Telp: ${school.phone} | Email: ${school.email}`,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            text: '-----------------------------------------------------------------------------------------------------',
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            text: doc.title,
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            text: `Nomor: ${doc.documentNumber}`,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            text: `Tahun Pelajaran: ${doc.academicYear} | Semester: ${doc.semester}`,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({ text: '' }),
          ...doc.bodyContent.split('\n').map(line => 
            new Paragraph({
              children: [new TextRun(line)],
            })
          ),
          new Paragraph({ text: '' }),
          new Paragraph({
            text: `Kakas, ${doc.date}`,
            alignment: AlignmentType.RIGHT,
          }),
          new Paragraph({
            text: doc.signatoryTitle,
            alignment: AlignmentType.RIGHT,
          }),
          new Paragraph({ text: '' }),
          new Paragraph({ text: '' }),
          new Paragraph({
            text: doc.signatoryName,
            alignment: AlignmentType.RIGHT,
          }),
          new Paragraph({
            text: `NIP. ${doc.signatoryNip}`,
            alignment: AlignmentType.RIGHT,
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(docxFile);
  const cleanTitle = (doc.documentNumber || doc.title).replace(/[^a-zA-Z0-9_-]/g, '_');
  triggerDownload(blob, `${cleanTitle}.docx`);
}

// 2. Export Work Programs to Excel (.xlsx) & CSV
export function exportProgramsToExcel(programs: WorkProgram[], academicYear: string, format: 'xlsx' | 'csv' = 'xlsx') {
  const data = programs.map((p, idx) => ({
    'No': idx + 1,
    'Tahun Pelajaran': p.academicYear,
    'Semester': p.semester,
    'Bidang / Kategori': p.category,
    'Nama Program / Kegiatan': p.name,
    'Tujuan': p.purpose,
    'Sasaran': p.targetAudience,
    'Indikator Keberhasilan': p.indicator,
    'Target': p.targetMetric,
    'Waktu Pelaksanaan': p.implementationTime,
    'Penanggung Jawab': p.personInCharge,
    'Peran': p.picRole,
    'Sumber Dana': p.budgetSource,
    'Rencana Anggaran (Rp)': p.plannedBudget,
    'Realisasi (Rp)': p.actualBudget,
    'Status Pelaksanaan': p.status,
    'Kelengkapan Dokumen': p.completenessStatus,
    'Bukti Fisik': p.physicalProof,
    'Catatan Evaluasi': p.evaluationNotes,
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Program Kerja Kesiswaan');

  if (format === 'csv') {
    const csvOutput = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
    triggerDownload(blob, `Program_Kerja_Kesiswaan_SMAN1Kakas_${academicYear.replace('/', '-')}.csv`);
  } else {
    XLSX.writeFile(workbook, `Program_Kerja_Kesiswaan_SMAN1Kakas_${academicYear.replace('/', '-')}.xlsx`);
  }
}

// 3. Export Student Achievements to Excel
export function exportAchievementsToExcel(achievements: StudentAchievement[], academicYear: string) {
  const data = achievements.map((a, idx) => ({
    'No': idx + 1,
    'Nama Siswa': a.studentName,
    'NIS': a.studentNis,
    'Kelas': a.classRoom,
    'Nama Kompetisi / Lomba': a.competitionName,
    'Bidang': a.field,
    'Tingkat': a.level,
    'Penyelenggara': a.organizer,
    'Tanggal': a.date,
    'Hasil / Peringkat': a.rankOrAward,
    'Guru Pembimbing': a.coachTeacher,
    'No. Sertifikat': a.certificateNumber,
    'No. Surat Tugas': a.assignmentLetterNumber || '-',
    'Tahun Pelajaran': a.academicYear,
    'Semester': a.semester,
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Prestasi Siswa');
  XLSX.writeFile(workbook, `Data_Prestasi_Siswa_SMAN1Kakas_${academicYear.replace('/', '-')}.xlsx`);
}

// 4. Export Budget Realization to Excel
export function exportBudgetToExcel(budgets: BudgetRecord[], academicYear: string) {
  const data = budgets.map((b, idx) => ({
    'No': idx + 1,
    'Nama Kegiatan': b.activityName,
    'Komponen Belanja': b.component,
    'Volume': b.volume,
    'Satuan': b.unit,
    'Harga Satuan (Rp)': b.unitPrice,
    'RAB Total (Rp)': b.totalPrice,
    'Sumber Dana': b.fundSource,
    'Realisasi (Rp)': b.realizedAmount,
    'Selisih (Rp)': b.difference,
    'Bukti Transaksi': b.transactionProofNotes,
    'Status': b.status,
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Realisasi Anggaran');
  XLSX.writeFile(workbook, `Anggaran_Kesiswaan_SMAN1Kakas_${academicYear.replace('/', '-')}.xlsx`);
}
