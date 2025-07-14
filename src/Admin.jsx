import React, { useState, useEffect } from 'react'
import { supabase } from './supabase'
import './Admin.css'

function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [emails, setEmails] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isAuthenticated) {
      fetchEmails()
    }
  }, [isAuthenticated])

  const handleLogin = (e) => {
    e.preventDefault()
    if (password === 'depoy123') {
      setIsAuthenticated(true)
      setError('')
    } else {
      setError('Invalid password')
    }
  }

  const fetchEmails = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('emails')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setEmails(data)
    } catch (error) {
      console.error('Error fetching emails:', error)
      setError('Failed to fetch emails')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!isAuthenticated) {
    return (
      <div className="admin-container">
        <div className="admin-content">
          <div className="login-form">
            <h2>Admin Login</h2>
            <form onSubmit={handleLogin}>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="password-input"
                required
              />
              <button type="submit" className="login-btn">
                Login
              </button>
            </form>
            {error && <p className="error-message">{error}</p>}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-container">
      <div className="admin-content">
        <div className="admin-header">
          <h1>Loutra Admin</h1>
          <p>Email Waitlist ({emails.length} subscribers)</p>
        </div>
        
        {loading ? (
          <div className="loading">Loading emails...</div>
        ) : (
          <div className="emails-list">
            {emails.length === 0 ? (
              <p className="no-emails">No emails yet</p>
            ) : (
              <div className="emails-grid">
                {emails.map((email) => (
                  <div key={email.id} className="email-card">
                    <div className="email-address">{email.email}</div>
                    <div className="email-date">{formatDate(email.created_at)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        <button 
          className="refresh-btn"
          onClick={fetchEmails}
          disabled={loading}
        >
          Refresh
        </button>
      </div>
    </div>
  )
}

export default Admin 