import logo from '../logo.svg';
import '../App.css';
import getCookie from '../utils/getCookie';
import LoginForm from './LoginForm';
import Home from './Home';
import React from 'react';
import {
  Browser,
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Switch
} from "react-router-dom";
import { useEffect, useState } from 'react';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem('token') !== null
  );

  useEffect(() => {
    
  })
  
  // useEffect(() => {
  //   async function checkLogin() {
  //     const url = `http://localhost:8000/login_check`;
  //     let response = await fetch(url, {
  //       credentials: 'include'
  //     });
  //     response = await response.json();
  //     console.log(response)
  //   }
  //   checkLogin()
  //   .catch(console.error);
  // }, [])  
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" />
          <Route index element={isLoggedIn ? <Home /> : <Navigate to='login'/>} />
          <Route path='login' element={<LoginForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
