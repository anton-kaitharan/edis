export type Reading = { id: string; timestamp: number; humidity: number; temperature: number };
export type BreachEvent = { id: string; start: number; recovery: number | null; peakHumidity: number; minHumidity: number; acknowledged: boolean; status: 'Active' | 'Resolved' };
export type Snapshot = { readings: Reading[]; events: BreachEvent[]; minHumidity: number; maxHumidity: number; humidity: number; temperature: number; paused: boolean; acknowledged: boolean };
