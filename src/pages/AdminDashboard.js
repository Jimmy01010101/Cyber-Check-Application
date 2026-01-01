import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import AdminSidebar from '../components/AdminSidebar'

export default function AdminDashboard() {
  const [clients, setClients] = useState([])
  const [messages, setMessages] = useState([])
  const [selectedClient, setSelectedClient] = useState(null)
  const [reply, setReply] = useState('')
  const [unreadTotal, setUnreadTotal] = useState(0)

  useEffect(() => {
    fetchClients()
    fetchUnreadTotal()
  }, [])

  // 🔔 TOTAL PESAN BELUM DIBACA
  const fetchUnreadTotal = async () => {
    const { count } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('sender', 'client')
      .eq('is_read', false)

    setUnreadTotal(count || 0)
  }

  // CLIENT LIST + JUMLAH UNREAD PER CLIENT
  const fetchClients = async () => {
    const { data } = await supabase
      .from('messages')
      .select('client_id, is_read, sender')

    if (!data) return

    const map = {}
    data.forEach(msg => {
      if (!map[msg.client_id]) map[msg.client_id] = 0
      if (msg.sender === 'client' && !msg.is_read) {
        map[msg.client_id]++
      }
    })

    const result = Object.entries(map).map(([id, unread]) => ({
      id,
      unread
    }))

    setClients(result)
  }

  // BUKA CHAT CLIENT
  const fetchMessages = async (clientId) => {
    setSelectedClient(clientId)

    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at')

    setMessages(data || [])

    // ✅ TANDAI SUDAH DIBACA
    await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('client_id', clientId)
      .eq('sender', 'client')

    fetchClients()
    fetchUnreadTotal()
  }

  const sendReply = async () => {
    if (!reply || !selectedClient) return

    await supabase.from('messages').insert([
      {
        client_id: selectedClient,
        sender: 'admin',
        message: reply,
        is_read: true
      }
    ])

    setReply('')
    fetchMessages(selectedClient)
  }

  return (
    <>
      <AdminSidebar unread={unreadTotal} />

      <div className="admin-content">
        <h2>SECURE CHAT PANEL</h2>

        <div style={{ display: 'flex' }}>
          {/* CLIENT LIST */}
          <div className="card" style={{ width: '30%' }}>
            <h3>CLIENTS</h3>

            {clients.map(c => (
              <div
                key={c.id}
                className="client-item"
                onClick={() => fetchMessages(c.id)}
              >
                {c.id.slice(0, 8)}...
                {c.unread > 0 && (
                  <span className="badge">{c.unread}</span>
                )}
              </div>
            ))}
          </div>

          {/* CHAT */}
          <div className="card" style={{ width: '70%', marginLeft: '15px' }}>
            <div className="chat-box">
              {messages.map(msg => (
                <p
                  key={msg.id}
                  className={msg.sender === 'admin'
                    ? 'chat-admin'
                    : 'chat-client'}
                >
                  <strong>{msg.sender}:</strong> {msg.message}
                </p>
              ))}
            </div>

            <input
              placeholder="secure reply..."
              value={reply}
              onChange={e => setReply(e.target.value)}
            />
            <button onClick={sendReply}>SEND</button>
          </div>
        </div>
      </div>
    </>
  )
}