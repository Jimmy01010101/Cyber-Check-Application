import { useEffect } from 'react'
import { getClientId } from '../utils/clientId'
import { useNavigate } from 'react-router-dom'

export default function Chat() {
  const navigate = useNavigate()

  useEffect(() => {
    const clientId = getClientId()
    console.log('Client sedang chat dengan ID:', clientId)
  }, [])

  return (
    <div>
      <h2>Chat dengan Admin</h2>

      <button onClick={() => navigate('/')}>
        ← Kembali
      </button>

      <div style={{ border: '1px solid #ccc', height: '200px', marginTop: '10px' }}>
        <p>Admin: Selamat datang, silakan jelaskan kebutuhan Anda.</p>
      </div>

      <input placeholder="Ketik pesan..." />
      <button>Kirim</button>
    </div>
  )
}