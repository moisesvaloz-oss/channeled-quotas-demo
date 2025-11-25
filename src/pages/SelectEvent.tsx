import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const ICON_CHEVRON_DOWN = '/icons/chevron-down.svg';

export default function SelectEvent() {
  const navigate = useNavigate();
  
  // Mock data for the single event
  const event = {
    id: '1',
    name: 'LIV Golf Chicago 2025',
    image: '/images/liv-golf-event.jpg',
    location: 'Bolingbrook Golf Club',
    city: 'Chicago',
    dates: ['Fri 25 Jul', 'Sat 26 Jul', 'Sun 27 Jul'],
    status: 'For sale'
  };

  return (
    <div className="h-screen flex flex-col bg-neutral-50">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 overflow-auto flex flex-col bg-background-contrast">
          {/* Hero Section */}
          <div className="bg-background-contrast px-8 py-6">
            <button 
              onClick={() => navigate('/reservations/create')}
              className="text-white text-sm font-semibold mb-4 flex items-center gap-2 hover:underline"
            >
              <span className="text-lg">‹</span> Back
            </button>
            <h1 className="text-white text-2xl font-bold mb-6">Make a reservation</h1>
            
            {/* Filters */}
            <div className="flex gap-4">
              {/* City */}
              <div className="bg-white border border-border-main rounded-sm h-14 px-3 flex flex-col justify-center relative w-64 cursor-pointer">
                <label className="text-text-subtle text-xs font-semibold">City</label>
                <div className="flex items-center justify-between">
                  <div className="text-text-main text-base">Chicago</div>
                  <img src={ICON_CHEVRON_DOWN} alt="" className="w-3 h-2 absolute right-3" />
                </div>
              </div>

              {/* Venue */}
              <div className="bg-white border border-border-main rounded-sm h-14 px-3 flex flex-col justify-center relative w-64 cursor-pointer">
                <label className="text-text-subtle text-xs font-semibold">Venue</label>
                <div className="flex items-center justify-between">
                  <div className="text-text-main text-base">Bolingbrook Golf Club</div>
                  <img src={ICON_CHEVRON_DOWN} alt="" className="w-3 h-2 absolute right-3" />
                </div>
              </div>

              {/* Event */}
              <div className="bg-white border border-border-main rounded-sm h-14 px-3 flex flex-col justify-center relative flex-1 cursor-pointer">
                <label className="text-text-subtle text-xs font-semibold">Event</label>
                <div className="flex items-center justify-between">
                  <div className="text-text-main text-base">{event.name}</div>
                  <img src={ICON_CHEVRON_DOWN} alt="" className="w-3 h-2 absolute right-3" />
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 bg-neutral-50 p-8">
            <div className="bg-white rounded-lg border border-border-main p-6">
              {/* Page Title */}
              <h2 className="text-2xl font-bold text-text-main mb-2">Available events</h2>
              <p className="text-text-subtle text-base mb-6">
                Select an available event and start a new reservation
              </p>

              {/* Results Count */}
              <div className="text-sm font-semibold text-text-main mb-4">
                1 events with the filters applied
              </div>

              {/* Table */}
              <div className="rounded-lg border border-border-main overflow-hidden">
                {/* Table Header */}
                <div className="bg-neutral-75 px-6 py-3 grid grid-cols-[auto_1fr_200px_120px] gap-6 items-center border-b border-border-main">
                  <div className="w-16"></div>
                  <div className="flex items-center gap-2 cursor-pointer hover:text-text-main">
                    <span className="text-sm font-semibold text-text-subtle">Event</span>
                    <svg className="w-3 h-3 text-text-subtle" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M7 15l5 5 5-5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M7 9l5-5 5 5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="text-sm font-semibold text-text-subtle">Dates</div>
                  <div className="flex items-center gap-2 cursor-pointer hover:text-text-main">
                    <span className="text-sm font-semibold text-text-subtle">Status</span>
                    <svg className="w-3 h-3 text-text-subtle" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M7 15l5 5 5-5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M7 9l5-5 5 5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>

                {/* Table Body */}
                <div className="bg-white divide-y divide-border-main">
                  {/* Event Row */}
                  <div 
                    className="px-6 py-4 grid grid-cols-[auto_1fr_200px_120px] gap-6 items-start hover:bg-neutral-50 cursor-pointer transition-colors"
                    onClick={() => navigate('/reservations/create/tickets')}
                  >
                    {/* Event Image */}
                    <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                      <img 
                        src={event.image} 
                        alt={event.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Event Info */}
                    <div className="flex flex-col gap-1">
                      <h3 className="text-base font-semibold text-text-main">
                        {event.name}
                      </h3>
                      <div className="text-sm text-text-subtle">
                        {event.city} - {event.location}
                      </div>
                      <div className="text-sm text-text-subtle">
                        2001 Rodeo Drive, Bolingbrook 60490
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="flex flex-col gap-1">
                      {event.dates.map((date, index) => (
                        <div key={index} className="text-sm text-text-main">
                          {date}
                        </div>
                      ))}
                    </div>

                    {/* Status */}
                    <div className="flex items-start">
                      <span className="inline-flex items-center px-2.5 py-1 rounded border border-green-500 bg-white text-green-700 text-sm font-medium">
                        {event.status}
                      </span>
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

