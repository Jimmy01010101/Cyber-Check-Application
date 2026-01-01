import UserNavbar from '../components/UserNavbar'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  return (
    <>
      <UserNavbar />

      <div className="hero">
        <h1>Secure Your System</h1>
        <p>
          Kami menguji, kamu tenang.<br />
          Cyber Security Testing untuk Website & Aplikasi.
        </p>

        <div className="hero-action">
          <button onClick={() => navigate('/packages')}>
            🔍 Lihat Paket
          </button>
          <button onClick={() => navigate('/chat')}>
            💬 Konsultasi
          </button>
        </div>
      </div>
    </>
  )
}