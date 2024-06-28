import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Driver from "./routes/driver";
import DriverDetails from "./routes/driver-details";
import HomePage from "./routes/home";
import RootLayout from "./routes/layout";
import Team from "./routes/team";
import TeamDetails from "./routes/team-details";
import ErrorPage from "./error-page";
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <ErrorPage />,
  },
  {
    element: <RootLayout />,
    children: [
      {
        path: "/drivers",
        element: <Driver />,
      },
      {
        path: "/drivers/:id",
        element: <DriverDetails />,
      },
      {
        path: "/teams",
        element: <Team />,
      },
      {
        path: "/teams/:id",
        element: <TeamDetails />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
