import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home></Home>
  }, {
    path: "/login",
    element: <Login></Login>
  }
])

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
