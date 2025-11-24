import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { useBusinessStore } from '../stores/businessStore';

// Placeholder illustration since we don't have the asset
// Removed as requested

const ICON_CHEVRON_DOWN = '/icons/chevron-down.svg';

export default function MakeReservation() {
  const navigate = useNavigate();
  const businesses = useBusinessStore((state) => state.businesses);
  const enabledBusinesses = businesses.filter(b => b.enabled);

  const [selectedBusinessId, setSelectedBusinessId] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedBusiness = businesses.find(b => b.id === selectedBusinessId);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelectBusiness = (id: string) => {
    setSelectedBusinessId(id);
    setIsDropdownOpen(false);
  };

  const handleContinue = () => {
    if (selectedBusinessId) {
      navigate('/reservations/create/event');
    }
  };

  return (
    <div className="h-screen flex flex-col bg-neutral-50">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          {/* Header Area */}
          <div className="bg-background-contrast px-8 py-6">
            <h1 className="text-white text-2xl font-bold">Make a reservation</h1>
          </div>

          {/* Main Content */}
          <div className="p-8">
            <div className="bg-white rounded-lg shadow-sm border border-border-main">
              <div className="flex flex-col md:flex-row">
                {/* Left Side: Form */}
                <div className="flex-1 p-8">
                  <h2 className="text-xl font-bold text-text-main mb-2">Select a business</h2>
                  <p className="text-text-subtle text-sm mb-8">
                    In order to create a reservation, you must select a business.
                  </p>

                  {/* Business Dropdown */}
                  <div className="relative max-w-md" ref={dropdownRef}>
                    <div
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className={`w-full h-14 px-4 rounded-lg border flex items-center justify-between cursor-pointer transition-colors ${
                        isDropdownOpen
                          ? 'border-primary-main ring-1 ring-primary-main'
                          : 'border-border-main hover:border-text-subtle'
                      }`}
                    >
                      <span className={`${selectedBusiness ? 'text-text-main' : 'text-text-subtle'} text-base`}>
                        {selectedBusiness ? selectedBusiness.name : 'Business name'}
                      </span>
                      <img
                        src={ICON_CHEVRON_DOWN}
                        alt=""
                        className={`w-3.5 h-2 text-text-subtle transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                      />
                    </div>

                    {isDropdownOpen && (
                      <div className="absolute top-full left-0 w-full mt-1 bg-white rounded-lg shadow-lg border border-border-main py-2 z-50 max-h-[300px] overflow-y-auto">
                        {enabledBusinesses.map((business) => (
                          <div
                            key={business.id}
                            onClick={() => handleSelectBusiness(business.id)}
                            className="px-4 py-3 hover:bg-neutral-50 cursor-pointer text-sm text-text-main"
                          >
                            {business.name}
                          </div>
                        ))}
                        {enabledBusinesses.length === 0 && (
                          <div className="px-4 py-3 text-sm text-text-subtle italic">
                            No enabled businesses found
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Side: Empty space */}
                <div className="flex-1 flex items-center justify-center p-8 bg-neutral-50 md:bg-white">
                  {/* Illustration removed as requested */}
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="px-8 py-4 border-t border-border-main flex justify-end gap-4 bg-white">
                <button
                  onClick={() => navigate('/reservations/overview')}
                  className="h-10 px-6 rounded-full border border-border-main text-sm font-semibold text-text-main hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleContinue}
                  disabled={!selectedBusinessId}
                  className={`h-10 px-6 rounded-full text-sm font-semibold transition-colors ${
                    selectedBusinessId
                      ? 'bg-action-primary text-white hover:bg-action-primary-hover'
                      : 'bg-neutral-100 text-text-subtle cursor-not-allowed'
                  }`}
                >
                  Select business
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

