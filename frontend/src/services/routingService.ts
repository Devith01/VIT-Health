export interface RouteResult {
  coordinates: [number, number][]; // Array of [lat, lng]
  distanceMeters: number;
  durationSeconds: number;
  engine: 'OSRM_PUBLIC_API' | 'CAMPUS_ROAD_GRAPH';
}

// Fixed required coordinates specified by project requirements
export const CLINIC_COORDS: [number, number] = [23.076039, 76.850110];
export const BOYS_HOSTEL_1_COORDS: [number, number] = [23.074891, 76.859719];
export const GIRLS_HOSTEL_1_COORDS: [number, number] = [23.074909, 76.853133];

// High-fidelity road path from Clinic (23.076039, 76.850110) to Boys Hostel 1 (23.074891, 76.859719)
export const ROAD_TO_BOYS_HOSTEL_1: [number, number][] = [
  [23.076039, 76.850110], // Clinic / Ambulance Dispatch Station
  [23.076041, 76.850157],
  [23.074987, 76.850213],
  [23.074843, 76.850185],
  [23.074711, 76.850848],
  [23.074659, 76.851169],
  [23.074635, 76.851319],
  [23.074633, 76.851403],
  [23.074641, 76.851483],
  [23.074717, 76.851817],
  [23.074763, 76.852062],
  [23.074826, 76.852382],
  [23.074874, 76.852842],
  [23.074924, 76.853594],
  [23.074975, 76.854095],
  [23.075038, 76.854523],
  [23.075072, 76.854787],
  [23.075046, 76.854817],
  [23.075023, 76.854845],
  [23.075019, 76.854887],
  [23.075014, 76.854929],
  [23.075038, 76.854972],
  [23.075082, 76.854977],
  [23.075111, 76.855283],
  [23.075091, 76.855658],
  [23.075028, 76.856127],
  [23.074931, 76.856623],
  [23.074936, 76.857061],
  [23.074955, 76.857415],
  [23.074970, 76.858080],
  [23.074950, 76.858445],
  [23.074941, 76.858618],
  [23.074903, 76.859177],
  [23.074891, 76.859719], // Boys Hostel 1
];

// High-fidelity road path from Clinic (23.076039, 76.850110) to Girls Hostel 1 (23.074909, 76.853133)
export const ROAD_TO_GIRLS_HOSTEL_1: [number, number][] = [
  [23.076039, 76.850110], // Clinic / Ambulance Dispatch Station
  [23.076041, 76.850157],
  [23.074987, 76.850213],
  [23.074843, 76.850185],
  [23.074711, 76.850848],
  [23.074659, 76.851169],
  [23.074635, 76.851319],
  [23.074633, 76.851403],
  [23.074641, 76.851483],
  [23.074717, 76.851817],
  [23.074763, 76.852062],
  [23.074826, 76.852382],
  [23.074874, 76.852842],
  [23.074909, 76.853133], // Girls Hostel 1
];

/**
 * Calculates bearing angle in degrees (0° - 360°) between two GPS points
 */
export function calculateBearing(start: [number, number], end: [number, number]): number {
  const startLat = (start[0] * Math.PI) / 180;
  const startLng = (start[1] * Math.PI) / 180;
  const endLat = (end[0] * Math.PI) / 180;
  const endLng = (end[1] * Math.PI) / 180;

  const dLng = endLng - startLng;
  const y = Math.sin(dLng) * Math.cos(endLat);
  const x = Math.cos(startLat) * Math.sin(endLat) - Math.sin(startLat) * Math.cos(endLat) * Math.cos(dLng);

  let brng = (Math.atan2(y, x) * 180) / Math.PI;
  return (brng + 360) % 360;
}

/**
 * Calculates distance in meters between two GPS points using Haversine formula
 */
export function calculateDistanceMeters(p1: [number, number], p2: [number, number]): number {
  const R = 6371000; // Earth radius in meters
  const dLat = ((p2[0] - p1[0]) * Math.PI) / 180;
  const dLng = ((p2[1] - p1[1]) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((p1[0] * Math.PI) / 180) * Math.cos((p2[0] * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Formats duration in seconds into human-readable "X min Y sec" or "X min"
 */
export function formatDurationText(totalSeconds: number): string {
  const rounded = Math.max(0, Math.round(totalSeconds));
  const mins = Math.floor(rounded / 60);
  const secs = rounded % 60;
  if (mins === 0) return `${secs} sec`;
  if (secs === 0) return `${mins} min`;
  return `${mins} min ${secs} sec`;
}

/**
 * Fetches real road routing geometry from OSRM Public API with fallback to Campus Road Graph
 */
export async function fetchRoadRoute(start: [number, number], end: [number, number]): Promise<RouteResult> {
  const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const response = await fetch(osrmUrl, {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' },
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        // OSRM returns GeoJSON coordinates as [lng, lat], convert to Leaflet [lat, lng]
        const rawCoords: [number, number][] = route.geometry.coordinates;
        const leafletCoords: [number, number][] = rawCoords.map((c) => [c[1], c[0]]);

        // Ensure start and end precisely pin to the required fixed coordinates
        leafletCoords[0] = start;
        leafletCoords[leafletCoords.length - 1] = end;

        return {
          coordinates: leafletCoords,
          distanceMeters: Math.round(route.distance),
          durationSeconds: Math.round(route.duration),
          engine: 'OSRM_PUBLIC_API',
        };
      }
    }
  } catch (err) {
    console.warn('[RoutingService] OSRM API call failed or timed out. Falling back to high-precision campus road graph.', err);
  }

  // Fallback to high-precision Campus Road Network Graph
  const isGirlsHostel = Math.abs(end[0] - GIRLS_HOSTEL_1_COORDS[0]) < 0.001 && Math.abs(end[1] - GIRLS_HOSTEL_1_COORDS[1]) < 0.001;
  const fallbackCoords = isGirlsHostel ? ROAD_TO_GIRLS_HOSTEL_1 : ROAD_TO_BOYS_HOSTEL_1;

  let totalDistance = 0;
  for (let i = 0; i < fallbackCoords.length - 1; i++) {
    totalDistance += calculateDistanceMeters(fallbackCoords[i], fallbackCoords[i + 1]);
  }

  // Standard emergency vehicle speed ~ 25-30 km/h on campus (~8 m/s)
  const durationSec = Math.round(totalDistance / 7.5);

  return {
    coordinates: fallbackCoords,
    distanceMeters: Math.round(totalDistance),
    durationSeconds: durationSec,
    engine: 'CAMPUS_ROAD_GRAPH',
  };
}
