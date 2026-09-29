import { createBrowserRouter } from "react-router-dom";
import Layout from "../layout/Layout";
import Dashboard from "../../pages/dashboard/container/Dashboard";

const Router = createBrowserRouter([
  {
    path: "/dashbaord",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Dashboard></Dashboard>,
      },
    ],
  },
]);

export default Router;
