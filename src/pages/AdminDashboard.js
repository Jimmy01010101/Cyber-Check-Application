import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import AdminSidebar from '../components/AdminSidebar'

export default function AdminDashboard() {
  const [clients, setClients] = useState([])
  const [messages, setMessages] = useState([])
  const [selectedClient, setSelectedClient] = useState(null)
  const [reply, setReply] = useState('')

  const [stats, setStats] = useState({
    totalClients: 0,
    totalMessages: 0,
    unreadMessages: 0,
    todayMessages: 0
  })

  useEffect(() => {
    fetchClients()
    fetchStats()
  }, [])

  // === STATISTIK ADMIN ===
  const fetchStats = async () => {
    const today = new Date().toISOString().split('T')[0]

    const { data: allMessages } = await supabase
      .from('messages')
      .select('client_id, sender, is_read, created_at')

    if (!allMessages) return

    const uniqueClients = new Set(allMessages.map(m => m.client_id))
    const unread = allMessages.filter(
      m => m.sender === 'client' && m.is_read === false
    )
    const todayMsgs = allMessages.filter(
      m => m.created_at.startsWith(today)
    )

    setStats({
      totalClients: uniqueClients.size,
      totalMessages: allMessages.length,
      unreadMessages: unread.length,
      todayMessages: todayMsgs.length
    })
  }

  // === CLIENT LIST + UNREAD PER CLIENT ===
  const fetchClients = async () => {
    const { data } = await supabase
      .from('messages')
      .select('client_id, sender, is_read')

    if (!data) return

    const map = {}
    data.forEach(msg => {
      if (!map[msg.client_id]) map[msg.client_id] = 0
      if (msg.sender === 'client' && !msg.is_read) {
        map[msg.client_id]++
      }
    })

    setClients(
      Object.entries(map).map(([id, unread]) => ({ id, unread }))
    )
  }

  // === OPEN CHAT ===
  const fetchMessages = async (clientId) => {
    setSelectedClient(clientId)

    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at')

    setMessages(data || [])

    // tandai sudah dibaca
    await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('client_id', clientId)
      .eq('sender', 'client')

    fetchClients()
    fetchStats()
  }

  // === ADMIN REPLY ===
  const sendReply = async () => {
    if (!reply || !selectedClient) return

    await supabase.from('messages').insert({
      client_id: selectedClient,
      sender: 'admin',
      message: reply,
      is_read: true
    })

    setReply('')
    fetchMessages(selectedClient)
  }

  return (
    <>
      <AdminSidebar />

      <div className="admin-content">
        <h2>ADMIN DASHBOARD</h2>

        {/* === STAT BOX === */}
        <div className="stats-grid">
          <div className="stat-card">
            <h3>{stats.totalClients}</h3>
            <p>Total Clients</p>
          </div>

          <div className="stat-card">
            <h3>{stats.totalMessages}</h3>
            <p>Total Messages</p>
          </div>

          <div className="stat-card">
            <h3>{stats.unreadMessages}</h3>
            <p>Unread Messages</p>
          </div>

          <div className="stat-card">
            <h3>{stats.todayMessages}</h3>
            <p>Messages Today</p>
          </div>
        </div>

        {/* === CHAT PANEL === */}
        <div style={{ display: 'flex', marginTop: 20 }}>
          <div className="card" style={{ width: '30%' }}>
            <h3>Clients</h3>
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

          <div className="card" style={{ width: '70%', marginLeft: 15 }}>
            <div className="chat-box">
              {messages.map(m => (
                <p
                  key={m.id}
                  className={m.sender === 'admin'
                    ? 'chat-admin'
                    : 'chat-client'}
                >
                  <strong>{m.sender}:</strong> {m.message}
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