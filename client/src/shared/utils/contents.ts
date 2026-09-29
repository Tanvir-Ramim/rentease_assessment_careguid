export const navdata = [
  {
    title: "Dashboard",
    link: "/",
  },
  {
    title: "Properites",
    link: "/properties",
  },
  {
    title: "Tenants",
    link: "/tenants",
  },
  {
    title: "Payments",
    link: "/payments",
  },
];

export const cities = ["Dhaka", "Chattogram", "Sylhet", "Rajshahi", "Khulna"];
export type TPageDetails = {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
};