import { useNavigate } from 'react-router-dom'

export default function UserNavbar() {
  const navigate = useNavigate()

  return (
    <div className="user-navbar">
      <div className="logo">🛡 Cyber-Check</div>

      <div className="nav-menu">
        <button onClick={() => navigate('/')}>Home</button>
        <button onClick={() => navigate('/packages')}>Paket</button>
        <button onClick={() => navigate('/chat')}>Chat</button>
      </div>
    </div>
  )
}