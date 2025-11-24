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
  const [selectedCity, setSelectedCity] = useState('City');
  const [selectedVenue, setSelectedVenue] = useState('Venue');
  const [globalSearch, setGlobalSearch] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="h-screen flex flex-col bg-neutral-50">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          {/* Hero Section - Matching QuotaManagement */}
          <div className="bg-background-contrast p-6">
            <div className="mb-4">
              <h1 className="text-white text-2xl font-semibold">Reservations</h1>
            </div>
            <div className="flex gap-6">
              {/* City Dropdown */}
              <div className="bg-white border border-border-main rounded-sm h-14 px-3 flex flex-col justify-center relative w-[200px]">
                <label className="text-text-subtle text-xs font-semibold absolute top-0 left-3">City</label>
                <div className="pt-4 flex items-center justify-between cursor-pointer">
                  <span className="text-text-main text-base">{selectedCity}</span>
                  <img src={ICON_CHEVRON_DOWN} alt="" className="w-3 h-1.5 text-text-subtle" />
                </div>
              </div>

              {/* Global Search */}
              <div className="bg-white border border-border-main rounded-sm h-14 px-3 flex flex-col justify-center relative flex-1">
                 <input
                  type="text"
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                  className={`w-full h-full pt-4 bg-transparent border-none text-base text-text-main placeholder:text-transparent focus:ring-0 ${globalSearch ? '' : 'placeholder:text-text-subtle'}`}
                  placeholder="Select a city and search for an event"
                />
                <label className={`text-text-subtle text-xs font-semibold absolute left-3 transition-all duration-200 pointer-events-none ${globalSearch ? 'top-2' : 'top-4 text-base font-normal opacity-0'}`}>
                  Select a city and search for an event
                </label>
                 {/* Placeholder logic: If empty, show placeholder style text. If typed, show label top and value. 
                     Actually, the QuotaManagement input has a static label "Search or type event" and a value "LIV Golf...".
                     The user wants a search INPUT here. 
                     Let's stick to the visual style: White box, label if possible, or just input.
                     If it's an input, the label usually floats.
                     Let's try to mimic the exact style:
                 */}
                 {!globalSearch && (
                   <span className="absolute left-3 top-4 text-text-subtle text-base pointer-events-none">Select a city and search for an event</span>
                 )}
              </div>

              {/* Venue Dropdown */}
              <div className="bg-white border border-border-main rounded-sm h-14 px-3 flex flex-col justify-center relative w-[200px]">
                <label className="text-text-subtle text-xs font-semibold absolute top-0 left-3">Venue</label>
                <div className="pt-4 flex items-center justify-between cursor-pointer">
                  <span className="text-text-main text-base">{selectedVenue}</span>
                  <img src={ICON_CHEVRON_DOWN} alt="" className="w-3 h-1.5 text-text-subtle" />
                </div>
              </div>

              {/* Show Button */}
              <button className="bg-neutral-100 hover:bg-neutral-200 text-text-main px-8 h-14 rounded-sm font-semibold text-sm transition-colors border border-transparent">
                Show
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="p-4">
            <div className="bg-white rounded-lg shadow-[0px_6px_6px_0px_rgba(0,70,121,0.2)] p-6 min-h-[600px] flex flex-col">
                
                {/* Header Section */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-text-main">Reservations Overview</h2>
                  <button className="bg-action-primary hover:bg-action-primary-hover text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-colors">
                    Make a reservation
                  </button>
                </div>

                {/* Filters Bar - Using h-14 styles like Businesses/QuotaManagement */}
                <div className="flex items-center gap-4 mb-6">
                  {/* Date Filter - Keep as Pill Button or Match Input Style? 
                      Screenshot showed a black pill button. I'll keep it but check height.
                      If it's next to h-14 inputs, maybe it should be bigger?
                      Screenshot showed it aligned.
                      I'll keep the pill button style as it seems specific to this view's "Next 3 months" selector.
                  */}
                  <button className="h-14 flex items-center gap-2 bg-neutral-900 text-white px-6 rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors">
                    <span>Next 3 months</span>
                    <img src={ICON_CALENDAR} alt="" className="w-4 h-4 invert" />
                  </button>

                  {/* Search Input - h-14 with floating label style */}
                  <div className="flex-1 relative max-w-md">
                    <div className="w-full h-14 px-3 rounded-lg border border-border-main flex flex-col justify-center relative bg-neutral-50">
                         {/* Icon? Screenshot showed icon inside. */}
                         <div className="absolute left-3 top-1/2 -translate-y-1/2">
                            <img src={ICON_SEARCH} alt="" className="w-4 h-4 text-text-subtle opacity-50" />
                         </div>
                         <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full h-full pl-8 bg-transparent border-none text-base text-text-main placeholder:text-transparent focus:ring-0"
                          placeholder="Search by reservation ID..."
                        />
                        {!searchQuery && (
                          <span className="absolute left-10 top-1/2 -translate-y-1/2 text-text-subtle text-sm pointer-events-none">Search by reservation ID, recipient or business</span>
                        )}
                        {searchQuery && (
                           <label className="absolute left-10 top-2 text-[10px] text-text-subtle font-semibold pointer-events-none">
                             Search by reservation ID...
                           </label>
                        )}
                    </div>
                  </div>

                  {/* Status Dropdown - h-14 */}
                  <div className="w-48 h-14 px-3 rounded-lg border border-border-main flex flex-col justify-center relative bg-neutral-50 cursor-pointer hover:border-text-subtle transition-colors">
                      <label className="text-text-subtle text-xs font-semibold absolute top-2 left-3">Status</label>
                      <div className="pt-4 flex items-center justify-between">
                          <span className="text-text-main text-sm">To be paid, Paid</span>
                          <img src={ICON_CHEVRON_DOWN} alt="" className="w-3 h-1.5 text-text-subtle" />
                      </div>
                  </div>

                  {/* Business Type Dropdown - h-14 */}
                  <div className="w-48 h-14 px-3 rounded-lg border border-border-main flex flex-col justify-center relative bg-neutral-50 cursor-pointer hover:border-text-subtle transition-colors">
                      <label className="text-text-subtle text-xs font-semibold absolute top-2 left-3">Business Type</label>
                      <div className="pt-4 flex items-center justify-between">
                          <span className="text-text-main text-sm">All types</span>
                          <img src={ICON_CHEVRON_DOWN} alt="" className="w-3 h-1.5 text-text-subtle" />
                      </div>
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

                {/* Main Table Area */}
                <div className="border border-border-subtle rounded-lg flex-1 flex flex-col overflow-hidden">
                   {/* Table Header */}
                   <div className="grid grid-cols-[auto_1fr_1fr_auto_1fr_auto_auto_auto_auto] gap-4 px-6 py-3 bg-neutral-100 border-b border-border-subtle text-xs font-semibold text-text-subtle">
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
        </div>
      </div>
    </div>
  );
}
