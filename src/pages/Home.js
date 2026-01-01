import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="page">
      <h1>Cyber-Check Service</h1>
      <p>Security Testing & Vulnerability Assessment</p>

      <button onClick={() => navigate('/packages')}>
        Lihat Paket Keamanan
      </button>

      <button onClick={() => navigate('/chat')}>
        Chat Admin
      </button>
    </div>
  )
}