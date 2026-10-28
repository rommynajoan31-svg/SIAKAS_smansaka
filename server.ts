import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const DB_FILE = path.resolve(process.cwd(), 'data', 'database.json');

// Ensure data directory exists
const dataDir = path.dirname(DB_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

app.use(express.json({ limit: '25mb' }));

// Helper to read DB
function readDatabase() {
  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(content);
    } catch (e) {
      console.error('Error reading database file:', e);
    }
  }
  return null;
}

// Helper to write DB
function writeDatabase(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (e) {
    console.error('Error writing database file:', e);
    return false;
  }
}

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', serverTime: new Date().toISOString() });
});

// Get all persistent data
app.get('/api/database', (req: Request, res: Response) => {
  const data = readDatabase();
  res.json({ success: true, data });
});

// Save all persistent data
app.post('/api/database', (req: Request, res: Response) => {
  const success = writeDatabase(req.body);
  if (success) {
    res.json({ success: true, message: 'Data berhasil disimpan di server.' });
  } else {
    res.status(500).json({ success: false, message: 'Gagal menyimpan data di server.' });
  }
});

// Gemini AI Document Generator Endpoint (Server-Side)
app.post('/api/gemini/generate-document', async (req: Request, res: Response) => {
  try {
    const { documentType, schoolProfile, academicYear, semester, activityName, personInCharge, date, place, participants, legalBasis, purpose, budget, additionalNotes } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(400).json({
        success: false,
        message: 'Kunci API Gemini (GEMINI_API_KEY) belum terpasang di environment.',
        fallbackUsed: true
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const prompt = `Anda adalah ahli tata naskah dinas pendidikan SMA Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi Indonesia.
Tolong buatkan draf naskah resmi dalam Bahasa Indonesia yang formal, baku, rapi, dan sesuai kaidah persuratan kedinasan sekolah menengah atas.

Identitas Sekolah:
- Nama Sekolah: ${schoolProfile?.name || 'SMA Negeri 1 Kakas'}
- NPSN: ${schoolProfile?.npsn || '40100895'}
- Alamat: ${schoolProfile?.address || 'Kecamatan Kakas, Kabupaten Minahasa, Sulawesi Utara'}
- Kepala Sekolah: ${schoolProfile?.principalName || 'Drs. Ventje Lengkong, M.Pd'} (NIP: ${schoolProfile?.principalNip || '19680512 199412 1 002'})
- Wakasek Kesiswaan: ${schoolProfile?.vicePrincipalStudentAffairs || 'Rommy Najoan, S.Pd, M.Pd'} (NIP: ${schoolProfile?.vicePrincipalNip || '19780824 200501 1 008'})

Parameter Dokumen:
- Jenis Dokumen: ${documentType}
- Tahun Pelajaran: ${academicYear || '2026/2027'}
- Semester: ${semester || 'Ganjil'}
- Nama Kegiatan / Program: ${activityName || '-'}
- Penanggung Jawab: ${personInCharge || '-'}
- Tanggal & Tempat: ${date || '-'}, ${place || '-'}
- Sasaran / Peserta: ${participants || '-'}
- Dasar Hukum / Pertimbangan: ${legalBasis || 'Standar Nasional Pendidikan dan Kebijakan Sekolah Terkait'}
- Tujuan Dokumen / Kegiatan: ${purpose || '-'}
- Anggaran: ${budget ? 'Rp ' + Number(budget).toLocaleString('id-ID') : 'Sesuai RKAS / Swadana'}
- Catatan Tambahan: ${additionalNotes || '-'}

Petunjuk Penting:
1. Format output berupa teks terstruktur rapi (jangan sertakan markdown kop gambar, fokus pada teks isi, pembukaan, konsiderans menimbang/mengingat, diktum keputusan atau batang tubuh surat/proposal/laporan, penutup, serta blok tanda tangan pengesahan).
2. Jika ada informasi spesifik yang belum ditentukan, gunakan placeholder yang jelas seperti [Nomor Surat], [Tanggal Pelaksanaan], [Lampiran].
3. Bedakan jabatan pembuat, pemeriksa, dan pejabat yang mengesahkan (Kepala Sekolah atau Wakasek Kesiswaan).
4. Gunakan gaya bahasa kedinasan resmi Republik Indonesia.

Tolong hasilkan draf dokumen lengkap:`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    res.json({
      success: true,
      content: response.text,
    });
  } catch (error: any) {
    console.error('Error generating document with Gemini:', error);
    res.status(500).json({
      success: false,
      message: error?.message || 'Terjadi kesalahan saat memproses generator dokumen.',
    });
  }
});

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    // Development mode: Vite middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production mode: Serve dist folder
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server SIAKAS SMAN 1 Kakas berjalan di port ${PORT} [Mode: ${isProduction ? 'Production' : 'Development'}]`);
  });
}

startServer();
