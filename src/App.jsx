import { Routes, Route, Outlet } from "react-router";
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

import Head from "./components/Head";
import Board from "./pages/Board";
import LoginPage from "./pages/Login";
import Register from "./pages/Register";
import RegisterSuccess from "./pages/RegisterSuccess";

import './App.css'


const queryClient = new QueryClient();

function App() {

  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/" element={<Layout />} >
            <Route index element={<Board />} />
            <Route path="board" element={<Board />} />
          </Route>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<Register />} />
          <Route path="register_success" element={<RegisterSuccess />} />

        </Routes>
      </QueryClientProvider >
    </div>
  )
}

function Layout() {
  return (
    <div>
      <Head />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default App
