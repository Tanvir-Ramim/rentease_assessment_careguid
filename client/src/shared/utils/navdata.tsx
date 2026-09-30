import { FaBuilding, FaHome, FaUsers, FaMoneyBillWave } from "react-icons/fa";

export const navdata = [
  {
    title: "Dashboard",
    link: "/",
    icon: <FaHome />,
  },
  {
    title: "Properties",
    link: "/properties",
    icon: <FaBuilding />,
  },
  {
    title: "Tenants",
    link: "/tenants",
    icon: <FaUsers />,
  },
  {
    title: "Payments",
    link: "/payments",
    icon: <FaMoneyBillWave />,
  },
];
