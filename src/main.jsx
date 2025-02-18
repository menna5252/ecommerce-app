import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { HomePage } from "./pages/Home";
import { ProductsPage } from "./pages/Products";
import { ProductPage } from "./pages/ProductPage"; // Updated import
import SignIn from "./pages/signin.jsx";
import SignUp from "./pages/SignUp.jsx";
import { CategoriesPage } from "./pages/Categories.jsx";
import { BrandsPage } from "./pages/Brands.jsx";
import { WishlistPage } from "./pages/Wishlist.jsx";
import { CartPage } from "./pages/Cart.jsx";
import Orders from "./pages/Orders.jsx";
import { useParams } from 'react-router-dom';


const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <HomePage />,
      },
      {
        path: "/signin",
        element: <SignIn />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
      {
        path: "products",
        element: <ProductsPage />,
      },
      {
        path: "products/:id",
        element: <ProductPage />,
      },
      {
        path: "categories",
        element: <CategoriesPage />,
      },
      {
        path: "brands",
        element: <BrandsPage />,
      },
      {
        path: "wishlist",
        element: <WishlistPage />,
      },
      {
        path: "cart",
        element: <CartPage />,
      },
      {
        path: "allorders",
        element: <Orders />,
      },
      
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
