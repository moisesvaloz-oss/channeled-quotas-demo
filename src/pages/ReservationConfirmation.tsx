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
                <div className="flex-1">
                  {/* Event Card */}
                  <div className="bg-white rounded-lg border border-border-main p-6 mb-6">
                    <div className="flex gap-4">
                      <img 
                        src={reservation.eventImage}
                        alt={reservation.eventName}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h2 className="text-lg font-semibold text-text-main mb-2">
                          {reservation.eventName}
                        </h2>
                        <div className="flex items-center gap-1 text-sm text-text-subtle">
                          <img 
                            src="/icons/location-pin.svg" 
                            alt="Location" 
                            className="w-3 h-3 flex-shrink-0"
                          />
                          <span>{reservation.venueAddress}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cart Section */}
                  <div className="bg-white rounded-lg border border-border-main p-6">
                    <h2 className="text-xl font-bold text-text-main mb-6">Cart</h2>

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
                    <div className="flex justify-between items-center border-t border-border-main pt-6">
                      <div className="text-base font-bold text-text-main">Total</div>
                      <div className="text-xl font-bold text-text-main">
                        ${reservation.total.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Confirmation */}
                <div className="flex-1 lg:min-w-[400px]">
                  <div className="bg-white rounded-lg border border-border-main p-8 text-center">
                    {/* Success Icon */}
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="text-green-600">
                        <path d="M9 16L14 21L23 11" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>

                    <h2 className="text-3xl font-bold text-text-main mb-2">Thank you!</h2>
                    
                    <div className="text-lg text-primary-main font-semibold mb-8">
                      Order ID: {reservation.id}
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <button className="w-full h-12 rounded-full bg-action-primary text-white font-semibold hover:bg-action-primary-hover transition-colors">
                        Get delivery note
                      </button>
                      
                      <button
                        onClick={() => navigate('/reservations/overview')}
                        className="w-full text-primary-active font-semibold hover:underline"
                      >
                        Order details
                      </button>
                    </div>

                    {/* Action Links */}
                    <div className="flex items-center justify-center gap-8 mt-8 pt-8 border-t border-border-main">
                      <button
                        onClick={() => navigate('/reservations/overview')}
                        className="flex items-center gap-2 text-primary-active hover:underline"
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-primary-active">
                          <path d="M2 8C2 8 4 4 8 4C12 4 14 8 14 8C14 8 12 12 8 12C4 12 2 8 2 8Z" stroke="currentColor" strokeWidth="1.5"/>
                          <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5"/>
                        </svg>
                        <span className="text-sm font-semibold">See reservations</span>
                      </button>
                      
                      <button
                        onClick={() => navigate('/reservations/create')}
                        className="text-primary-active hover:underline text-sm font-semibold"
                      >
                        New reservation
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

