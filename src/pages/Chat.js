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
      .order('created_at')

    setMessages(data || [])
  }

  // === FIRST MESSAGE FROM PACKAGE ===
  useEffect(() => {
    fetchMessages()

    const pkg = localStorage.getItem('selected_package')

    if (pkg) {
      const selected = JSON.parse(pkg)

      sendAutoMessage(
        `📦 Saya ingin memesan paket: ${selected.name}`
      )

      localStorage.removeItem('selected_package')
    }
  }, [])

  const sendAutoMessage = async (text) => {
    await supabase.from('messages').insert({
      client_id: clientId,
      sender: 'client',
      message: text,
      is_read: false
    })

    fetchMessages()
  }

  // === SEND MESSAGE ===
  const sendMessage = async () => {
    if (!newMessage.trim()) return

    await supabase.from('messages').insert({
      client_id: clientId,
      sender: 'client',
      message: newMessage,
      is_read: false
    })

    setNewMessage('')
    fetchMessages()
  }

  return (
    <div className="page">
      <h2>Secure Chat</h2>

      <div className="menu-bar">
        <button onClick={() => navigate('/packages')}>📦 Paket</button>
        <button onClick={() => navigate('/')}>🏠 Home</button>
      </div>

      <div className="chat-box">
        {messages.map(m => (
          <div
            key={m.id}
            className={m.sender === 'client'
              ? 'chat-client'
              : 'chat-admin'}
          >
            {m.message}
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          placeholder="Ketik pesan..."
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  )
}