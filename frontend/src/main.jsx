import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './index.css'
import App from './App.jsx'
import Homepage from "./routes/Homepage.jsx";
import Write from "./routes/Write.jsx";
import SearchResultPage from "./routes/SearchResultPage.jsx";
import MainLayout from "./layouts/MainLayout.jsx";
import AuthLayout from "./layouts/AuthLayout.jsx";
import SinglePostPage from "./routes/SinglePostPage.jsx";
import AuthorPage from "./routes/AuthorPage.jsx";
import LoginPage from "./routes/LoginPage.jsx";
import RegisterPage from "./routes/RegisterPage.jsx";
import AdminDashboard from './routes/AdminDashboard.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';

const router = createBrowserRouter([

  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <Homepage /> },
      { path: "/search", element: <SearchResultPage /> },
      { path: "/post/:postId", element: <SinglePostPage /> },
      { path: "/write", element: <Write /> },
      { path: "/author/:username", element: <AuthorPage /> },
      
    ],
  },

  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },

    ],
  },
  {
    element: <AdminLayout />,
    children: [
      { path: "/admin", element: <AdminDashboard /> },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
