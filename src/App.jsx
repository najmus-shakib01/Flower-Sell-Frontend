/* eslint-disable react/prop-types */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";

import Add_Flower from "./Components/ADMIN/Admin/Add_Flower";
import Admin_Flower_Show from "./Components/ADMIN/Admin/Admin_Flower_Show";
import Order_History_Admin from "./Components/ADMIN/Admin/Order_History_Admin";
import User from "./Components/ADMIN/Admin/User";

import Auth_Home from "./Components/AUTHENTICATION/Auth_Home/Auth_Home";
import Cart from "./Components/AUTHENTICATION/Cart/Cart";
import Flower_Details from "./Components/AUTHENTICATION/Flower_Details/Flower_Details";
import Order_History from "./Components/AUTHENTICATION/Order_History/Order_History";
import Profile from "./Components/AUTHENTICATION/Profile/Profile";

import Footer from "./ConstData/Footer";
import Navbar from "./ConstData/Navbar";

import Contact from "./Components/UNAUTHENTICATION/Contact/Contact";
import Home from "./Components/UNAUTHENTICATION/Home/Home";
import Hr_Login from "./Components/UNAUTHENTICATION/Hr_Login/Hr_Login";
import Login from "./Components/UNAUTHENTICATION/Login/Login";
import OTP from "./Components/UNAUTHENTICATION/OTP/OTP";
import Password_Reset from "./Components/UNAUTHENTICATION/Password_Reset/Password_Reset";
import Register from "./Components/UNAUTHENTICATION/Register/Register";
import Reset_Password from "./Components/UNAUTHENTICATION/Reset_Password/Reset_Password";

import ProtectedRoute from "./Components/ProtectedRoute";
import PublicRoute from "./Components/PublicRoute";

const OTPRoute = ({ children }) => {
  const pendingEmail = localStorage.getItem('pendingVerificationEmail');

  return pendingEmail ? children : <Navigate to="/register" replace />;
};

const queryClient = new QueryClient();

const App = () => {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Navbar />
          <Toaster />
          <Routes>

            <Route path="/" element={<Home />} />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />
            <Route
              path="/hr_login"
              element={
                <PublicRoute>
                  <Hr_Login />
                </PublicRoute>
              }
            />
            <Route path="/contact" element={<Contact />} />
            <Route
              path="/password_reset"
              element={
                <PublicRoute>
                  <Password_Reset />
                </PublicRoute>
              }
            />
            <Route
              path="/reset_password/:uid64/:token"
              element={<Reset_Password />}
            />

            <Route
              path="/otp"
              element={
                <OTPRoute>
                  <OTP />
                </OTPRoute>
              }
            />

            <Route
              path="/auth_home"
              element={
                <ProtectedRoute>
                  <Auth_Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/flower_details"
              element={
                <ProtectedRoute>
                  <Flower_Details />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/:userName"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order_history"
              element={
                <ProtectedRoute>
                  <Order_History />
                </ProtectedRoute>
              }
            />

            <Route
              path="/add_flower"
              element={
                <ProtectedRoute>
                  <Add_Flower />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user"
              element={
                <ProtectedRoute>
                  <User />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order_history_admin"
              element={
                <ProtectedRoute>
                  <Order_History_Admin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin_flower_show"
              element={
                <ProtectedRoute>
                  <Admin_Flower_Show />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;