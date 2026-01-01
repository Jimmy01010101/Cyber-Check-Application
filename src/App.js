import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import Chat from './pages/Chat'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import AdminPackages from './pages/AdminPackages'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/packages" element={<AdminPackages />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App