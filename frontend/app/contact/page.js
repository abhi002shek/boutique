'use client'

const PHONE = '+91 94902 86831'
const WHATSAPP_NUMBER = '919490286831'

export default function ContactPage() {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi! I would like to enquire about your saree collection.')}`

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '5rem 2rem', textAlign: 'center' }}>
      <p style={{ fontSize: '0.75rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '1rem' }}>
        ✦ Get in Touch
      </p>
      <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#1A0A00', marginBottom: '1rem' }}>
        Contact Us
      </h1>
      <p style={{ color: '#7A5C4A', lineHeight: 1.8, marginBottom: '3rem' }}>
        We'd love to hear from you. Reach out on WhatsApp to enquire about any saree, place an order, or ask about custom requirements.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.75rem',
          padding: '1rem 2.5rem', background: '#25D366', color: '#fff',
          fontSize: '0.9rem', letterSpacing: '0.08em', textTransform: 'uppercase',
          textDecoration: 'none', width: '100%', maxWidth: 320, justifyContent: 'center'
        }}>
          💬 Chat on WhatsApp
        </a>

        <a href={`tel:${PHONE.replace(/\s/g, '')}`} style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.75rem',
          padding: '1rem 2.5rem', background: 'transparent', color: '#2C1810',
          fontSize: '0.9rem', letterSpacing: '0.08em', textTransform: 'uppercase',
          border: '1px solid rgba(44,24,16,0.2)', textDecoration: 'none',
          width: '100%', maxWidth: 320, justifyContent: 'center'
        }}>
          📞 {PHONE}
        </a>
      </div>

      <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid rgba(201,168,76,0.2)' }}>
        <p style={{ fontSize: '0.8rem', color: '#7A5C4A', letterSpacing: '0.05em' }}>
          Available Mon – Sat · 10 AM to 7 PM
        </p>
      </div>
    </div>
  )
}
