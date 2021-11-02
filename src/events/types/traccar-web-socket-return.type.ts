export type TraccarWebSocketReturn = {
  devices: Device[];
  positions: Position[];
};
export type Device = {
  id: number;
  attributes: object;
  groupId: number;
  name: string;
  uniqueId: string;
  status: string;
  lastUpdate: Date;
  positionId: number;
  geofenceIds: number[];
  phone: string;
  model: string;
  contact: string;
  category: null;
  disabled: false;
};

export type Position = {
  accuracy: number;
  address?: string;
  altitude?: number;
  attributes?: Attributes;
  course: number;
  deviceId: number;
  deviceTime: Date;
  fixTime: Date;
  id: number;
  latitude: number;
  longitude: number;
  network?: Network;
  outdated: boolean;
  protocol: string;
  serverTime: Date;
  speed: number;
  type?: string;
  valid: boolean;
};
export type Network = {
  cellTowers: CellTowers[];
  considerIp: boolean;
  radioType: string;
};
export type CellTowers = {
  cellId: number;
  locationAreaCode: number;
  mobileCountryCode: number;
  mobileNetworkCode: number;
};

export type Attributes = {
  distance: number;
  hours: number;
  motion: boolean;
  result: string;
  totalDistance: number;
};
