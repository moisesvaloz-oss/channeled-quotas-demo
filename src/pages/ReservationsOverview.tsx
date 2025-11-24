import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

// Icon assets
const ICON_CALENDAR = '/icons/calendar.svg';
const ICON_SEARCH = '/icons/search.svg';
const ICON_CHEVRON_DOWN = '/icons/chevron-down.svg';
const ICON_INFO = '/icons/info.svg';
const ICON_CLOSE = '/icons/close.svg';
const ICON_CHECK = '/icons/check.svg';

const STATUS_OPTIONS = ['To be paid', 'Paid', 'Cancelled', 'Expired'];

export default function ReservationsOverview() {
  const navigate = useNavigate();
  // Force refresh
  const [showGuideBanner, setShowGuideBanner] = useState(true);
  const [selectedCity, setSelectedCity] = useState('Chicago');
  const [selectedVenue, setSelectedVenue] = useState('Bolingbrook Golf Club');
  const [globalSearch, setGlobalSearch] = useState('LIV Golf Chicago 2025');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Status Dropdown State
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(['To be paid', 'Paid']);
  const statusDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
        setIsStatusDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleStatus = (status: string) => {
    setSelectedStatuses(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const getStatusLabel = () => {
    if (selectedStatuses.length === 0) return 'Select status';
    if (selectedStatuses.length === STATUS_OPTIONS.length) return 'All statuses';
    return selectedStatuses.join(', ');
  };

  return (
    <div className="h-screen flex flex-col bg-neutral-50">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          {/* Hero Section - EXACT copy of QuotaManagement style */}
          <div className="bg-background-contrast p-6">
            <div className="mb-4">
              <h1 className="text-white text-2xl font-bold">Reservations</h1>
            </div>
            <div className="flex gap-6">
              {/* City Dropdown */}
              <div className="bg-white border border-border-main rounded-sm h-14 px-3 flex flex-col justify-center relative flex-1 max-w-[386px] cursor-pointer">
                <label className="text-text-subtle text-xs font-semibold absolute top-0 left-3">City</label>
                <div className="pt-4 text-text-main text-base">{selectedCity}</div>
                <svg className="absolute right-3 top-[18px] w-5 h-5 text-text-main" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>

              {/* Global Search */}
              <div className="bg-white border border-border-main rounded-sm h-14 px-3 flex flex-col justify-center relative flex-1">
                 <label className="text-text-subtle text-xs font-semibold absolute top-0 left-3">Search or type event</label>
                 <div className="pt-4 flex items-center w-full">
                   <input
                    type="text"
                    value={globalSearch}
                    onChange={(e) => setGlobalSearch(e.target.value)}
                    className="w-full h-full bg-transparent border-none text-base text-text-main placeholder:text-transparent focus:ring-0 p-0"
                    placeholder="Search or type event"
                  />
                 </div>
                 <svg className="absolute right-3 top-[18px] w-5 h-5 text-text-main pointer-events-none" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                 </svg>
              </div>

              {/* Venue Dropdown - Narrower width */}
              <div className="bg-white border border-border-main rounded-sm h-14 px-3 flex flex-col justify-center relative w-[240px] cursor-pointer flex-none">
                <label className="text-text-subtle text-xs font-semibold absolute top-0 left-3">Venue</label>
                <div className="pt-4 text-text-main text-base truncate pr-4">{selectedVenue}</div>
                <svg className="absolute right-3 top-[18px] w-5 h-5 text-text-main" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>

              {/* Show Button - Outlined and Wider */}
              <button className="h-14 w-[200px] rounded-full bg-transparent border-2 border-white text-white font-semibold text-base hover:bg-white/10 transition-colors whitespace-nowrap flex-none">
                Show
              </button>
            </div>
          </div>

          {/* Main Content Area - Matching QuotaManagement padding and shadow EXACTLY */}
          <div className="p-4">
            <div className="bg-white rounded-lg shadow-[0px_6px_6px_0px_rgba(0,70,121,0.2)] p-6 min-h-[600px] flex flex-col overflow-visible">
                
                {/* Header Section */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-text-main">Reservations Overview</h2>
                  <button 
                    onClick={() => navigate('/reservations/create')}
                    className="bg-action-primary hover:bg-action-primary-hover text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-colors"
                  >
                    Make a reservation
                  </button>
                </div>

                {/* Filters Bar */}
                <div className="flex items-center gap-4 mb-6 relative z-20">
                  {/* Date Filter - Dark Blue Pill Button */}
                  <button className="h-10 flex items-center gap-2 bg-background-contrast text-white px-4 rounded-full text-sm font-medium hover:opacity-90 transition-opacity">
                    <span>Next 3 months</span>
                    <img src={ICON_CALENDAR} alt="" className="w-4 h-4 invert" />
                  </button>

                  {/* Search Input */}
                  <div className="flex-1 relative max-w-md">
                    <div className="w-full h-10 px-3 rounded-lg bg-neutral-100 flex items-center">
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

                  {/* Status Dropdown - Multi-select */}
                  <div className="relative w-48" ref={statusDropdownRef}>
                    <div 
                      onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                      className={`w-full h-10 px-3 rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                        isStatusDropdownOpen 
                          ? 'bg-white border border-action-primary ring-1 ring-action-primary' 
                          : 'bg-neutral-100 hover:bg-neutral-200'
                      }`}
                    >
                        <div className="flex flex-col justify-center truncate pr-2">
                           <span className="text-text-subtle text-sm truncate">{getStatusLabel()}</span>
                        </div>
                        <img 
                          src={ICON_CHEVRON_DOWN} 
                          alt="" 
                          className={`w-3 h-1.5 text-text-subtle transition-transform duration-200 ${isStatusDropdownOpen ? 'rotate-180' : ''}`} 
                        />
                    </div>

                    {/* Dropdown Menu */}
                    {isStatusDropdownOpen && (
                      <div className="absolute top-full left-0 w-[240px] mt-1 bg-white rounded-md shadow-lg border border-border-main z-50">
                        {/* Options - No search bar */}
                        <div className="max-h-[200px] overflow-y-auto py-1">
                          {STATUS_OPTIONS.map(status => {
                            const isSelected = selectedStatuses.includes(status);
                            return (
                              <div 
                                key={status}
                                onClick={() => toggleStatus(status)}
                                className={`px-3 py-2 flex items-center gap-2.5 cursor-pointer hover:bg-neutral-50 transition-colors ${isSelected ? 'bg-blue-50' : ''}`}
                              >
                                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                                  isSelected ? 'bg-action-primary border-action-primary' : 'bg-white border-gray-300'
                                }`}>
                                  {isSelected && (
                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                  )}
                                </div>
                                <span className="text-sm text-text-main">{status}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Business Type Dropdown */}
                  <div className="w-48 h-10 px-3 rounded-lg bg-neutral-100 flex items-center justify-between cursor-pointer hover:bg-neutral-200 transition-colors">
                      <span className="text-text-subtle text-sm">Business Type</span>
                      <img src={ICON_CHEVRON_DOWN} alt="" className="w-3 h-1.5 text-text-subtle" />
                  </div>
                </div>

                {/* Results Count & Actions */}
                <div className="flex items-center gap-3 mb-4 relative z-10">
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
                <div className="w-full rounded-lg overflow-hidden border border-border-main flex flex-col flex-1 relative z-0">
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

          <Footer />
        </div>
      </div>
    </div>
  );
}
