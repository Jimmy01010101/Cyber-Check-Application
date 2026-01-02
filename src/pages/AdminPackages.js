import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import AdminSidebar from '../components/AdminSidebar'

export default function AdminPackages() {
  const [packages, setPackages] = useState([])
  const [form, setForm] = useState({
    id: null,
    name: '',
    description: '',
    price: ''
  })

  // ===============================
  // LOAD PACKAGES
  // ===============================
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

  // ===============================
  // HANDLE INPUT
  // ===============================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  // ===============================
  // CREATE / UPDATE
  // ===============================
  const savePackage = async () => {
    if (!form.name) {
      alert('Nama paket wajib diisi')
      return
    }

    const payload = {
      name: form.name,
      description: form.description,
      price: form.price
    }

    if (form.id) {
      // UPDATE
      await supabase
        .from('packages')
        .update(payload)
        .eq('id', form.id)
    } else {
      // CREATE
      await supabase
        .from('packages')
        .insert(payload)
    }

    setForm({
      id: null,
      name: '',
      description: '',
      price: ''
    })

    fetchPackages()
  }

  // ===============================
  // EDIT
  // ===============================
  const editPackage = (pkg) => {
    setForm({
      id: pkg.id,
      name: pkg.name || '',
      description: pkg.description || '',
      price: pkg.price || ''
    })
  }

  // ===============================
  // DELETE
  // ===============================
  const deletePackage = async (id) => {
    const ok = window.confirm('Hapus paket ini?')
    if (!ok) return

    await supabase
      .from('packages')
      .delete()
      .eq('id', id)

    fetchPackages()
  }

  return (
    <>
      <AdminSidebar />

      {/* ⚠️ CLASS INI TIDAK DIUBAH (AMAN CSS) */}
      <div className="admin-content">
        <h2>Manajemen Paket Keamanan</h2>

        {/* ================= FORM ================= */}
        <div className="card">
          <h3>{form.id ? 'Edit Paket' : 'Tambah Paket'}</h3>

          <input
            name="name"
            placeholder="Nama Paket"
            value={form.name}
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Deskripsi Paket"
            value={form.description}
            onChange={handleChange}
          />

          <input
            name="price"
            placeholder="Harga"
            value={form.price}
            onChange={handleChange}
          />

          <button onClick={savePackage}>
            {form.id ? 'Update' : 'Simpan'}
          </button>
        </div>

        {/* ================= LIST ================= */}
        <div className="card">
          <h3>Daftar Paket</h3>

          {packages.map(p => (
            <div key={p.id} className="package-item">
              <strong>{p.name}</strong>
              <div>{p.description}</div>
              <div>Harga: {p.price}</div>

              <div className="actions">
                <button onClick={() => editPackage(p)}>Edit</button>
                <button onClick={() => deletePackage(p.id)}>Hapus</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}