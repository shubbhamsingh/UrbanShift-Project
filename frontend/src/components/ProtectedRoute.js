import React from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

/**
 * ProtectedRoute - Protects routes that require authentication
 * @param {ReactNode} children - Component to render if authenticated
 * @param {Array} allowedRoles - Optional array of allowed user types ['BUYER', 'SELLER', 'COMPANY']
 */
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');

    // Not logged in
    if (!token) {
        toast.warning('Please login to access this page 🔐');
        return <Navigate to="/login" replace />;
    }

    // Check role-based access (if roles are specified)
    if (allowedRoles.length > 0 && !allowedRoles.includes(userType)) {
        toast.error('You do not have permission to access this page ❌');
        return <Navigate to="/" replace />;
    }

    // Authenticated and authorized
    return children;
};

export default ProtectedRoute;
