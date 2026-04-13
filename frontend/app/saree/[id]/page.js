'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

export default function SareeDetail() {
  const { id } = useParams()
  const [saree, setSaree] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/sarees/${id}`)
      .then(r => r.json())
      .then(data => { setSaree(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7A5C4A' }}>
      Loading...
    </div>
  )

  if (!saree) return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
      <p style={{ color: '#7A5C4A' }}>Saree not found.</p>
      <Link href="/" style={{ color: '#C9A84C' }}>← Back to collection</Link>
    </div>
  )

  const whatsappMsg = `Hi! I am interested in the ${saree.name} saree priced at Rs ${saree.price}. Is it available?`
const whatsappUrl = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP}?text=${whatsappMsg.split(' ').join('%20')}`

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '3rem 2rem' }}>
      <p style={{ fontSize: '0.8rem', color: '#7A5C4A', marginBottom: '2rem' }}>
        <Link href="/" style={{ color: '#C9A84C' }}>Collection</Link>
        <span style={{ margin: '0 0.5rem' }}>›</span>
        {saree.name}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }}>
        <div style={{ aspectRatio: '3/4', background: '#F0E4D0', overflow: 'hidden' }}>
          {saree.image_url
            ? <img src={saree.image_url} alt={saree.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem' }}>🥻</div>
          }
        </div>

        <div style={{ position: 'sticky', top: '80px' }}>
          <p style={{ fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '0.75rem' }}>
            {saree.fabric} · {saree.occasion}
          </p>
          <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', color: '#1A0A00', marginBottom: '1rem', lineHeight: 1.2, fontFamily: 'Playfair Display, serif' }}>
            {saree.name}
          </h1>
          <p style={{ fontSize: '1.6rem', color: '#C9A84C', marginBottom: '1.5rem', fontFamily: 'Playfair Display, serif' }}>
            ₹{saree.price?.toLocaleString()}
          </p>

          {saree.description && (
            <p style={{ color: '#7A5C4A', lineHeight: 1.8, marginBottom: '2rem', fontSize: '0.95rem' }}>
              {saree.description}
            </p>
          )}

          <div style={{ borderTop: '1px solid rgba(201,168,76,0.2)', paddingTop: '1.5rem', marginBottom: '2rem' }}>
            {[
              ['Fabric', saree.fabric],
              ['Occasion', saree.occasion],
              ['Colors', saree.colors],
              ['Care', saree.care],
              ['Status', saree.available ? '✓ In Stock' : 'Sold Out'],
            ].filter(([, v]) => v).map(([label, value]) => (
              <div key={label} style={{ display: 'flex', padding: '0.6rem 0', borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
                <span style={{ width: 100, fontSize: '0.8rem', color: '#7A5C4A', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{label}</span>
                <span style={{ fontSize: '0.9rem', color: '#2C1810' }}>{value}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link href={`/tryon?saree=${saree.id}`} style={{
              display: 'block', textAlign: 'center', padding: '1rem',
              background: '#C9A84C', color: '#fff',
              fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase'
            }}>
              ✦ Try This On Virtually
            </Link>
            {saree.available && (
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" style={{
                display: 'block', textAlign: 'center', padding: '1rem',
                background: 'transparent', color: '#2C1810',
                fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                border: '1px solid rgba(44,24,16,0.2)'
              }}>
                💬 Order on WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
