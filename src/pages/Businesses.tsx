import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const ICON_ANGLE_DOWN = '/icons/angle-down.svg';

const businesses = [
  {
    name: "Acme Demo",
    phone: "92947083513",
    email: "alejandro.sagrado+acme@gmail.com",
    type: "Corporate",
    contactName: "Alex",
    contactPhone: "+1 63729182391",
    address: "242 Greene St",
    enabled: true,
  },
  {
    name: "Complimentary - Bunkers",
    email: "joe.occorso+73@livgolf.com",
    type: "Educational",
    contactName: "Joe Occorso",
    contactPhone: "15512062541",
    enabled: true,
  },
  {
    name: "Complimentary - Employee",
    email: "joe.occorso+46@livgolf.com",
    type: "Educational",
    contactName: "Joseph",
    contactPhone: "551-206-2541",
    enabled: true,
  },
  {
    name: "Complimentary - LIV Golf",
    email: "joe.occorso+45@livgolf.com",
    type: "Educational",
    contactName: "Joseph",
    contactPhone: "5512062541",
    enabled: true,
  },
  {
    name: "Complimentary - Marketing",
    email: "joe.occorso+52@livgolf.com",
    type: "Educational",
    contactName: "Joseph",
    contactPhone: "5512062541",
    enabled: true,
  },
  {
    name: "Complimentary - Military",
    email: "joe.occorso+49@livgolf.com",
    type: "Educational",
    contactName: "Joseph",
    contactPhone: "5512062541",
    enabled: true,
  },
  {
    name: "Complimentary - Resolution",
    email: "joe.occorso+51@livgolf.com",
    type: "Educational",
    contactName: "Joseph",
    contactPhone: "5512062541",
    enabled: true,
  },
  {
    name: "Complimentary - Service",
    email: "joe.occorso+47@livgolf.com",
    type: "Educational",
    contactName: "Joseph",
    contactPhone: "5512062541",
    enabled: true,
  },
];

export default function Businesses() {
  return (
    <div className="h-screen flex flex-col bg-background-main">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto p-8">
          <div className="flex flex-col gap-6">
            <h1 className="text-white text-xl font-semibold">Businesses</h1>
            
            <div className="bg-white rounded-lg shadow-sm border border-border-main p-6 min-h-[600px]">
              {/* Controls */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex gap-4">
                  {/* Search */}
                  <div className="relative w-[280px]">
                    <input
                      type="text"
                      placeholder="Search by name or email"
                      className="w-full h-10 pl-3 pr-10 rounded border border-border-main text-sm placeholder:text-text-subtle focus:outline-none focus:border-primary-main"
                    />
                  </div>
                  
                  {/* Type Select */}
                  <div className="relative w-[200px]">
                    <select className="w-full h-10 pl-3 pr-10 rounded border border-border-main text-sm text-text-main focus:outline-none focus:border-primary-main appearance-none bg-white cursor-pointer">
                      <option value="">Business type</option>
                      <option value="Corporate">Corporate</option>
                      <option value="Educational">Educational</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <img src={ICON_ANGLE_DOWN} alt="" className="w-3 h-3 text-text-subtle" />
                    </div>
                  </div>
                </div>
                
                <button className="h-10 px-6 bg-primary-main hover:bg-primary-hover text-white text-sm font-semibold rounded transition-colors">
                  Add new business
                </button>
              </div>

              {/* Table */}
              <div className="w-full">
                <div className="grid grid-cols-[2fr,1fr,1.5fr,1.5fr,1fr] gap-4 px-4 py-3 bg-neutral-75 rounded-t-lg border-b border-border-main">
                  <div className="text-xs font-semibold text-text-subtle">Name</div>
                  <div className="text-xs font-semibold text-text-subtle">Type</div>
                  <div className="text-xs font-semibold text-text-subtle">Contact</div>
                  <div className="text-xs font-semibold text-text-subtle">Address</div>
                  <div className="text-xs font-semibold text-text-subtle text-right">Permissions</div>
                </div>
                
                <div className="flex flex-col">
                  {businesses.map((business, index) => (
                    <div key={index} className={`grid grid-cols-[2fr,1fr,1.5fr,1.5fr,1fr] gap-4 px-4 py-4 items-start ${index !== businesses.length - 1 ? 'border-b border-border-main' : ''}`}>
                      {/* Name */}
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-semibold text-text-main">{business.name}</span>
                        {business.phone && (
                          <div className="flex items-center gap-1 text-xs text-text-subtle">
                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 12.284 3 4V5z" />
                            </svg>
                            {business.phone}
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-xs text-text-subtle truncate">
                          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          {business.email}
                        </div>
                      </div>

                      {/* Type */}
                      <div>
                        <span className={`inline-flex items-center px-3 py-1 rounded border text-xs font-medium ${
                          business.type === 'Corporate' 
                            ? 'bg-white border-status-danger text-status-danger' 
                            : 'bg-white border-text-main text-text-main'
                        }`}>
                          {business.type}
                        </span>
                      </div>

                      {/* Contact */}
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm text-text-main font-medium">{business.contactName}</span>
                        <span className="text-xs text-text-subtle">{business.contactPhone}</span>
                      </div>

                      {/* Address */}
                      <div>
                        <span className="text-sm text-text-main">{business.address || ''}</span>
                      </div>

                      {/* Permissions */}
                      <div className="flex justify-end">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded border border-status-success text-status-success text-xs font-medium bg-white">
                          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                          Enabled
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

