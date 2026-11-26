export type TripStatus = "approved" | "pending" | "rejected";

export type Trip = {
  id: string;
  from: string;
  to: string;
  time: string;
  bus: string;
  driver: string;
  passengers: number;
  capacity: number;
  revenue: number;
  status: TripStatus;
};

export type RouteStat = {
  from: string;
  to: string;
  occupancy: number;
  passengers: number;
};

export type Company = {
  name: string;
  share: number;
  revenue: number;
  color: string;
};

export const trips: Trip[] = [
  {
    id: "TR-1042",
    from: "Avtovokzal",
    to: "6-mavze",
    time: "08:30",
    bus: "01 A 777 AA",
    driver: "Sardor Qulmatov",
    passengers: 42,
    capacity: 50,
    revenue: 1_260_000,
    status: "approved",
  },
  {
    id: "TR-1043",
    from: "Aeroport",
    to: "Markaziy bozor",
    time: "09:15",
    bus: "01 B 452 CA",
    driver: "Bekzod Allamuratov",
    passengers: 28,
    capacity: 45,
    revenue: 700_000,
    status: "approved",
  },
  {
    id: "TR-1044",
    from: "Madeniyat",
    to: "Doslıq",
    time: "10:00",
    bus: "01 C 118 DA",
    driver: "Islom Jumanazarov",
    passengers: 19,
    capacity: 50,
    revenue: 380_000,
    status: "pending",
  },
  {
    id: "TR-1045",
    from: "Bo'ston",
    to: "Jipek Joli",
    time: "11:40",
    bus: "01 D 903 EA",
    driver: "Azamat Yusupov",
    passengers: 46,
    capacity: 50,
    revenue: 1_380_000,
    status: "approved",
  },
  {
    id: "TR-1046",
    from: "Qarao'zak",
    to: "Avtovokzal",
    time: "13:20",
    bus: "01 E 221 FA",
    driver: "Doston O'razbaev",
    passengers: 12,
    capacity: 45,
    revenue: 300_000,
    status: "rejected",
  },
  {
    id: "TR-1047",
    from: "Shag'at",
    to: "Markaz",
    time: "14:50",
    bus: "01 F 610 GA",
    driver: "Jasur Tolegenov",
    passengers: 33,
    capacity: 50,
    revenue: 660_000,
    status: "approved",
  },
];

export const routeStats: RouteStat[] = [
  { from: "Avtovokzal", to: "6-mavze", occupancy: 92, passengers: 460 },
  { from: "Aeroport", to: "Markaziy bozor", occupancy: 88, passengers: 410 },
  { from: "Madeniyat", to: "Doslıq", occupancy: 78, passengers: 296 },
  { from: "Qarao'zak", to: "Avtovokzal", occupancy: 66, passengers: 214 },
  { from: "Bo'ston", to: "Jipek Joli", occupancy: 54, passengers: 148 },
];

export const companies: Company[] = [
  {
    name: "Nukus Avtotrans",
    share: 46,
    revenue: 284,
    color: "#c9d9e5",
  },
  {
    name: "Qaraqalpaq Avto",
    share: 32,
    revenue: 198,
    color: "#8fa9bc",
  },
  {
    name: "Jayhun Trans",
    share: 22,
    revenue: 136,
    color: "#d1bca1",
  },
];

export const revenueSeries = {
  daily: {
    values: [32.4, 41.8, 38.2, 45.1, 42.7, 52.3, 48.6],
    previous: [28.1, 35.2, 33.8, 39.4, 38.1, 44.6, 42.9],
  },
  weekly: {
    values: [210, 245, 232, 268, 289, 276],
    previous: [190, 218, 224, 240, 252, 260],
  },
  monthly: {
    values: [820, 910, 875, 960, 1020, 980, 1050, 1120, 1090, 1180, 1240, 1310],
    previous: [760, 840, 820, 900, 940, 920, 980, 1010, 1000, 1080, 1130, 1180],
  },
};

export const kpi = {
  revenue: 48.6,
  revenueTrend: 12.4,
  trips: 36,
  tripsTrend: 4,
  passengers: 1284,
  passengersTrend: 6.8,
  buses: 128,
  busesTrend: 2.1,
  busesActive: 96,
};

export const sparklines = {
  revenue: [32, 38, 35, 42, 40, 47, 45, 52, 49],
  trips: [18, 22, 20, 26, 24, 30, 28, 33, 36],
  passengers: [640, 720, 690, 810, 780, 880, 940, 1080, 1284],
  buses: [96, 102, 99, 108, 111, 118, 115, 122, 128],
};
