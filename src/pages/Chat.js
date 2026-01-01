import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { getClientId } from '../utils/clientId'
import { useNavigate } from 'react-router-dom'

export default function Chat() {
  const navigate = useNavigate()
  const clientId = getClientId()

  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')

  // === LOAD CHAT ===
  const fetchMessages = async () => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: true })

    setMessages(data || [])
  }

  // === REALTIME LISTENER ===
  useEffect(() => {
    fetchMessages()

    const channel = supabase
      .channel('client-chat')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `client_id=eq.${clientId}`
        },
        () => {
          fetchMessages()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  // === KIRIM PESAN CLIENT ===
  const sendMessage = async () => {
    if (!newMessage.trim()) return

    await supabase.from('messages').insert({
      client_id: clientId,
      sender: 'client',
      message: newMessage,
      is_read: false // 🔔 INI PENTING UNTUK NOTIFIKASI ADMIN
    })

    setNewMessage('')
  }

  return (
    <div style={{ maxWidth: 600, margin: '20px auto' }}>
      <h2>Chat dengan Admin</h2>

      <button onClick={() => navigate('/')}>← Kembali</button>

      <div
        style={{
          border: '1px solid #ccc',
          height: 300,
          padding: 10,
          overflowY: 'auto',
          marginTop: 10
        }}
      >
        {messages.map(m => (
          <p key={m.id}>
            <strong>{m.sender}:</strong> {m.message}
          </p>
        ))}
      </div>

      <input
        value={newMessage}
        onChange={e => setNewMessage(e.target.value)}
        placeholder="Ketik pesan..."
        style={{ width: '80%' }}
      />
      <button onClick={sendMessage}>Kirim</button>
    </div>
  )
}