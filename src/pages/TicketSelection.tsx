import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const ICON_CALENDAR = '/icons/calendar.svg';
const ICON_CHEVRON_UP = '/icons/angle-down.svg'; // Rotation needed
const ICON_ADD = '/icons/add.svg';

export default function TicketSelection() {
  const navigate = useNavigate();
  
  const [selectedDate, setSelectedDate] = useState('Sat 8 Aug');
  const [selectedTime, setSelectedTime] = useState('9:00');
  const [selectedTicketType, setSelectedTicketType] = useState('Grounds Pass');
  const [ticketCount, setTicketCount] = useState(0);
  const [selectedTab, setSelectedTab] = useState('Fanstand');

  const tabs = ['Fanstand', 'Birdie Shack', 'Birdie Shack Loge Box', 'Club 54', 'LIV Premium - All Access Hospitality', 'Suite on 18'];
  
  const dates = [
    { day: 'Sat', date: '8 Aug' },
    { day: 'Sun', date: '9 Aug' },
    { day: 'Mon', date: '10 Aug' }
  ];

  const ticketTypes = ['Grounds Pass', 'Grounds Pass Plus', 'Fanstand'];

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
              
              {/* Left Column: Event Info & Description */}
              <div className="flex-[2] flex flex-col gap-6">
                
                {/* Event Card */}
                <div className="bg-white rounded-lg shadow-sm border border-border-main p-4 flex gap-4">
                  <div className="w-16 h-16 bg-neutral-200 rounded-lg overflow-hidden flex-shrink-0">
                    {/* Placeholder for event image */}
                    <div className="w-full h-full bg-[#0089e3] flex items-center justify-center text-white font-bold text-xs">
                      LIV GOLF
                    </div>
                  </div>
                  <div className="flex flex-col justify-center">
                    <h2 className="text-base font-bold text-text-main mb-1">LIV Golf Chicago 2025</h2>
                    <div className="flex items-center gap-1 text-sm text-text-subtle">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>Chicago - 2001 Rodeo Drive, Bolingbrook 60490</span>
                    </div>
                  </div>
                </div>

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

              {/* Right Column: Selectors */}
              <div className="flex-1 flex flex-col gap-6">
                
                <div className="bg-white rounded-lg shadow-sm border border-border-main p-8">
                  <h3 className="text-base font-bold text-text-main mb-4">Date & hour</h3>
                  
                  {/* Date Picker Input */}
                  <div className="mb-4">
                    <div className="border border-border-main rounded-lg px-3 py-2 flex items-center justify-between cursor-pointer hover:border-text-subtle">
                        <div className="flex flex-col">
                            <span className="text-xs text-text-subtle">Show availability from...</span>
                            <span className="text-sm text-text-main">2025-08-08</span>
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
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm text-text-subtle">Morning - 7:00 to 14:59</span>
                    <button className="w-6 h-6 bg-neutral-100 rounded-full flex items-center justify-center">
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
                <div className="bg-white rounded-lg shadow-sm border border-border-main p-8">
                    <h3 className="text-base font-bold text-text-main mb-4">Choose tickets</h3>
                    
                    {/* Ticket Type Pills */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {ticketTypes.map(type => (
                            <button
                                key={type}
                                onClick={() => setSelectedTicketType(type)}
                                className={`px-4 py-2 rounded-full border text-xs font-medium transition-all ${
                                    selectedTicketType === type
                                        ? 'border-primary-main text-primary-main bg-white'
                                        : 'border-border-main text-text-subtle hover:border-text-subtle'
                                }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>

                    {/* Ticket Counter Card */}
                    <div className="border border-border-main rounded-lg p-4 flex items-center justify-between">
                        <div className="flex-1">
                            <div className="text-sm font-bold text-text-main mb-1">Friday (August 8)</div>
                            <div className="text-xs text-text-subtle mb-1">9919 available tickets left</div>
                            <button className="text-xs text-primary-main hover:underline mb-2">See more</button>
                            <div className="text-sm font-bold text-text-main">$45.00</div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={() => ticketCount > 0 && setTicketCount(ticketCount - 1)}
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                                    ticketCount > 0 ? 'bg-neutral-100 hover:bg-neutral-200 text-text-main' : 'bg-neutral-50 text-border-main cursor-not-allowed'
                                }`}
                                disabled={ticketCount === 0}
                            >
                                <svg width="10" height="2" viewBox="0 0 10 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0 1H10" stroke="currentColor" strokeWidth="2"/>
                                </svg>
                            </button>
                            
                            <span className="w-4 text-center text-sm font-medium">{ticketCount}</span>
                            
                            <button 
                                onClick={() => setTicketCount(ticketCount + 1)}
                                className="w-8 h-8 rounded-full bg-primary-main hover:bg-primary-active flex items-center justify-center text-white transition-colors"
                            >
                                <img src={ICON_ADD} alt="" className="w-3 h-3 brightness-0 invert" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Add to Cart Button */}
                <button 
                    className={`w-full py-3 rounded-lg text-sm font-bold transition-colors ${
                        ticketCount > 0 
                            ? 'bg-action-primary text-white hover:bg-action-primary-hover' 
                            : 'bg-neutral-100 text-text-subtle cursor-not-allowed'
                    }`}
                    disabled={ticketCount === 0}
                >
                    Add to cart
                </button>

              </div>
            </div>
          </div>

          <Footer />
        </div>
      </div>
    </div>
  );
}

