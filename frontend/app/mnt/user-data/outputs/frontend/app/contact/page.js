'use client'

export default function Contact() {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '5rem 2rem', textAlign: 'center' }}>
      <p style={{ fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '0.75rem' }}>Get In Touch</p>
      <h1 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', color: '#1A0A00', marginBottom: '1rem' }}>Contact Us</h1>
      <p style={{ color: '#7A5C4A', lineHeight: 1.8, marginBottom: '3rem' }}>
        We'd love to hear from you. For orders, queries, or custom requests — just WhatsApp us.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center', marginBottom: '3rem' }}>
        <a href={`https://wa.me/${phone}`} target="_blank" rel="noopener noreferrer" style={{
          display: 'flex', alignItems: 'center', gap: '1rem',
          padding: '1.25rem 2.5rem', background: '#C9A84C', color: '#fff',
          fontSize: '0.9rem', letterSpacing: '0.08em'
        }}>
          <span>💬</span> Chat on WhatsApp
        </a>
        <p style={{ color: '#7A5C4A', fontSize: '0.85rem' }}>We usually reply within a few hours</p>
      </div>

      <div style={{ borderTop: '1px solid rgba(201,168,76,0.2)', paddingTop: '2rem' }}>
        <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', color: '#1A0A00', marginBottom: '0.5rem' }}>
          Visit Our Store
        </p>
        <p style={{ color: '#7A5C4A', fontSize: '0.9rem', lineHeight: 1.8 }}>
          Open Monday – Saturday<br />
          10:00 AM – 7:00 PM
        </p>
      </div>
    </div>
  )
}
