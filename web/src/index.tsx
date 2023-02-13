import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import ProductManagement from './pages/Product Management';
import App from './App';
import ProductConfirmation from './pages/ProductConfirmation';
import SalerConfirmation from './pages/SalerConfirmation';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home></Home>
  },
  {
    path: "/login",
    element: <Login></Login>
  },
  {
    path: "/product-management",
    element: <ProductManagement></ProductManagement>
  },
  {
    path: "/product-confirmation",
    element: <ProductConfirmation></ProductConfirmation>
  },
  {
    path: "/saler-confirmation",
    element: <SalerConfirmation></SalerConfirmation>
  }
])

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App>
      <RouterProvider router={router} />
    </App>
  </React.StrictMode>
);
