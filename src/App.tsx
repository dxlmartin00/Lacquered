import { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from './db/schema';
import { seedDatabaseIfEmpty } from './db/mockData';
import { AppShell } from './components/layout/AppShell';
import type { NavTab } from './components/layout/Navigation';
import { ActiveSessionCard } from './components/desk/ActiveSessionCard';
import { DailyTimeline } from './components/desk/DailyTimeline';
import { ClientVault } from './components/clients/ClientVault';
import { QuoteEngineView } from './components/quote/QuoteEngineView';
import { QuickQuoteModal } from './components/quote/QuickQuoteModal';
import { ServiceLogVault } from './components/logs/ServiceLogVault';
import { NewAppointmentModal } from './components/desk/NewAppointmentModal';
import { NewClientModal } from './components/clients/NewClientModal';
import { useSessionStore } from './stores/useSessionStore';
import { Armchair, Plus } from 'lucide-react';
import type { AppointmentRecord, ClientRecord } from './types';
import { playTactileTick } from './utils/audio';

export function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('desk');
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Zustand session modal state
  const { activeModal, setActiveModal, activeAppointmentId, setActiveAppointmentId } =
    useSessionStore();

  // Reactive IndexedDB queries
  const clients = useLiveQuery(() => db.clients.toArray()) || [];
  const appointments = useLiveQuery(() => db.appointments.toArray()) || [];

  // Seed on boot
  useEffect(() => {
    seedDatabaseIfEmpty().finally(() => {
      setIsInitialized(true);
    });
  }, []);

  // Determine active chair session:
  const inChairAppointments = appointments.filter((a) => a.status === 'in_chair');
  const activeAppointment =
    appointments.find((a) => a.id === activeAppointmentId && a.status === 'in_chair') ||
    inChairAppointments[0] ||
    null;

  const activeClient = activeAppointment
    ? clients.find((c) => c.id === activeAppointment.clientId)
    : undefined;

  const handleSeatAppointment = async (aptId: string) => {
    try {
      await db.appointments.update(aptId, { status: 'in_chair' });
      setActiveAppointmentId(aptId);
      setActiveTab('desk');
    } catch (err) {
      console.error('Failed to seat appointment:', err);
    }
  };

  const handleSeatClientDirectly = async (client: ClientRecord) => {
    try {
      const newApt: AppointmentRecord = {
        id: `apt-${Date.now()}`,
        clientId: client.id,
        clientName: client.name,
        scheduledTime: Date.now(),
        status: 'in_chair',
        baseService: 'Structured BIAB',
        artTier: 2,
        quotedPrice: 95,
        durationMinutes: 75,
        depositPaid: 0,
        notes: `Seated directly from Client Vault. Preferred shape: ${client.preferredShape}.`,
      };

      await db.appointments.add(newApt);
      setActiveAppointmentId(newApt.id);
      setActiveTab('desk');
    } catch (err) {
      console.error('Failed to seat client directly:', err);
    }
  };

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-[100dvh] w-screen bg-studio-base text-stone-100">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-center animate-pulse">
            <span className="font-display text-2xl font-bold text-amber-400">L</span>
          </div>
          <span className="font-mono text-xs uppercase tracking-widest text-stone-400">
            Booting Lacquered Studio OS...
          </span>
        </div>
      </div>
    );
  }

  return (
    <AppShell
      activeTab={activeTab}
      onTabChange={setActiveTab}
      inChairCount={inChairAppointments.length}
    >
      {/* TAB 1: THE DESK (Active Chair Session & Daily Timeline) */}
      {activeTab === 'desk' && (
        <div className="max-w-5xl mx-auto space-y-6 pb-20 md:pb-6">
          {activeAppointment ? (
            <ActiveSessionCard
              appointment={activeAppointment}
              client={activeClient}
              onViewSizingVault={() => setActiveTab('vault')}
            />
          ) : (
            <div className="w-full hairline-card rounded-2xl p-8 text-center space-y-4 select-none">
              <div className="w-14 h-14 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-center mx-auto text-stone-500 shadow-inner">
                <Armchair className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold font-sans text-stone-100">
                  Chair is Currently Open
                </h3>
                <p className="text-xs text-stone-400 max-w-sm mx-auto">
                  Select an upcoming appointment below or start a live walk-in consultation quote.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    playTactileTick();
                    setActiveModal('new-apt');
                  }}
                  className="touch-target px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-white text-stone-950 font-mono text-xs font-bold flex items-center space-x-2 shadow-md tactile-btn"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>SEAT WALK-IN NOW</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    playTactileTick();
                    setActiveTab('quote');
                  }}
                  className="touch-target px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-800 font-mono text-xs font-semibold tactile-btn"
                >
                  CALCULATE QUOTE
                </button>
              </div>
            </div>
          )}

          {/* Daily Schedule Timeline */}
          <DailyTimeline
            appointments={appointments}
            clients={clients}
            onSelectAppointment={(apt) => {
              if (apt.status === 'in_chair') {
                setActiveAppointmentId(apt.id);
              } else {
                handleSeatAppointment(apt.id);
              }
            }}
            onSeatAppointment={handleSeatAppointment}
            onNewAppointment={() => setActiveModal('new-apt')}
          />
        </div>
      )}

      {/* TAB 2: SIZING VAULT */}
      {activeTab === 'vault' && (
        <ClientVault
          clients={clients}
          onSeatInChair={handleSeatClientDirectly}
        />
      )}

      {/* TAB 3: CONSULTATION QUICK-QUOTE ENGINE */}
      {activeTab === 'quote' && (
        <QuoteEngineView
          onSeatClient={(aptId) => {
            setActiveAppointmentId(aptId);
            setActiveTab('desk');
          }}
        />
      )}

      {/* TAB 4: SERVICE LOGS & PHOTO GALLERY */}
      {activeTab === 'logs' && <ServiceLogVault />}

      {/* GLOBAL MODALS */}
      <QuickQuoteModal
        isOpen={activeModal === 'quote'}
        onClose={() => setActiveModal('none')}
        onSeatClient={(aptId) => {
          setActiveAppointmentId(aptId);
          setActiveTab('desk');
        }}
      />

      <NewAppointmentModal
        isOpen={activeModal === 'new-apt'}
        onClose={() => setActiveModal('none')}
        onCreated={(aptId) => {
          setActiveAppointmentId(aptId);
          setActiveTab('desk');
        }}
      />

      <NewClientModal
        isOpen={activeModal === 'new-client'}
        onClose={() => setActiveModal('none')}
      />
    </AppShell>
  );
}

export default App;
