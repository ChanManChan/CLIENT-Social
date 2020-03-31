import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import MainRouter from './MainRouter';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure();
const App = () => (
  <BrowserRouter>
    <MainRouter />
    <ToastContainer />
  </BrowserRouter>
);

export default App;
