'use client'
import { useState } from 'react'

const API = process.env.NEXT_PUBLIC_API_URL
const OCCASIONS = ['Wedding', 'Festival', 'Casual', 'Office', 'Party']

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)
  const [loginError, setLoginError] = useState('')

  const [form, setForm] = useState({
    name: '', fabric: '', occasion: 'Wedding',
    price: '', colors: '', description: '', care: 'Dry clean only', available: true
  })
  const [images, setImages] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState(null)
  const [sarees, setSarees] = useState([])
  const [loadingSarees, setLoadingSarees] = useState(false)

  const handleLogin = async () => {
    setLoginError('')
    try {
      const res = await fetch(`${API}/sarees/`)
      if (res.ok) {
        setLoggedIn(true)
        loadSarees()
      }
    } catch {
      setLoggedIn(true)
      loadSarees()
    }
  }

  const loadSarees = async () => {
    setLoadingSarees(true)
    try {
      const res = await fetch(`${API}/sarees/`)
      const data = await res.json()
      setSarees(data)
    } catch {}
    setLoadingSarees(false)
  }

  const handleImages = (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    setImages(files)
    setImagePreviews(files.map(f => URL.createObjectURL(f)))
  }

  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.fabric || !images.length) {
      setError('Please fill all required fields and upload at least one image.')
      return
    }
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const formData = new FormData()
      Object.entries(form).forEach(([k, v]) => formData.append(k, v))
      images.forEach(img => formData.append('images', img))

      const res = await fetch(`${API}/admin/sarees`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${password}` },
        body: formData
      })

      if (res.status === 401) {
        setError('Wrong password.')
        return
      }

      if (!res.ok) {
        const err = await res.json()
        setError(err.detail || 'Something went wrong.')
        return
      }

      setSuccess('Saree added successfully!')
      setForm({ name: '', fabric: '', occasion: 'Wedding', price: '', colors: '', description: '', care: 'Dry clean only', available: true })
      setImages([])
      setImagePreviews([])
      loadSarees()
    } catch {
      setError('Failed to add saree. Check your connection.')
    }
    setLoading(false)
  }

  const toggleAvailable = async (saree) => {
    try {
      const formData = new FormData()
      formData.append('available', !saree.available)
      await fetch(`${API}/admin/sarees/${saree.id}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${password}` },
        body: formData
      })
      loadSarees()
    } catch {}
  }

  const deleteSaree = async (id) => {
    if (!confirm('Delete this saree?')) return
    try {
      await fetch(`${API}/admin/sarees/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${password}` }
      })
      loadSarees()
    } catch {}
  }

  if (!loggedIn) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAF6F0' }}>
      <div style={{ background: '#fff', padding: '3rem', border: '1px solid rgba(201,168,76,0.2)', width: 360, textAlign: 'center' }}>
        <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', color: '#C9A84C', marginBottom: '0.5rem' }}>✦ Trisha Admin</p>
        <p style={{ color: '#7A5C4A', fontSize: '0.85rem', marginBottom: '2rem' }}>Enter your admin password</p>
        <input
          type="password" placeholder="Password"
          value={password} onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
          style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid rgba(201,168,76,0.3)', marginBottom: '1rem', fontSize: '0.9rem', background: 'transparent' }}
        />
        {loginError && <p style={{ color: '#c0392b', fontSize: '0.8rem', marginBottom: '1rem' }}>{loginError}</p>}
        <button onClick={handleLogin} style={{
          width: '100%', padding: '0.85rem', background: '#C9A84C', color: '#fff',
          border: 'none', fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer'
        }}>Login</button>
      </div>
    </div>
  )

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '3rem 2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', color: '#C9A84C' }}>✦ Trisha Admin</p>
          <p style={{ color: '#7A5C4A', fontSize: '0.85rem' }}>Manage your saree collection</p>
        </div>
        <a href="/" style={{ fontSize: '0.8rem', color: '#7A5C4A', letterSpacing: '0.08em', textTransform: 'uppercase' }}>← View Website</a>
      </div>

      {/* Add saree form */}
      <div style={{ background: '#fff', border: '1px solid rgba(201,168,76,0.15)', padding: '2rem', marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.1rem', color: '#1A0A00', marginBottom: '1.5rem', fontFamily: 'Playfair Display, serif' }}>Add New Saree</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={labelStyle}>Saree Name *</label>
            <input style={inputStyle} placeholder="e.g. Royal Blue Banarasi" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          </div>
          <div>
            <label style={labelStyle}>Price (₹) *</label>
            <input style={inputStyle} type="number" placeholder="e.g. 4500" value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
          </div>
          <div>
            <label style={labelStyle}>Fabric * (type freely)</label>
            <input style={inputStyle} placeholder="e.g. Pure Banarasi Silk, Soft Cotton..." value={form.fabric} onChange={e => setForm({...form, fabric: e.target.value})} />
          </div>
          <div>
            <label style={labelStyle}>Occasion *</label>
            <select style={inputStyle} value={form.occasion} onChange={e => setForm({...form, occasion: e.target.value})}>
              {OCCASIONS.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Colors</label>
            <input style={inputStyle} placeholder="e.g. Blue, Gold" value={form.colors} onChange={e => setForm({...form, colors: e.target.value})} />
          </div>
          <div>
            <label style={labelStyle}>Care Instructions</label>
            <input style={inputStyle} value={form.care} onChange={e => setForm({...form, care: e.target.value})} />
          </div>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={labelStyle}>Description</label>
          <textarea style={{...inputStyle, height: 80, resize: 'vertical'}} placeholder="Describe the saree..." value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={labelStyle}>Saree Photos * (can select multiple)</label>
          <label style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            border: '1px dashed rgba(201,168,76,0.4)', padding: '2rem', cursor: 'pointer',
            background: 'rgba(201,168,76,0.02)', marginBottom: '1rem'
          }}>
            <input type="file" accept="image/*" multiple onChange={handleImages} style={{ display: 'none' }} />
            <span style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📸</span>
            <span style={{ fontSize: '0.8rem', color: '#7A5C4A' }}>
              {imagePreviews.length ? `${imagePreviews.length} photo(s) selected — click to change` : 'Click to upload saree photos'}
            </span>
            <span style={{ fontSize: '0.75rem', color: '#C9A84C', marginTop: '0.3rem' }}>You can select multiple photos at once</span>
          </label>
          {imagePreviews.length > 0 && (
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {imagePreviews.map((src, i) => (
                <div key={i} style={{ position: 'relative' }}>
                  <div style={{ width: 90, height: 120, overflow: 'hidden', border: i === 0 ? '2px solid #C9A84C' : '1px solid rgba(201,168,76,0.2)' }}>
                    <img src={src} alt={`Preview ${i+1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  {i === 0 && <span style={{ fontSize: '0.6rem', color: '#C9A84C', display: 'block', textAlign: 'center', marginTop: '0.2rem' }}>Main photo</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        {error && <p style={{ color: '#c0392b', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</p>}
        {success && <p style={{ color: '#27ae60', fontSize: '0.85rem', marginBottom: '1rem' }}>{success}</p>}

        <button onClick={handleSubmit} disabled={loading} style={{
          padding: '0.85rem 2.5rem', background: loading ? '#E8D5A3' : '#C9A84C',
          color: '#fff', border: 'none', fontSize: '0.85rem',
          letterSpacing: '0.1em', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer'
        }}>
          {loading ? 'Uploading...' : '✦ Add Saree'}
        </button>
      </div>

      {/* Existing sarees */}
      <div>
        <h2 style={{ fontSize: '1.1rem', color: '#1A0A00', marginBottom: '1.5rem', fontFamily: 'Playfair Display, serif' }}>
          Your Collection ({sarees.length} sarees)
        </h2>
        {loadingSarees ? (
          <p style={{ color: '#7A5C4A' }}>Loading...</p>
        ) : sarees.length === 0 ? (
          <p style={{ color: '#7A5C4A', textAlign: 'center', padding: '2rem' }}>No sarees yet. Add your first one above!</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {sarees.map(saree => (
              <div key={saree.id} style={{
                display: 'flex', gap: '1rem', alignItems: 'center',
                padding: '1rem', background: '#fff', border: '1px solid rgba(201,168,76,0.15)'
              }}>
                <div style={{ width: 60, height: 80, overflow: 'hidden', background: '#F0E4D0', flexShrink: 0 }}>
                  {saree.image_url
                    ? <img src={saree.image_url} alt={saree.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🥻</div>
                  }
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 500, color: '#1A0A00', marginBottom: '0.2rem' }}>{saree.name}</p>
                  <p style={{ fontSize: '0.8rem', color: '#7A5C4A' }}>{saree.fabric} · {saree.occasion} · ₹{saree.price?.toLocaleString()}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <button onClick={() => toggleAvailable(saree)} style={{
                    padding: '0.4rem 0.75rem', fontSize: '0.75rem', border: '1px solid',
                    cursor: 'pointer', letterSpacing: '0.05em',
                    borderColor: saree.available ? '#27ae60' : '#e74c3c',
                    color: saree.available ? '#27ae60' : '#e74c3c',
                    background: 'transparent'
                  }}>
                    {saree.available ? 'In Stock' : 'Sold'}
                  </button>
                  <button onClick={() => deleteSaree(saree.id)} style={{
                    padding: '0.4rem 0.75rem', fontSize: '0.75rem',
                    border: '1px solid rgba(231,76,60,0.3)', color: '#e74c3c',
                    background: 'transparent', cursor: 'pointer'
                  }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const labelStyle = {
  display: 'block', fontSize: '0.75rem', color: '#7A5C4A',
  letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.4rem'
}

const inputStyle = {
  width: '100%', padding: '0.65rem 0.85rem',
  border: '1px solid rgba(201,168,76,0.25)', fontSize: '0.9rem',
  background: 'transparent', color: '#2C1810', display: 'block'
}
