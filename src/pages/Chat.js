export default function Chat() {
  return (
    <div>
      <h2>Chat dengan Admin</h2>

      <div style={{ border: '1px solid #ccc', height: '200px' }}>
        <p>Admin: Selamat datang</p>
      </div>

      <input placeholder="Ketik pesan..." />
      <button>Kirim</button>
    </div>
  )
}