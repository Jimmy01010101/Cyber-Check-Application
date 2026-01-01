import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  const handleOrder = () => {
    navigate('/chat')
  }

  return (
    <div>
      <h1>Cyber Check Service</h1>
      <p>Jasa pengujian keamanan sistem</p>

      <div>
        <h3>Paket Basic</h3>
        <button onClick={handleOrder}>
          Pesan Sekarang
        </button>
      </div>
    </div>
  )
}