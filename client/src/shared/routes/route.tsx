import { createBrowserRouter } from "react-router-dom";
import Layout from "../layout/Layout";
import Dashboard from "../../pages/dashboard/container/Dashboard";
import Login from "../../pages/login/container/login";
import Register from "../../pages/register/container/Register";
import AuthChecker from "../middleware/AuthChecker";
import Property from "../../pages/property/container/Property";
import PropertyDetails from "../../pages/singleProperty/container/PropertyDetails";
import Tenant from "../../pages/tenantService/container/Tenant";
import Payment from "../../pages/payment/container/Payment";
import GuestChecker from "../middleware/GuestChecker";

const Router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthChecker>
        <Layout />
      </AuthChecker>
    ),
    children: [
      {
        index: true,
        element: <Dashboard></Dashboard>,
      },
      {
        path: "/properties",
        element: <Property></Property>,
      },
      { path: "properties/:id", element: <PropertyDetails /> },
      { path: "tenants", element: <Tenant /> },
      { path: "payments", element: <Payment /> },
    ],
  },
  {
    path: "/login",
    element: (
      <GuestChecker>
        <Login />
      </GuestChecker>
    ),
  },
  {
    path: "/registration",
    element: (
      <GuestChecker>
        <Register />
      </GuestChecker>
    ),
  },
]);

export default Router;
