export default function Footer() {
  return (
    <footer className="global-footer">
      <div className="footer-content">
        <span>© {new Date().getFullYear()} Cyber-Check System</span>
        <span className="footer-sep">|</span>
        <span>Security • Audit • Testing</span>
      </div>
    </footer>
  )
}