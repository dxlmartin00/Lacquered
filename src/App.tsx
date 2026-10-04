import { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { LaqueredLogo } from './components/common/LaqueredLogo';
import { db } from './db/schema';
import { seedDatabaseIfEmpty } from './db/mockData';
import { AppShell } from './components/layout/AppShell';
import type { NavTab } from './components/layout/Navigation';
import { HomeScreen } from './components/home/HomeScreen';
import { ServicesScreen } from './components/services/ServicesScreen';
import { HistoryScreen } from './components/history/HistoryScreen';
import { CustomersScreen } from './components/clients/CustomersScreen';
import { AddCustomerFlowModal } from './components/customer/AddCustomerFlowModal';
import type { ClientRecord } from './types';
import { playChimeSuccess } from './utils/audio';

export function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState<boolean>(false);
  const [prefilledClient, setPrefilledClient] = useState<ClientRecord | undefined>(undefined);

  // Reactive IndexedDB queries
  const clients = useLiveQuery(() => db.clients.toArray()) || [];
  const appointments = useLiveQuery(() => db.appointments.toArray()) || [];

  // Seed database with "Pretty Tips by Nyx" services and sample data
  useEffect(() => {
    seedDatabaseIfEmpty().finally(() => {
      setIsInitialized(true);
    });
  }, []);

  // Determine active chair session
  const inChairAppointments = appointments.filter((a) => a.status === 'in_chair');
  const activeAppointment = inChairAppointments[0] || null;

  const handleSeatAppointment = async (aptId: string) => {
    try {
      // Mark others as scheduled if needed or seat this one
      await db.appointments.update(aptId, { status: 'in_chair' });
      setActiveTab('home');
    } catch (err) {
      console.error('Failed to seat appointment:', err);
    }
  };

  const handleCompleteAppointment = async (aptId: string) => {
    try {
      await db.appointments.update(aptId, { status: 'completed' });
    } catch (err) {
      console.error('Failed to complete appointment:', err);
    }
  };

  const handleOpenAddForClient = (client: ClientRecord) => {
    setPrefilledClient(client);
    setIsAddCustomerOpen(true);
  };

  const handleOpenNewCustomer = () => {
    setPrefilledClient(undefined);
    setIsAddCustomerOpen(true);
  };

  const handleCustomerCreated = (_aptId: string) => {
    playChimeSuccess();
    setActiveTab('home');
    setPrefilledClient(undefined);
  };

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-[100dvh] w-screen bg-[#fff5f7] text-slate-800">
        <div className="flex flex-col items-center space-y-4">
          <LaqueredLogo className="w-16 h-16 rounded-3xl shadow-lg shadow-pink-200 animate-pulse" />
          <div className="text-center space-y-1">
            <span className="font-display text-lg font-bold text-slate-800 block">
              Laquered Studio OS
            </span>
            <span className="font-mono text-xs text-pink-500 block">
              Loading offline database...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AppShell
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onOpenAddCustomer={handleOpenNewCustomer}
      inChairCount={inChairAppointments.length}
    >
      {/* SCREEN 1: HOME (Active Session & Today's Schedule - Image 1 Left) */}
      {activeTab === 'home' && (
        <HomeScreen
          activeAppointment={activeAppointment}
          appointments={appointments}
          clients={clients}
          onOpenAddCustomer={handleOpenNewCustomer}
          onSeatAppointment={handleSeatAppointment}
          onCompleteAppointment={handleCompleteAppointment}
          onNavigateToServices={() => setActiveTab('services')}
        />
      )}

      {/* SCREEN 2: SERVICES & PRICE LIST (Image 2 Price List & Image 1 Center) */}
      {activeTab === 'services' && <ServicesScreen />}

      {/* SCREEN 3: STUDIO PROGRESS & HISTORY (Image 1 Right) */}
      {activeTab === 'history' && <HistoryScreen appointments={appointments} />}

      {/* SCREEN 4: CUSTOMERS DIRECTORY */}
      {activeTab === 'customers' && (
        <CustomersScreen
          clients={clients}
          onOpenAddCustomer={handleOpenNewCustomer}
          onSelectCustomerToBook={handleOpenAddForClient}
        />
      )}

      {/* 2-STEP ADD CUSTOMER FLOW MODAL */}
      <AddCustomerFlowModal
        isOpen={isAddCustomerOpen}
        initialClient={prefilledClient}
        onClose={() => {
          setIsAddCustomerOpen(false);
          setPrefilledClient(undefined);
        }}
        onComplete={handleCustomerCreated}
      />
    </AppShell>
  );
}

export default App;
