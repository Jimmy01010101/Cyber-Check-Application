import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { useNavigate } from 'react-router-dom'

export default function AdminPackages() {
  const navigate = useNavigate()

  const [packages, setPackages] = useState([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [editId, setEditId] = useState(null)

  // ===== AMBIL DATA =====
  const fetchPackages = async () => {
    const { data } = await supabase
      .from('packages')
      .select('*')
      .order('created_at', { ascending: false })

    setPackages(data || [])
  }

  useEffect(() => {
    fetchPackages()
  }, [])

  // ===== SIMPAN / UPDATE =====
  const savePackage = async () => {
    if (!name || !price) {
      alert('Nama dan harga wajib diisi')
      return
    }

    if (editId) {
      await supabase
        .from('packages')
        .update({ name, description, price })
        .eq('id', editId)
    } else {
      await supabase
        .from('packages')
        .insert({ name, description, price })
    }

    resetForm()
    fetchPackages()
  }

  const editPackage = (pkg) => {
    setEditId(pkg.id)
    setName(pkg.name)
    setDescription(pkg.description)
    setPrice(pkg.price)
  }

  const deletePackage = async (id) => {
    if (!window.confirm('Hapus paket ini?')) return

    await supabase
      .from('packages')
      .delete()
      .eq('id', id)

    fetchPackages()
  }

  const resetForm = () => {
    setEditId(null)
    setName('')
    setDescription('')
    setPrice('')
  }

  return (
    <div style={{ maxWidth: '800px', margin: '20px auto' }}>

      {/* ===== MENU ADMIN ===== */}
      <div style={{ marginBottom: '15px' }}>
        <button onClick={() => navigate('/admin/dashboard')}>
          Dashboard Chat
        </button>
        <button
          style={{ marginLeft: '10px' }}
          onClick={() => navigate('/admin/packages')}
        >
          Paket Keamanan
        </button>
      </div>

      <h2>Manajemen Paket Keamanan</h2>

      {/* FORM */}
      <div style={{ border: '1px solid #ccc', padding: '10px' }}>
        <input
          placeholder="Nama Paket"
          value={name}
          onChange={e => setName(e.target.value)}
        /><br /><br />

        <textarea
          placeholder="Deskripsi"
          value={description}
          onChange={e => setDescription(e.target.value)}
        /><br /><br />

        <input
          placeholder="Harga"
          value={price}
          onChange={e => setPrice(e.target.value)}
        /><br /><br />

        <button onClick={savePackage}>
          {editId ? 'Update' : 'Tambah'}
        </button>

        {editId && (
          <button onClick={resetForm} style={{ marginLeft: '10px' }}>
            Batal
          </button>
        )}
      </div>

      <hr />

      {/* LIST */}
      <h3>Daftar Paket</h3>

      {packages.map(pkg => (
        <div key={pkg.id} style={{ borderBottom: '1px solid #eee', marginBottom: '10px' }}>
          <h4>{pkg.name}</h4>
          <p>{pkg.description}</p>
          <strong>{pkg.price}</strong><br />

          <button onClick={() => editPackage(pkg)}>Edit</button>
          <button
            onClick={() => deletePackage(pkg.id)}
            style={{ marginLeft: '10px' }}
          >
            Hapus
          </button>
        </div>
      ))}
    </div>
  )
}