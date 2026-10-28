import React, { useState, useEffect } from 'react';
import { DatabaseState, OfficialDocument } from './types';
import { INITIAL_DATABASE } from './data/initialData';
import { loadInitialData, saveDatabaseToServer, logAction } from './services/api';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardModule } from './components/modules/DashboardModule';
import { TahunPelajaranModule } from './components/modules/TahunPelajaranModule';
import { ProgramKerjaModule } from './components/modules/ProgramKerjaModule';
import { KalenderModule } from './components/modules/KalenderModule';
import { DokumenModule } from './components/modules/DokumenModule';
import { GeneratorDokumenAIModule } from './components/modules/GeneratorDokumenAIModule';
import { MPLSModule } from './components/modules/MPLSModule';
import { OSISModule } from './components/modules/OSISModule';
import { EkstrakurikulerModule } from './components/modules/EkstrakurikulerModule';
import { KarakterModule } from './components/modules/KarakterModule';
import { PrestasiModule } from './components/modules/PrestasiModule';
import { KegiatanModule } from './components/modules/KegiatanModule';
import { AnggaranModule } from './components/modules/AnggaranModule';
import { LaporanModule } from './components/modules/LaporanModule';
import { ArsipModule } from './components/modules/ArsipModule';
import { PengaturanPenggunaModule } from './components/modules/PengaturanPenggunaModule';
import { OfficialDocumentViewer } from './components/common/OfficialDocumentViewer';

export function App() {
  const [state, setState] = useState<DatabaseState>(INITIAL_DATABASE);
  const [currentModule, setCurrentModule] = useState<string>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [viewingDoc, setViewingDoc] = useState<OfficialDocument | null>(null);

  // Initialize data from server or localStorage
  useEffect(() => {
    async function init() {
      try {
        const loaded = await loadInitialData();
        setState(loaded);
      } catch (err) {
        console.error('Failed to load initial data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, []);

  // Update state helper that logs and persists to backend
  const handleUpdateState = (newState: DatabaseState) => {
    setState(newState);
    saveDatabaseToServer(newState).catch(e => {
      console.warn('Failed to sync state to server:', e);
    });
  };

  const handleNavigate = (module: string) => {
    setViewingDoc(null);
    setCurrentModule(module);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewDocumentFromArchive = (doc: OfficialDocument) => {
    setViewingDoc(doc);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white space-y-4">
        <div className="w-12 h-12 rounded-xl bg-blue-700 flex items-center justify-center font-bold text-xl shadow-lg animate-pulse">
          S1
        </div>
        <div className="text-center space-y-1">
          <h2 className="text-base font-bold tracking-wide">SIAKAS SMAN 1 KAKAS</h2>
          <p className="text-xs text-blue-200">Memuat Sistem Informasi Administrasi Kesiswaan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Top Application Header */}
      <Header
        state={state}
        onUpdateState={handleUpdateState}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        onNavigate={handleNavigate}
      />

      <div className="flex-1 flex">
        {/* Navigation Sidebar */}
        <Sidebar
          currentModule={currentModule}
          onNavigate={handleNavigate}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          state={state}
        />

        {/* Main Content Workspace */}
        <main className="flex-1 lg:pl-64 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full transition-all">
          {viewingDoc ? (
            <div className="space-y-4">
              <div className="no-print flex items-center justify-between">
                <button
                  onClick={() => setViewingDoc(null)}
                  className="px-3.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  ← Kembali ke Menu Sebelumnya
                </button>
                <span className="text-xs text-slate-500 font-medium">
                  Pratinjau Arsip Naskah Resmi ({viewingDoc.documentType})
                </span>
              </div>

              <OfficialDocumentViewer
                document={viewingDoc}
                school={state.schoolProfile}
                canEdit={true}
                onEdit={(d) => {
                  setViewingDoc(null);
                  setCurrentModule('dokumen');
                }}
              />
            </div>
          ) : (
            <>
              {currentModule === 'dashboard' && (
                <DashboardModule state={state} onNavigate={handleNavigate} />
              )}
              {currentModule === 'tahun-pelajaran' && (
                <TahunPelajaranModule state={state} onUpdateState={handleUpdateState} onNavigate={handleNavigate} />
              )}
              {currentModule === 'program-kerja' && (
                <ProgramKerjaModule state={state} onUpdateState={handleUpdateState} onNavigate={handleNavigate} />
              )}
              {currentModule === 'kalender' && (
                <KalenderModule state={state} onUpdateState={handleUpdateState} onNavigate={handleNavigate} />
              )}
              {currentModule === 'dokumen' && (
                <DokumenModule state={state} onUpdateState={handleUpdateState} onNavigate={handleNavigate} />
              )}
              {currentModule === 'generator-ai' && (
                <GeneratorDokumenAIModule state={state} onUpdateState={handleUpdateState} onNavigate={handleNavigate} />
              )}
              {currentModule === 'mpls' && (
                <MPLSModule state={state} onUpdateState={handleUpdateState} onNavigate={handleNavigate} />
              )}
              {currentModule === 'osis' && (
                <OSISModule state={state} onUpdateState={handleUpdateState} onNavigate={handleNavigate} />
              )}
              {currentModule === 'ekskul' && (
                <EkstrakurikulerModule state={state} onUpdateState={handleUpdateState} onNavigate={handleNavigate} />
              )}
              {currentModule === 'karakter' && (
                <KarakterModule state={state} onUpdateState={handleUpdateState} onNavigate={handleNavigate} />
              )}
              {currentModule === 'prestasi' && (
                <PrestasiModule state={state} onUpdateState={handleUpdateState} onNavigate={handleNavigate} />
              )}
              {currentModule === 'kegiatan' && (
                <KegiatanModule state={state} onUpdateState={handleUpdateState} onNavigate={handleNavigate} />
              )}
              {currentModule === 'anggaran' && (
                <AnggaranModule state={state} onUpdateState={handleUpdateState} onNavigate={handleNavigate} />
              )}
              {currentModule === 'laporan' && (
                <LaporanModule state={state} onUpdateState={handleUpdateState} onNavigate={handleNavigate} />
              )}
              {currentModule === 'arsip' && (
                <ArsipModule
                  state={state}
                  onUpdateState={handleUpdateState}
                  onNavigate={handleNavigate}
                  onViewDocument={handleViewDocumentFromArchive}
                />
              )}
              {(currentModule === 'pengguna' || currentModule === 'pengaturan') && (
                <PengaturanPenggunaModule state={state} onUpdateState={handleUpdateState} onNavigate={handleNavigate} />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
