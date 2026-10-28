import React from 'react';
import { SchoolProfile } from '../../types';

interface KopSuratProps {
  school: SchoolProfile;
  className?: string;
}

export const KopSurat: React.FC<KopSuratProps> = ({ school, className = '' }) => {
  return (
    <div className={`border-b-4 border-double border-slate-900 pb-3 mb-6 text-center select-none font-serif ${className}`}>
      <div className="flex items-center justify-between gap-4">
        {/* Lambang Provinsi Sulawesi Utara (Sebelah Kiri) */}
        <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center">
          <img
            src="/assets/aistudio/logo_provinsi_c9769acf.png"
            alt="Logo Provinsi Sulawesi Utara"
            className="w-18 h-18 object-contain drop-shadow-xs"
          />
        </div>

        {/* Teks Kop Surat Resmi */}
        <div className="flex-1 text-center">
          <h4 className="text-xs sm:text-sm font-semibold tracking-wider text-slate-800 uppercase leading-tight font-sans">
            PEMERINTAH PROVINSI SULAWESI UTARA
          </h4>
          <h3 className="text-sm sm:text-base font-bold tracking-wide text-slate-900 uppercase leading-tight font-sans">
            DINAS PENDIDIKAN DAERAH
          </h3>
          <h1 className="text-lg sm:text-2xl font-black text-blue-950 tracking-wide uppercase leading-tight my-0.5 font-serif">
            {school.name}
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-700 leading-snug font-sans font-medium">
            NPSN: {school.npsn} • {school.address}
          </p>
          <p className="text-[10px] sm:text-[11px] text-slate-600 leading-snug font-sans">
            Telepon: {school.phone} | Pos-el: {school.email} | Laman: {school.website}
          </p>
        </div>

        {/* Lambang SMA Negeri 1 Kakas (Sebelah Kanan) */}
        <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center">
          <img
            src="/assets/aistudio/WhatsApp_Image_2025-11-20_at_12.29.19-removebg-preview__1__c9a0a08a.png"
            alt="Logo SMA Negeri 1 Kakas"
            className="w-18 h-18 object-contain drop-shadow-xs"
          />
        </div>
      </div>
    </div>
  );
};
