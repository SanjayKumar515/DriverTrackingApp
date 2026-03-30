import { Driver, DriverVehicleType } from '../../types/driver';
import { toNumberOrNull } from '../../helpers/geo';

const VEHICLES: DriverVehicleType[] = ['Sedan', 'SUV', 'Hatchback', 'Bike', 'Van'];

function pickVehicle(seed: string): DriverVehicleType {
  const idx = Math.abs(hash(seed)) % VEHICLES.length;
  return VEHICLES[idx];
}

function ratingFromSeed(seed: string): number {
  const r = (Math.abs(hash(seed)) % 21) / 10; // 0.0..2.0
  const base = 3.0 + r; // 3.0..5.0
  return Math.max(1, Math.min(5, Math.round(base * 10) / 10));
}

export function mapRandomUserToDriver(u: any): Driver | null {
  const id = u?.login?.uuid || u?.email || u?.phone;
  const first = u?.name?.first;
  const last = u?.name?.last;
  const phone = u?.phone || u?.cell || '';
  const imageUrl = u?.picture?.large || u?.picture?.medium || u?.picture?.thumbnail || '';

  const lat = toNumberOrNull(u?.location?.coordinates?.latitude);
  const lon = toNumberOrNull(u?.location?.coordinates?.longitude);
  if (!id || !first || !last || lat === null || lon === null) return null;

  const seed = String(id);
  return {
    id: String(id),
    name: `${first} ${last}`,
    phone: String(phone),
    imageUrl: String(imageUrl),
    vehicleType: pickVehicle(seed),
    rating: ratingFromSeed(seed),
    coordinate: { latitude: lat, longitude: lon },
  };
}

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return h;
}

