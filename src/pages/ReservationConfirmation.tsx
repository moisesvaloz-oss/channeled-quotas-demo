import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { useReservationStore } from '../stores/reservationStore';

export default function ReservationConfirmation() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { getReservationById } = useReservationStore();
  const [reservation, setReservation] = useState(getReservationById(orderId || ''));

  useEffect(() => {
    if (orderId) {
      const res = getReservationById(orderId);
      setReservation(res);
    }
  }, [orderId, getReservationById]);

  // Calculate payment deadline (event time)
  const getPaymentDeadline = () => {
    return 'Fri, 25 Jul 2025, 11:59 PM (UTC-5)';
  };

  // Calculate time left (mock)
  const getTimeLeft = () => {
    return '210d 7h 0m';
  };

  if (!reservation) {
    return (
      <div className="h-screen flex flex-col bg-neutral-50">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-auto flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-text-main mb-4">Reservation not found</h1>
              <button
                onClick={() => navigate('/reservations/overview')}
                className="text-primary-active hover:underline"
              >
                Go to reservations
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-neutral-50">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 overflow-auto flex flex-col">
          {/* Hero Section */}
          <div className="bg-background-contrast px-8 py-6">
            <h1 className="text-2xl font-bold text-white">Make a reservation</h1>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-8">
            <div className="max-w-[1400px] mx-auto">
              <div className="flex gap-8 flex-col lg:flex-row">
                {/* Left Column - Event & Cart */}
                <div className="flex-1 max-w-[500px]">
                  {/* Event Card */}
                  <div className="bg-white rounded-lg border border-border-main p-6 mb-6">
                    <div className="flex gap-4">
                      <img 
                        src={reservation.eventImage}
                        alt={reservation.eventName}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h2 className="text-base font-semibold text-text-main mb-1">
                          {reservation.eventName}
                        </h2>
                        <div className="flex items-center gap-1 text-sm text-text-subtle">
                          <img 
                            src="/icons/location-pin.svg" 
                            alt="Location" 
                            className="w-3 h-3 flex-shrink-0"
                          />
                          <span>{reservation.venueName} - {reservation.venueAddress}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cart Section */}
                  <div className="bg-white rounded-lg border border-border-main p-6 mb-6">
                    <h2 className="text-xl font-bold text-text-main mb-4">Cart</h2>

                    {/* Date/Time */}
                    <div className="text-sm font-semibold text-text-main mb-4">
                      {reservation.date} - {reservation.time}
                    </div>

                    {/* Cart Items */}
                    {reservation.tickets.map((ticket, index) => (
                      <div key={index} className="mb-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="text-sm text-text-main mb-1">
                              {ticket.quantity}x &nbsp; {ticket.name}
                            </div>
                            <div className="text-xs text-text-subtle">
                              Booking fee per ticket: $0.00
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <div className="text-base font-semibold text-text-main">
                              ${(ticket.price * ticket.quantity).toFixed(2)}
                            </div>
                            <div className="text-xs text-text-subtle">
                              $0.00
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Total */}
                    <div className="flex justify-between items-center border-t border-border-main pt-4 mt-4">
                      <div className="text-base font-bold text-text-main">Total</div>
                      <div className="text-lg font-bold text-text-main">
                        ${reservation.total.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Promo Code Section */}
                  <div className="bg-white rounded-lg border border-border-main p-4 flex items-center justify-between cursor-pointer hover:bg-neutral-50">
                    <div className="flex items-center gap-3">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-text-subtle">
                        <path d="M17.5 8.33V6.67C17.5 5.75 16.75 5 15.83 5H4.17C3.25 5 2.5 5.75 2.5 6.67V8.33C3.42 8.33 4.17 9.08 4.17 10C4.17 10.92 3.42 11.67 2.5 11.67V13.33C2.5 14.25 3.25 15 4.17 15H15.83C16.75 15 17.5 14.25 17.5 13.33V11.67C16.58 11.67 15.83 10.92 15.83 10C15.83 9.08 16.58 8.33 17.5 8.33Z" stroke="currentColor" strokeWidth="1.5"/>
                      </svg>
                      <div>
                        <div className="text-sm font-semibold text-text-main">Promo Code</div>
                        <div className="text-xs text-text-subtle">Enter one if applicable</div>
                      </div>
                    </div>
                    <svg width="8" height="14" viewBox="0 0 8 14" fill="none" className="text-text-subtle">
                      <path d="M1 1L7 7L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>

                {/* Right Column - Confirmation */}
                <div className="flex-1">
                  <div className="bg-white rounded-lg border border-border-main p-8">
                    {/* Success Icon & Thanks */}
                    <div className="text-center mb-6">
                      <div className="inline-flex items-center gap-2 mb-2">
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                          <circle cx="14" cy="14" r="14" fill="#22c55e"/>
                          <path d="M8 14L12 18L20 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <h2 className="text-2xl font-bold text-text-main">Thanks!</h2>
                      </div>
                      
                      <div className="text-lg text-primary-main font-semibold">
                        Reservation ID: {reservation.id}
                      </div>
                    </div>

                    {/* Payment Deadline Warning */}
                    <div className="bg-[#e0f2fe] rounded-lg p-4 mb-6">
                      <div className="flex items-start gap-2">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-[#0284c7] flex-shrink-0 mt-0.5">
                          <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5"/>
                          <path d="M10 6V10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                          <circle cx="10" cy="13.5" r="0.75" fill="currentColor"/>
                        </svg>
                        <div>
                          <p className="text-sm text-text-main font-semibold mb-1">
                            Please complete the payment to avoid cancellations.
                          </p>
                          <p className="text-sm text-text-subtle">
                            <span className="font-semibold">Payment deadline</span> (Event time): {getPaymentDeadline()}
                          </p>
                          <p className="text-sm text-text-subtle">
                            <span className="font-semibold">Time left:</span>{' '}
                            <span className="text-[#0284c7] font-semibold">{getTimeLeft()}</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 mb-4">
                      <button className="flex-1 h-12 rounded-full border-2 border-primary-main text-primary-main font-semibold hover:bg-primary-main hover:text-white transition-colors">
                        Get payment link
                      </button>
                      
                      <button className="flex-1 h-12 rounded-full bg-action-primary text-white font-semibold hover:bg-action-primary-hover transition-colors">
                        Pay at the Box Office
                      </button>
                    </div>

                    {/* Mark as paid manually link */}
                    <div className="text-center">
                      <button className="text-primary-active font-semibold hover:underline text-sm">
                        Mark as paid manually
                      </button>
                    </div>
                  </div>

                  {/* Bottom Action Links */}
                  <div className="flex items-center justify-between mt-6">
                    <button
                      onClick={() => navigate('/reservations/overview')}
                      className="flex items-center gap-2 border border-border-main rounded-full px-6 py-3 bg-white hover:bg-neutral-50 transition-colors"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-text-main">
                        <path d="M2 8C2 8 4 4 8 4C12 4 14 8 14 8C14 8 12 12 8 12C4 12 2 8 2 8Z" stroke="currentColor" strokeWidth="1.5"/>
                        <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5"/>
                      </svg>
                      <span className="text-sm font-semibold text-text-main">See reservations</span>
                    </button>
                    
                    <button
                      onClick={() => navigate('/reservations/create')}
                      className="flex items-center gap-2 border border-border-main rounded-full px-6 py-3 bg-white hover:bg-neutral-50 transition-colors"
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-primary-active">
                        <path d="M6 0V12M0 6H12" stroke="currentColor" strokeWidth="1.5"/>
                      </svg>
                      <span className="text-sm font-semibold text-primary-active">New reservation</span>
                    </button>
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

