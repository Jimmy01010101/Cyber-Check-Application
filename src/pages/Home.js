import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()
  const [packages, setPackages] = useState([])

  // === AMBIL DATA PAKET ===
  const fetchPackages = async () => {
    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .order('created_at', { ascending: true })

    if (!error) setPackages(data)
  }

  useEffect(() => {
    fetchPackages()
  }, [])

  return (
    <div style={{ maxWidth: 800, margin: '20px auto' }}>
      <h1>Cyber Check Service</h1>
      <p>Jasa pengujian keamanan sistem</p>

      {packages.length === 0 && (
        <p><i>Paket belum tersedia</i></p>
      )}

      {packages.map(pkg => (
        <div
          key={pkg.id}
          style={{
            border: '1px solid #ccc',
            padding: 15,
            marginBottom: 10
          }}
        >
          <h3>{pkg.name}</h3>
          <p>{pkg.description}</p>
          <strong>Harga: {pkg.price}</strong>
          <br /><br />

          <button onClick={() => navigate('/chat')}>
            Pesan Sekarang
          </button>
        </div>
      ))}
    </div>
  )
}