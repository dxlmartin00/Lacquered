import Dexie, { type Table } from 'dexie';
import type { ClientRecord, AppointmentRecord, ServiceLogRecord } from '../types';

export class LacqueredDB extends Dexie {
  clients!: Table<ClientRecord, string>;
  appointments!: Table<AppointmentRecord, string>;
  serviceLogs!: Table<ServiceLogRecord, string>;

  constructor() {
    super('LacqueredDatabase');
    this.version(1).stores({
      clients: 'id, name, phone, createdAt',
      appointments: 'id, clientId, scheduledTime, status',
      serviceLogs: 'id, appointmentId, clientId, timestamp'
    });
  }
}

export const db = new LacqueredDB();
