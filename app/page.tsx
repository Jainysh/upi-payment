'use client'

import { useState, FormEvent, ChangeEvent } from 'react';
import './styles.css';

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    mobile: ''
  })
  const [errors, setErrors] = useState({
    name: false,
    mobile: false
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    
    if (name === 'mobile') {
      // Only allow numbers and limit to 10 digits
      const numericValue = value.replace(/[^0-9]/g, '').slice(0, 10)
      setFormData(prev => ({ ...prev, [name]: numericValue }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }

    // Clear error when user starts typing
    setErrors(prev => ({ ...prev, [name]: false }))
  }

  const validateName = (): boolean => {
    const isValid = formData.name.trim().length >= 2
    setErrors(prev => ({ ...prev, name: !isValid }))
    return isValid
  }

  const validateMobile = (): boolean => {
    const mobilePattern = /^[0-9]{10}$/
    const isValid = mobilePattern.test(formData.mobile)
    setErrors(prev => ({ ...prev, mobile: !isValid }))
    return isValid
  }

  const generateUPIUrl = (name: string, mobile: string): string => {
    const payee = 'yyert@okupi'
    const amount = '500'
    const description = `${name}-${mobile}`
    
    return `upi://pay?pa=${payee}&am=${amount}&tn=${encodeURIComponent(description)}&cu=INR`
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const isNameValid = validateName()
    const isMobileValid = validateMobile()

    if (!isNameValid || !isMobileValid) {
      return
    }

    setIsLoading(true)

    try {
      const upiUrl = generateUPIUrl(formData.name.trim(), formData.mobile.trim())
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Try to open UPI app
      window.location.href = upiUrl
      
    } catch (error) {
      console.error('Payment initiation failed:', error)
    } finally {
      setTimeout(() => {
        setIsLoading(false)
      }, 2000)
    }
  }

  const handlePayment = (e: FormEvent) => {
     e.preventDefault();

                const isNameValid = validateName();
                const isMobileValid = validateMobile();

                if (!isNameValid || !isMobileValid) {
                    return;
                }

                // Show loading state
                setIsLoading(true)
                

                // Create UPI payment URL
                const upiUrl = generateUPIUrl(formData.name.trim(), formData.mobile.trim());

                // Simulate processing time
                setTimeout(() => {
                    // Try to open UPI app
                    window.location.href = upiUrl;

                    // Reset button after attempting to open UPI app
                    setTimeout(() => {
                        setIsLoading(false);
                    }, 2000);
                }, 1000);
  }



  return (
    <div className="container">
        <div className="header">
            <h1>💳 UPI Payment</h1>
            <p>Enter your details to proceed with payment</p>
        </div>

        <div className="payment-info">
            <div className="payment-amount">₹500</div>
            <div className="payment-to">Paying to: yjain2025@okaxis</div>
        </div>

        <form id="paymentForm">
            <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input onChange={handleInputChange} type="text" id="name" name="name" required placeholder="Enter your full name" />
                <div className="error" id="nameError">Please enter your name</div>
            </div>

            <div className="form-group">
                <label htmlFor="mobile">Mobile Number *</label>
                <input onChange={handleInputChange} type="tel" id="mobile" name="mobile" required placeholder="Enter your 10-digit mobile number" pattern="[0-9]{10}" maxLength="10" />
                <div className="error" id="mobileError">Please enter a valid 10-digit mobile number</div>
            </div>

            <button disabled={isLoading}  onClick={handlePayment} className="pay-button" id="payButton">
                <span className="button-text">Pay Now with UPI</span>
                <div className="loading" id="loading"></div>
            </button>
        </form>

        <div className="upi-apps">
            <p>Supports all major UPI apps</p>
            <div className="app-icons">
                <div className="app-icon">GPay</div>
                <div className="app-icon">PhonePe</div>
                <div className="app-icon">Paytm</div>
                <div className="app-icon">BHIM</div>
                <div className="app-icon">Amazon</div>
            </div>
        </div>
    </div>
  )
}