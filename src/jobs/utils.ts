import type { Job as DbJob } from '../types';

export type ToInsert = Omit<DbJob, 'id' | 'created_at'>;
export type ToUpdate = Omit<DbJob, 'created_at'>;
