import type { BreachEvent, Reading } from './types';

export function isValidReading(humidity: number, temperature: number) {
  return Number.isFinite(humidity) && Number.isFinite(temperature) &&
    humidity >= 0 && humidity <= 100 && temperature >= -20 && temperature <= 80;
}

export function isBreach(humidity: number, min: number, max: number) {
  return humidity < min || humidity > max;
}

export function updateBreach(events: BreachEvent[], reading: Reading, min: number, max: number, acknowledged: boolean) {
  const updatedEvents = events.map(event => ({ ...event }));
  const active = updatedEvents.find(event => event.status === 'Active');
  const breach = isBreach(reading.humidity, min, max);

  if (breach) {
    if (active) {
      active.peakHumidity = Math.max(active.peakHumidity, reading.humidity);
      active.minHumidity = Math.min(active.minHumidity, reading.humidity);
      active.acknowledged = active.acknowledged || acknowledged;
    } else {
      updatedEvents.unshift({
        id: `event-${reading.timestamp}`,
        start: reading.timestamp,
        recovery: null,
        peakHumidity: reading.humidity,
        minHumidity: reading.humidity,
        acknowledged,
        status: 'Active',
      });
    }
    const currentEvent = active ?? updatedEvents[0];
    return { events: updatedEvents, acknowledged: currentEvent.acknowledged, breach: true };
  }

  if (active) {
    active.recovery = reading.timestamp;
    active.status = 'Resolved';
  }
  return { events: updatedEvents, acknowledged: false, breach: false };
}
export function trendWarning(readings:Reading[],max:number,now:number){const recent=readings.filter(r=>now-r.timestamp<=120000).slice(-8);if(recent.length<4)return {warning:false,rate:0,etaMinutes:null as number|null};const first=recent[0],last=recent[recent.length-1],elapsed=(last.timestamp-first.timestamp)/60000;if(elapsed<=0)return {warning:false,rate:0,etaMinutes:null};const rate=(last.humidity-first.humidity)/elapsed;const rising=recent.slice(1).filter((r,i)=>r.humidity>=recent[i].humidity).length>=recent.length-2;const eta=rate>0?(max-last.humidity)/rate:null;return {warning:rate>0.15&&rising&&eta!==null&&eta>0&&eta<=60,rate,etaMinutes:eta};}
