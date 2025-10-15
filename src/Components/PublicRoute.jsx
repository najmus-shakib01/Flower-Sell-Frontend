/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
    const token = localStorage.getItem("auth_token");

    if (token) {
        return <Navigate to="/auth_home" replace />;
    }

    return children;
};

export default PublicRoute;