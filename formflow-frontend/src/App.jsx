import React, { useEffect, useRef, useState } from 'react';

function App() {
  const nameRef = useRef(null)
  const emailRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (nameRef.current) nameRef.current.value = params.get('name') || ''
    if (emailRef.current) emailRef.current.value = params.get('email') || ''
  }, [])

  const handleSubmit = async (e) => {
  e.preventDefault()
  setError(null)
  if (!nameRef.current.value || !emailRef.current.value) {
    setError('Name and Email are required')
    return
  }
    setLoading(true)
    try {
      const data = {
        name: nameRef.current.value,
        email: emailRef.current.value,
      }
      const res = await fetch('http://localhost:3000/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Network response was not ok')
      const result = await res.json()
      alert('Submitted! ' + JSON.stringify(result))
    } catch (err) {
      setError('Submission error: ' + err.message)
      alert('Submission error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input ref={nameRef} placeholder="Name" />
        <input ref={emailRef} placeholder="Email" />
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Submit'}
        </button>
      </form>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <a
        href="https://form.typeform.com/to/Sr4cPuZy?utm_source=google&utm_medium=cpc&utm_campaign=summer_sale&utm_term=form&utm_content=ad1&first_name=Jane&last_name=Doe&email=jane@example.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        Fill Out Our Demo Form
      </a>
    </div>
  )
}

export default App