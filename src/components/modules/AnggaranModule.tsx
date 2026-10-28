import React, { useState } from 'react';
import {
  DollarSign,
  Plus,
  FileSpreadsheet,
  Printer,
  TrendingUp,
  Receipt,
  PieChart,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { DatabaseState, BudgetRecord, BudgetSource } from '../../types';
import { exportBudgetToExcel } from '../../services/exportService';

interface AnggaranModuleProps {
  state: DatabaseState;
  onUpdateState: (newState: DatabaseState) => void;
  onNavigate: (module: string) => void;
}

export const AnggaranModule: React.FC<AnggaranModuleProps> = ({
  state,
  onUpdateState,
  onNavigate,
}) => {
  const currentAcademicYear = state.schoolProfile.activeAcademicYear;

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedFundSource, setSelectedFundSource] = useState('Semua');

  // Form State
  const [formData, setFormData] = useState<Partial<BudgetRecord>>({
    activityName: state.activities[0]?.title || 'Penyelenggaraan Kegiatan Kesiswaan',
    component: '',
    volume: 1,
    unit: 'Paket',
    unitPrice: 500000,
    fundSource: 'BOS Reguler',
    realizedAmount: 0,
    transactionProofNotes: '',
    status: 'Rencana',
  });

  const budgets = state.budgets.filter(b => b.academicYear === currentAcademicYear);

  const filteredBudgets = budgets.filter(b => {
    return selectedFundSource === 'Semua' || b.fundSource === selectedFundSource;
  });

  // Calculate totals
  const totalRAB = budgets.reduce((acc, b) => acc + b.totalPrice, 0);
  const totalRealisasi = budgets.reduce((acc, b) => acc + b.realizedAmount, 0);
  const totalSelisih = totalRAB - totalRealisasi;
  const realizationPct = totalRAB > 0 ? Math.round((totalRealisasi / totalRAB) * 100) : 0;

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.component?.trim()) return;

    const vol = Number(formData.volume) || 1;
    const price = Number(formData.unitPrice) || 0;
    const calculatedTotal = vol * price;
    const real = Number(formData.realizedAmount) || 0;

    const newBudget: BudgetRecord = {
      id: 'bdg-' + Date.now(),
      activityName: formData.activityName || 'Kegiatan Kesiswaan',
      academicYear: currentAcademicYear,
      semester: state.schoolProfile.activeSemester,
      component: formData.component || '',
      volume: vol,
      unit: formData.unit || 'Paket',
      unitPrice: price,
      totalPrice: calculatedTotal,
      fundSource: (formData.fundSource as BudgetSource) || 'BOS Reguler',
      realizedAmount: real,
      difference: calculatedTotal - real,
      transactionProofNotes: formData.transactionProofNotes || 'Nota / Kuitansi Belanja',
      status: real > 0 ? 'Terealisasi' : 'Rencana',
    };

    onUpdateState({
      ...state,
      budgets: [newBudget, ...state.budgets],
    });

    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-700" />
            <h2 className="text-lg font-bold text-slate-900">
              Modul Administrasi & Pemantauan Anggaran Kegiatan Kesiswaan
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Rencana Anggaran Biaya (RAB), pencatatan realisasi faktual, dan verifikasi bukti kuitansi belanja dinas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportBudgetToExcel(filteredBudgets, currentAcademicYear)}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg flex items-center gap-1.5 cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
            Ekspor Excel (.xlsx)
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Tambah Komponen Anggaran
          </button>
        </div>
      </div>

      {/* Summary Financial Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Total Rencana Anggaran (RAB)</span>
          <span className="text-xl font-black text-slate-900 mt-1 block">
            Rp {totalRAB.toLocaleString('id-ID')}
          </span>
          <span className="text-[10px] text-slate-400">Tahun Pelajaran {currentAcademicYear}</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Total Realisasi Belanja</span>
          <span className="text-xl font-black text-blue-900 mt-1 block">
            Rp {totalRealisasi.toLocaleString('id-ID')}
          </span>
          <span className="text-[10px] text-emerald-700 font-semibold">{realizationPct}% Terserap</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Sisa Anggaran / Efisiensi</span>
          <span className="text-xl font-black text-emerald-700 mt-1 block">
            Rp {totalSelisih.toLocaleString('id-ID')}
          </span>
          <span className="text-[10px] text-slate-400">Efisiensi Belanja Kegiatan</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Bendahara Kesiswaan</span>
          <span className="text-sm font-bold text-slate-900 mt-1 block truncate">
            {state.schoolProfile.treasurerName}
          </span>
          <span className="text-[10px] text-slate-400">NIP: {state.schoolProfile.treasurerNip}</span>
        </div>
      </div>

      {/* Table of Budget Items */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="font-bold text-slate-900">Rincian Komponen Anggaran & Realisasi (RAB Kesiswaan)</span>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-600">Sumber Dana:</span>
            <select
              value={selectedFundSource}
              onChange={(e) => setSelectedFundSource(e.target.value)}
              className="px-2.5 py-1 border border-slate-300 rounded-lg bg-white text-xs focus:outline-none"
            >
              <option value="Semua">Semua Sumber Dana</option>
              <option value="BOS Reguler">BOS Reguler</option>
              <option value="BOS Kinerja">BOS Kinerja</option>
              <option value="Komite Sekolah">Komite Sekolah</option>
              <option value="Swadana / Sponsor">Swadana / Sponsor</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-900 text-white font-bold">
              <tr>
                <th className="py-3 px-3 text-center w-10">No</th>
                <th className="py-3 px-3">Nama Kegiatan</th>
                <th className="py-3 px-4">Komponen Pengeluaran</th>
                <th className="py-3 px-2.5 text-center">Volume & Satuan</th>
                <th className="py-3 px-3 text-right">Harga Satuan (Rp)</th>
                <th className="py-3 px-3 text-right">RAB Total (Rp)</th>
                <th className="py-3 px-2.5">Sumber Dana</th>
                <th className="py-3 px-3 text-right">Realisasi (Rp)</th>
                <th className="py-3 px-3 text-right">Selisih</th>
                <th className="py-3 px-3">Bukti Transaksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBudgets.map((b, idx) => (
                <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3 text-center font-bold text-slate-500">{idx + 1}</td>
                  <td className="py-3 px-3 font-semibold text-blue-900 max-w-[180px] truncate" title={b.activityName}>
                    {b.activityName}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {b.component}
                  </td>
                  <td className="py-3 px-2.5 text-center text-slate-700">
                    {b.volume} {b.unit}
                  </td>
                  <td className="py-3 px-3 text-right font-medium text-slate-700">
                    {b.unitPrice.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-slate-900">
                    {b.totalPrice.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3 px-2.5">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-semibold text-slate-700 whitespace-nowrap">
                      {b.fundSource}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-blue-950">
                    {b.realizedAmount.toLocaleString('id-ID')}
                  </td>
                  <td className={`py-3 px-3 text-right font-semibold ${
                    b.difference >= 0 ? 'text-emerald-700' : 'text-rose-600'
                  }`}>
                    {b.difference.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3 px-3 text-[11px] text-slate-500 max-w-[160px] truncate" title={b.transactionProofNotes}>
                    {b.transactionProofNotes || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Menampilkan {filteredBudgets.length} pos anggaran kesiswaan</span>
          <button
            onClick={() => window.print()}
            className="text-xs font-semibold text-blue-900 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" /> Cetak Rekapitulasi Anggaran
          </button>
        </div>
      </div>

      {/* Modal Add Budget */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-lg w-full shadow-2xl border border-slate-200 p-5 space-y-3.5 text-xs animate-in fade-in max-h-[90vh] overflow-y-auto">
            <h3 className="text-sm font-bold text-slate-900">Tambah Komponen Anggaran Kegiatan (RAB)</h3>
            <form onSubmit={handleSaveBudget} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Kegiatan *</label>
                <select
                  value={formData.activityName}
                  onChange={(e) => setFormData({ ...formData, activityName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                >
                  {state.activities.map(a => (
                    <option key={a.id} value={a.title}>{a.title}</option>
                  ))}
                  <option value="Operasional Rutin Kesiswaan">Operasional Rutin Kesiswaan</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Komponen Belanja / Uraian Pengeluaran *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pengadaan Konsumsi Peserta & Panitia"
                  value={formData.component}
                  onChange={(e) => setFormData({ ...formData, component: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Volume</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.volume}
                    onChange={(e) => setFormData({ ...formData, volume: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Satuan</label>
                  <input
                    type="text"
                    placeholder="Kotak / Orang"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Harga Satuan (Rp)</label>
                  <input
                    type="number"
                    value={formData.unitPrice}
                    onChange={(e) => setFormData({ ...formData, unitPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-2.5 bg-blue-50 rounded-lg text-blue-900 font-bold flex justify-between items-center">
                <span>Total Biaya Otomatis:</span>
                <span className="text-sm font-black">
                  Rp {((formData.volume || 1) * (formData.unitPrice || 0)).toLocaleString('id-ID')}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sumber Dana</label>
                  <select
                    value={formData.fundSource}
                    onChange={(e) => setFormData({ ...formData, fundSource: e.target.value as BudgetSource })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                  >
                    <option value="BOS Reguler">BOS Reguler</option>
                    <option value="BOS Kinerja">BOS Kinerja</option>
                    <option value="Komite Sekolah">Komite Sekolah</option>
                    <option value="Swadana / Sponsor">Swadana / Sponsor</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Realisasi Faktual (Rp)</label>
                  <input
                    type="number"
                    value={formData.realizedAmount}
                    onChange={(e) => setFormData({ ...formData, realizedAmount: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Catatan Bukti Transaksi / Nota</label>
                <input
                  type="text"
                  placeholder="Contoh: Kuitansi No. 042/VII/2026 Rumah Makan Kasuari Kakas"
                  value={formData.transactionProofNotes}
                  onChange={(e) => setFormData({ ...formData, transactionProofNotes: e.target.value })}
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
                  Simpan Komponen Anggaran
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
