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
Kami hadir sebagai penyedia layanan keamanan siber (Cyber Security Services) yang berfokus pada pencegahan, pendeteksian, dan penanganan ancaman digital secara profesional, terstruktur, dan etis.
Setiap layanan dirancang berdasarkan pendekatan risk-based security dengan tujuan memastikan kerahasiaan (confidentiality), integritas (integrity), dan ketersediaan (availability) sistem Anda.
        </p>

        <div className="hero-action">
          <button onClick={() => navigate('/packages')}>
            Lihat Paket
          </button>
          <button onClick={() => navigate('/chat')}>
            Konsultasi
          </button>
        </div>
      </div>
    </>
  )
}