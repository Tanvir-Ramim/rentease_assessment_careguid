import { createBrowserRouter } from "react-router-dom";
import Layout from "../layout/Layout";
import Dashboard from "../../pages/dashboard/container/Dashboard";
import Login from "../../pages/login/container/login";
import Register from "../../pages/register/container/Register";
import AuthChecker from "../middleware/AuthChecker";
import Property from "../../pages/property/container/Property";
import PropertyDetails from "../../pages/singleProperty/container/PropertyDetails";

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
    ],
  },
  {
    path: "/login",
    element: <Login></Login>,
  },
  {
    path: "/registration",
    element: <Register></Register>,
  },
]);

export default Router;
