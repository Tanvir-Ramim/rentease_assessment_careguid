
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

export type TUnit = {
  _id: string;
  property: string;
  unitNumber: string;
  floor: number;
  monthlyRent: number;
  status: "vacant" | "occupied";
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