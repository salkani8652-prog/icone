export type ProductCategory = 'poc' | 'dmr' | 'repeater' | 'accessory';

export type FormFactor = 'handheld' | 'mobile_vehicle' | 'base_repeater' | 'accessory';

export interface CustomSpecItem {
  key: string;
  value: string;
}

export interface TechnicalSpecs {
  // General Specs
  dimensions: string;
  weight: string;
  display: string;
  keypad: string;
  operatingSystem?: string;
  processor?: string;

  // RF & Connectivity
  frequencyBand: string;
  rfPowerOutput?: string;
  channelCapacity: string;
  channelSpacing?: string;
  dmrTier?: string;
  vocoder?: string;
  cellularBands?: string;
  wifi?: string;
  bluetooth?: string;
  satelliteGps: string;

  // Audio Specs
  speakerOutput: string;
  noiseSuppression: string;

  // Battery & Power
  batteryCapacity: string;
  batteryLife: string;
  chargingInterface: string;

  // Ruggedness & Environmental
  ipRating: string;
  militaryStandard: string;
  operatingTemperature: string;
  dropResistance: string;
  atexCertified?: boolean;

  // Security & Protocol
  encryption?: string;
  emergencyFeatures: string[];
  pocPlatform?: string;

  // Flexible Custom Specs
  customSpecs?: CustomSpecItem[];
}

export interface Product {
  id: string;
  name: string;
  modelCode: string;
  category: ProductCategory;
  formFactor: FormFactor;
  tagline: string;
  description: string;
  highlights: string[];
  imageUrl: string;
  price: number | null; // null if price on request
  isPriceOnRequest: boolean;
  inStock: boolean;
  isFeatured: boolean;
  specs: TechnicalSpecs;
  updatedAt: string;
}

export interface RfqRequest {
  productId?: string;
  productName?: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  email: string;
  quantity: number;
  notes: string;
  urgency: 'normal' | 'urgent' | 'tender';
}
