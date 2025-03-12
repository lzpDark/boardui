import { Fragment } from "react";
import { Routes, Route, Outlet } from "react-router";
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

import Board from "./pages/Board";
import LoginPage from "./pages/Login";
import Register from "./pages/Register";
import RegisterSuccess from "./pages/RegisterSuccess";
import Sample from "./pages/Sample";

import Head from "./components/Head";
import Footer from "./components/Footer";

import './App.css'


const queryClient = new QueryClient();

function App() {
  return (
    <Fragment> 
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/" element={<Layout />} >
            <Route index element={<Board />} />
            <Route path="board" element={<Board />} />
          </Route>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<Register />} />
          <Route path="register_success" element={<RegisterSuccess />} />
          <Route path="hello-world" element={<Sample />} />
        </Routes>
      </QueryClientProvider >
      <Toaster position="bottom-right"/>
    </Fragment>
  )
}

function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Head />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App
