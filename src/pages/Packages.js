import UserNavbar from '../components/UserNavbar'
import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { useNavigate } from 'react-router-dom'

export default function Packages() {
  const [packages, setPackages] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    supabase.from('packages').select('*').then(res => {
      setPackages(res.data || [])
    })
  }, [])

  const order = (pkg) => {
    localStorage.setItem('selected_package', JSON.stringify(pkg))
    navigate('/chat')
  }

  return (
    <>
      <UserNavbar />

      <div className="page">
        <h2></h2>

        <div className="package-grid">
          {packages.map(pkg => (
            <div key={pkg.id} className="package-card">
              <h3>{pkg.name}</h3>
              <p>{pkg.description}</p>
              <span className="price">{pkg.price}</span>

              <button onClick={() => order(pkg)}>
                Order Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}