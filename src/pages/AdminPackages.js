import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import AdminSidebar from '../components/AdminSidebar'

export default function AdminPackages() {
  const [packages, setPackages] = useState([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')

  useEffect(() => {
    fetchPackages()
  }, [])

  const fetchPackages = async () => {
    const { data } = await supabase
      .from('packages')
      .select('*')
      .order('created_at', { ascending: false })

    setPackages(data || [])
  }

  const savePackage = async () => {
    if (!name || !description || !price) return

    await supabase.from('packages').insert([
      { name, description, price }
    ])

    setName('')
    setDescription('')
    setPrice('')
    fetchPackages()
  }

  return (
    <>
      <AdminSidebar />

      <div className="admin-content">
        <h2>SECURITY PACKAGES</h2>

        {/* FORM */}
        <div className="card">
          <input
            placeholder="Package name"
            value={name}
            onChange={e => setName(e.target.value)}
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />

          <input
            placeholder="Price"
            value={price}
            onChange={e => setPrice(e.target.value)}
          />

          <button onClick={savePackage} style={{ marginTop: '10px' }}>
            SAVE
          </button>
        </div>

        {/* LIST */}
        {packages.map(pkg => (
          <div key={pkg.id} className="card">
            <h3>{pkg.name}</h3>
            <p>{pkg.description}</p>
            <strong>{pkg.price}</strong>
          </div>
        ))}
      </div>
    </>
  )
}