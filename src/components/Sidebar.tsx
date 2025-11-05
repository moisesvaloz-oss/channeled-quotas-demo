export default function Sidebar() {
  const menuItems = [
    { name: 'Events List', active: false },
    { name: 'Dashboard', active: false },
    { name: 'Content', active: false },
    { name: 'General Settings', active: false },
    { name: 'Schedule & Tickets', active: true },
    { name: 'Time Slots', active: false },
    { name: 'Attendees', active: false },
    { name: 'Invitations', active: false },
    { name: 'Reviews', active: false },
  ];

  const mainMenuItems = [
    'Validation',
    'Orders',
    'Reservations',
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

  return (
    <div className="w-sidebar bg-background-contrast border-r border-border-contrast h-full flex flex-col">
      <div className="p-6 flex flex-col gap-8">
        {/* Events Section */}
        <div className="flex flex-col gap-1">
          <div className="bg-background-secondary rounded-sm px-3 h-10 flex items-center gap-1">
            <span className="text-white text-base">Events</span>
            <div className="flex-1" />
            <svg className="w-5 h-5 text-neutral-100" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
          <div className="border-b border-dashed border-border-contrast pl-6 pb-1 flex flex-col gap-1">
            {menuItems.map((item, index) => (
              <div
                key={index}
                className={`px-3 py-1 rounded-sm h-10 flex items-center ${
                  item.active ? 'bg-background-secondary' : ''
                }`}
              >
                <span className="text-white text-base">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Menu Items */}
        <div className="flex flex-col gap-1">
          {mainMenuItems.map((item, index) => (
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

