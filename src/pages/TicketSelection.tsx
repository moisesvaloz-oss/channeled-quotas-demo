import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const ICON_CALENDAR = '/icons/calendar.svg';
const ICON_CHEVRON_UP = '/icons/angle-down.svg'; // Rotation needed
const ICON_ADD = '/icons/add.svg';
const ICON_INFO = '/icons/info.svg';

export default function TicketSelection() {
  const navigate = useNavigate();
  
  const [selectedDate, setSelectedDate] = useState('Sat 8 Aug');
  const [selectedTime, setSelectedTime] = useState('9:00');
  const [ticketCounts, setTicketCounts] = useState<{ [key: string]: number }>({});
  const [selectedTab, setSelectedTab] = useState('Fanstand');

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
        { id: 'fanstand-fri', name: 'Fanstand | Friday (June 26)', price: 45.00, available: 9919 },
        { id: 'fanstand-3day', name: 'Fanstand | 3 days pass', price: 120.00, available: 500 }
      ]
    },
    {
      name: 'Club 54',
      tickets: [
        { id: 'club54-fri', name: 'Club 54 | Friday (June 26)', price: 250.00, available: 100 },
        { id: 'club54-3day', name: 'Club 54 | 3 days pass', price: 600.00, available: 50 }
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
          <div className="flex-1 bg-neutral-50 p-8">
            <div className="flex gap-8">
              
              {/* Left Column: Event Info & Description (Visuals) */}
              <div className="flex-[2.5] flex flex-col gap-6">
                
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
                    {/* Placeholder Image area */}
                    <div className="w-full aspect-video bg-neutral-100 rounded-lg overflow-hidden relative group">
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                            {/* Mocking the golf image */}
                            <svg className="w-16 h-16 opacity-20" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: Selector Component */}
              <div className="flex-1 flex flex-col gap-6">
                
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
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
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
                                  className={`flex-1 py-2 px-1 rounded-lg border text-center transition-all ${
                                      isSelected 
                                          ? 'border-primary-main bg-white ring-1 ring-primary-main text-primary-main' 
                                          : 'border-border-main text-text-subtle hover:border-text-subtle'
                                  }`}
                              >
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
                          className={`px-6 py-2 rounded-lg border text-sm font-medium transition-all ${
                              selectedTime === '9:00'
                                  ? 'border-primary-main bg-white ring-1 ring-primary-main text-primary-main'
                                  : 'border-border-main text-text-main hover:border-text-subtle'
                          }`}
                      >
                          9:00
                      </button>
                    </div>
                  </div>

                  {/* Choose tickets */}
                  <div className="pt-4 border-t border-border-main">
                      <h3 className="text-sm font-bold text-text-main mb-3">Choose tickets</h3>
                      
                      <div className="space-y-6">
                        {ticketSections.map((section) => (
                          <div key={section.name}>
                            <h4 className="text-sm font-bold text-text-main mb-3">{section.name}</h4>
                            <div className="space-y-3">
                              {section.tickets.map((ticket) => {
                                const count = ticketCounts[ticket.id] || 0;
                                return (
                                  <div key={ticket.id} className="border border-border-main rounded-lg p-3 flex items-center justify-between bg-white relative overflow-hidden">
                                      {/* Dashed separator visual */}
                                      <div className="absolute right-[120px] top-0 bottom-0 w-px border-l border-dashed border-border-main"></div>
                                      
                                      <div className="flex-1 pr-4">
                                          <div className="text-sm font-bold text-text-main mb-0.5">{ticket.name}</div>
                                          <div className="text-xs text-text-subtle mb-0.5">{ticket.available} available tickets left</div>
                                          <button className="text-xs text-primary-main hover:underline mb-1 font-semibold">See more</button>
                                          <div className="text-sm font-bold text-text-main">${ticket.price.toFixed(2)}</div>
                                      </div>
                                      
                                      <div className="flex items-center gap-2 pl-4 z-10 bg-white">
                                          <button 
                                              onClick={() => updateTicketCount(ticket.id, -1)}
                                              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                                                  count > 0 ? 'bg-neutral-100 hover:bg-neutral-200 text-text-main' : 'bg-neutral-50 text-border-main cursor-not-allowed'
                                              }`}
                                              disabled={count === 0}
                                          >
                                              <svg width="10" height="2" viewBox="0 0 10 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                  <path d="M0 1H10" stroke="currentColor" strokeWidth="2"/>
                                              </svg>
                                          </button>
                                          
                                          <span className="w-6 text-center text-sm font-medium">{count}</span>
                                          
                                          <button 
                                              onClick={() => updateTicketCount(ticket.id, 1)}
                                              className="w-8 h-8 rounded-full bg-primary-main hover:bg-primary-active flex items-center justify-center text-white transition-colors"
                                          >
                                              <img src={ICON_ADD} alt="" className="w-3 h-3 brightness-0 invert" />
                                          </button>
                                      </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                  </div>

                  {/* Add to Cart Button */}
                  <button 
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
