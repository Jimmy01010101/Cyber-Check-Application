import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { getClientId } from '../utils/clientId'
import { useNavigate } from 'react-router-dom'

export default function Chat() {
  const navigate = useNavigate()
  const clientId = getClientId()

  // ===== STATE =====
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')

  // ===== AMBIL RIWAYAT PESAN =====
  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: true })

    if (!error) {
      setMessages(data)
    } else {
      console.error(error)
    }
  }

  // ===== SIMPAN CLIENT & LOAD CHAT SAAT HALAMAN DIBUKA =====
  useEffect(() => {
    // simpan client jika belum ada
    supabase.from('clients').insert({ id: clientId }).then(() => {
      // abaikan error duplicate (normal)
    })

    fetchMessages()
  }, [])

  // ===== KIRIM PESAN =====
  const sendMessage = async () => {
    if (newMessage.trim() === '') return

    await supabase.from('messages').insert({
      client_id: clientId,
      sender: 'client',
      message: newMessage
    })

    setNewMessage('')
    fetchMessages()
  }

  // ===== UI =====
  return (
    <div style={{ maxWidth: '600px', margin: '20px auto' }}>
      <h2>Chat dengan Admin</h2>

      <button onClick={() => navigate('/')}>← Kembali</button>

      <div
        style={{
          border: '1px solid #ccc',
          height: '300px',
          padding: '10px',
          marginTop: '10px',
          overflowY: 'auto'
        }}
      >
        {messages.length === 0 && (
          <p><i>Belum ada pesan</i></p>
        )}

        {messages.map(msg => (
          <p key={msg.id}>
            <strong>{msg.sender}:</strong> {msg.message}
          </p>
        ))}
      </div>

      <div style={{ marginTop: '10px' }}>
        <input
          style={{ width: '80%' }}
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          placeholder="Ketik pesan..."
        />
        <button onClick={sendMessage}>Kirim</button>
      </div>
    </div>
  )
}