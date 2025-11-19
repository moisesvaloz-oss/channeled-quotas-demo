import { useState, useRef, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import AddBusinessDrawer from '../components/AddBusinessDrawer';
import type { BusinessFormData } from '../components/AddBusinessDrawer';
import { useBusinessStore } from '../stores/businessStore';
import type { Business } from '../stores/businessStore';

const ICON_CHEVRON_DOWN = '/icons/chevron-down.svg';
const businessTypes = [
  'All business types',
  'Agency',
  'Corporate',
  'Cultural',
  'Educational',
  'Guide',
  'Internal operations',
  'Large Group',
  'Partnerships',
  'Premium Services',
  'Sales Representative'
];

// Business type color mapping
const getBusinessTypeColor = (type: string): string => {
  const colorMap: { [key: string]: string } = {
    'Agency': 'border-purple-500 text-purple-700',
    'Corporate': 'border-pink-500 text-pink-700',
    'Cultural': 'border-blue-500 text-blue-700',
    'Educational': 'border-green-500 text-green-700',
    'Guide': 'border-yellow-500 text-yellow-700',
    'Internal operations': 'border-gray-500 text-gray-700',
    'Large Group': 'border-orange-500 text-orange-700',
    'Partnerships': 'border-teal-500 text-teal-700',
    'Premium Services': 'border-indigo-500 text-indigo-700',
    'Sales Representative': 'border-cyan-500 text-cyan-700'
  };
  return colorMap[type] || 'border-gray-400 text-gray-600';
};

export default function Businesses() {
  const businesses = useBusinessStore((state) => state.businesses);
  const addBusiness = useBusinessStore((state) => state.addBusiness);
  const updateBusiness = useBusinessStore((state) => state.updateBusiness);
  const deleteBusiness = useBusinessStore((state) => state.deleteBusiness);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [businessType, setBusinessType] = useState('All business types');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSaveBusiness = (businessData: BusinessFormData) => {
    if (editingBusiness) {
      // Update existing business
      updateBusiness(editingBusiness.id, businessData);
      setEditingBusiness(null);
    } else {
      // Create new business
      const newBusiness: Business = {
        id: crypto.randomUUID(),
        ...businessData,
      };
      addBusiness(newBusiness);
    }
  };

  const handleDeleteBusiness = (businessId: string) => {
    deleteBusiness(businessId);
    setIsDrawerOpen(false);
    setEditingBusiness(null);
  };

  const handleEditBusiness = (business: Business) => {
    setEditingBusiness(business);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setEditingBusiness(null);
  };

  // Filter businesses based on search query and business type
  const filteredBusinesses = businesses.filter((business) => {
    const matchesSearch = 
      business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (business.email && business.email.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = 
      businessType === 'All business types' || business.type === businessType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="h-screen flex flex-col bg-background-main">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto flex flex-col">
          {/* Banner */}
          <div className="bg-background-contrast px-8 py-6">
            <h1 className="text-white text-xl font-semibold">Businesses</h1>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="bg-white rounded-lg shadow-sm border border-border-main p-6 min-h-[600px] flex flex-col">
              {/* Controls */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex gap-4">
                  {/* Search */}
                  <div className="relative w-[280px]">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by name or email"
                      className={`w-full h-14 px-3 rounded-lg border border-border-main text-base placeholder:text-background-subtle-medium focus:outline-none focus:border-primary-main focus:ring-1 focus:ring-primary-main ${
                        searchQuery ? 'pt-4' : ''
                      }`}
                    />
                    {searchQuery && (
                      <label className="absolute top-2 left-3 text-xs font-semibold text-text-subtle pointer-events-none">
                        Search by name or email
                      </label>
                    )}
                  </div>
                  
                  {/* Type Select */}
                  <div className="relative w-[280px]" ref={dropdownRef}>
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className={`w-full h-14 px-3 pr-10 rounded-lg border text-left relative bg-white transition-colors ${
                        isDropdownOpen ? 'border-primary-main ring-1 ring-primary-main' : 'border-border-main hover:border-text-subtle'
                      }`}
                    >
                      <label className="absolute top-2 left-3 text-xs font-semibold text-text-subtle pointer-events-none">
                        Business type
                      </label>
                      <div className="pt-4 text-base text-text-main truncate pr-6">
                        {businessType}
                      </div>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <img 
                          src={ICON_CHEVRON_DOWN} 
                          alt="" 
                          className={`w-[14px] h-[7px] text-text-subtle transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                        />
                      </div>
                    </button>

                    {isDropdownOpen && (
                      <div className="absolute top-full left-0 w-full mt-1 bg-white border border-border-main rounded shadow-lg z-10 py-1 max-h-[300px] overflow-y-auto">
                        {businessTypes.map((type) => (
                          <div
                            key={type}
                            className={`px-3 py-2 text-sm cursor-pointer hover:bg-neutral-50 ${
                              type === businessType ? 'font-semibold text-text-main' : 'text-text-main'
                            }`}
                            onClick={() => {
                              setBusinessType(type);
                              setIsDropdownOpen(false);
                            }}
                          >
                            {type}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <button 
                  onClick={() => setIsDrawerOpen(true)}
                  className="h-10 px-6 bg-action-primary hover:bg-action-primary-hover text-white text-base font-semibold rounded-full transition-colors cursor-pointer relative z-10"
                >
                  Add new business
                </button>
              </div>

              {/* Table */}
              <div className="w-full rounded-lg overflow-hidden mb-auto">
                {/* Table Header */}
                <div className="bg-neutral-75 px-4 py-3 grid grid-cols-[2fr_1fr_1.2fr_1.2fr_1fr] gap-4 items-center">
                  <div className="text-sm font-semibold text-text-subtle">Name</div>
                  <div className="text-sm font-semibold text-text-subtle">Type</div>
                  <div className="text-sm font-semibold text-text-subtle">Contact</div>
                  <div className="text-sm font-semibold text-text-subtle">Address</div>
                  <div className="text-sm font-semibold text-text-subtle">Permissions</div>
                </div>
                
                {/* Table Body */}
                <div className="flex flex-col bg-white">
                  {filteredBusinesses.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-text-subtle gap-4">
                      <svg className="w-16 h-16 text-background-subtle-medium" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="3" y="6" width="18" height="15" rx="2" />
                        <path d="M3 10h18M8 6V4M16 6V4" />
                        <circle cx="17" cy="17" r="5" fill="white" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M17 15v2M17 20h.01" strokeLinecap="round"/>
                      </svg>
                      <p className="text-base text-text-subtle">You don't have any businesses added to your organization</p>
                    </div>
                  ) : (
                    filteredBusinesses.map((business, index) => (
                      <div 
                        key={business.id} 
                        onClick={() => handleEditBusiness(business)}
                        className={`px-4 py-4 grid grid-cols-[2fr_1fr_1.2fr_1.2fr_1fr] gap-4 items-center cursor-pointer hover:bg-neutral-50 transition-colors ${index !== filteredBusinesses.length - 1 ? 'border-b border-border-main' : ''}`}
                      >
                        {/* Name */}
                        <div className="flex items-center">
                          <span className="text-base font-semibold text-text-main truncate">{business.name}</span>
                        </div>

                        {/* Type */}
                        <div className="flex items-center">
                          <span className={`inline-flex items-center px-3 py-1 rounded border text-sm font-medium bg-white ${getBusinessTypeColor(business.type)}`}>
                            {business.type}
                          </span>
                        </div>

                        {/* Contact */}
                        <div className="flex flex-col gap-0.5">
                          <span className="text-base text-text-main font-medium truncate">{business.contactName}</span>
                          <span className="text-sm text-text-subtle truncate">{business.contactPhone}</span>
                        </div>

                        {/* Address */}
                        <div className="flex items-start">
                          <span className="text-base text-text-main truncate block">{business.address || ''}</span>
                        </div>

                        {/* Permissions */}
                        <div className="flex items-center justify-end">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-green-500 bg-white text-green-700 text-sm font-medium">
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Enabled
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Add Business Drawer */}
      <AddBusinessDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        onSave={handleSaveBusiness}
        onDelete={editingBusiness ? () => handleDeleteBusiness(editingBusiness.id) : undefined}
        editingBusiness={editingBusiness}
      />
    </div>
  );
}
