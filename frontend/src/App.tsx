import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Driver from "./routes/driver";
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
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
