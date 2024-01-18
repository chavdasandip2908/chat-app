import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { USER_SIGN_IN_PATH, USER_SIGN_UP_PATH, DEFAULT_PATH } from './constants/api'
import { Routes, Route, Navigate } from 'react-router-dom';
import Form from "./modules/Form/index";
import Dashboard from "./modules/Dashboard/index";


const ProtectedRoute = ({ children, auth = false }) => {
  const isLoggedIn = localStorage.getItem('user:token') !== null;

  // console.log(auth);
  if (!isLoggedIn && auth) {
    return <Navigate to={USER_SIGN_IN_PATH} />
  } else if (isLoggedIn && [USER_SIGN_IN_PATH, USER_SIGN_UP_PATH].includes(window.location.pathname)) {
    return <Navigate to={DEFAULT_PATH} />
  } 
  return children;
};

function App() {
  return (
    <Routes>
      <Route path={DEFAULT_PATH} element={
        <ProtectedRoute auth={true}>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path={USER_SIGN_IN_PATH} element={
        <ProtectedRoute>
          <Form isSignInPage={true} />
        </ProtectedRoute>
      } />
      < Route path={USER_SIGN_UP_PATH} element={
        <ProtectedRoute>
          < Form isSignInPage={false} />
        </ProtectedRoute>
      } />
    </Routes >
  );
}

export default App;
