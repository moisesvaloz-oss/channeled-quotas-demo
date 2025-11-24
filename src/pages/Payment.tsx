import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { useCartStore } from '../stores/cartStore';

export default function Payment() {
  const navigate = useNavigate();
  const { items: cartItems, getTotal, clearCart } = useCartStore();
  
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('bank-card');
  const [cardNumber, setCardNumber] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const total = getTotal();
  const bookingFees = cartItems.reduce((sum, item) => sum + (item.bookingFee * item.quantity), 0);
  const totalWithFees = total + bookingFees;

  const handlePayment = () => {
    // Mock payment - clear cart and show success
    clearCart();
    setShowSuccessToast(true);
    
    // Redirect to reservations overview after 2 seconds
    setTimeout(() => {
      navigate('/reservations/overview');
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 overflow-auto">
          {/* Success Toast */}
          {showSuccessToast && (
            <div className="fixed top-20 right-8 z-50 bg-white border-l-4 border-status-positive rounded-lg shadow-lg p-4 flex items-center gap-3 animate-slideInRight">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-status-positive">
                <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM8 15L3 10L4.41 8.59L8 12.17L15.59 4.58L17 6L8 15Z" fill="currentColor"/>
              </svg>
              <div className="flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-status-positive">
                  <path d="M7 10L9 12L13 8M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-text-main font-semibold">Reservation created successfully</span>
              </div>
              <button
                onClick={() => setShowSuccessToast(false)}
                className="ml-4 text-text-subtle hover:text-text-main"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          )}

          {/* Breadcrumb */}
          <div className="bg-white border-b border-border-main px-8 py-4">
            <div className="flex items-center gap-2 text-sm text-text-subtle">
              <span>Overview</span>
              <span>/</span>
              <span className="text-text-main font-semibold">XJOVL0R5W</span>
            </div>
            <h1 className="text-2xl font-bold text-text-main mt-2">Reservations</h1>
          </div>

          {/* Main Content */}
          <div className="p-8">
            <div className="max-w-[1400px] mx-auto flex gap-8 flex-col lg:flex-row">
              
              {/* Left Column - Purchase Details */}
              <div className="flex-1 max-w-[600px]">
                {/* Event Card */}
                <div className="bg-white rounded-lg border border-border-main p-4 mb-6 flex gap-4">
                  <img 
                    src="/images/liv-golf-event.jpg" 
                    alt="LIV Golf Chicago 2026"
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <h2 className="text-base font-semibold text-text-main">LIV Golf Chicago 2026</h2>
                    <div className="flex items-center gap-1 text-sm text-text-subtle mt-1">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M6 1C3.24 1 1 3.24 1 6C1 8.76 3.24 11 6 11C8.76 11 11 8.76 11 6C11 3.24 8.76 1 6 1Z" stroke="currentColor" strokeWidth="1.5"/>
                      </svg>
                      <span>Chicago - 2001 Rodeo Drive, Bolingbrook</span>
                    </div>
                  </div>
                </div>

                {/* Purchase Details Card */}
                <div className="bg-white rounded-lg border border-border-main">
                  <div className="p-6 border-b border-border-main flex items-center justify-between cursor-pointer">
                    <h3 className="text-lg font-bold text-text-main">Purchase details</h3>
                    <svg width="14" height="8" viewBox="0 0 14 8" fill="none" className="text-text-main">
                      <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>

                  <div className="p-6">
                    {cartItems.length === 0 ? (
                      <p className="text-text-subtle">No items in cart</p>
                    ) : (
                      <>
                        {/* Date/Time Header */}
                        <div className="flex items-center gap-2 mb-4">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-text-subtle">
                            <path d="M12.667 2.667H12V1.333H10.667V2.667H5.333V1.333H4V2.667H3.333C2.597 2.667 2 3.264 2 4V13.333C2 14.07 2.597 14.667 3.333 14.667H12.667C13.403 14.667 14 14.07 14 13.333V4C14 3.264 13.403 2.667 12.667 2.667ZM12.667 13.333H3.333V6H12.667V13.333Z" fill="currentColor"/>
                          </svg>
                          <span className="text-sm font-semibold text-text-main">
                            {cartItems[0]?.date} - {cartItems[0]?.time}
                          </span>
                        </div>

                        {/* Cart Items */}
                        {cartItems.map((item, index) => (
                          <div key={index} className="mb-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="text-sm text-text-main mb-1">
                                  {item.quantity}x &nbsp; {item.ticketName}
                                </div>
                                <div className="text-xs text-text-subtle">
                                  Booking fee per ticket: ${item.bookingFee.toFixed(2)}
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-1">
                                <div className="text-sm font-semibold text-text-main">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </div>
                                <div className="text-xs text-text-subtle">
                                  ${(item.bookingFee * item.quantity).toFixed(2)}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}

                        {/* Total */}
                        <div className="border-t border-border-main pt-4 mt-4">
                          <div className="flex justify-between items-center">
                            <span className="text-base font-bold text-text-main">Total to pay</span>
                            <span className="text-base font-bold text-text-main">${totalWithFees.toFixed(2)}</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Promo Code Card (non-functional) */}
                <div className="bg-white rounded-lg border border-border-main mt-6 p-4 flex items-center justify-between cursor-pointer hover:bg-neutral-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-text-subtle">
                      <path d="M17.5 8.33V5.83C17.5 4.54 16.46 3.5 15.17 3.5H4.83C3.54 3.5 2.5 4.54 2.5 5.83V8.33C3.42 8.33 4.17 9.08 4.17 10C4.17 10.92 3.42 11.67 2.5 11.67V14.17C2.5 15.46 3.54 16.5 4.83 16.5H15.17C16.46 16.5 17.5 15.46 17.5 14.17V11.67C16.58 11.67 15.83 10.92 15.83 10C15.83 9.08 16.58 8.33 17.5 8.33Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <div>
                      <div className="text-sm font-semibold text-text-main">Promo Code</div>
                      <div className="text-xs text-text-subtle">Enter one if applicable</div>
                    </div>
                  </div>
                  <svg width="8" height="14" viewBox="0 0 8 14" fill="none" className="text-text-subtle">
                    <path d="M1 1L7 7L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

              {/* Right Column - Payment Method */}
              <div className="flex-1">
                {/* Warning Banner */}
                <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded mb-6">
                  <div className="flex gap-3">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-orange-500 flex-shrink-0 mt-0.5">
                      <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V13H11V15ZM11 11H9V5H11V11Z" fill="currentColor"/>
                    </svg>
                    <div>
                      <div className="text-sm text-orange-900 mb-1">
                        <strong>Please complete the payment to avoid cancellations.</strong>
                      </div>
                      <div className="text-sm text-orange-800">
                        <strong>Payment deadline</strong> (Event time): Thu, 27 Nov 2025, 3:06 PM (UTC-6).
                      </div>
                      <div className="text-sm text-orange-800">
                        <strong>Time left:</strong> 2d 23h 59m
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="bg-white rounded-lg border border-border-main p-6">
                  <h3 className="text-lg font-bold text-text-main mb-6">Select your payment method</h3>

                  <div className="space-y-3 mb-6">
                    {/* Bank Card */}
                    <label className={`border-2 rounded-lg p-4 cursor-pointer flex items-center gap-3 transition-colors ${
                      selectedPaymentMethod === 'bank-card' 
                        ? 'border-primary-main bg-blue-50' 
                        : 'border-border-main hover:border-text-subtle'
                    }`}>
                      <input
                        type="radio"
                        name="payment"
                        value="bank-card"
                        checked={selectedPaymentMethod === 'bank-card'}
                        onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedPaymentMethod === 'bank-card' ? 'border-primary-main' : 'border-border-main'
                      }`}>
                        {selectedPaymentMethod === 'bank-card' && (
                          <div className="w-3 h-3 rounded-full bg-primary-main"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-text-main">Bank Card</div>
                        <div className="text-xs text-text-subtle">Manually enter data</div>
                      </div>
                    </label>

                    {/* Payment Link */}
                    <label className={`border-2 rounded-lg p-4 cursor-pointer flex items-center gap-3 transition-colors ${
                      selectedPaymentMethod === 'payment-link' 
                        ? 'border-primary-main bg-blue-50' 
                        : 'border-border-main hover:border-text-subtle'
                    }`}>
                      <input
                        type="radio"
                        name="payment"
                        value="payment-link"
                        checked={selectedPaymentMethod === 'payment-link'}
                        onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedPaymentMethod === 'payment-link' ? 'border-primary-main' : 'border-border-main'
                      }`}>
                        {selectedPaymentMethod === 'payment-link' && (
                          <div className="w-3 h-3 rounded-full bg-primary-main"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-text-main">Payment link</div>
                        <div className="text-xs text-text-subtle">Send link to the customer</div>
                      </div>
                    </label>

                    {/* Pay at Box Office */}
                    <label className={`border-2 rounded-lg p-4 cursor-pointer flex items-center gap-3 transition-colors ${
                      selectedPaymentMethod === 'box-office' 
                        ? 'border-primary-main bg-blue-50' 
                        : 'border-border-main hover:border-text-subtle'
                    }`}>
                      <input
                        type="radio"
                        name="payment"
                        value="box-office"
                        checked={selectedPaymentMethod === 'box-office'}
                        onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedPaymentMethod === 'box-office' ? 'border-primary-main' : 'border-border-main'
                      }`}>
                        {selectedPaymentMethod === 'box-office' && (
                          <div className="w-3 h-3 rounded-full bg-primary-main"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-text-main">Pay at the box office</div>
                        <div className="text-xs text-text-subtle">Bank card or cash</div>
                      </div>
                    </label>

                    {/* Mark as Paid */}
                    <label className={`border-2 rounded-lg p-4 cursor-pointer flex items-center gap-3 transition-colors ${
                      selectedPaymentMethod === 'mark-paid' 
                        ? 'border-primary-main bg-blue-50' 
                        : 'border-border-main hover:border-text-subtle'
                    }`}>
                      <input
                        type="radio"
                        name="payment"
                        value="mark-paid"
                        checked={selectedPaymentMethod === 'mark-paid'}
                        onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedPaymentMethod === 'mark-paid' ? 'border-primary-main' : 'border-border-main'
                      }`}>
                        {selectedPaymentMethod === 'mark-paid' && (
                          <div className="w-3 h-3 rounded-full bg-primary-main"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-text-main">Mark as paid</div>
                        <div className="text-xs text-text-subtle">Payment is made manually</div>
                      </div>
                    </label>

                    {/* Pay Later */}
                    <label className={`border-2 rounded-lg p-4 cursor-pointer flex items-center gap-3 transition-colors ${
                      selectedPaymentMethod === 'pay-later' 
                        ? 'border-primary-main bg-blue-50' 
                        : 'border-border-main hover:border-text-subtle'
                    }`}>
                      <input
                        type="radio"
                        name="payment"
                        value="pay-later"
                        checked={selectedPaymentMethod === 'pay-later'}
                        onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedPaymentMethod === 'pay-later' ? 'border-primary-main' : 'border-border-main'
                      }`}>
                        {selectedPaymentMethod === 'pay-later' && (
                          <div className="w-3 h-3 rounded-full bg-primary-main"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-text-main">Pay later</div>
                        <div className="text-xs text-text-subtle">Confirm now, pay later</div>
                      </div>
                    </label>
                  </div>

                  {/* Card Input (only shown for bank-card) */}
                  {selectedPaymentMethod === 'bank-card' && (
                    <div className="mb-6">
                      <p className="text-sm text-text-main mb-4">
                        Enter your card details below to complete the payment.
                      </p>
                      
                      <label className="block text-sm font-semibold text-text-main mb-2">
                        Card number
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="Card number"
                          className="w-full h-12 pl-4 pr-32 rounded-lg border border-border-main text-sm focus:outline-none focus:border-primary-main focus:ring-1 focus:ring-primary-main"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                          <span className="text-xs text-text-subtle">MM / YY</span>
                          <span className="text-xs text-text-subtle">CVC</span>
                        </div>
                      </div>

                      {/* Card Logos */}
                      <div className="flex items-center gap-2 mt-3">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-5" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b7/MasterCard_Logo.svg" alt="Mastercard" className="h-5" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg" alt="Amex" className="h-5" />
                      </div>

                      <div className="flex items-center gap-2 mt-4 text-xs text-text-subtle">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M6 0C2.686 0 0 2.686 0 6C0 9.314 2.686 12 6 12C9.314 12 12 9.314 12 6C12 2.686 9.314 0 6 0ZM7 9H5V5H7V9ZM6 4C5.448 4 5 3.552 5 3C5 2.448 5.448 2 6 2C6.552 2 7 2.448 7 3C7 3.552 6.552 4 6 4Z" fill="currentColor"/>
                        </svg>
                        <span>Your payment info is stored securely</span>
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <a href="#" className="text-xs text-primary-active hover:underline">Terms and conditions of use</a>
                        <span className="text-xs text-text-subtle">•</span>
                        <a href="#" className="text-xs text-primary-active hover:underline">Privacy policy</a>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <button
                      onClick={() => navigate('/reservations/create/checkout')}
                      className="flex-1 h-12 rounded-full border-2 border-primary-main text-primary-main font-semibold hover:bg-blue-50 transition-colors"
                    >
                      Pay later & continue
                    </button>
                    <button
                      onClick={handlePayment}
                      className="flex-1 h-12 rounded-full bg-action-primary text-white font-semibold hover:bg-action-primary-hover transition-colors"
                    >
                      Pay
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

