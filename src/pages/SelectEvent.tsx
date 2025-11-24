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
    location: 'Bolingbrook Golf Club',
    city: 'Chicago',
    dates: '13 Sep 2025\n15 Sep 2025',
    status: 'For sale'
  };

  return (
    <div className="min-h-screen flex flex-col bg-background-contrast">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-auto bg-background-contrast">
          
          {/* Header Section */}
          <div className="px-8 pt-6 pb-8">
            <button 
              onClick={() => navigate('/reservations/create')}
              className="text-white text-sm font-semibold mb-4 flex items-center gap-2 hover:underline"
            >
              <span className="text-lg">‹</span> Back
            </button>
            <h1 className="text-white text-2xl font-bold">Make a reservation</h1>
            
            {/* Filters */}
            <div className="flex gap-4 mt-6">
              {/* City */}
              <div className="w-64 h-14 bg-white rounded-lg px-4 flex items-center justify-between cursor-pointer">
                <div className="flex flex-col justify-center">
                  <span className="text-xs text-text-subtle font-semibold">City</span>
                  <span className="text-sm text-text-main">Chicago</span>
                </div>
                <img src={ICON_CHEVRON_DOWN} alt="" className="w-3 h-2 text-text-main" />
              </div>

              {/* Venue */}
              <div className="w-64 h-14 bg-white rounded-lg px-4 flex items-center justify-between cursor-pointer">
                <div className="flex flex-col justify-center">
                  <span className="text-xs text-text-subtle font-semibold">Venue</span>
                  <span className="text-sm text-text-main">Bolingbrook Golf Club</span>
                </div>
                <img src={ICON_CHEVRON_DOWN} alt="" className="w-3 h-2 text-text-main" />
              </div>

              {/* Event */}
              <div className="flex-1 h-14 bg-white rounded-lg px-4 flex items-center justify-between cursor-pointer">
                <div className="flex flex-col justify-center">
                  <span className="text-xs text-text-subtle font-semibold">Event</span>
                  <span className="text-sm text-text-main">{event.name}</span>
                </div>
                <img src={ICON_CHEVRON_DOWN} alt="" className="w-3 h-2 text-text-main" />
              </div>
            </div>
          </div>

          {/* Content Card */}
          <div className="flex-1 bg-neutral-50 p-8">
            <div className="bg-white rounded-lg shadow-sm border border-border-main p-6 min-h-[400px]">
              <h2 className="text-xl font-bold text-text-main mb-2">Available events</h2>
              <p className="text-text-subtle text-sm mb-6">
                Select an available event and start a new reservation
              </p>

              <div className="text-sm text-text-subtle mb-4">
                1 events with the filters applied
              </div>

              {/* Table */}
              <div className="w-full">
                {/* Table Header */}
                <div className="bg-neutral-50 px-4 py-3 flex items-center border-b border-border-main">
                  <div className="flex-1 flex items-center gap-2 cursor-pointer">
                    <span className="text-sm font-semibold text-text-subtle">Event</span>
                    <img src={ICON_CHEVRON_DOWN} alt="" className="w-2 h-2 text-text-subtle opacity-50" />
                  </div>
                  <div className="w-48 text-sm font-semibold text-text-subtle">Dates</div>
                  <div className="w-32 flex items-center gap-2 cursor-pointer">
                    <span className="text-sm font-semibold text-text-subtle">Status</span>
                    <img src={ICON_CHEVRON_DOWN} alt="" className="w-2 h-2 text-text-subtle opacity-50" />
                  </div>
                </div>

                {/* Table Row */}
                <div 
                  onClick={() => navigate('/reservations/create/tickets')}
                  className="px-4 py-4 flex items-center border-b border-border-main hover:bg-neutral-50 cursor-pointer transition-colors"
                >
                  <div className="flex-1">
                    <div className="text-base font-semibold text-text-main mb-1">{event.name}</div>
                    <div className="text-xs text-text-subtle">{event.city} - {event.location}</div>
                    <div className="text-xs text-text-subtle">2001 Rodeo Drive, Bolingbrook 60490</div>
                  </div>
                  <div className="w-48 text-sm text-text-main whitespace-pre-line">
                    {event.dates}
                  </div>
                  <div className="w-32">
                    <span className="inline-block px-2 py-1 rounded border border-status-positive text-status-positive text-xs font-medium bg-white">
                      {event.status}
                    </span>
                  </div>
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

