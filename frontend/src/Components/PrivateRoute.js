import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../App";
import { BrowserRouter as Route } from "react-router-dom";


const PrivateRoute = ({ path, element }) => {
  const location = useLocation();
  const { user } = useContext(AuthContext);

  return user ? <Route path={path} element={element} /> : <Navigate to="/login" state={{ from: location }} />;
};

export default PrivateRoute;
