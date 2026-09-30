export type TProperty = {
  _id: string;
  name: string;
  address: string;
  city: string;
  managers: string[];
};

export type TManager = {
  _id: string;
  name: string;
  email: string;
};

export type TCurrentTenant = { _id: string; name: string; phone: string };

export type TUnit = {
  _id: string;
  property: string;
  unitNumber: string;
  floor: number;
  monthlyRent: number;
  status: "vacant" | "occupied";
  currentTenant?: TCurrentTenant;
};

export type TPropertyDetails = {
  _id: string;
  name: string;
  address: string;
  city: string;
  managers: TManager[];
  totalUnits: number;
  occupiedUnits: number;
};

export type TTenant = {
  _id: string;
  name: string;
  phone: string;
  email: string;
  unit: string; 
  property: string; 
  moveInDate: string;
  moveOutDate: string | null;
  monthlyRent: number;
  paidThisMonth: boolean;
};

export type TPayment = {
  _id: string;
  tenant: string;
  unit: string;
  property: string;
  month: string;
  amount: number;
  paidDate: string | null;
  status: "paid" | "unpaid";
};
