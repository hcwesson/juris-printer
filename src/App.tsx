import { GradeTable } from "./components";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

export const App = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <h3>Gradebook</h3>,
    },
    {
      path: ':questionNo',
      children: [
        {
          path: ':studentId',
          element: <GradeTable />,
        },
      ]
    },
  ])
  return (
    <RouterProvider router={router} />
  );
};
