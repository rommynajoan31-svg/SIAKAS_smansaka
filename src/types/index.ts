export type UserRole = 'admin' | 'wakasek' | 'kepsek' | 'staf' | 'pembina' | 'auditor';

export interface UserAccount {
  id: string;
  username: string;
  fullName: string;
  nip?: string;
  role: UserRole;
  roleTitle: string;
  email: string;
  avatar?: string;
  active: boolean;
}

export interface SchoolProfile {
  name: string;
  npsn: string;
  province: string;
  regency: string;
  district: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  principalName: string;
  principalNip: string;
  vicePrincipalStudentAffairs: string;
  vicePrincipalNip: string;
  treasurerName: string;
  treasurerNip: string;
  activeAcademicYear: string;
  activeSemester: 'Ganjil' | 'Genap';
  letterNumberPrefix: string; // e.g. "421.3/SMAN1-KKS/KS"
  archiveClassificationCode: string; // e.g. "421.3"
  logoUrl?: string;
}

export interface AcademicYear {
  id: string;
  code: string; // e.g. "2026/2027"
  label: string;
  status: 'Aktif' | 'Diarsipkan' | 'Perencanaan';
  activeSemester: 'Ganjil' | 'Genap';
  startDate: string;
  endDate: string;
  notes: string;
  createdAt: string;
}

export type ProgramCategory = 
  | 'MPLS' 
  | 'OSIS & MPK' 
  | 'Ekstrakurikuler' 
  | 'Karakter & Disiplin' 
  | 'Prestasi & Lomba' 
  | 'Kegiatan Khusus & PHBN' 
  | 'Layanan & Bimbingan';

export type BudgetSource = 
  | 'BOS Reguler' 
  | 'BOS Kinerja' 
  | 'Komite Sekolah' 
  | 'Swadana / Sponsor' 
  | 'Tanpa Biaya';

export type ProgramStatus = 
  | 'Direncanakan' 
  | 'Sedang Berjalan' 
  | 'Selesai' 
  | 'Ditunda' 
  | 'Belum Terlaksana';

export interface WorkProgram {
  id: string;
  academicYear: string;
  semester: 'Ganjil' | 'Genap' | 'Tahunan';
  category: ProgramCategory;
  name: string;
  purpose: string;
  targetAudience: string;
  indicator: string;
  targetMetric: string;
  implementationTime: string;
  month: number; // 1 - 12
  personInCharge: string;
  picRole: string;
  budgetSource: BudgetSource;
  plannedBudget: number;
  actualBudget: number;
  status: ProgramStatus;
  physicalProof: string;
  evaluationNotes: string;
  completenessStatus: 'Lengkap' | 'Perlu Dilengkapi' | 'Belum Ada Dokumen';
  isDemo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  programId?: string;
  academicYear: string;
  semester: 'Ganjil' | 'Genap';
  title: string;
  category: ProgramCategory;
  dateStart: string;
  dateEnd: string;
  time: string;
  location: string;
  description: string;
  personInCharge: string;
  status: 'Persiapan' | 'Sedang Berlangsung' | 'Selesai' | 'Dibatalkan';
  reportDeadline: string;
  reportStatus: 'Belum Dibuat' | 'Draf' | 'Selesai';
  budgetPlanned: number;
  budgetRealized: number;
  committeeCount: number;
  participantCount: number;
  requiredDocs: string[];
  completedDocs: string[];
  conflictNotes?: string;
  isDemo: boolean;
  createdAt: string;
}

export type DocumentCategory = 
  | 'Perencanaan' 
  | 'SK & Penugasan' 
  | 'Persuratan' 
  | 'Pelaksanaan' 
  | 'Evaluasi & Laporan';

export type DocumentType = 
  | 'Program Kerja Tahunan'
  | 'SK Panitia MPLS'
  | 'SK Pembina OSIS'
  | 'SK Pengurus OSIS'
  | 'SK Pembina Ekstrakurikuler'
  | 'Surat Tugas Pembimbing / Guru'
  | 'Surat Undangan Resmi'
  | 'Surat Pemberitahuan Orang Tua'
  | 'Surat Permohonan Izin / Rekomendasi'
  | 'Proposal Kegiatan'
  | 'Kerangka Acuan Kerja (TOR)'
  | 'Jadwal & Agenda'
  | 'Daftar Hadir Resmi'
  | 'Notulen Rapat'
  | 'Berita Acara Kegiatan'
  | 'Laporan Pertanggungjawaban (LPJ)'
  | 'Laporan Bulanan Kesiswaan'
  | 'Laporan Semester'
  | 'Laporan Tahunan Kesiswaan'
  | 'Tata Tertib Sekolah'
  | 'Dokumen Lainnya';

export type DocumentStatus = 
  | 'Draf' 
  | 'Dalam Pemeriksaan' 
  | 'Perlu Revisi' 
  | 'Disetujui' 
  | 'Ditandatangani' 
  | 'Diarsipkan';

export interface DocumentVersion {
  version: number;
  date: string;
  author: string;
  note: string;
}

