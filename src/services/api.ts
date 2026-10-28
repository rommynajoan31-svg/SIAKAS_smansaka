import { DatabaseState, AuditLog } from '../types';
import { INITIAL_DATABASE } from '../data/initialData';

const STORAGE_KEY = 'siakas_sman1kakas_database_v1';

export async function loadInitialData(): Promise<DatabaseState> {
  // First try fetching from full-stack server
  try {
    const res = await fetch('/api/database');
    if (res.ok) {
      const json = await res.json();
      if (json && json.data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(json.data));
        return json.data;
      }
    }
  } catch (err) {
    console.warn('Server storage fetch failed, trying local storage:', err);
  }

  // Fallback to localStorage
  const local = localStorage.getItem(STORAGE_KEY);
  if (local) {
    try {
      const parsed = JSON.parse(local);
      // Try pushing to server in background
      saveDatabaseToServer(parsed).catch(() => {});
      return parsed;
    } catch (e) {
      console.error('Error parsing local database, resetting to initial:', e);
    }
  }

  // Default to initial database
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATABASE));
  saveDatabaseToServer(INITIAL_DATABASE).catch(() => {});
  return INITIAL_DATABASE;
}

export async function saveDatabaseToServer(state: DatabaseState): Promise<boolean> {
  // Always update localStorage first for instantaneous UI
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('LocalStorage quota warning:', e);
  }

  try {
    const res = await fetch('/api/database', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state),
    });
    return res.ok;
  } catch (err) {
    console.warn('Background server sync failed, data is saved locally:', err);
    return false;
  }
}

export function logAction(
  currentState: DatabaseState,
  action: string,
  category: string,
  details: string
): DatabaseState {
  const activeUser = currentState.users.find(u => u.id === currentState.activeUserId);
  const userLabel = activeUser ? `${activeUser.fullName} (${activeUser.roleTitle})` : 'Sistem';

  const newLog: AuditLog = {
    id: 'log-' + Date.now(),
    timestamp: new Date().toISOString(),
    user: userLabel,
    action,
    category,
    details,
  };

  return {
    ...currentState,
    auditLogs: [newLog, ...currentState.auditLogs.slice(0, 99)], // keep last 100
  };
}

// AI Document Generator via backend proxy
export async function generateDocumentAI(payload: {
  documentType: string;
  schoolProfile: any;
  academicYear: string;
  semester: string;
  activityName: string;
  personInCharge: string;
  date: string;
  place: string;
  participants: string;
  legalBasis: string;
  purpose: string;
  budget?: number;
  additionalNotes?: string;
}): Promise<{ content: string; source: 'gemini' | 'template' }> {
  try {
    const response = await fetch('/api/gemini/generate-document', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.content) {
        return { content: data.content, source: 'gemini' };
      }
    }
  } catch (e) {
    console.warn('Gemini server call failed or unconfigured, generating formal template:', e);
  }

  // Formal fallback template based on Indonesian Educational Bureaucracy Standards
  const template = buildFormalDocumentTemplate(payload);
  return { content: template, source: 'template' };
}

