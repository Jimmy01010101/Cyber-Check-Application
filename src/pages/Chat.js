import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { getClientId } from '../utils/clientId'
import UserNavbar from '../components/UserNavbar'

export default function Chat() {
  const clientId = getClientId()

  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [hiddenMessages, setHiddenMessages] = useState([]) // local only

  // === LOAD CHAT ===
  const fetchMessages = async () => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at')

    setMessages(data || [])
  }

  // === FIRST MESSAGE FROM PACKAGE (MENTION) ===
  useEffect(() => {
    fetchMessages()

    const pkg = localStorage.getItem('selected_package')
    if (pkg) {
      const selected = JSON.parse(pkg)
      sendAutoMessage(`📦 Saya ingin memesan paket: ${selected.name}`)
      localStorage.removeItem('selected_package')
    }
  }, [])

  // === AUTO MESSAGE ===
  const sendAutoMessage = async (text) => {
    await supabase.from('messages').insert({
      client_id: clientId,
      sender: 'client',
      message: text
    })

    fetchMessages()
  }

  // === SEND TEXT MESSAGE ===
  const sendMessage = async () => {
    if (!newMessage.trim()) return

    await supabase.from('messages').insert({
      client_id: clientId,
      sender: 'client',
      message: newMessage
    })

    setNewMessage('')
    fetchMessages()
  }

  // === HAPUS UNTUK SAYA (UI ONLY) ===
  const deleteForMe = (id) => {
    setHiddenMessages(prev => [...prev, id])
  }

  // === HAPUS UNTUK SEMUA (DELETE DB) ===
  const deleteForAll = async (id) => {
    const ok = window.confirm(
      'Pesan akan dihapus permanen untuk semua. Lanjutkan?'
    )
    if (!ok) return

    await supabase
      .from('messages')
      .delete()
      .eq('id', id)

    fetchMessages()
  }

  // === UPLOAD FILE ZIP ===
  const uploadZip = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.name.endsWith('.zip')) {
      alert('Hanya file ZIP yang diperbolehkan')
      return
    }

    const path = `${clientId}/${Date.now()}-${file.name}`

    const { error } = await supabase
      .storage
      .from('chat-files')
      .upload(path, file)

    if (error) {
      alert('Upload gagal')
      return
    }

    const { data } = supabase
      .storage
      .from('chat-files')
      .getPublicUrl(path)

    await supabase.from('messages').insert({
      client_id: clientId,
      sender: 'client',
      file_url: data.publicUrl,
      file_name: file.name
    })

    fetchMessages()
  }

  return (
    <>
      <UserNavbar />

      <div className="chat-page">
        <div className="chat-box">
          {messages.length === 0 && (
            <div className="empty-chat">
              👋 Halo! Silakan konsultasi keamanan sistem anda dengan admin kami.
            </div>
          )}

          {messages
            .filter(m => !hiddenMessages.includes(m.id))
            .map(m => (
              <div
                key={m.id}
                className={`bubble ${m.sender === 'client' ? 'client' : 'admin'}`}
              >
                {/* TEXT */}
                {m.message && <div>{m.message}</div>}

                {/* FILE ZIP */}
                {m.file_url && (
                  <a
                    href={m.file_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    📦 {m.file_name}
                  </a>
                )}

                {/* ACTIONS */}
                <div className="bubble-actions">
                  {m.sender === 'client' && (
                    <>
                      <button onClick={() => deleteForMe(m.id)}>
                        Hapus Saya
                      </button>
                      <button onClick={() => deleteForAll(m.id)}>
                        Hapus Semua
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
        </div>

        <div className="chat-input">
          <input
            placeholder="Ketik pesan aman..."
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
          />
          <button className="btn" onClick={sendMessage}>
            Kirim
          </button>
        </div>

        <input
          type="file"
          accept=".zip"
          onChange={uploadZip}
          style={{ marginTop: 10 }}
        />
      </div>
    </>
  )
}