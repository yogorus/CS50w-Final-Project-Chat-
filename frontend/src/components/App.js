import '../App.css';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import Home from './Home';
import Room from './Room';
import CreateRoom from './CreateRoom';
import PrivateRoute from './PrivateRoute'
import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";



function App() {

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
          <Route path='*' element={<Navigate replace to="/" />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
