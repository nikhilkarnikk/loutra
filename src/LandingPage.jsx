import React, { useState } from 'react'
import { supabase } from './supabase'
import './App.css'

function LandingPage() {
  const [showEmailInput, setShowEmailInput] = useState(false)
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleJoinWaitlist = () => {
    setShowEmailInput(true)
  }

  const handleSubmitEmail = async (e) => {
    e.preventDefault()
    if (!email || isSubmitting) return

    setIsSubmitting(true)
    
    try {
      const { error } = await supabase
        .from('emails')
        .insert([{ email: email }])
      
      if (error) throw error
      
      setSubmitted(true)
      setEmail('')
    } catch (error) {
      console.error('Error submitting email:', error)
      alert('Error submitting email. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="app">
      <div className="hero-container">
        <div className="content-wrapper">
          <div className="logo-container">
            <img src="/loutralogo.png" alt="Loutra" className="logo" />
          </div>
          
          <div className="text-container">
            <p className="tagline">Inspired by Greece,</p>
            <p className="tagline italic">powered by nature.</p>
          </div>
          
          <div className="waitlist-container">
            {!showEmailInput ? (
              <button 
                className="join-waitlist-btn" 
                onClick={handleJoinWaitlist}
              >
                Join Waitlist
              </button>
            ) : submitted ? (
              <div className="success-message">
                <p>Thank you for joining our waitlist!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitEmail} className="email-form">
                <div className="email-input-container">
                  <input
                    type="email"
                    placeholder="Your Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="email-input"
                    required
                    autoFocus
                    autoComplete="new-email"
                  />
                  {email && (
                    <button 
                      type="submit" 
                      className="submit-arrow"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? '...' : '→'}
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingPage 