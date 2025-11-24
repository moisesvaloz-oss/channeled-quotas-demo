import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

export default function Checkout() {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('mvaloz@feverup.com');
  const [firstName, setFirstName] = useState('Gabriel');
  const [lastName, setLastName] = useState('Williams');
  const [includeDeliveryNote, setIncludeDeliveryNote] = useState(false);
  const [acceptContact, setAcceptContact] = useState(true);
  const [overridePrice, setOverridePrice] = useState(false);

  // Mock cart data
  const cartItems = [
    {
      date: '8 Aug 2026 - 09:00',
      ticket: 'Grounds Pass | Friday (August 8)',
      quantity: 1,
      price: 45.00,
      bookingFee: 0.00
    }
  ];

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="h-screen flex flex-col bg-neutral-50">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 overflow-auto flex flex-col">
          {/* Hero Section */}
          <div className="bg-background-contrast px-8 py-6">
            <div className="mb-4">
              <button
                onClick={() => navigate('/reservations/create/tickets')}
                className="text-white hover:underline text-sm font-semibold"
              >
                Go Back to list
              </button>
            </div>
            <h1 className="text-2xl font-bold text-white">Make a reservation</h1>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-8">
            <div className="max-w-[1400px] mx-auto">
              <div className="flex gap-8 flex-col lg:flex-row">
                {/* Left Column - Cart */}
                <div className="flex-1">
                  {/* Event Card */}
                  <div className="bg-white rounded-lg border border-border-main p-6 mb-6">
                    <div className="flex gap-4">
                      <img 
                        src="/api/placeholder/80/80" 
                        alt="Event"
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h2 className="text-lg font-semibold text-text-main mb-2">
                          LIV Golf Chicago 2026
                        </h2>
                        <div className="flex items-center gap-2 text-sm text-text-subtle">
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="flex-shrink-0">
                            <path d="M6 1C3.24 1 1 3.24 1 6C1 8.76 3.24 11 6 11C8.76 11 11 8.76 11 6C11 3.24 8.76 1 6 1Z" stroke="currentColor" strokeWidth="1.5"/>
                            <path d="M6 3V6L8 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                          </svg>
                          <span>Chicago - 2001 Rodeo Drive, Bolingbrook</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cart Section */}
                  <div className="bg-white rounded-lg border border-border-main p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold text-text-main">Cart</h2>
                      <button className="text-primary-active text-sm font-semibold hover:underline">
                        Clear all
                      </button>
                    </div>

                    {/* Cart Items */}
                    {cartItems.map((item, index) => (
                      <div key={index} className="mb-6">
                        <div className="text-sm font-semibold text-text-main mb-3">
                          {item.date}
                        </div>
                        
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="text-sm text-text-main mb-1">
                              {item.quantity}x &nbsp; {item.ticket}
                            </div>
                            <div className="text-xs text-text-subtle">
                              Booking fee per ticket: ${item.bookingFee.toFixed(2)}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <div className="text-base font-semibold text-text-main">
                              ${item.price.toFixed(2)}
                            </div>
                            <div className="text-xs text-text-subtle">
                              ${item.bookingFee.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Override Booking Price */}
                    <div className="border-t border-border-main pt-6 mb-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-text-subtle">
                            <path d="M8 1L9 5H13L10 8L11 12L8 10L5 12L6 8L3 5H7L8 1Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                          </svg>
                          <div>
                            <div className="text-sm font-semibold text-text-main">
                              Override booking price
                            </div>
                            <div className="text-xs text-text-subtle">
                              Set a custom internal value for this booking.
                            </div>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={overridePrice}
                            onChange={(e) => setOverridePrice(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-neutral-100 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border-main after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-action-primary"></div>
                        </label>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="border-t border-border-main pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-base font-semibold text-text-main">Total</span>
                        <span className="text-base font-semibold text-text-main">${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Contact Information */}
                <div className="w-full lg:w-[480px] flex-none">
                  <div className="bg-white rounded-lg border border-border-main p-6">
                    <h2 className="text-xl font-semibold text-text-main mb-6">
                      Contact information
                    </h2>

                    {/* Email Input */}
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-text-main mb-2">
                        Email <span className="text-status-danger">*</span>
                      </label>
                      <div className="text-xs text-text-subtle mb-2">
                        Mandatory if tickets are bought for a future date.
                      </div>
                      <div className="relative">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter email"
                          className={`w-full h-14 px-3 rounded-lg border border-border-main text-base placeholder:text-background-subtle-medium focus:outline-none focus:border-primary-main focus:ring-1 focus:ring-primary-main ${
                            email ? 'pt-4' : ''
                          }`}
                        />
                        {email && (
                          <label className="absolute top-2 left-3 text-xs font-semibold text-text-subtle pointer-events-none">
                            Enter email
                          </label>
                        )}
                      </div>
                    </div>

                    {/* First Name Input */}
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-text-main mb-2">
                        First name <span className="text-text-subtle text-xs font-normal">Optional</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="Enter first name"
                          className={`w-full h-14 px-3 rounded-lg border border-border-main text-base placeholder:text-background-subtle-medium focus:outline-none focus:border-primary-main focus:ring-1 focus:ring-primary-main ${
                            firstName ? 'pt-4' : ''
                          }`}
                        />
                        {firstName && (
                          <label className="absolute top-2 left-3 text-xs font-semibold text-text-subtle pointer-events-none">
                            Enter first name
                          </label>
                        )}
                      </div>
                    </div>

                    {/* Last Name Input */}
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-text-main mb-2">
                        Last name <span className="text-text-subtle text-xs font-normal">Optional</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Enter last name"
                          className={`w-full h-14 px-3 rounded-lg border border-border-main text-base placeholder:text-background-subtle-medium focus:outline-none focus:border-primary-main focus:ring-1 focus:ring-primary-main ${
                            lastName ? 'pt-4' : ''
                          }`}
                        />
                        {lastName && (
                          <label className="absolute top-2 left-3 text-xs font-semibold text-text-subtle pointer-events-none">
                            Enter last name
                          </label>
                        )}
                      </div>
                    </div>

                    {/* Checkboxes */}
                    <div className="space-y-4 mb-6">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <div className="relative flex items-center justify-center w-5 h-5 mt-0.5">
                          <input
                            type="checkbox"
                            checked={includeDeliveryNote}
                            onChange={(e) => setIncludeDeliveryNote(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className={`w-5 h-5 border-2 rounded flex items-center justify-center ${
                            includeDeliveryNote 
                              ? 'bg-primary-main border-primary-main' 
                              : 'bg-white border-border-main'
                          }`}>
                            {includeDeliveryNote && (
                              <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                                <path 
                                  d="M1 5L4.5 8.5L11 1.5" 
                                  stroke="white" 
                                  strokeWidth="2" 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                          </div>
                        </div>
                        <span className="text-sm text-text-main">
                          Include the delivery note as an attachment in the business email confirmation.
                        </span>
                      </label>

                      <label className="flex items-start gap-3 cursor-pointer">
                        <div className="relative flex items-center justify-center w-5 h-5 mt-0.5">
                          <input
                            type="checkbox"
                            checked={acceptContact}
                            onChange={(e) => setAcceptContact(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className={`w-5 h-5 border-2 rounded flex items-center justify-center ${
                            acceptContact 
                              ? 'bg-primary-main border-primary-main' 
                              : 'bg-white border-border-main'
                          }`}>
                            {acceptContact && (
                              <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                                <path 
                                  d="M1 5L4.5 8.5L11 1.5" 
                                  stroke="white" 
                                  strokeWidth="2" 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                          </div>
                        </div>
                        <span className="text-sm text-text-main">
                          I accept to be contacted for operational issues, to be provided access to digital tickets via the Fever app and to receive a satisfaction survey.
                        </span>
                      </label>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                      <button
                        onClick={() => navigate('/reservations/create/tickets')}
                        className="flex-1 h-12 rounded-full border-2 border-action-primary text-action-primary font-semibold hover:bg-action-primary hover:text-white transition-colors"
                      >
                        Back
                      </button>
                      <button
                        onClick={() => {
                          // Handle continue action
                          alert('Reservation completed!');
                        }}
                        className="flex-1 h-12 rounded-full bg-action-primary text-white font-semibold hover:bg-action-primary-hover transition-colors"
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Footer />
        </main>
      </div>
    </div>
  );
}

