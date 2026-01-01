import { useState } from 'react'
import { supabase } from '../supabase'
import { useNavigate } from 'react-router-dom'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const login = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      setError('Login gagal')
    } else {
      navigate('/admin/dashboard')
    }
  }

  return (
    <div className="card" style={{ maxWidth: '400px', margin: '80px auto' }}>
      <h2>ADMIN LOGIN</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <input
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      /><br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      /><br /><br />

      <button onClick={login}>LOGIN</button>
    </div>
  )
}