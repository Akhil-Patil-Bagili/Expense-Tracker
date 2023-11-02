import { useContext } from "react";
import { Navigate, useLocation, Route } from "react-router-dom";
import { AuthContext } from "../App";

/**
 * PrivateRoute - A wrapper for the Route component that redirects to the login
 * page if a user is not authenticated.
 *
 * @param {object} props - The props object.
 * @param {string} props.path - The path of the route.
 * @param {ReactNode} props.element - The React element to render when the route matches.
 * @returns {ReactNode} - The Route component or a redirection to the login page.
 */
const PrivateRoute = ({ path, element }) => {
  const location = useLocation();
  const { user } = useContext(AuthContext);

  return user ? <Route path={path} element={element} /> : <Navigate to="/login" state={{ from: location }} />;
};

export default PrivateRoute;