function buildFormalDocumentTemplate(p: any): string {
  const dateStr = p.date || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  const docType = p.documentType;

  if (docType.includes('SK') || docType.includes('Keputusan')) {
    return `KEPUTUSAN KEPALA ${p.schoolProfile?.name?.toUpperCase() || 'SMA NEGERI 1 KAKAS'}
NOMOR: ${p.schoolProfile?.letterNumberPrefix || '421.3/SMAN1-KKS/KS'}/SK-KES/[NO_URUT]/${new Date().getFullYear()}

TENTANG
${p.activityName?.toUpperCase() || 'PENETAPAN TIM KERJA KESISWAAN'}
TAHUN PELAJARAN ${p.academicYear || '2026/2027'}

DENGAN RAHMAT TUHAN YANG MAHA ESA
KEPALA ${p.schoolProfile?.name?.toUpperCase() || 'SMA NEGERI 1 KAKAS'}

Menimbang:
a. Bahwa dalam rangka kelancaran pelaksanaan ${p.activityName || 'kegiatan kesiswaan'} di ${p.schoolProfile?.name || 'SMA Negeri 1 Kakas'}, dipandang perlu membentuk panitia/tim kerja yang bertanggung jawab;
b. Bahwa nama-nama yang tercantum dalam lampiran keputusan ini dianggap cakap dan memenuhi syarat untuk melaksanakan tugas tersebut;
c. Bahwa berdasarkan pertimbangan sebagaimana dimaksud pada huruf a dan huruf b, perlu menetapkan Keputusan Kepala Sekolah.

Mengingat:
1. Undang-Undang Nomor 20 Tahun 2003 tentang Sistem Pendidikan Nasional;
2. Peraturan Menteri Pendidikan Nasional Nomor 39 Tahun 2008 tentang Pembinaan Kesiswaan;
3. Permendikbudristek Nomor 46 Tahun 2023 tentang Pencegahan dan Penanganan Kekerasan di Lingkungan Satuan Pendidikan;
4. ${p.legalBasis || 'Program Kerja Tahunan Wakil Kepala Sekolah Bidang Kesiswaan Tahun Pelajaran ' + (p.academicYear || '2026/2027')}.

MEMUTUSKAN:
Menetapkan:
KESATU: Mengangkat dan menetapkan susunan panitia/tim pelaksana ${p.activityName || 'kegiatan'} sebagaimana tercantum dalam lampiran keputusan ini;
KEDUA: Menugaskan kepada panitia/tim untuk menyusun rencana teknis, melaksanakan koordinasi, dan bertanggung jawab penuh atas kelancaran kegiatan;
KETIGA: Segala biaya yang timbul akibat pelaksanaan keputusan ini dibebankan pada anggaran yang sah sesuai peraturan perundang-undangan;
KEEMPAT: Keputusan ini mulai berlaku sejak tanggal ditetapkan dengan ketentuan apabila terdapat kekeliruan akan diperbaiki sebagaimana mestinya.

Ditetapkan di: Kakas
Pada tanggal: ${dateStr}

Kepala Sekolah,


${p.schoolProfile?.principalName || 'Drs. Ventje Lengkong, M.Pd'}
NIP. ${p.schoolProfile?.principalNip || '19680512 199412 1 002'}`;
  }

  if (docType.includes('Tugas')) {
    return `SURAT TUGAS
NOMOR: ${p.schoolProfile?.letterNumberPrefix || '421.3/SMAN1-KKS/KS'}/ST/[NO_URUT]/${new Date().getFullYear()}

Dasar:
1. ${p.legalBasis || 'Surat Edaran Dinas Pendidikan Daerah Provinsi Sulawesi Utara'};
2. Kalender Kegiatan Kesiswaan SMA Negeri 1 Kakas Tahun Pelajaran ${p.academicYear || '2026/2027'}.

MEMBERIKAN TUGAS:

Kepada:
Nama       : ${p.personInCharge || '[Nama Guru / Pendamping]'}
Jabatan    : Guru / Pembina Kesiswaan SMA Negeri 1 Kakas
Sasaran    : ${p.participants || 'Siswa Peserta Perwakilan Sekolah'}

Untuk:
1. Menjadi pendamping/pelaksana dalam kegiatan: ${p.activityName || '[Nama Kegiatan]'};
2. Waktu Pelaksanaan: ${dateStr};
3. Tempat: ${p.place || 'SMA Negeri 1 Kakas / Lokasi Kegiatan'};
4. Melaporkan hasil pelaksanaan tugas kepada Kepala Sekolah sesegera mungkin setelah kegiatan berakhir.

Demikian Surat Tugas ini dibuat untuk dilaksanakan dengan penuh rasa tanggung jawab.

Kakas, ${dateStr}
Kepala Sekolah,


${p.schoolProfile?.principalName || 'Drs. Ventje Lengkong, M.Pd'}
NIP. ${p.schoolProfile?.principalNip || '19680512 199412 1 002'}`;
  }

  if (docType.includes('Undangan')) {
    return `Nomor   : ${p.schoolProfile?.letterNumberPrefix || '421.3/SMAN1-KKS/KS'}/UND/[NO_URUT]/${new Date().getFullYear()}
Lampiran: -
Perihal : Undangan ${p.activityName || 'Pertemuan Koordinasi Kesiswaan'}

Kepada Yth.
${p.participants || 'Bapak/Ibu Orang Tua / Wali Peserta Didik'}
di Tempat

Dengan hormat,

Sehubungan dengan agenda program kesiswaan SMA Negeri 1 Kakas Tahun Pelajaran ${p.academicYear || '2026/2027'}, dengan ini kami mengundang Bapak/Ibu untuk dapat hadir pada:

Hari / Tanggal : ${dateStr}
Waktu          : Pukul 09.00 WITA s.d. Selesai
Tempat         : ${p.place || 'Aula SMA Negeri 1 Kakas'}
Acara          : ${p.purpose || p.activityName || 'Koordinasi Program Kesiswaan'}

Mengingat pentingnya agenda tersebut demi kemajuan pendidikan dan pembinaan peserta didik kita, kehadiran Bapak/Ibu tepat pada waktunya sangat kami harapkan.

Demikian undangan ini kami sampaikan. Atas perhatian dan kerja sama yang baik, kami ucapkan terima kasih.

Kakas, ${dateStr}
Wakil Kepala Sekolah Bidang Kesiswaan,


${p.schoolProfile?.vicePrincipalStudentAffairs || 'Rommy Najoan, S.Pd, M.Pd'}
NIP. ${p.schoolProfile?.vicePrincipalNip || '19780824 200501 1 008'}`;
  }

  // Default Proposal / Laporan
  return `PROPOSAL / LAPORAN PELAKSANAAN KEGIATAN KESISWAAN
${p.activityName?.toUpperCase() || 'KEGIATAN KESISWAAN SMA NEGERI 1 KAKAS'}
TAHUN PELAJARAN ${p.academicYear || '2026/2027'}

I. PENDAHULUAN
Pendidikan menengah atas memiliki peran strategis dalam menumbuhkembangkan potensi intelektual, emosional, spiritual, serta kecakapan sosial peserta didik. Kegiatan ${p.activityName || 'kesiswaan'} diselenggarakan sebagai wahana penguatan Profil Pelajar Pancasila dan budaya positif di lingkungan sekolah.

II. DASAR KEGIATAN
1. Undang-Undang Nomor 20 Tahun 2003 tentang Sistem Pendidikan Nasional;
2. Permendiknas No. 39 Tahun 2008 tentang Pembinaan Kesiswaan;
3. ${p.legalBasis || 'Program Kerja Kesiswaan SMA Negeri 1 Kakas Tahun Pelajaran 2026/2027'}.

III. TUJUAN
${p.purpose || '1. Membina karakter kepemimpinan dan kemandirian siswa.\n2. Mengembangkan bakat dan minat secara optimal.\n3. Mempererat persaudaraan antarwarga sekolah.'}

IV. SASARAN PESERTA
${p.participants || 'Peserta didik dan warga SMA Negeri 1 Kakas.'}

V. WAKTU DAN TEMPAT PELAKSANAAN
Hari, Tanggal : ${dateStr}
Tempat        : ${p.place || 'Kampus SMA Negeri 1 Kakas'}

VI. ESTIMASI ANGGARAN
Dibutuhkan alokasi anggaran sebesar Rp ${p.budget ? Number(p.budget).toLocaleString('id-ID') : '0'} yang bersumber dari alokasi yang sah.

VII. PENUTUP
Demikian dokumen rancangan/laporan kegiatan ini disusun untuk menjadi pedoman dan rujukan bersama.

Kakas, ${dateStr}

Penanggung Jawab Kegiatan,          Mengetahui,
Wakasek Kesiswaan,                 Kepala SMA Negeri 1 Kakas,


${p.schoolProfile?.vicePrincipalStudentAffairs || 'Rommy Najoan, S.Pd, M.Pd'}    ${p.schoolProfile?.principalName || 'Drs. Ventje Lengkong, M.Pd'}
NIP. ${p.schoolProfile?.vicePrincipalNip || '19780824 200501 1 008'}            NIP. ${p.schoolProfile?.principalNip || '19680512 199412 1 002'}`;
}
