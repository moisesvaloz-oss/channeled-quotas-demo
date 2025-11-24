import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { useCartStore } from '../stores/cartStore';

const ICON_CALENDAR = '/icons/calendar.svg';
const ICON_CHEVRON_UP = '/icons/angle-down.svg'; // Rotation needed

export default function TicketSelection() {
  const navigate = useNavigate();
  const { addItem, clearCart } = useCartStore();
  
  const [selectedDate, setSelectedDate] = useState('Sat 8 Aug');
  const [selectedTime, setSelectedTime] = useState('9:00');
  const [ticketCounts, setTicketCounts] = useState<{ [key: string]: number }>({});
  const [selectedTab, setSelectedTab] = useState('Fanstand');
  const [selectedTicketSection, setSelectedTicketSection] = useState('Fanstand');

  const tabs = ['Fanstand', 'Birdie Shack', 'Birdie Shack Loge Box', 'Club 54', 'LIV Premium - All Access Hospitality', 'Suite on 18'];
  
  const dates = [
    { day: 'Sat', date: '8 Aug' },
    { day: 'Sun', date: '9 Aug' },
    { day: 'Mon', date: '10 Aug' }
  ];

  const ticketSections = [
    {
      name: 'Fanstand',
      tickets: [
        { id: 'fanstand-fri', name: 'Fanstand | Friday (June 26)', price: 287.00, available: 9919 },
        { id: 'fanstand-3day', name: 'Fanstand | 3 days pass', price: 680.00, available: 500 }
      ]
    },
    {
      name: 'Club 54',
      tickets: [
        { id: 'club54-fri', name: 'Club 54 | Friday (June 26)', price: 1031.00, available: 100 },
        { id: 'club54-3day', name: 'Club 54 | 3 days pass', price: 2890.00, available: 50 }
      ]
    }
  ];

  const updateTicketCount = (id: string, delta: number) => {
    setTicketCounts(prev => {
      const current = prev[id] || 0;
      const newCount = Math.max(0, current + delta);
      return { ...prev, [id]: newCount };
    });
  };

  const totalTickets = Object.values(ticketCounts).reduce((sum, count) => sum + count, 0);

  return (
    <div className="min-h-screen flex flex-col bg-background-contrast">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-auto bg-background-contrast">
          
          {/* Header Section */}
          <div className="px-8 pt-6 pb-4">
            <button 
              onClick={() => navigate('/reservations/create/event')}
              className="text-white text-sm font-semibold mb-2 hover:underline"
            >
              Go Back to list
            </button>
            <h1 className="text-white text-xl font-bold">Make a reservation</h1>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-neutral-50 p-8 overflow-x-hidden">
            <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-8">
              
              {/* Left Column: Event Info & Description (Visuals) */}
              <div className="w-full lg:flex-1 lg:max-w-[60%] flex flex-col gap-6">
                
                {/* Tabs & Content */}
                <div className="bg-white rounded-lg shadow-sm border border-border-main min-h-[500px] flex flex-col">
                  {/* Scrollable Tabs */}
                  <div className="flex border-b border-border-main overflow-x-auto no-scrollbar">
                    {tabs.map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setSelectedTab(tab)}
                        className={`px-6 py-4 text-sm font-semibold whitespace-nowrap transition-colors relative ${
                          selectedTab === tab 
                            ? 'text-text-main' 
                            : 'text-text-subtle hover:text-text-main'
                        }`}
                      >
                        {tab}
                        {selectedTab === tab && (
                          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#84cc16]"></div>
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-bold text-text-main mb-4">{selectedTab}</h3>
                    {/* Event Image */}
                    <div className="w-full aspect-video bg-neutral-100 rounded-lg overflow-hidden relative group">
                        <img 
                          src="/images/liv-golf-event.jpg" 
                          alt="LIV Golf Chicago 2026"
                          className="w-full h-full object-cover"
                        />
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: Selector Component */}
              <div className="w-full lg:w-[480px] lg:flex-none flex flex-col gap-6">
                
                <div className="bg-white rounded-lg shadow-sm border border-border-main p-6 space-y-6">
                  
                  {/* Event Card (Small) */}
                  <div className="flex gap-4 pb-4 border-b border-border-main">
                    <div className="w-12 h-12 bg-neutral-200 rounded-md overflow-hidden flex-shrink-0">
                      <div className="w-full h-full bg-[#0089e3] flex items-center justify-center text-white font-bold text-[10px]">
                        LIV GOLF
                      </div>
                    </div>
                    <div className="flex flex-col justify-center">
                      <h2 className="text-sm font-bold text-text-main mb-1">LIV Golf Chicago 2026</h2>
                      <div className="flex items-center gap-1 text-xs text-text-subtle">
                        <img 
                          src="/icons/location-pin.svg" 
                          alt="Location" 
                          className="w-3 h-3 flex-shrink-0"
                        />
                        <span className="truncate max-w-[200px]">Chicago - 2001 Rodeo Drive, Bolingbrook</span>
                      </div>
                    </div>
                  </div>

                  {/* Event Description Accordion - Removed as per request (mobile only) */}

                  {/* Date & hour */}
                  <div>
                    <h3 className="text-sm font-bold text-text-main mb-3">Date & hour</h3>
                    
                    {/* Date Picker Input */}
                    <div className="mb-4">
                      <div className="border border-border-main rounded-lg px-3 py-2 flex items-center justify-between cursor-pointer hover:border-text-subtle">
                          <div className="flex flex-col">
                              <span className="text-xs text-text-subtle">Show availability from...</span>
                              <span className="text-sm text-text-main">2026-08-08</span>
                          </div>
                          <img src={ICON_CALENDAR} alt="" className="w-4 h-4 text-text-main" />
                      </div>
                    </div>

                  {/* Date Pills */}
                  <div className="flex gap-2 mb-6">
                    {dates.map((d) => {
                        const label = `${d.day} ${d.date}`;
                        const isSelected = selectedDate === label;
                        return (
                            <button
                                key={label}
                                onClick={() => setSelectedDate(label)}
                                className={`flex-1 py-2 px-1 rounded-lg border text-center transition-all relative overflow-hidden ${
                                    isSelected 
                                        ? 'border-primary-main bg-white text-primary-main' 
                                        : 'border-border-main text-text-subtle hover:border-text-subtle'
                                }`}
                            >
                                {isSelected && (
                                  <div className="absolute top-[1px] right-[1px] w-3.5 h-3.5 bg-primary-main rounded-tr-[5px]" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%)' }}></div>
                                )}
                                <div className={`text-xs font-semibold ${isSelected ? 'text-primary-main' : ''}`}>{d.day}</div>
                                <div className={`text-sm ${isSelected ? 'text-primary-main font-bold' : ''}`}>{d.date}</div>
                            </button>
                        )
                    })}
                  </div>

                  {/* Time Section */}
                  <div className="mb-3 flex items-center justify-between border-b border-border-main pb-0">
                    <div className="flex gap-4">
                      <button className="text-sm font-bold text-primary-main border-b-2 border-primary-main pb-2">
                        Morning
                      </button>
                      {/* Add hidden tabs if needed */}
                    </div>
                    <span className="text-xs text-text-subtle mb-2">7:00 to 14:59</span>
                    <button className="w-6 h-6 bg-neutral-100 rounded-full flex items-center justify-center mb-2">
                        <img src={ICON_CHEVRON_UP} alt="" className="w-3 h-3 rotate-180 opacity-50" />
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setSelectedTime('9:00')}
                        className={`px-6 py-2 rounded-lg border text-sm font-medium transition-all relative overflow-hidden ${
                            selectedTime === '9:00'
                                ? 'border-primary-main bg-white text-primary-main'
                                : 'border-border-main text-text-main hover:border-text-subtle'
                        }`}
                    >
                        {selectedTime === '9:00' && (
                          <div className="absolute top-[1px] right-[1px] w-3.5 h-3.5 bg-primary-main rounded-tr-[5px]" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%)' }}></div>
                        )}
                        9:00
                    </button>
                  </div>
                  </div>

                  {/* Choose tickets */}
                  <div className="pt-4 border-t border-border-main">
                      <h3 className="text-sm font-bold text-text-main mb-3">Choose tickets</h3>
                      
                      {/* Ticket Group Pills */}
                      <div className="flex flex-wrap gap-2 mb-4">
                          {ticketSections.map(section => {
                              const isSelected = selectedTicketSection === section.name;
                              return (
                                <button
                                    key={section.name}
                                    onClick={() => setSelectedTicketSection(section.name)}
                                    className={`px-4 py-2 rounded-lg border text-xs font-medium transition-all relative overflow-hidden ${
                                        isSelected
                                            ? 'border-primary-main text-primary-main bg-white'
                                            : 'border-border-main text-text-subtle hover:border-text-subtle'
                                    }`}
                                >
                                {isSelected && (
                                  <div className="absolute top-[1px] right-[1px] w-3.5 h-3.5 bg-primary-main rounded-tr-[5px]" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%)' }}></div>
                                )}
                                    {section.name}
                                </button>
                              );
                          })}
                      </div>

                      {/* Tickets List for Selected Group */}
                      <div className="space-y-3">
                        {ticketSections.find(s => s.name === selectedTicketSection)?.tickets.map((ticket) => {
                          const count = ticketCounts[ticket.id] || 0;
                          return (
                            <div key={ticket.id} className="bg-white rounded-lg border border-border-main relative overflow-hidden flex">
                                
                                {/* Ticket Info (Left) */}
                                <div className="flex-1 p-4 pr-8">
                                    <div className="text-base font-bold text-text-main mb-1">{ticket.name.split('|')[1] ? ticket.name.split('|')[1].trim() : ticket.name}</div>
                                    <div className="text-sm text-text-subtle mb-2">{ticket.available} available tickets left</div>
                                    <button className="text-sm text-primary-main hover:underline font-semibold block mb-2">See more</button>
                                    <div className="text-base font-bold text-text-main">${ticket.price.toFixed(2)}</div>
                                </div>

                                {/* Visual Divider & Notches */}
                                <div className="relative w-px flex flex-col items-center">
                                  {/* Dashed Line */}
                                  <div className="h-full border-l border-dashed border-border-main absolute top-0 bottom-0 left-0"></div>
                                  {/* Top Notch */}
                                  <div className="absolute top-[-6px] left-[-6px] w-3 h-3 rounded-full bg-neutral-50 border-b border-border-main box-content z-10"></div>
                                  <div className="absolute top-[-7px] left-[-7px] w-[13px] h-[13px] rounded-full border border-border-main bg-neutral-50 z-10 clip-bottom-half"></div>
                                  {/* Bottom Notch - Simplified to just a circle on top for now as CSS masks are complex */}
                                   <div className="absolute top-[-6px] left-[-6px] w-3 h-3 bg-neutral-50 rounded-full border border-border-main z-20"></div>
                                   <div className="absolute bottom-[-6px] left-[-6px] w-3 h-3 bg-neutral-50 rounded-full border border-border-main z-20"></div>
                                </div>
                                
                                      {/* Counter (Right) */}
                                      <div className="w-[180px] flex items-center justify-center p-4 bg-white z-0">
                                          <div className="flex items-center gap-3">
                                              {/* Minus Button */}
                                              <button 
                                                  onClick={() => updateTicketCount(ticket.id, -1)}
                                                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                                                      count > 0 ? 'bg-[#e6f4ff] text-[#0079ca] hover:bg-[#dbefff]' : 'bg-neutral-50 text-border-main cursor-not-allowed'
                                                  }`}
                                                  disabled={count === 0}
                                              >
                                                  <svg width="10" height="2" viewBox="0 0 10 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                      <path d="M0 1H10" stroke="currentColor" strokeWidth="1.5"/>
                                                  </svg>
                                              </button>
                                              
                                              {/* Count Display Box - Removed border */}
                                              <div className="w-8 h-8 flex items-center justify-center bg-transparent text-base font-medium text-text-main">
                                                {count}
                                              </div>
                                              
                                              {/* Plus Button */}
                                              <button 
                                                  onClick={() => updateTicketCount(ticket.id, 1)}
                                                  className="w-8 h-8 rounded-full bg-[#e6f4ff] text-[#0079ca] hover:bg-[#dbefff] flex items-center justify-center transition-colors"
                                              >
                                                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M6 0V12M0 6H12" stroke="currentColor" strokeWidth="1.5"/>
                                                  </svg>
                                              </button>
                                          </div>
                                      </div>
                            </div>
                          );
                        })}
                      </div>
                  </div>

                  {/* Add to Cart Button */}
                  <button 
                      onClick={() => {
                        if (totalTickets > 0) {
                          // Clear cart first
                          clearCart();
                          
                          // Add each selected ticket to cart
                          ticketSections.forEach(section => {
                            section.tickets.forEach(ticket => {
                              const count = ticketCounts[ticket.id] || 0;
                              if (count > 0) {
                                addItem({
                                  id: ticket.id,
                                  ticketName: ticket.name,
                                  date: selectedDate,
                                  time: selectedTime,
                                  quantity: count,
                                  price: ticket.price,
                                  bookingFee: 0.00
                                });
                              }
                            });
                          });
                          
                          navigate('/reservations/create/checkout');
                        }
                      }}
                      className={`w-full py-3 rounded-lg text-sm font-bold transition-colors ${
                          totalTickets > 0 
                              ? 'bg-action-primary text-white hover:bg-action-primary-hover' 
                              : 'bg-neutral-100 text-text-subtle cursor-not-allowed'
                      }`}
                      disabled={totalTickets === 0}
                  >
                      Add to cart {totalTickets > 0 && `(${totalTickets})`}
                  </button>

                </div>
              </div>
            </div>
          </div>

          <Footer />
        </div>
      </div>
    </div>
  );
}
