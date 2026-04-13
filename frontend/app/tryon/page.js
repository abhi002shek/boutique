'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

const PHOTO_TIPS = [
  { icon: '🧍', good: true,  text: 'Stand straight, full body visible from head to toe' },
  { icon: '☀️', good: true,  text: 'Well-lit room — natural daylight is best' },
  { icon: '🟫', good: true,  text: 'Plain, light-coloured background (white wall ideal)' },
  { icon: '👗', good: true,  text: 'Wear fitted, light-coloured clothing (not a saree)' },
  { icon: '📐', good: true,  text: 'Camera at chest height, phone held straight — not tilted' },
  { icon: '🚫', good: false, text: 'No group photos — only you in the frame' },
  { icon: '🚫', good: false, text: 'No heavy shadows, dark rooms or backlit photos' },
  { icon: '🚫', good: false, text: 'No sitting, bending or side poses — stand facing forward' },
]

function TryOnContent() {
  const searchParams = useSearchParams()
  const preselected = searchParams.get('saree')

  const [sarees, setSarees] = useState([])
  const [selectedSaree, setSelectedSaree] = useState(preselected || '')
  const [photo, setPhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/sarees/`)
      .then(r => r.json())
      .then(setSarees)
      .catch(() => {})
  }, [])

  const handlePhoto = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setPhoto(file)
    setPhotoPreview(URL.createObjectURL(file))
    setResult(null)
  }

  const handleTryOn = async () => {
    if (!photo || !selectedSaree) return
    setLoading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('photo', photo)
      formData.append('saree_id', selectedSaree)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tryon/`, {
        method: 'POST',
        body: formData
      })
      if (!res.ok) throw new Error('Try-on failed')
      const data = await res.json()
      setResult(data.result_url)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const selectedSareeData = sarees.find(s => s.id === selectedSaree)

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '3rem 2rem' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <p style={{ fontSize: '0.75rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '0.75rem' }}>
          ✦ Virtual Fitting Room
        </p>
        <h1 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', color: '#1A0A00', marginBottom: '1rem', fontFamily: 'Playfair Display, serif' }}>
          Try Before You Buy
        </h1>
        <p style={{ color: '#7A5C4A', maxWidth: 500, margin: '0 auto', lineHeight: 1.8 }}>
          Our AI drapes the saree on your photo so you can see exactly how it looks on you — before ordering.
        </p>
      </div>

      {/* Photo Tips */}
      <div style={{
        background: 'linear-gradient(135deg, #FAF6F0, #F5EDE0)',
        border: '1px solid rgba(201,168,76,0.25)',
        padding: '1.75rem 2rem', marginBottom: '3rem'
      }}>
        <p style={{ fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '1.25rem', fontWeight: 600 }}>
          📸 For the best result — follow these photo tips
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.6rem' }}>
          {PHOTO_TIPS.map((tip, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
              <span style={{ fontSize: '1rem', flexShrink: 0, marginTop: '0.05rem' }}>{tip.icon}</span>
              <span style={{
                fontSize: '0.82rem', lineHeight: 1.5,
                color: tip.good ? '#2C1810' : '#9B4444'
              }}>
                {tip.text}
              </span>
            </div>
          ))}
        </div>
        <div style={{
          marginTop: '1.25rem', paddingTop: '1rem',
          borderTop: '1px solid rgba(201,168,76,0.2)',
          fontSize: '0.78rem', color: '#7A5C4A', lineHeight: 1.7
        }}>
          💡 <strong>Pro tip:</strong> The better your photo follows these tips, the more realistic and accurate the AI result will be. A clear, well-lit, full-body front-facing photo gives the best draping output.
        </div>
      </div>

      {/* Step 1 — Select Saree */}
      <h2 style={{ fontSize: '1rem', marginBottom: '1rem', color: '#1A0A00', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ color: '#C9A84C', fontFamily: 'Playfair Display, serif' }}>01</span> Select a Saree
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
        {sarees.filter(s => s.available).map(saree => (
          <div key={saree.id} onClick={() => setSelectedSaree(saree.id)} style={{
            cursor: 'pointer', border: '2px solid',
            borderColor: selectedSaree === saree.id ? '#C9A84C' : 'transparent',
            transition: 'border-color 0.2s', background: '#fff'
          }}>
            <div style={{ aspectRatio: '3/4', background: '#F0E4D0', overflow: 'hidden' }}>
              {saree.image_url
                ? <img src={saree.image_url} alt={saree.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>🥻</div>
              }
            </div>
            <div style={{ padding: '0.5rem', background: selectedSaree === saree.id ? 'rgba(201,168,76,0.08)' : 'transparent' }}>
              <p style={{ fontSize: '0.75rem', color: '#2C1810', marginBottom: '0.2rem' }}>{saree.name}</p>
              <p style={{ fontSize: '0.7rem', color: '#C9A84C' }}>₹{saree.price?.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Step 2 — Upload Photo */}
      <h2 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: '#1A0A00', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ color: '#C9A84C', fontFamily: 'Playfair Display, serif' }}>02</span> Upload Your Photo
      </h2>
      <p style={{ fontSize: '0.8rem', color: '#7A5C4A', marginBottom: '1.25rem', lineHeight: 1.6 }}>
        Stand straight, full body, facing the camera. Plain background. Good lighting. See tips above ↑
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: photoPreview ? '1fr 1fr' : '1fr', gap: '2rem', marginBottom: '2rem' }}>
        <label style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          border: '1px dashed rgba(201,168,76,0.4)', padding: '3rem 2rem',
          cursor: 'pointer', background: 'rgba(201,168,76,0.02)', minHeight: 220
        }}>
          <input type="file" accept="image/*" onChange={handlePhoto} style={{ display: 'none' }} />
          <span style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📷</span>
          <p style={{ color: '#7A5C4A', fontSize: '0.9rem', textAlign: 'center', lineHeight: 1.6 }}>
            {photoPreview ? 'Click to change photo' : 'Click to upload your photo'}
          </p>
          <p style={{ color: '#C9A84C', fontSize: '0.75rem', marginTop: '0.5rem', textAlign: 'center' }}>
            Full body · Front facing · Plain background
          </p>
        </label>
        {photoPreview && (
          <div style={{ aspectRatio: '3/4', overflow: 'hidden', background: '#F0E4D0', position: 'relative' }}>
            <img src={photoPreview} alt="Your photo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              background: 'linear-gradient(transparent, rgba(26,10,0,0.6))',
              padding: '1rem 0.75rem 0.75rem',
              fontSize: '0.7rem', color: 'rgba(255,255,255,0.8)', letterSpacing: '0.05em'
            }}>
              ✓ Your photo uploaded
            </div>
          </div>
        )}
      </div>

      {/* Generate Button */}
      {selectedSaree && photo && !result && (
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          {!loading && (
            <p style={{ fontSize: '0.8rem', color: '#7A5C4A', marginBottom: '1rem' }}>
              Ready to try on <strong style={{ color: '#C9A84C' }}>{selectedSareeData?.name}</strong>
            </p>
          )}
          <button onClick={handleTryOn} disabled={loading} style={{
            padding: '1rem 3rem', background: loading ? '#E8D5A3' : '#C9A84C',
            color: '#fff', border: 'none', fontSize: '0.85rem',
            letterSpacing: '0.1em', textTransform: 'uppercase',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}>
            {loading ? '✦ AI is working...' : '✦ Generate Try-On'}
          </button>
          {loading && (
            <div style={{ marginTop: '1.5rem' }}>
              <p style={{ color: '#7A5C4A', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                🪡 Draping the saree on your photo...
              </p>
              <p style={{ color: '#C9A84C', fontSize: '0.78rem' }}>
                This takes 1–3 minutes. Please don't close this page.
              </p>
            </div>
          )}
          {error && <p style={{ color: '#c0392b', fontSize: '0.85rem', marginTop: '1rem' }}>{error}</p>}
        </div>
      )}

      {/* Result */}
      {result && (
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: '#1A0A00', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <span style={{ color: '#C9A84C', fontFamily: 'Playfair Display, serif' }}>03</span> Your Look ✦
          </h2>
          <p style={{ fontSize: '0.8rem', color: '#7A5C4A', marginBottom: '1.5rem' }}>
            Here's how <strong style={{ color: '#C9A84C' }}>{selectedSareeData?.name}</strong> looks on you
          </p>
          <div style={{ maxWidth: 400, margin: '0 auto 2rem', aspectRatio: '3/4', overflow: 'hidden', background: '#F0E4D0' }}>
            <img src={result} alt="Try-on result" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {selectedSareeData && (
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP}?text=${encodeURIComponent(`Hi! I tried on the ${selectedSareeData.name} saree virtually and I love it! Is it available?`)}`}
                target="_blank" rel="noopener noreferrer"
                style={{
                  padding: '0.85rem 2rem', background: '#C9A84C', color: '#fff',
                  fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                  textDecoration: 'none'
                }}
              >
                💬 Order on WhatsApp
              </a>
            )}
            <button onClick={() => { setResult(null); setPhoto(null); setPhotoPreview(null); setSelectedSaree('') }} style={{
              padding: '0.85rem 2rem', background: 'transparent', color: '#7A5C4A',
              border: '1px solid rgba(201,168,76,0.3)', fontSize: '0.8rem',
              letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer'
            }}>
              Try Another
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function TryOn() {
  return (
    <Suspense fallback={<div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7A5C4A' }}>Loading...</div>}>
      <TryOnContent />
    </Suspense>
  )
}
