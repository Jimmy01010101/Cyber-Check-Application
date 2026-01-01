import UserNavbar from '../components/UserNavbar'
import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { getClientId } from '../utils/clientId'

export default function Chat() {
  const clientId = getClientId()
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')

  useEffect(() => {
    supabase
      .from('messages')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at')
      .then(res => setMessages(res.data || []))
  }, [])

  const send = async () => {
    if (!text) return

    await supabase.from('messages').insert({
      client_id: clientId,
      sender: 'client',
      message: text,
      is_read: false
    })

    setText('')
  }

  return (
    <>
      <UserNavbar />

      <div className="chat-page">
        <div className="chat-box">
          {messages.length === 0 && (
            <div className="empty-chat">
              👋 Halo! Silakan mulai chat dengan admin.
            </div>
          )}

          {messages.map(m => (
            <div
              key={m.id}
              className={`bubble ${m.sender}`}
            >
              {m.message}
            </div>
          ))}
        </div>

        <div className="chat-input">
          <input
            placeholder="Ketik pesan aman..."
            value={text}
            onChange={e => setText(e.target.value)}
          />
          <button onClick={send}>Kirim</button>
        </div>
      </div>
    </>
  )
}