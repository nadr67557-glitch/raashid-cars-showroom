export interface CarSpec {
  label: string;
  value: string;
  category?: 'engine' | 'transmission' | 'drivetrain' | 'safety' | 'interior' | 'exterior';
}

export interface FinancingInfo {
  monthlyPayment?: number;
  downPayment?: number;
  finalPayment?: number;
  bank?: string;
  duration?: number;
  contactInfo?: string;
  available?: boolean;
  type?: string;
  banks?: string[];
}

export interface Car {
  id: string;
  name: string;
  nameAr: string;
  brand: string;
  year: number;
  price: number;
  heroImage: string;
  gallery: {
    exterior?: string[];
    interior?: string[];
    details?: string[];
  };
  specs: CarSpec[];
  financing?: FinancingInfo;
  harajUrl: string;
  status: 'available' | 'sold' | 'reserved' | 'جديدة' | 'بطاقة جمركية';
  color?: string;
  interiorColor?: string;
  fuelType?: string;
  transmission?: string;
  drivetrain?: string;
  mileage?: number;
  engine?: string;
  cylinders?: string;
  engineType?: string;
  horsepower?: string;
  torque?: string;
  fuelTankCapacity?: string;
  fuelEfficiency?: string;
  agent?: string;
  warranty?: string;
  model?: string;
  category?: string;
  description?: string;
  features?: Record<string, any>;
  contactNumbers?: {
    cash?: string[];
    financing?: string[];
  };
  freeServices?: string[];
  shipping?: {
    available: boolean;
    companies?: string[];
    discount?: boolean;
  };
}

export interface ShowroomState {
  currentIndex: number;
  filteredCars: Car[];
  isInventoryOpen: boolean;
}
