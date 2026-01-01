import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import AdminSidebar from '../components/AdminSidebar'

// CHART
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

export default function AdminDashboard() {
  const [clients, setClients] = useState([])
  const [messages, setMessages] = useState([])
  const [selectedClient, setSelectedClient] = useState(null)
  const [reply, setReply] = useState([])
  const [stats, setStats] = useState({})
  const [chartData, setChartData] = useState(null)

  useEffect(() => {
    fetchStats()
    fetchClients()
    fetchChart()
  }, [])

  // === STATISTIK ===
  const fetchStats = async () => {
    const today = new Date().toISOString().split('T')[0]

    const { data } = await supabase
      .from('messages')
      .select('client_id, sender, is_read, created_at')

    if (!data) return

    const uniqueClients = new Set(data.map(d => d.client_id))
    const unread = data.filter(d => d.sender === 'client' && !d.is_read)
    const todayMsg = data.filter(d => d.created_at.startsWith(today))

    setStats({
      totalClients: uniqueClients.size,
      totalMessages: data.length,
      unreadMessages: unread.length,
      todayMessages: todayMsg.length
    })
  }

  // === CLIENT LIST ===
  const fetchClients = async () => {
    const { data } = await supabase
      .from('messages')
      .select('client_id, sender, is_read')

    const map = {}
    data?.forEach(m => {
      if (!map[m.client_id]) map[m.client_id] = 0
      if (m.sender === 'client' && !m.is_read) map[m.client_id]++
    })

    setClients(Object.entries(map).map(([id, unread]) => ({ id, unread })))
  }

  // === GRAFIK PESAN 7 HARI ===
  const fetchChart = async () => {
    const { data } = await supabase
      .from('messages')
      .select('created_at')

    if (!data) return

    const days = [...Array(7)].map((_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (6 - i))
      return d.toISOString().split('T')[0]
    })

    const counts = days.map(day =>
      data.filter(m => m.created_at.startsWith(day)).length
    )

    setChartData({
      labels: days.map(d => d.slice(5)),
      datasets: [
        {
          label: 'Messages',
          data: counts,
          backgroundColor: '#00ff88'
        }
      ]
    })
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

  const deleteMessage = async (id) => {
  const ok = window.confirm('Hapus pesan ini secara permanen?')
  if (!ok) return

  await supabase
    .from('messages')
    .delete()
    .eq('id', id)

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
            <p>Clients</p>
          </div>
          <div className="stat-card">
            <h3>{stats.totalMessages}</h3>
            <p>Messages</p>
          </div>
          <div className="stat-card">
            <h3>{stats.unreadMessages}</h3>
            <p>Unread</p>
          </div>
          <div className="stat-card">
            <h3>{stats.todayMessages}</h3>
            <p>Today</p>
          </div>
        </div>

        {/* === GRAFIK === */}
        <div className="card">
          <h3>Message Activity (7 Days)</h3>
          {chartData && <Bar data={chartData} />}
        </div>

        {/* === CHAT === */}
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
                {c.unread > 0 && <span className="badge">{c.unread}</span>}
              </div>
            ))}
          </div>

          <div className="card" style={{ width: '70%', marginLeft: 15 }}>
            <div className="chat-box">
  {messages.map(m => (
    <div
      key={m.id}
      className={`bubble ${m.sender === 'admin'
        ? 'chat-admin'
        : 'chat-client'}`}
    >
      {/* TEXT */}
      {m.message && (
        <div>
          <strong>{m.sender}:</strong> {m.message}
        </div>
      )}

      {/* FILE ZIP */}
      {m.file_url && (
        <a
          href={m.file_url}
          target="_blank"
          rel="noreferrer"
          className="file-link"
        >
          📦 Download {m.file_name}
        </a>
      )}

      {/* DELETE BUTTON */}
      <button
        className="delete-btn"
        onClick={() => deleteMessage(m.id)}
      >
        🗑 Hapus
      </button>
    </div>
  ))}
</div>
            <input
              value={reply}
              onChange={e => setReply(e.target.value)}
              placeholder="secure reply..."
            />
            <button onClick={sendReply}>SEND</button>
          </div>
        </div>
      </div>
    </>
  )
}