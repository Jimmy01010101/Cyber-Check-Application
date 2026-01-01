import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { useNavigate } from 'react-router-dom'

export default function Packages() {
  const [packages, setPackages] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetchPackages()
  }, [])

  const fetchPackages = async () => {
    const { data } = await supabase.from('packages').select('*')
    setPackages(data || [])
  }

  const orderPackage = (pkg) => {
    // simpan paket yang dipilih
    localStorage.setItem('selected_package', JSON.stringify(pkg))
    navigate('/chat')
  }

  return (
    <div className="page">
      <h2>Security Packages</h2>

      <div className="package-grid">
        {packages.map(pkg => (
          <div key={pkg.id} className="card">
            <h3>{pkg.name}</h3>
            <p>{pkg.description}</p>
            <strong>{pkg.price}</strong>

            <button onClick={() => orderPackage(pkg)}>
              Order Package
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}