import { BrowserRouter, Routes, Route } from 'react-router-dom'

import './styles/hacker.css'
import Footer from './components/Footer'

import Home from './pages/Home'
import Chat from './pages/Chat'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import AdminPackages from './pages/AdminPackages'
import Packages from './pages/Packages'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>

      <Routes>
        {/* ===== PUBLIC ===== */}
        <Route path="/" element={<Home />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/chat" element={<Chat />} />

        {/* ===== ADMIN LOGIN ===== */}
        <Route path="/admin" element={<AdminLogin />} />

        {/* ===== ADMIN PROTECTED ===== */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/packages"
          element={
            <ProtectedRoute>
              <AdminPackages />
            </ProtectedRoute>
          }
        />
      </Routes>

      {/* ===== GLOBAL FOOTER ===== */}
      <Footer />

    </BrowserRouter>
  )
}

export default App