export interface OfficialDocument {
  id: string;
  documentNumber: string;
  title: string;
  category: DocumentCategory;
  documentType: DocumentType;
  academicYear: string;
  semester: 'Ganjil' | 'Genap';
  activityId?: string;
  date: string;
  subject: string;
  consideration?: string; // Menimbang
  legalBasis?: string; // Mengingat
  decreeContent?: string; // Menetapkan / Memutuskan
  bodyContent: string;
  signatoryName: string;
  signatoryTitle: string;
  signatoryNip: string;
  checkerName?: string;
  creatorName: string;
  status: DocumentStatus;
  tags: string[];
  revisionHistory: DocumentVersion[];
  attachments?: { name: string; size: string; type: string }[];
  isImportant: boolean;
  isDemo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MPLSSession {
  id: string;
  day: string;
  date: string;
  time: string;
  topic: string;
  speaker: string;
  location: string;
  category: 'Pengenalan Satuan Pendidikan' | 'Budaya Aman & Nyaman' | 'Tata Tertib & Karakter' | 'Pencegahan Perundungan & TPPK' | 'Dinamika Kelompok';
}

export interface MPLSData {
  academicYear: string;
  theme: string;
  dateStart: string;
  dateEnd: string;
  chairman: string;
  secretary: string;
  treasurer: string;
  participantCount: number;
  maleParticipants: number;
  femaleParticipants: number;
  sessions: MPLSSession[];
  committeeList: { name: string; role: string; division: string }[];
  materials: { title: string; category: string; speaker: string; summary: string }[];
  evaluationSummary: string;
  status: 'Perencanaan' | 'Berlangsung' | 'Selesai';
}

export interface OSISCandidate {
  number: number;
  name: string;
  classRoom: string;
  vision: string;
  mission: string[];
  votes: number;
  photoUrl?: string;
}

export interface OSISData {
  academicYear: string;
  period: string;
  ketuaOsis: string;
  wakilKetua: string;
  sekretaris: string;
  bendahara: string;
  pembinaUtama: string;
  pembinaPendamping: string;
  structure: { division: string; head: string; programCount: number; members: string[] }[];
  pilketos: {
    electionDate: string;
    totalVoters: number;
    votesCounted: number;
    candidates: OSISCandidate[];
    status: 'Persiapan' | 'Masa Kampanye' | 'Pemungutan Suara' | 'Selesai';
  };
  meetingNotes: { id: string; date: string; title: string; attendees: number; summary: string }[];
}

export interface Extracurricular {
  id: string;
  name: string;
  category: 'Kepramukaan' | 'Olahraga' | 'Seni & Budaya Minahasa' | 'Akademik / Sains' | 'Paskibra & Kedisiplinan' | 'Keagamaan' | 'PMR & Kemanusiaan' | 'Teknologi & Multimedia';
  advisor: string; // Pembina guru
  coach?: string; // Pelatih luar
  scheduleDay: string;
  scheduleTime: string;
  location: string;
  memberCount: number;
  semesterGoal: string;
  achievements: string[];
  isMandatory: boolean;
  active: boolean;
  recentSessions: { date: string; topic: string; attendanceCount: number }[];
}

export interface CharacterCultureRecord {
  id: string;
  academicYear: string;
  semester: 'Ganjil' | 'Genap';
  programTitle: string;
  category: '7 Kebiasaan Anak Indonesia Hebat' | 'Penguatan Karakter Pancasila' | 'Pencegahan Perundungan (TPPK)' | 'Sekolah Ramah Anak' | 'Konsultasi Bimbingan & Restoratif';
  date: string;
  targetGroup: string;
  participantCount: number;
  notes: string;
  followUpAction: string;
  coordinator: string;
  status: 'Rencana' | 'Terlaksana' | 'Berkelanjutan';
}

export interface StudentAchievement {
  id: string;
  studentName: string;
  studentNis: string;
  classRoom: string;
  competitionName: string;
  field: 'Akademik' | 'Seni & Budaya' | 'Olahraga' | 'Pramuka / Paskibra' | 'Keagamaan' | 'Riset & Bahasa';
  level: 'Kecamatan Kakas' | 'Kabupaten Minahasa' | 'Provinsi Sulawesi Utara' | 'Tingkat Nasional' | 'Internasional';
  organizer: string;
  date: string;
  rankOrAward: string;
  coachTeacher: string;
  certificateNumber: string;
  assignmentLetterNumber?: string;
  academicYear: string;
  semester: 'Ganjil' | 'Genap';
  proofUrl?: string;
}

export interface BudgetRecord {
  id: string;
  activityName: string;
  academicYear: string;
  semester: 'Ganjil' | 'Genap';
  component: string;
  volume: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  fundSource: BudgetSource;
  realizedAmount: number;
  difference: number;
  transactionProofNotes: string;
  status: 'Rencana' | 'Terealisasi' | 'Tertunda';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  category: string;
  details: string;
}

export interface DatabaseState {
  schoolProfile: SchoolProfile;
  academicYears: AcademicYear[];
  workPrograms: WorkProgram[];
  activities: Activity[];
  documents: OfficialDocument[];
  mplsData: MPLSData;
  osisData: OSISData;
  extracurriculars: Extracurricular[];
  characterRecords: CharacterCultureRecord[];
  achievements: StudentAchievement[];
  budgets: BudgetRecord[];
  users: UserAccount[];
  auditLogs: AuditLog[];
  activeUserId: string;
}
