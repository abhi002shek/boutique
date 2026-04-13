'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

export default function SareeDetail() {
  const { id } = useParams()
  const [saree, setSaree] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImg, setSelectedImg] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/sarees/${id}`)
      .then(r => r.json())
      .then(data => { setSaree(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') setFullscreen(false) }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

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
  const whatsappUrl = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP}?text=${encodeURIComponent(whatsappMsg)}`

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '3rem 2rem' }}>
      {/* Breadcrumb */}
      <p style={{ fontSize: '0.8rem', color: '#7A5C4A', marginBottom: '2rem' }}>
        <Link href="/" style={{ color: '#C9A84C' }}>Collection</Link>
        <span style={{ margin: '0 0.5rem' }}>›</span>
        {saree.name}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }}>
        {/* Image gallery */}
        <div>
          {(() => {
            const imgs = saree.image_urls?.length ? saree.image_urls : (saree.image_url ? [saree.image_url] : [])
            const current = imgs[selectedImg]
            return (
              <>
                <div
                  onClick={() => current && setFullscreen(true)}
                  style={{ aspectRatio: '3/4', background: '#F0E4D0', overflow: 'hidden', cursor: current ? 'zoom-in' : 'default', position: 'relative' }}
                >
                  {current ? (
                    <img src={current} alt={saree.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem' }}>🥻</div>
                  )}
                  {current && (
                    <div style={{
                      position: 'absolute', bottom: '0.75rem', right: '0.75rem',
                      background: 'rgba(0,0,0,0.5)', color: '#fff',
                      padding: '0.3rem 0.7rem', fontSize: '0.7rem', borderRadius: 4, letterSpacing: '0.05em'
                    }}>🔍 Click to zoom</div>
                  )}
                </div>
                {imgs.length > 1 && (
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                    {imgs.map((url, i) => (
                      <div key={i} onClick={() => setSelectedImg(i)} style={{
                        width: 64, height: 80, overflow: 'hidden', cursor: 'pointer',
                        border: i === selectedImg ? '2px solid #C9A84C' : '1px solid rgba(201,168,76,0.2)',
                        opacity: i === selectedImg ? 1 : 0.7, transition: 'all 0.2s'
                      }}>
                        <img src={url} alt={`${saree.name} ${i+1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ))}
                  </div>
                )}
              </>
            )
          })()}
        </div>

        {/* Details */}
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

      {/* Fullscreen modal */}
      {fullscreen && (() => {
        const imgs = saree.image_urls?.length ? saree.image_urls : (saree.image_url ? [saree.image_url] : [])
        const current = imgs[selectedImg]
        return (
          <div
            onClick={() => setFullscreen(false)}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.93)',
              zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'zoom-out', padding: '2rem'
            }}
          >
            <img
              src={current}
              alt={saree.name}
              style={{ maxHeight: '90vh', maxWidth: '90vw', objectFit: 'contain' }}
              onClick={e => e.stopPropagation()}
            />
            <button
              onClick={() => setFullscreen(false)}
              style={{
                position: 'fixed', top: '1.5rem', right: '1.5rem',
                background: 'rgba(255,255,255,0.15)', color: '#fff',
                border: '1px solid rgba(255,255,255,0.3)',
                width: 44, height: 44, borderRadius: '50%',
                fontSize: '1.1rem', cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center'
              }}
            >✕</button>
            <p style={{
              position: 'fixed', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)',
              color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', letterSpacing: '0.1em'
            }}>
              Press ESC or click outside to close
            </p>
          </div>
        )
      })()}
    </div>
  )
}
