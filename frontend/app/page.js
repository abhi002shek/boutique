'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const OCCASIONS = ['All', 'Wedding', 'Festival', 'Casual', 'Office', 'Party']

export default function Home() {
  const [sarees, setSarees] = useState([])
  const [loading, setLoading] = useState(true)
  const [occasion, setOccasion] = useState('All')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/sarees/`)
      .then(r => r.json())
      .then(data => { setSarees(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = sarees.filter(s => {
    const matchOccasion = occasion === 'All' || s.occasion === occasion
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase())
    return matchOccasion && matchSearch
  })

  return (
    <>
      {/* Hero */}
      <section style={{
        minHeight: '90vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center',
        padding: '4rem 2rem', position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(160deg, #FAF6F0 0%, #F0E4D0 50%, #FAF6F0 100%)'
      }}>
        <div style={{ position: 'absolute', top: '10%', left: '5%', width: 300, height: 300, borderRadius: '50%', border: '1px solid rgba(201,168,76,0.1)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: 200, height: 200, borderRadius: '50%', border: '1px solid rgba(201,168,76,0.15)', pointerEvents: 'none' }} />

        <p style={{ fontSize: '0.75rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '1.5rem' }}>
          ✦ Handpicked Collection ✦
        </p>
        <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', lineHeight: 1.1, color: '#1A0A00', marginBottom: '1.5rem', maxWidth: 700 }}>
          Trisha Fancy Sarees<br />
          <em style={{ color: '#C9A84C' }}>crafted for you</em>
        </h1>
        <p style={{ fontSize: '1.05rem', color: '#7A5C4A', maxWidth: 480, lineHeight: 1.7, marginBottom: '2.5rem' }}>
          Browse our curated saree collection and see how each one looks on you with our virtual try-on.
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <a href="#collection" style={{
            background: '#C9A84C', color: '#fff', padding: '0.85rem 2rem',
            fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase',
            border: 'none', cursor: 'pointer'
          }}>
            Browse Collection
          </a>
          <Link href="/tryon" style={{
            background: 'transparent', color: '#C9A84C', padding: '0.85rem 2rem',
            fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase',
            border: '1px solid rgba(201,168,76,0.4)'
          }}>
            Virtual Try-On
          </Link>
        </div>
      </section>

      {/* Collection */}
      <section id="collection" style={{ padding: '5rem 2rem', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p style={{ fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '0.75rem' }}>Our Sarees</p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', color: '#1A0A00' }}>The Collection</h2>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem', alignItems: 'center' }}>
          <input
            type="text" placeholder="Search sarees..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{
              padding: '0.6rem 1rem', border: '1px solid rgba(201,168,76,0.3)',
              background: 'transparent', fontSize: '0.9rem', color: '#2C1810',
              flex: '1', minWidth: 180
            }}
          />
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {OCCASIONS.map(o => (
              <button key={o} onClick={() => setOccasion(o)} style={{
                padding: '0.5rem 1rem', fontSize: '0.8rem', letterSpacing: '0.05em',
                border: '1px solid', transition: 'all 0.2s', cursor: 'pointer',
                borderColor: occasion === o ? '#C9A84C' : 'rgba(201,168,76,0.25)',
                background: occasion === o ? '#C9A84C' : 'transparent',
                color: occasion === o ? '#fff' : '#7A5C4A'
              }}>{o}</button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#7A5C4A' }}>
            Loading collection...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#7A5C4A' }}>
            No sarees found. Try a different filter.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
            {filtered.map(saree => (
              <SareeCard key={saree.id} saree={saree} />
            ))}
          </div>
        )}
      </section>
    </>
  )
}

function SareeCard({ saree }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: 'pointer', transition: 'transform 0.3s', transform: hovered ? 'translateY(-4px)' : 'none' }}
    >
      <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', background: '#F0E4D0', marginBottom: '1rem' }}>
        {saree.image_url ? (
          <img src={saree.image_url} alt={saree.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s', transform: hovered ? 'scale(1.04)' : 'scale(1)' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C9A84C', fontSize: '3rem' }}>
            🥻
          </div>
        )}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          background: 'linear-gradient(transparent, rgba(26,10,0,0.7))',
          padding: '2rem 1rem 1rem',
          opacity: hovered ? 1 : 0, transition: 'opacity 0.3s',
          display: 'flex', gap: '0.5rem'
        }}>
          <Link href={`/saree/${saree.id}`} style={{
            flex: 1, textAlign: 'center', padding: '0.6rem',
            background: '#C9A84C', color: '#fff',
            fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase'
          }}>
            View Details
          </Link>
          <Link href={`/tryon?saree=${saree.id}`} style={{
            flex: 1, textAlign: 'center', padding: '0.6rem',
            background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)',
            color: '#fff', border: '1px solid rgba(255,255,255,0.3)',
            fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase'
          }}>
            Try On
          </Link>
        </div>
        {!saree.available && (
          <div style={{
            position: 'absolute', top: '1rem', right: '1rem',
            background: 'rgba(26,10,0,0.7)', color: '#E8D5A3',
            padding: '0.3rem 0.75rem', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase'
          }}>
            Sold
          </div>
        )}
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.3rem' }}>
          <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.05rem', fontWeight: 400, color: '#1A0A00', flex: 1 }}>
            {saree.name}
          </h3>
          <span style={{ fontSize: '1rem', color: '#C9A84C', fontWeight: 500, marginLeft: '1rem', whiteSpace: 'nowrap' }}>
            ₹{saree.price?.toLocaleString()}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', color: '#7A5C4A' }}>{saree.fabric}</span>
          <span style={{ color: 'rgba(201,168,76,0.4)' }}>·</span>
          <span style={{ fontSize: '0.75rem', color: '#7A5C4A' }}>{saree.occasion}</span>
        </div>
      </div>
    </div>
  )
}
