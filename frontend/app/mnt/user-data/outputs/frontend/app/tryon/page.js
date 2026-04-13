'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

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
  const [step, setStep] = useState(1)

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/sarees`)
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

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tryon`, {
        method: 'POST',
        body: formData
      })

      if (!res.ok) throw new Error('Try-on failed')
      const data = await res.json()
      setResult(data.result_url)
      setStep(3)
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const selectedSareeData = sarees.find(s => s.id === selectedSaree)

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '3rem 2rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <p style={{ fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '0.75rem' }}>Virtual Fitting Room</p>
        <h1 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', color: '#1A0A00', marginBottom: '1rem' }}>Try Before You Buy</h1>
        <p style={{ color: '#7A5C4A', maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
          Upload your photo, select a saree, and see how it looks on you. It takes about 30–60 seconds.
        </p>
      </div>

      {/* Steps indicator */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '3rem', gap: '0' }}>
        {['Select Saree', 'Upload Photo', 'See Result'].map((label, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', cursor: 'pointer'
            }} onClick={() => i < step && setStep(i + 1)}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', border: '1px solid',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.8rem', fontWeight: 500,
                borderColor: step >= i + 1 ? '#C9A84C' : 'rgba(201,168,76,0.3)',
                background: step === i + 1 ? '#C9A84C' : step > i + 1 ? 'rgba(201,168,76,0.1)' : 'transparent',
                color: step === i + 1 ? '#fff' : step > i + 1 ? '#C9A84C' : '#7A5C4A'
              }}>{i + 1}</div>
              <span style={{ fontSize: '0.7rem', letterSpacing: '0.05em', textTransform: 'uppercase', color: step >= i + 1 ? '#C9A84C' : '#7A5C4A', whiteSpace: 'nowrap' }}>{label}</span>
            </div>
            {i < 2 && <div style={{ width: 60, height: 1, background: step > i + 1 ? '#C9A84C' : 'rgba(201,168,76,0.2)', margin: '0 0.5rem', marginBottom: '1.5rem' }} />}
          </div>
        ))}
      </div>

      {/* Step 1 — Select Saree */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: '#1A0A00', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ color: '#C9A84C' }}>01</span> Select a Saree
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem' }}>
          {sarees.filter(s => s.available).map(saree => (
            <div key={saree.id} onClick={() => { setSelectedSaree(saree.id); setStep(Math.max(step, 2)) }} style={{
              cursor: 'pointer', border: '2px solid',
              borderColor: selectedSaree === saree.id ? '#C9A84C' : 'transparent',
              transition: 'border-color 0.2s'
            }}>
              <div style={{ aspectRatio: '3/4', background: '#F0E4D0', overflow: 'hidden' }}>
                {saree.image_url ? (
                  <img src={saree.image_url} alt={saree.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>🥻</div>
                )}
              </div>
              <div style={{ padding: '0.5rem', background: selectedSaree === saree.id ? 'rgba(201,168,76,0.08)' : 'transparent' }}>
                <p style={{ fontSize: '0.75rem', color: '#2C1810', lineHeight: 1.3, marginBottom: '0.2rem' }}>{saree.name}</p>
                <p style={{ fontSize: '0.7rem', color: '#C9A84C' }}>₹{saree.price?.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step 2 — Upload Photo */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: '#1A0A00', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ color: '#C9A84C' }}>02</span> Upload Your Photo
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: photoPreview ? '1fr 1fr' : '1fr', gap: '2rem', alignItems: 'start' }}>
          <label style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            border: '1px dashed rgba(201,168,76,0.4)', padding: '3rem 2rem',
            cursor: 'pointer', transition: 'border-color 0.2s', background: 'rgba(201,168,76,0.02)',
            minHeight: 200
          }}>
            <input type="file" accept="image/*" onChange={handlePhoto} style={{ display: 'none' }} />
            <span style={{ fontSize: '2rem', marginBottom: '1rem' }}>📷</span>
            <p style={{ color: '#7A5C4A', fontSize: '0.9rem', textAlign: 'center', lineHeight: 1.6 }}>
              {photoPreview ? 'Click to change photo' : 'Click to upload your photo'}
            </p>
            <p style={{ color: '#C9A84C', fontSize: '0.75rem', marginTop: '0.5rem' }}>JPG, PNG · Full body works best</p>
          </label>

          {photoPreview && (
            <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', background: '#F0E4D0' }}>
              <img src={photoPreview} alt="Your photo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
        </div>
      </div>

      {/* Generate button */}
      {selectedSaree && photo && !result && (
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <button onClick={handleTryOn} disabled={loading} style={{
            padding: '1rem 3rem', background: loading ? '#E8D5A3' : '#C9A84C',
            color: '#fff', border: 'none', fontSize: '0.85rem',
            letterSpacing: '0.1em', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s'
          }}>
            {loading ? '✦ Processing... (30–60 sec)' : '✦ Generate Try-On'}
          </button>
          {loading && <p style={{ color: '#7A5C4A', fontSize: '0.8rem', marginTop: '1rem' }}>
            Our AI is draping the saree on your photo. Please wait...
          </p>}
          {error && <p style={{ color: '#c0392b', fontSize: '0.85rem', marginTop: '1rem' }}>{error}</p>}
        </div>
      )}

      {/* Step 3 — Result */}
      {result && (
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: '#1A0A00', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <span style={{ color: '#C9A84C' }}>03</span> Your Look ✦
          </h2>
          <div style={{ maxWidth: 400, margin: '0 auto 2rem', aspectRatio: '3/4', overflow: 'hidden', background: '#F0E4D0' }}>
            <img src={result} alt="Try-on result" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {selectedSareeData && (
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP}?text=${encodeURIComponent(`Hi! I tried on "${selectedSareeData.name}" virtually and I love it! Is it available?`)}`}
                target="_blank" rel="noopener noreferrer"
                style={{
                  padding: '0.85rem 2rem', background: '#C9A84C', color: '#fff',
                  fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase'
                }}
              >
                Order on WhatsApp
              </a>
            )}
            <button onClick={() => { setResult(null); setStep(1) }} style={{
              padding: '0.85rem 2rem', background: 'transparent', color: '#7A5C4A',
              border: '1px solid rgba(201,168,76,0.3)', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase'
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
