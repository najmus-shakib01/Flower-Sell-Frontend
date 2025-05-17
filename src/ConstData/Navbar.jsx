import { ChevronDown, Menu, ShoppingCart, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { baseUrl } from "../constants/env.constants";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("auth_token")
  );
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminDropdown, setShowAdminDropdown] = useState(false);
  const navigate = useNavigate();
  const logoutModalRef = useRef(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = localStorage.getItem("auth_token");
      if (token) {
        setIsLoggedIn(true);

        try {
          const response = await fetch(`${baseUrl}/admins/`, {
            method: "GET",
            headers: {
              Authorization: `token ${token}`,
              "Content-Type": "application/json",
            },
          });
          const data = await response.json();
          if (response.ok && data.is_admin) {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        } catch (error) {
          console.error("Admin check failed:", error);
        }
      } else {
        setIsLoggedIn(false);
        setIsAdmin(false);
      }
    };

    checkLoginStatus();

    window.addEventListener("storage", checkLoginStatus);
    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, []);

  const token = localStorage.getItem("auth_token");
  const userName = localStorage.getItem("UserName");

  const handleLogout = async () => {
    try {
      const response = await fetch(`${baseUrl}/user/logout/`, {
        method: "GET",
        headers: {
          Authorization: `token ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("userId");
        localStorage.removeItem("UserName");
        setIsLoggedIn(false);
        setIsAdmin(false);
        toast.success("Logged out successfully!");
        navigate("/");
      } else {
        toast.error("Logout failed!");
      }
    } catch (error) {
      toast.error(error.message || "Logout Error");
    }
  };

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-screen-xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link to={"/"}>
          <h1 className="text-4xl text-teal-500">Flower Seal</h1>
        </Link>

        <button className="lg:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        <ul
          className={`lg:flex lg:space-x-6 ${
            isOpen
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

          {isLoggedIn ? (
            <>
              <li className="w-full">
                <Link
                  to={"/auth_home"}
                  className="hover:text-primary whitespace-nowrap block py-2"
                  onClick={() => setIsOpen(false)}
                >
                  <b>Auth Home</b>
                </Link>
              </li>
              <li className="w-full">
                <Link
                  to={`/profile/${userName}`}
                  className="hover:text-primary block py-2"
                  onClick={() => setIsOpen(false)}
                >
                  <b>Profile</b>
                </Link>
              </li>
              <li className="w-full whitespace-nowrap">
                <Link
                  to={"/order_history"}
                  className="hover:text-primary block py-2"
                  onClick={() => setIsOpen(false)}
                >
                  <b>Order History</b>
                </Link>
              </li>
              <li className="w-full">
                <Link
                  to={"/cart"}
                  className="hover:text-primary block py-2 items-center"
                  onClick={() => setIsOpen(false)}
                >
                  <ShoppingCart className="mr-2" />
                </Link>
              </li>

              {isAdmin && (
                <li className="relative w-full">
                  <button
                    onClick={() => setShowAdminDropdown(!showAdminDropdown)}
                    className="items-center flex gap-2 py-2"
                  >
                    <b>Admin</b>
                    <ChevronDown
                      size={20}
                      className={`transition-transform ${
                        showAdminDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {showAdminDropdown && (
                    <ul className="lg:absolute lg:left-0 lg:mt-2 shadow-2xl bg-white rounded-md w-full lg:w-56 z-50">
                      <li>
                        <Link
                          to={"/add_flower"}
                          className="block py-2 px-4 hover:bg-gray-200 rounded"
                          onClick={() => {
                            setIsOpen(false);
                            setShowAdminDropdown(false);
                          }}
                        >
                          Add Flower
                        </Link>
                      </li>
                      <li>
                        <Link
                          to={"/order_history_admin"}
                          className="block py-2 px-4 hover:bg-gray-200 rounded"
                          onClick={() => {
                            setIsOpen(false);
                            setShowAdminDropdown(false);
                          }}
                        >
                          Order History
                        </Link>
                      </li>
                      <li>
                        <Link
                          to={"/admin_flower_show"}
                          className="block py-2 px-4 whitespace-nowrap hover:bg-gray-200 rounded"
                          onClick={() => {
                            setIsOpen(false);
                            setShowAdminDropdown(false);
                          }}
                        >
                          Flower Show And Edit
                        </Link>
                      </li>
                      <li>
                        <Link
                          to={"/user"}
                          className="block py-2 px-4 hover:bg-gray-200 rounded"
                          onClick={() => {
                            setIsOpen(false);
                            setShowAdminDropdown(false);
                          }}
                        >
                          Users Show
                        </Link>
                      </li>
                      <li>
                        <Link
                          to={"/visitor-counter"}
                          className="block py-2 px-4 hover:bg-gray-200 rounded"
                          onClick={() => {
                            setIsOpen(false);
                            setShowAdminDropdown(false);
                          }}
                        >
                          Visitor Counter
                        </Link>
                      </li>
                    </ul>
                  )}
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
          ) : (
            <>
              <li className="w-full">
                <Link
                  to={"/"}
                  className="hover:text-primary block py-2"
                  onClick={() => setIsOpen(false)}
                >
                  <b>Home</b>
                </Link>
              </li>
              <li className="w-full">
                <Link
                  to={"/register"}
                  className="hover:text-primary block py-2"
                  onClick={() => setIsOpen(false)}
                >
                  <b>Register</b>
                </Link>
              </li>
              <li className="w-full">
                <Link
                  to={"/contact"}
                  className="hover:text-primary block py-2"
                  onClick={() => setIsOpen(false)}
                >
                  <b>Contact</b>
                </Link>
              </li>
              <li className="w-full">
                <Link
                  to={"/login"}
                  className="hover:text-primary block py-2"
                  onClick={() => setIsOpen(false)}
                >
                  <b>Login</b>
                </Link>
              </li>
            </>
          )}
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
