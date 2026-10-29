import type { Snapshot } from './types';
export const SNAPSHOT_KEY='smart-grain-monitor-v1';
const KEY=SNAPSHOT_KEY;
export const emptySnapshot=():Snapshot=>({readings:[],events:[],minHumidity:40,maxHumidity:65,humidity:52,temperature:24,paused:false,acknowledged:false});
export const loadSnapshot=():Snapshot=>{try{const raw=localStorage.getItem(KEY);return raw?{...emptySnapshot(),...JSON.parse(raw)}:emptySnapshot();}catch{return emptySnapshot();}};
export const saveSnapshot=(value:Snapshot)=>{try{localStorage.setItem(KEY,JSON.stringify(value));}catch{/* storage can be unavailable; in-memory monitoring continues */}};
