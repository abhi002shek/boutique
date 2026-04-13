import './globals.css'

export const metadata = {
  title: "Trisha Fancy Sarees",
  description: "Discover exquisite Indian sarees",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          background: 'rgba(250,246,240,0.95)', backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(201,168,76,0.15)',
          padding: '0 2rem', height: '64px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <a href="/" style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', color: '#C9A84C', letterSpacing: '0.02em' }}>
            ✦ Trisha Fancy Sarees
          </a>
          <div style={{ display: 'flex', gap: '2rem', fontSize: '0.85rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#7A5C4A' }}>
            <a href="/">Collection</a>
            <a href="/tryon">Try On</a>
            <a href="/contact">Contact</a>
          </div>
        </nav>
        <main style={{ paddingTop: '64px' }}>
          {children}
        </main>
        <footer style={{
          background: '#1A0A00', color: '#7A5C4A',
          textAlign: 'center', padding: '2rem',
          fontSize: '0.8rem', letterSpacing: '0.05em'
        }}>
          <p style={{ color: '#C9A84C', fontFamily: 'Playfair Display, serif', marginBottom: '0.5rem' }}>✦ Trisha Fancy Sarees</p>
          <p>Handpicked sarees with love · WhatsApp us to order</p>
        </footer>
      </body>
    </html>
  )
}
