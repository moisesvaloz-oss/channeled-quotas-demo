import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const [reservationsOpen, setReservationsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes('businesses') || location.pathname.includes('reservations')) {
      setReservationsOpen(true);
    }
  }, [location.pathname]);

  const menuItems = [
    { name: 'Events List', path: '/', active: false },
    { name: 'Dashboard', path: '/', active: false },
    { name: 'Content', path: '/', active: false },
    { name: 'General Settings', path: '/', active: false },
    { name: 'Schedule & Tickets', path: '/quota-management', active: location.pathname === '/quota-management' },
    { name: 'Time Slots', path: '/', active: false },
    { name: 'Attendees', path: '/', active: false },
    { name: 'Invitations', path: '/', active: false },
    { name: 'Reviews', path: '/', active: false },
  ];

  const mainMenuItems = [
    'Validation',
    'Orders',
    'Memberships',
    'Box Office',
    'Marketing',
    'Analytics',
    'Channels',
    'Venues',
    'Finance',
    'Settings',
    'Organizations',
    'Log out',
  ];

  const reservationsSubItems = [
    { name: 'Overview', path: '/reservations/overview' },
    { name: 'Rules', path: '/reservations/rules' },
    { name: 'Businesses', path: '/businesses' },
  ];

  const isReservationsActive = location.pathname.includes('businesses') || location.pathname.includes('reservations');

  return (
    <div className="w-sidebar bg-background-contrast border-r border-border-contrast h-full flex flex-col">
      <div className="p-6 flex flex-col gap-8">
        {/* Events Section */}
        <div className="flex flex-col gap-1">
          <Link to="/" className="bg-background-secondary rounded-sm px-3 h-10 flex items-center gap-1 text-white hover:text-white no-underline">
            <span className="text-base">Events</span>
            <div className="flex-1" />
            <svg className="w-5 h-5 text-neutral-100" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </Link>
          <div className="border-b border-dashed border-border-contrast pl-6 pb-1 flex flex-col gap-1">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className={`px-3 py-1 rounded-sm h-10 flex items-center text-white hover:text-white no-underline ${
                  item.active ? 'bg-background-secondary' : ''
                }`}
              >
                <span className="text-base">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Main Menu Items */}
        <div className="flex flex-col gap-1">
          {mainMenuItems.slice(0, 2).map((item, index) => (
            <div key={index} className="px-3 h-10 flex items-center gap-1 rounded-sm">
              <span className="text-white text-base">{item}</span>
            </div>
          ))}
          
          {/* Reservations with submenu */}
          <div className="flex flex-col">
            <div 
              className={`px-3 h-10 flex items-center gap-1 rounded-sm cursor-pointer ${isReservationsActive ? 'bg-background-secondary' : ''}`}
              onClick={() => setReservationsOpen(!reservationsOpen)}
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="6" width="18" height="15" rx="2" strokeWidth="2"/>
                <path d="M3 10h18M8 6V4M16 6V4" strokeWidth="2"/>
              </svg>
              <span className="text-white text-base">Reservations</span>
              <div className="flex-1 flex justify-end">
                <svg 
                  className={`w-5 h-5 text-neutral-100 transition-transform duration-200 ${reservationsOpen ? 'rotate-180' : ''}`} 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
            
            {/* Reservations Submenu */}
            <div className={`overflow-hidden transition-all duration-200 ease-out ${reservationsOpen ? 'max-h-[500px]' : 'max-h-0'}`}>
              <div className="pl-6 flex flex-col">
                {reservationsSubItems.map((subItem, index) => (
                  <Link 
                    key={index} 
                    to={subItem.path}
                    className={`px-3 h-10 flex items-center rounded-sm text-white hover:text-white no-underline ${
                      location.pathname === subItem.path ? 'bg-background-secondary' : ''
                    }`}
                  >
                    <span className="text-base">{subItem.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          
          {mainMenuItems.slice(2).map((item, index) => (
            <div key={index} className="px-3 h-10 flex items-center gap-1 rounded-sm">
              <span className="text-white text-base">{item}</span>
              {(item === 'Channels' || item === 'Settings') && (
                <div className="flex-1 flex justify-end">
                  <svg className="w-5 h-5 text-neutral-100" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
