import { Link, NavLink } from "react-router-dom";
import { useUserStore } from "../stores/UserStore";

export const Nav = () => {
  const { user } = useUserStore();

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <ul className="flex space-x-6">
            <li>
              <NavLink 
                to="/"
                className={({ isActive }) =>
                  `text-gray-600 hover:text-indigo-600 ${isActive ? 'text-indigo-600 font-semibold' : ''}`
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/products"
                className={({ isActive }) =>
                  `text-gray-600 hover:text-indigo-600 ${isActive ? 'text-indigo-600 font-semibold' : ''}`
                }
              >
                Products
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/categories"
                className={({ isActive }) =>
                  `text-gray-600 hover:text-indigo-600 ${isActive ? 'text-indigo-600 font-semibold' : ''}`
                }
              >
                Categories
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/brands"
                className={({ isActive }) =>
                  `text-gray-600 hover:text-indigo-600 ${isActive ? 'text-indigo-600 font-semibold' : ''}`
                }
              >
                Brands
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/cart"
                className={({ isActive }) =>
                  `text-gray-600 hover:text-indigo-600 ${isActive ? 'text-indigo-600 font-semibold' : ''}`
                }
              >
                Cart
              </NavLink>
            </li>
            {user && (
              <>
                <li>
                  <NavLink 
                    to="/wishlist"
                    className={({ isActive }) =>
                      `text-gray-600 hover:text-indigo-600 ${isActive ? 'text-indigo-600 font-semibold' : ''}`
                    }
                  >
                    Wishlist
                  </NavLink>
                </li>
                <li>
                  <NavLink 
                    to="/allorders"
                    className={({ isActive }) =>
                      `text-gray-600 hover:text-indigo-600 ${isActive ? 'text-indigo-600 font-semibold' : ''}`
                    }
                  >
                    Orders
                  </NavLink>
                </li>
                
              </>
            )}
          </ul>
          <div>
            {user ? (
              <div className="text-gray-800 font-medium">{user.name}</div>
            ) : (
              <Link 
                to="/signin"
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};