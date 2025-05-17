import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import './App.css';
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
import Home from './Components/UNAUTHENTICATION/Home/Home';
import Hr_Login from "./Components/UNAUTHENTICATION/Hr_Login/Hr_Login";
import Login from "./Components/UNAUTHENTICATION/Login/Login";
import Password_Reset from "./Components/UNAUTHENTICATION/Password_Reset/Password_Reset";
import Register from "./Components/UNAUTHENTICATION/Register/Register";
import Reset_Password from "./Components/UNAUTHENTICATION/Reset_Password/Reset_Password";
import OTP from "./Components/UNAUTHENTICATION/OTP/OTP";

const queryClient = new QueryClient();

const App = () => {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Navbar />
          <Toaster />
          <Routes>
            {/* un authentication user */}
            <Route path='/' element={<Home />}></Route>
            <Route path='/register' element={<Register />}></Route>
            <Route path='/login' element={<Login />}></Route>
            <Route path='/hr_login' element={<Hr_Login />}></Route>
            <Route path='/contact' element={<Contact />}></Route>
            <Route path='/password_reset' element={<Password_Reset />}></Route>
            <Route path="/reset_password/:uid64/:token" element={<Reset_Password />} />

            {/* authentication user */}
            <Route path='/auth_home' element={<Auth_Home />}></Route>
            <Route path="/flower_details" element={<Flower_Details />} />
            <Route path="/otp" element={<OTP />} />
            <Route path="/profile/:userName" element={<Profile />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/order_history" element={<Order_History />} />

            {/* admin */}
            <Route path="/add_flower" element={<Add_Flower />} />
            <Route path='/user' element={<User />}></Route>
            <Route path='/order_history_admin' element={<Order_History_Admin />}></Route>
            <Route path='/admin_flower_show' element={<Admin_Flower_Show />}></Route>
          </Routes>
          <Footer />
        </BrowserRouter>
      </QueryClientProvider>
    </HelmetProvider>
  )
}

export default App;