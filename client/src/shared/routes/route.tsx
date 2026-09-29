import { createBrowserRouter } from "react-router-dom";
import Layout from "../layout/Layout";
import Dashboard from "../../pages/dashboard/container/Dashboard";
import Login from "../../pages/login/container/login";
import Register from "../../pages/register/container/Register";
import AuthChecker from "../middleware/AuthChecker";

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
