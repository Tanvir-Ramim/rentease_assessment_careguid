import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import config from "../config";
import { User } from "../modules/auth/auth.model";
import { Property } from "../modules/property/property.model";
import { Unit } from "../modules/unit/unit.model";
import { Tenant } from "../modules/tenant/tenant.model";
import { Payment } from "../modules/payment/payment.model";

const propertyNames = [
  "Green View Apartments",
  "Lake Side Tower",
  "Sunrise Residency",
  "Blue Sky Heights",
  "Palm Garden",
  "River Park Villa",
  "Royal Court",
  "City Center Homes",
  "Rose Valley",
  "Golden Nest",
  "Hill Top Residence",
  "Maple Court",
  "Ocean Breeze",
  "Silver Oak",
  "Harmony Heights",
  "Star Point",
  "Orchid Tower",
  "Moonlight Villa",
  "Cedar Place",
  "Pearl Residency",
];
const cities = ["Dhaka", "Chattogram", "Sylhet", "Rajshahi", "Khulna"];

const seed = async () => {
  await mongoose.connect(config.database_url as string);
  console.log("MongoDB connected");

  await User.deleteMany({
    email: {
      $in: ["admin@rentease.com", "tanvir@rentease.com", "ramim@rentease.com"],
    },
  });
  await Promise.all([
    Property.deleteMany({}),
    Unit.deleteMany({}),
    Tenant.deleteMany({}),
    Payment.deleteMany({}),
  ]);

  const password = await bcrypt.hash(
    "123456",
    Number(config.bcrypt_salt_rounds),
  );

  const users = await User.insertMany([
    {
      name: "Admin User",
      email: "admin@rentease.com",
      password,
      role: "admin",
    },
    { name: "Tanvir", email: "tanvir@rentease.com", password, role: "manager" },
    { name: "Ramim", email: "ramim@rentease.com", password, role: "manager" },
  ]);
  const tanvir = users[1]!;
  const ramim = users[2]!;

  const properties = await Property.insertMany(
    propertyNames.map((name, i) => ({
      name,
      address: `${10 + i} Main Road`,
      city: cities[i % cities.length]!,
      managers: [i < 10 ? tanvir._id : ramim._id],
    })),
  );

  const unitDocs = [];
  let u = 0;
  for (let p = 0; p < properties.length; p++) {
    const property = properties[p]!;
    const letter = String.fromCharCode(65 + p);
    for (let j = 0; j < 20; j++) {
      const floor = Math.floor(j / 4) + 1;
      const n = (j % 4) + 1;
      unitDocs.push({
        property: property._id,
        unitNumber: `${letter}-${floor}0${n}`,
        floor,
        monthlyRent: 10000 + floor * 1000 + n * 500,
        status: u % 8 === 7 ? ("vacant" as const) : ("occupied" as const),
      });
      u++;
    }
  }
  const units = await Unit.insertMany(unitDocs);

  const now = new Date();
  const occupiedUnits = units.filter((unit) => unit.status === "occupied");

  const tenants = await Tenant.insertMany(
    occupiedUnits.map((unit, t) => ({
      name: `Tenant ${t + 1}`,
      phone: `017${String(10000000 + t)}`,
      email: `tenant${t + 1}@example.com`,
      unit: unit._id,
      property: unit.property,
      moveInDate: new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 10, 1 + (t % 25)),
      ),
      moveOutDate: null,
    })),
  );

  const months = Array.from({ length: 9 }, (_, i) =>
    new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (8 - i), 1))
      .toISOString()
      .slice(0, 7),
  );

  const paymentDocs = [];
  for (let t = 0; t < tenants.length; t++) {
    const tenant = tenants[t]!;
    const unit = occupiedUnits[t]!;

    for (let m = 0; m < months.length; m++) {
      const month = months[m]!;
      const isCurrentMonth = m === months.length - 1;
      if (isCurrentMonth && t % 7 >= 4) continue;

      paymentDocs.push({
        tenant: tenant._id,
        unit: tenant.unit,
        property: tenant.property,
        month,
        amount: unit.monthlyRent,
        paidDate: new Date(`${month}-05`),
        status: "paid" as const,
      });
    }
  }
  await Payment.insertMany(paymentDocs);

  console.log(
    `Seeded 1 admin, 2 managers, ${properties.length} properties, ${units.length} units, ${tenants.length} tenants, ${paymentDocs.length} payments`,
  );
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
