import { describe,it,expect } from 'vitest';
import { isBreach,isValidReading,trendWarning,updateBreach } from './alert-engine';
import { getAnalytics } from './analytics';
import type { Reading } from './types';
const r=(humidity:number,timestamp:number):Reading=>({id:String(timestamp),humidity,temperature:24,timestamp});
describe('alert engine',()=>{
 it('keeps safe readings in range and detects high and low breaches',()=>{expect(isBreach(50,40,65)).toBe(false);expect(isBreach(66,40,65)).toBe(true);expect(isBreach(39,40,65)).toBe(true);});
 it('treats configured humidity endpoints as safe',()=>{expect(isBreach(40,40,65)).toBe(false);expect(isBreach(65,40,65)).toBe(false);});
 it('rejects invalid measurements and accepts the documented boundary values',()=>{expect(isValidReading(NaN,20)).toBe(false);expect(isValidReading(101,20)).toBe(false);expect(isValidReading(50,81)).toBe(false);expect(isValidReading(0,-20)).toBe(true);expect(isValidReading(100,80)).toBe(true);});
 it('creates one event per continuous breach and resolves it',()=>{let x=updateBreach([],r(70,1000),40,65,false);x=updateBreach(x.events,r(72,4000),40,65,false);expect(x.events).toHaveLength(1);expect(x.events[0].peakHumidity).toBe(72);x=updateBreach(x.events,r(55,7000),40,65,false);expect(x.events[0].status).toBe('Resolved');expect(x.events[0].recovery).toBe(7000);});
 it('keeps acknowledgment through continued breach but resets on recovery',()=>{let x=updateBreach([],r(70,1000),40,65,false);x=updateBreach(x.events,r(71,2000),40,65,true);expect(x.acknowledged).toBe(true);x=updateBreach(x.events,r(55,3000),40,65,true);expect(x.acknowledged).toBe(false);});
 it('does not lose an existing acknowledgment when the caller has stale state',()=>{let x=updateBreach([],r(70,1000),40,65,false);x=updateBreach(x.events,r(71,2000),40,65,true);x=updateBreach(x.events,r(72,3000),40,65,false);expect(x.acknowledged).toBe(true);expect(x.events[0].acknowledged).toBe(true);});
 it('signals a sustained rising trend nearing the upper bound',()=>{const readings=[r(58,0),r(59,15000),r(60,30000),r(61,45000),r(62,60000)];expect(trendWarning(readings,65,60000).warning).toBe(true);});
 it('does not warn on flat or stale readings',()=>{const flat=[r(60,0),r(60,15000),r(60,30000),r(60,45000)];expect(trendWarning(flat,65,45000).warning).toBe(false);expect(trendWarning(flat,65,300000).warning).toBe(false);});
 it('calculates event statistics from records',()=>{const a=getAnalytics([{id:'1',start:0,recovery:60000,peakHumidity:70,minHumidity:70,acknowledged:false,status:'Resolved'}],[r(70,0)],86400000);expect(a.total).toBe(1);expect(a.frequency).toBe(1);expect(a.averageDuration).toBe(1);expect(a.peak).toBe(70);});
 it('derives active breach duration through the current time and handles empty records',()=>{const active={id:'active',start:0,recovery:null,peakHumidity:71,minHumidity:71,acknowledged:false,status:'Active' as const};expect(getAnalytics([active],[],120000).averageDuration).toBe(2);expect(getAnalytics([],[],120000).peak).toBeNull();});
});
