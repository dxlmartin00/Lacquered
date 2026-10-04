import Dexie, { type Table } from 'dexie';
import type { ClientRecord, AppointmentRecord, ServiceLogRecord, ServiceItem } from '../types';

export class LacqueredDB extends Dexie {
  clients!: Table<ClientRecord, string>;
  appointments!: Table<AppointmentRecord, string>;
  serviceLogs!: Table<ServiceLogRecord, string>;
  services!: Table<ServiceItem, string>;

  constructor() {
    super('LacqueredDatabase');
    this.version(2).stores({
      clients: 'id, name, phone, createdAt',
      appointments: 'id, clientId, scheduledTime, status',
      serviceLogs: 'id, appointmentId, clientId, timestamp',
      services: 'id, category, name, price'
    });
  }
}

export const db = new LacqueredDB();
