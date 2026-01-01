import { NavLink, useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

export default function AdminSidebar() {
  const navigate = useNavigate()

  const logout = async () => {
    await supabase.auth.signOut()
    navigate('/admin')
  }

  return (
    <div className="sidebar">
      <h2>CYBER ADMIN</h2>

      <NavLink
        to="/admin/dashboard"
        className={({ isActive }) => (isActive ? 'active' : '')}
      >
        DASHBOARD
      </NavLink>

      <NavLink
        to="/admin/packages"
        className={({ isActive }) => (isActive ? 'active' : '')}
      >
        PACKAGES
      </NavLink>

      <button
        onClick={logout}
        style={{ marginTop: '20px', width: '100%' }}
      >
        LOGOUT
      </button>
    </div>
  )
}