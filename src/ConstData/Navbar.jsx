import { ChevronDown, Menu, ShoppingCart, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { baseUrl } from "../constants/env.constants";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [authState, setAuthState] = useState({
    isLoggedIn: false,
    isAdmin: false,
    isLoading: true,
  });
  const [showAdminDropdown, setShowAdminDropdown] = useState(false);
  const navigate = useNavigate();
  const logoutModalRef = useRef(null);
  const token = localStorage.getItem("auth_token");
  const userName = localStorage.getItem("UserName");

  const { data: cartItems = [] } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      if (!token) return [];
      const response = await fetch(`${baseUrl}/flower/cart/`, {
        headers: {
          Authorization: `token ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) return [];
      const data = await response.json();
      return data?.data || data || [];
    },
    enabled: !!token,
  });

  useEffect(() => {
    const checkLoginStatus = async () => {
      if (token) {
        try {
          const response = await fetch(`${baseUrl}/admins/`, {
            headers: {
              Authorization: `token ${token}`,
              "Content-Type": "application/json",
            },
          });
          const data = await response.json();
          setAuthState({
            isLoggedIn: true,
            isAdmin: response.ok && data.is_admin,
            isLoading: false,
          });
        } catch (error) {
          console.error("Admin check failed:", error);
          setAuthState({
            isLoggedIn: !!token,
            isAdmin: false,
            isLoading: false,
          });
        }
      } else {
        setAuthState({
          isLoggedIn: false,
          isAdmin: false,
          isLoading: false,
        });
      }
    };

    checkLoginStatus();
    window.addEventListener("storage", checkLoginStatus);
    return () => window.removeEventListener("storage", checkLoginStatus);
  }, [token]);

  const handleLogout = async () => {
    try {
      const response = await fetch(`${baseUrl}/user/logout/`, {
        headers: {
          Authorization: `token ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("userId");
        localStorage.removeItem("UserName");
        setAuthState({
          isLoggedIn: false,
          isAdmin: false,
          isLoading: false,
        });
        toast.success("Logged out successfully!");
        navigate("/");
      } else {
        toast.error("Logout failed!");
      }
    } catch (error) {
      toast.error(error.message || "Logout Error");
    }
  };

  const AdminDropdown = () => (
    <ul className="lg:absolute lg:left-0 lg:mt-2 shadow-2xl bg-white rounded-md w-full lg:w-56 z-50">
      {[
        { path: "/add_flower", text: "Add Flower" },
        { path: "/order_history_admin", text: "Order History" },
        { path: "/admin_flower_show", text: "Flower Show And Edit" },
        { path: "/user", text: "Users Show" },
      ].map((item) => (
        <li key={item.path}>
          <Link
            to={item.path}
            className="block py-2 px-4 hover:bg-gray-200 rounded"
            onClick={() => {
              setIsOpen(false);
              setShowAdminDropdown(false);
            }}
          >
            {item.text}
          </Link>
        </li>
      ))}
    </ul>
  );

  // eslint-disable-next-line react/prop-types
  const NavItem = ({ to, text, onClick }) => (
    <li className="w-full">
      <Link
        to={to}
        className="hover:text-primary whitespace-nowrap block py-2"
        onClick={onClick}
      >
        <b>{text}</b>
      </Link>
    </li>
  );

  const AuthLinks = () => (
    <>
      <NavItem to="/auth_home" text="Auth Home" onClick={() => setIsOpen(false)} />
      <NavItem to={`/profile/${userName}`} text="Profile" onClick={() => setIsOpen(false)} />
      <NavItem to="/order_history" text="Order History" onClick={() => setIsOpen(false)} />

      <li className="w-full">
        <Link
          to="/cart"
          className="hover:text-primary block py-2 items-center relative w-max"
          onClick={() => setIsOpen(false)}
        >
          <ShoppingCart className="inline mr-2" />
          {cartItems.length > 0 && (
            <span className="absolute -top-1 -right-2 bg-red-500 text-white rounded-full text-[10px] w-5 h-5 flex items-center justify-center font-extrabold shadow-sm border border-white">
              {cartItems.length}
            </span>
          )}
        </Link>
      </li>

      {authState.isAdmin && (
        <li className="relative w-full">
          <button
            onClick={() => setShowAdminDropdown(!showAdminDropdown)}
            className="items-center flex gap-2 py-2"
          >
            <b>Admin</b>
            <ChevronDown
              size={20}
              className={`transition-transform ${showAdminDropdown ? "rotate-180" : ""}`}
            />
          </button>
          {showAdminDropdown && <AdminDropdown />}
        </li>
      )}

      <li className="w-full">
        <button
          onClick={() => {
            setIsOpen(false);
            logoutModalRef.current.showModal();
          }}
          className="hover:text-primary cursor-pointer block py-2 text-left w-full"
        >
          <b>Logout</b>
        </button>
      </li>
    </>
  );

  const GuestLinks = () => (
    <>
      <NavItem to="/" text="Home" onClick={() => setIsOpen(false)} />
      <NavItem to="/register" text="Register" onClick={() => setIsOpen(false)} />
      <NavItem to="/contact" text="Contact" onClick={() => setIsOpen(false)} />
      <NavItem to="/login" text="Login" onClick={() => setIsOpen(false)} />
    </>
  );

  if (authState.isLoading) {
    return (
      <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
        <div className="max-w-screen-xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link to="/">
            <h1 className="text-4xl text-teal-500">Flower Seal</h1>
          </Link>
          <div>Loading...</div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-screen-xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link to="/">
          <h1 className="text-4xl text-teal-500">Flower Seal</h1>
        </Link>

        <button className="lg:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        <ul
          className={`lg:flex lg:space-x-6 ${isOpen
            ? "fixed top-0 right-0 h-full w-64 bg-white shadow-2xl flex flex-col items-start text-left space-y-4 py-4 px-6 transition-transform duration-300 ease-in-out"
            : "hidden lg:flex"
            }`}
        >
          {isOpen && (
            <button
              className="absolute top-4 right-4 lg:hidden"
              onClick={() => setIsOpen(false)}
            >
              <X size={24} />
            </button>
          )}

          {authState.isLoggedIn ? <AuthLinks /> : <GuestLinks />}
        </ul>
      </div>

      <dialog ref={logoutModalRef} className="modal">
        <div className="modal-box text-black bg-white">
          <h2 className="font-bold text-lg">Confirm Logout</h2>
          <p className="py-4">Are you sure you want to log out?</p>
          <div className="modal-action">
            <form method="dialog" className="flex gap-4">
              <button onClick={handleLogout} className="btn btn-error">
                Logout
              </button>
              <button
                className="btn"
                onClick={() => logoutModalRef.current.close()}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </nav>
  );
};

export default Navbar;