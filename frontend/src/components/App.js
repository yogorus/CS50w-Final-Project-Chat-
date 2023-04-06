import logo from '../logo.svg';
import '../App.css';
import getCookie from '../utils/getCookie';
import Layout from './Layout';
import LoginForm from './LoginForm';
import Home from './Home';
import Room from './Room';
import CreateRoom from './CreateRoom';
import PrivateRoute from './PrivateRoute'
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
import SignUpForm from './SignUpForm';


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
        <Route path="/" element={<PrivateRoute /> }>
          <Route index element={<Home />} />
          <Route path="room/:roomSlug" element={<Room />}/>
          <Route path="room/create" element={<CreateRoom />}/>
        </Route>
          <Route path='login' element={<LoginForm />} />
          <Route path='register' element={<SignUpForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
