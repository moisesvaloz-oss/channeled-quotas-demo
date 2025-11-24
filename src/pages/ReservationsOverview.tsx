import { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

// Icon assets
const ICON_CALENDAR = '/icons/calendar.svg';
const ICON_SEARCH = '/icons/search.svg';
const ICON_CHEVRON_DOWN = '/icons/chevron-down.svg';
const ICON_INFO = '/icons/info.svg';
const ICON_CLOSE = '/icons/close.svg';

export default function ReservationsOverview() {
  const [showGuideBanner, setShowGuideBanner] = useState(true);
  const [selectedCity, setSelectedCity] = useState('Chicago');
  const [selectedVenue, setSelectedVenue] = useState('Bolingbrook Golf Club');
  const [globalSearch, setGlobalSearch] = useState('LIV Golf Chicago 2025');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="h-screen flex flex-col bg-background-main">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto flex flex-col bg-neutral-50">
          {/* Hero Section - Refined to match screenshot */}
          <div className="bg-background-contrast p-6">
            <div className="mb-3">
              <h1 className="text-white text-lg font-bold">Reservations</h1>
            </div>
            <div className="flex gap-4 items-end">
              {/* City Dropdown */}
              <div className="bg-white rounded h-10 px-3 flex items-center justify-between cursor-pointer w-[200px]">
                <span className="text-text-main text-sm">{selectedCity}</span>
                <img src={ICON_CHEVRON_DOWN} alt="" className="w-3 h-1.5 text-text-subtle" />
              </div>

              {/* Global Search - Event Input */}
              <div className="bg-white rounded h-10 px-3 flex items-center justify-between flex-1">
                 <input
                  type="text"
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                  className="w-full h-full bg-transparent border-none text-sm text-text-main placeholder:text-text-subtle focus:ring-0 p-0"
                  placeholder="Select a city and search for an event"
                />
                <img src={ICON_CHEVRON_DOWN} alt="" className="w-3 h-1.5 text-text-subtle ml-2 flex-shrink-0" />
              </div>

              {/* Venue Dropdown */}
              <div className="bg-white rounded h-10 px-3 flex items-center justify-between cursor-pointer w-[200px]">
                <span className="text-text-main text-sm">{selectedVenue}</span>
                <img src={ICON_CHEVRON_DOWN} alt="" className="w-3 h-1.5 text-text-subtle" />
              </div>

              {/* Show Button */}
              <button className="bg-neutral-100 hover:bg-neutral-200 text-text-main px-8 h-10 rounded font-semibold text-sm transition-colors">
                Show
              </button>
            </div>
          </div>

          {/* Main Content Area - Matching Businesses padding */}
          <div className="p-8">
            <div className="bg-white rounded-lg shadow-sm border border-border-main p-6 min-h-[600px] flex flex-col">
                
                {/* Header Section */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-text-main">Reservations Overview</h2>
                  <button className="bg-action-primary hover:bg-action-primary-hover text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-colors">
                    Make a reservation
                  </button>
                </div>

                {/* Filters Bar - Refined to match screenshot (Light Grey, No Borders, Slimmer) */}
                <div className="flex items-center gap-4 mb-6">
                  {/* Date Filter - Black Pill Button */}
                  <button className="h-10 flex items-center gap-2 bg-neutral-900 text-white px-4 rounded-md text-sm font-medium hover:bg-neutral-800 transition-colors">
                    <span>Next 3 months</span>
                    <img src={ICON_CALENDAR} alt="" className="w-4 h-4 invert" />
                  </button>

                  {/* Search Input */}
                  <div className="flex-1 relative max-w-md">
                    <div className="w-full h-10 px-3 rounded-md bg-neutral-100 flex items-center">
                         <img src={ICON_SEARCH} alt="" className="w-4 h-4 text-text-subtle opacity-50 mr-2" />
                         <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full h-full bg-transparent border-none text-sm text-text-main placeholder:text-text-subtle focus:ring-0 p-0"
                          placeholder="Search by reservation ID, recipient or business"
                        />
                    </div>
                  </div>

                  {/* Status Dropdown */}
                  <div className="w-48 h-10 px-3 rounded-md bg-neutral-100 flex items-center justify-between cursor-pointer hover:bg-neutral-200 transition-colors">
                      <span className="text-text-subtle text-sm">To be paid, Paid</span>
                      <img src={ICON_CHEVRON_DOWN} alt="" className="w-3 h-1.5 text-text-subtle" />
                  </div>

                  {/* Business Type Dropdown */}
                  <div className="w-48 h-10 px-3 rounded-md bg-neutral-100 flex items-center justify-between cursor-pointer hover:bg-neutral-200 transition-colors">
                      <span className="text-text-subtle text-sm">Business Type</span>
                      <img src={ICON_CHEVRON_DOWN} alt="" className="w-3 h-1.5 text-text-subtle" />
                  </div>
                </div>

                {/* Results Count & Actions */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-sm font-semibold text-text-main">0 reservations with the filters applied</span>
                  <button className="p-1.5 hover:bg-neutral-100 rounded transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M7 10L12 15L17 10" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 15V3" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>

                {/* Main Table Area - Matching Businesses style */}
                <div className="w-full rounded-lg overflow-hidden border border-border-main flex flex-col flex-1">
                   {/* Table Header */}
                   <div className="bg-neutral-75 px-4 py-3 grid grid-cols-[auto_1fr_1fr_auto_1fr_auto_auto_auto_auto] gap-4 text-sm font-semibold text-text-subtle items-center border-b border-border-main">
                      <div className="flex items-center gap-1 cursor-pointer hover:text-text-main">
                        Event Date
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M7 15l5 5 5-5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M7 9l5-5 5 5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div className="flex items-center">Business</div>
                      <div className="flex items-center">Event</div>
                      <div className="flex items-center">Reservation ID</div>
                      <div className="flex items-center">Contact info</div>
                      <div className="text-right flex items-center justify-end"># Tickets</div>
                      <div className="text-right flex items-center justify-end">Total</div>
                      <div className="flex items-center justify-end gap-1 cursor-pointer hover:text-text-main">
                        Status
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M7 15l5 5 5-5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M7 9l5-5 5 5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div className="text-right flex items-center justify-end">Attendance</div>
                   </div>
                   
                   {/* Empty State */}
                   <div className="flex-1 flex flex-col items-center justify-center py-20 bg-white">
                      <div className="w-16 h-16 mb-4 text-neutral-300">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <p className="text-text-subtle text-base max-w-md text-center">
                        Sorry, we couldn't find reservations with your search criteria. Please change the filters and try again.
                      </p>
                   </div>
                </div>
            </div>
          </div>

          {/* Bottom Info Banner */}
          {showGuideBanner && (
            <div className="fixed bottom-8 left-[calc(50%+144px)] -translate-x-1/2 flex items-center gap-3 bg-[#E6F4FF] border border-[#BAE3FF] px-4 py-3 rounded-lg shadow-sm z-50">
              <img src={ICON_INFO} alt="" className="w-5 h-5 text-[#0089E3]" />
              <div className="text-[#004E82] text-sm">
                <span className="mr-1">For questions about reservations</span>
                <a href="#" className="font-semibold hover:underline">Check out our guide</a>
              </div>
              <button 
                onClick={() => setShowGuideBanner(false)}
                className="ml-2 text-[#004E82] hover:text-[#003A61]"
              >
                <img src={ICON_CLOSE} alt="Close" className="w-4 h-4" />
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
