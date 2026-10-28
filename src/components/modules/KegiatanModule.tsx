import React, { useState } from 'react';
import {
  GraduationCap,
  Calendar,
  Clock,
  MapPin,
  Users,
  Plus,
  Sparkles,
  FileText,
  Printer,
  CheckCircle2
} from 'lucide-react';
import { DatabaseState, Activity } from '../../types';

interface KegiatanModuleProps {
  state: DatabaseState;
  onUpdateState: (newState: DatabaseState) => void;
  onNavigate: (module: string) => void;
}

export const KegiatanModule: React.FC<KegiatanModuleProps> = ({
  state,
  onUpdateState,
  onNavigate,
}) => {
  const currentAcademicYear = state.schoolProfile.activeAcademicYear;

  // Filter activities in category 'Kegiatan Khusus & PHBN' or 'Layanan & Bimbingan'
  const specialActivities = state.activities.filter(a => 
    a.academicYear === currentAcademicYear && 
    (a.category === 'Kegiatan Khusus & PHBN' || a.category === 'Layanan & Bimbingan')
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-900" />
            <h2 className="text-lg font-bold text-slate-900">
              Modul Kegiatan Khusus & Peringatan Hari Besar (PHBN / PHBI)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Upacara kenegaraan, peringatan hari besar keagamaan, pentas seni P5, bakti Danau Tondano, dan classmeeting.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('generator-ai')}
            className="px-3.5 py-2 text-xs font-bold text-blue-950 bg-amber-400 hover:bg-amber-500 rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-900" />
            Draf Proposal Kegiatan
          </button>
          <button
            onClick={() => onNavigate('kalender')}
            className="px-4 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            Atur di Kalender
          </button>
        </div>
      </div>

      {/* Grid of Special Activities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {specialActivities.map((act) => {
          const budgetPct = act.budgetPlanned > 0 ? Math.round((act.budgetRealized / act.budgetPlanned) * 100) : 0;

          return (
            <div
              key={act.id}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    act.status === 'Selesai' ? 'bg-emerald-100 text-emerald-800' :
                    act.status === 'Sedang Berlangsung' ? 'bg-amber-100 text-amber-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {act.status}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">
                    {act.dateStart}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {act.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed font-sans">
                  {act.description}
                </p>

                <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-1.5 border border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <Clock className="w-3.5 h-3.5 text-blue-900" />
                    <span>{act.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{act.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-700 font-medium pt-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>PJ: {act.personInCharge} • Peserta: {act.participantCount} orang</span>
                  </div>
                </div>

                {/* Checklist Dokumen Wajib */}
                <div className="pt-2">
                  <span className="text-[11px] font-bold text-slate-700 block mb-1">Kelengkapan Administrasi:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {act.requiredDocs.map((docName, idx) => {
                      const isComplete = act.completedDocs.includes(docName);
                      return (
                        <span
                          key={idx}
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 ${
                            isComplete ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200'
                          }`}
                        >
                          {isComplete ? '✓' : '○'} {docName}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Realisasi Anggaran:</span>
                  <span className="font-bold text-slate-900">
                    Rp {act.budgetRealized.toLocaleString('id-ID')} / Rp {act.budgetPlanned.toLocaleString('id-ID')}
                  </span>
                </div>

                <button
                  onClick={() => onNavigate('dokumen')}
                  className="text-xs font-bold text-blue-900 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Buka Dokumen Terkait →
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
