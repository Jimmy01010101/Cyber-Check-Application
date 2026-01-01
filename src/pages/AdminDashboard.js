import { useEffect, useState } from 'react'
import { supabase } from '../supabase'

export default function AdminDashboard() {
  const [clients, setClients] = useState([])
  const [selectedClient, setSelectedClient] = useState(null)
  const [messages, setMessages] = useState([])
  const [reply, setReply] = useState('')

  // ===== AMBIL DAFTAR CLIENT DARI CHAT =====
  const fetchClients = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('client_id')

    if (!error) {
      const uniqueClients = [...new Set(data.map(d => d.client_id))]
      setClients(uniqueClients)
    }
  }

  // ===== AMBIL CHAT CLIENT =====
  const fetchMessages = async (clientId) => {
    setSelectedClient(clientId)

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: true })

    if (!error) setMessages(data)
  }

  // ===== BALAS PESAN =====
  const sendReply = async () => {
    if (reply.trim() === '' || !selectedClient) return

    await supabase.from('messages').insert({
      client_id: selectedClient,
      sender: 'admin',
      message: reply
    })

    setReply('')
    fetchMessages(selectedClient)
  }

  useEffect(() => {
    fetchClients()
  }, [])

  // ===== UI =====
  return (
    <div style={{ display: 'flex', padding: '20px' }}>
      
      {/* LIST CLIENT */}
      <div style={{ width: '30%', borderRight: '1px solid #ccc' }}>
        <h3>Daftar Client</h3>
        {clients.map(id => (
          <p
            key={id}
            style={{ cursor: 'pointer', color: 'blue' }}
            onClick={() => fetchMessages(id)}
          >
            {id.slice(0, 8)}...
          </p>
        ))}
      </div>

      {/* CHAT AREA */}
      <div style={{ width: '70%', paddingLeft: '20px' }}>
        <h3>Chat Client</h3>

        {!selectedClient && <p>Pilih client</p>}

        {selectedClient && (
          <>
            <div
              style={{
                border: '1px solid #ccc',
                height: '300px',
                padding: '10px',
                overflowY: 'auto'
              }}
            >
              {messages.map(msg => (
                <p key={msg.id}>
                  <strong>{msg.sender}:</strong> {msg.message}
                </p>
              ))}
            </div>

            <div style={{ marginTop: '10px' }}>
              <input
                style={{ width: '80%' }}
                value={reply}
                onChange={e => setReply(e.target.value)}
                placeholder="Balas pesan..."
              />
              <button onClick={sendReply}>Kirim</button>
            </div>
          </>
        )}
      </div>

    </div>
  )
}