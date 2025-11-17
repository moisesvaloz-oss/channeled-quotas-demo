import { useState, useEffect, useRef } from 'react';
import { useQuotaStore } from '../stores/quotaStore';
import type { Quota } from '../stores/quotaStore';

// Icon assets
const ICON_CHEVRON_DOWN = '/icons/chevron-down.svg';
const ICON_CHEVRON_RIGHT = '/icons/chevron-right.svg';
const ICON_TRASH = '/icons/trash.svg';
const ICON_ADD = '/icons/add.svg';
const ICON_CLOCK = '/icons/clock.svg';

interface AddQuotaDrawerProps {
  isOpen: boolean;
  onClose: (quotaCreated?: boolean) => void;
  capacityGroupName: string;
  timeSlot: string;
  editingQuota?: Quota | null;
  replicatingQuota?: Quota | null;
  validateCapacity: (groupName: string, capacity: number, excludeQuotaId?: string) => {
    isValid: boolean;
    maxAvailable: number;
    message: string;
  };
  initialTicketOption?: string;
}

export default function AddQuotaDrawer({ isOpen, onClose, capacityGroupName, timeSlot, editingQuota, replicatingQuota, validateCapacity, initialTicketOption }: AddQuotaDrawerProps) {
  const addQuota = useQuotaStore((state) => state.addQuota);
  const updateQuota = useQuotaStore((state) => state.updateQuota);
  
  const [isClosing, setIsClosing] = useState(false);
  const [capacityError, setCapacityError] = useState<string>('');
  const [applicationExpanded, setApplicationExpanded] = useState(true);
  const [replicationExpanded, setReplicationExpanded] = useState(true);
  const [quotaName, setQuotaName] = useState('');
  const [capacity, setCapacity] = useState('');
  const [quotaType, setQuotaType] = useState('');
  const [quotaTypeOpen, setQuotaTypeOpen] = useState(false);
  const [ticketOption, setTicketOption] = useState('');
  const [quotaNameFocused, setQuotaNameFocused] = useState(false);
  const [capacityFocused, setCapacityFocused] = useState(false);
  const [applicationOption, setApplicationOption] = useState('');
  const [replicationOption, setReplicationOption] = useState('');
  const [applicationSelectionOpen, setApplicationSelectionOpen] = useState(false);
  const [selectedApplicationValues, setSelectedApplicationValues] = useState<string[]>([]);
  const [dateRanges, setDateRanges] = useState([
    { id: 1, fromDate: '', toDate: '', weekdays: [] as string[], fromTime: '', toTime: '' }
  ]);
  const [openTimeDropdown, setOpenTimeDropdown] = useState<{ index: number; field: 'from' | 'to' } | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const applicationDropdownRef = useRef<HTMLDivElement>(null);
  const timeDropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const replicationSectionRef = useRef<HTMLDivElement>(null);
  const dateRangeRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const addDateButtonRef = useRef<HTMLButtonElement>(null);

  const quotaTypeOptions = ['Exclusive', 'Shared', 'Blocked'];
  
  // Generate hours (1-12), minutes (00-59), and periods (AM/PM) for scrollable picker
  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
  const periods = ['AM', 'PM'];
  
  const channelTypeOptions = [
    'Box Office',
    'Marketplace',
    'Affiliate Portal',
    'B2B Portals',
    'API',
    'Invitation',
    'Kiosk'
  ];
  
  const channelOptions = [
    'Fever marketplace',
    'whitelabel-liv-golf-chicago-marketplace',
    'Box office',
    'Reseller Educational Group',
    'Reseller Corporate Group',
    'Reseller Large Group',
    'Invitation',
    'BOLINGBROOKGC',
    'LIV GOLF DEPOSITS'
  ];
  
  const businessOptions = [
    'Complimentary - Marketing',
    'Complimentary - Employee',
    'Consignment - Logitix',
    'Consignment - EBG',
    'LIV Golf - Marketing',
    'LIV Golf - Partnership',
    'Partnership Fulfillment - Google',
    'Partnership Fulfillment - HSBC',
    'Sales Rep - Liam Ackerman',
    'Sales Rep - Aaron Clarke',
    'Ticket Ops - Joe Occorso'
  ];
  
  const getApplicationOptions = () => {
    if (applicationOption === 'channel-type') return channelTypeOptions;
    if (applicationOption === 'channels') return channelOptions;
    if (applicationOption === 'businesses') return businessOptions;
    return [];
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setQuotaTypeOpen(false);
      }
      if (applicationDropdownRef.current && !applicationDropdownRef.current.contains(event.target as Node)) {
        setApplicationSelectionOpen(false);
      }
      
      // Check time dropdowns
      if (openTimeDropdown) {
        const key = `${openTimeDropdown.index}-${openTimeDropdown.field}`;
        const ref = timeDropdownRefs.current[key];
        if (ref && !ref.contains(event.target as Node)) {
          setOpenTimeDropdown(null);
        }
      }
    }

    if (quotaTypeOpen || applicationSelectionOpen || openTimeDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [quotaTypeOpen, applicationSelectionOpen, openTimeDropdown]);

  // Scroll to replication section when "Specific selection" is selected
  useEffect(() => {
    if (replicationOption === 'specific' && replicationSectionRef.current) {
      setTimeout(() => {
        replicationSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  }, [replicationOption]);

  // Initialize form when editing
  useEffect(() => {
    const sourceQuota = editingQuota || replicatingQuota;
    
    if (sourceQuota) {
      setQuotaName(sourceQuota.name);
      setCapacity(sourceQuota.capacity.toString());
      setQuotaType(sourceQuota.type);
      setTicketOption(sourceQuota.ticketOption || '');
      
      // Parse assignation to set application fields
      if (sourceQuota.assignation && sourceQuota.assignation !== 'No assignation') {
        // Try to determine which type of application based on assignation value
        // This is a simplified approach - in a real app you'd store this info
        if (channelTypeOptions.some(opt => sourceQuota.assignation.includes(opt))) {
          setApplicationOption('channel-type');
        } else if (channelOptions.some(opt => sourceQuota.assignation.includes(opt))) {
          setApplicationOption('channels');
        } else if (businessOptions.some(opt => sourceQuota.assignation.includes(opt))) {
          setApplicationOption('businesses');
        }
        
        // Parse selected values from assignation string
        const values = sourceQuota.assignation.split(',').map(v => v.trim());
        const cleanedValues = values.filter(v => !v.includes('+') && !v.includes('more'));
        setSelectedApplicationValues(cleanedValues);
      } else {
        setApplicationOption('');
        setSelectedApplicationValues([]);
      }
    } else {
      // Reset form when not editing or replicating
      setQuotaName('');
      setCapacity('');
      setQuotaType('');
      setCapacityError('');
      setApplicationOption('');
      setSelectedApplicationValues([]);
      setReplicationOption('');
      setTicketOption(initialTicketOption || '');
    }
  }, [editingQuota, replicatingQuota, initialTicketOption]);

  // Reset isClosing when drawer opens
  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
    }
  }, [isOpen]);

  // Helper function to handle closing with animation
  const handleClose = (quotaCreated: boolean = false) => {
    setIsClosing(true);
    setTimeout(() => {
      onClose(quotaCreated);
    }, 300); // Match animation duration
  };

  // Validation: Check if all mandatory fields are filled and capacity is valid
  const isFormValid = (() => {
    // Basic field validation
    const basicFieldsValid = quotaName.trim() !== '' && quotaType !== '' && capacity.trim() !== '' && !capacityError;
    
    if (!basicFieldsValid) return false;
    
    // For replication mode, also check that replication option is selected and complete
    if (replicatingQuota) {
      if (replicationOption === 'all-future') {
        return true; // All future time slots is selected
      } else if (replicationOption === 'specific') {
        // Check that at least one date range has both dates filled
        return dateRanges.some(range => range.fromDate && range.toDate);
      } else {
        return false; // No replication option selected
      }
    }
    
    return true; // For create/edit mode, basic validation is enough
  })();

  if (!isOpen && !isClosing) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/20 z-40 transition-opacity duration-300 ${
          isClosing ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        onClick={() => handleClose(false)}
      />
      
      {/* Drawer */}
      <div className={`fixed right-0 top-0 bottom-0 w-[375px] bg-white shadow-[-6px_0px_6px_0px_rgba(0,70,121,0.2)] z-50 flex flex-col rounded-tl-2xl rounded-bl-2xl ${
        isClosing ? 'animate-slideOutToRight' : 'animate-slideInFromRight'
      }`}>
        {/* Header */}
        <div className="flex flex-col p-6 pb-2">
          <div className="text-center mb-2">
            <h2 className="text-base font-semibold text-text-main">
              {replicatingQuota ? 'Replicate Quota' : editingQuota ? 'Edit Quota' : `Add Quota - ${capacityGroupName}`}
            </h2>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-text-main">{timeSlot}</p>
          </div>
          <div className="w-full h-px bg-border-main mt-2" />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="flex flex-col gap-6">
            {/* Quota Name */}
            <div>
              <div className={`border border-border-main rounded-lg h-14 px-3 flex items-center relative ${replicatingQuota ? 'bg-neutral-75' : 'bg-white'}`}>
                <label 
                  className={`absolute left-3 transition-all duration-200 pointer-events-none ${
                    quotaNameFocused || quotaName 
                      ? 'top-0 text-xs text-text-subtle' 
                      : 'top-1/2 -translate-y-1/2 text-base text-text-subtle'
                  }`}
                >
                  Quota name
                </label>
                <input
                  type="text"
                  value={quotaName}
                  onChange={(e) => setQuotaName(e.target.value)}
                  onFocus={() => setQuotaNameFocused(true)}
                  onBlur={() => setQuotaNameFocused(false)}
                  disabled={!!replicatingQuota}
                  className={`text-base outline-none bg-transparent w-full ${
                    quotaNameFocused || quotaName ? 'pt-4' : ''
                  } ${replicatingQuota ? 'text-background-subtle-medium cursor-not-allowed' : 'text-text-main'}`}
                />
              </div>
            </div>

            {/* Quota Type */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => !replicatingQuota && setQuotaTypeOpen(!quotaTypeOpen)}
                disabled={!!replicatingQuota}
                className={`w-full border border-border-main rounded-lg h-14 px-3 pr-11 flex flex-col justify-center relative ${replicatingQuota ? 'bg-neutral-75 cursor-not-allowed' : 'bg-white'}`}
              >
                <label className="text-text-subtle text-xs absolute top-0 left-3 pointer-events-none">Quota type</label>
                <div className={`pt-4 text-base text-left ${
                  replicatingQuota ? 'text-background-subtle-medium' : quotaType ? 'text-text-main' : 'text-background-subtle-medium'
                }`}>
                  {quotaType || 'Select an option'}
                </div>
                <div className="absolute right-3 top-[18px] w-5 h-5 flex items-center justify-center pointer-events-none">
                  <img src={ICON_CHEVRON_DOWN} alt="" className="w-[14px] h-[7px]" />
                </div>
              </button>

              {/* Dropdown Menu */}
              {quotaTypeOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border-main rounded-lg shadow-lg z-10 overflow-hidden">
                  {quotaTypeOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setQuotaType(option);
                        setQuotaTypeOpen(false);
                        // Clear application fields if Blocked is selected
                        if (option === 'Blocked') {
                          setApplicationOption('');
                          setSelectedApplicationValues([]);
                        }
                      }}
                      className={`w-full px-3 py-3 text-left text-base hover:bg-neutral-50 transition-colors ${
                        quotaType === option ? 'bg-neutral-75 text-text-main font-semibold' : 'text-text-main'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}

              <div className="mt-1 text-xs text-text-main leading-4">
                <p className="mb-1">This is how a portion of capacity can be used or sold:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><span className="font-semibold">Exclusive:</span> Only the assigned Channels or Businesses can sell from this quota.</li>
                  <li><span className="font-semibold">Shared:</span> Mainly for the assigned Channels or Businesses, but others can use it if they have no quota and general capacity runs out.</li>
                  <li><span className="font-semibold">Blocked:</span> Reserved capacity — cannot be sold.</li>
                </ul>
              </div>
            </div>

            {/* Capacity */}
            <div>
              <div className={`border rounded-lg h-14 px-3 flex items-center relative ${
                capacityError ? 'border-status-danger' : 'border-border-main'
              } ${replicatingQuota ? 'bg-neutral-75' : 'bg-white'}`}>
                <label 
                  className={`absolute left-3 transition-all duration-200 pointer-events-none ${
                    capacityFocused || capacity 
                      ? 'top-0 text-xs text-text-subtle' 
                      : 'top-1/2 -translate-y-1/2 text-base text-text-subtle'
                  }`}
                >
                  Capacity
                </label>
                <input
                  type="number"
                  value={capacity}
                  disabled={!!replicatingQuota}
                  onChange={(e) => {
                    const newCapacity = e.target.value;
                    setCapacity(newCapacity);
                    
                    // Validate capacity
                    if (newCapacity && parseInt(newCapacity) > 0) {
                      const validation = validateCapacity(
                        capacityGroupName, 
                        parseInt(newCapacity), 
                        editingQuota?.id
                      );
                      setCapacityError(validation.message);
                    } else {
                      setCapacityError('');
                    }
                  }}
                  onFocus={() => setCapacityFocused(true)}
                  onBlur={() => setCapacityFocused(false)}
                  className={`text-base outline-none bg-transparent w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                    capacityFocused || capacity ? 'pt-4' : ''
                  } ${replicatingQuota ? 'text-background-subtle-medium cursor-not-allowed' : 'text-text-main'}`}
                  min="0"
                />
              </div>
              {capacityError && (
                <div className="flex items-center gap-1 mt-1 justify-end">
                  <img 
                    src="/icons/pie-chart.svg" 
                    alt="" 
                    className="w-3 h-3" 
                  />
                  <p className="text-xs text-status-danger">{capacityError}</p>
                </div>
              )}
            </div>

            {/* Application Section */}
            <div className="border-t border-border-main pt-6">
              <button
                onClick={() => setApplicationExpanded(!applicationExpanded)}
                className="flex items-center gap-1 w-full mb-4"
              >
                <div className="w-[18px] h-[18px] flex items-center justify-center rotate-90">
                  <img 
                    src={ICON_CHEVRON_RIGHT} 
                    alt="" 
                    className="w-[7px] h-[14px] transition-transform"
                    style={{ transform: applicationExpanded ? 'rotate(0deg)' : 'rotate(-90deg)' }}
                  />
                </div>
                <h3 className="text-sm font-semibold text-text-main">Application</h3>
              </button>

              {applicationExpanded && (
                <div className="flex flex-col gap-4">
                  {quotaType === 'Blocked' ? (
                    <div>
                      <p className="text-sm text-text-subtle italic">Not applicable</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs font-semibold text-text-subtle mb-2">Quota assigned to:</p>
                      <p className="text-sm text-text-main mb-4">Select the elements that will draw from this capacity:</p>
                    
                          <div className="flex flex-col gap-2">
                            <label 
                              className={`flex items-center gap-2 ${replicatingQuota ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                              onClick={() => {
                                if (replicatingQuota) return;
                                if (applicationOption === 'channel-type') {
                                  setApplicationOption('');
                                  setSelectedApplicationValues([]);
                                } else {
                                  setApplicationOption('channel-type');
                                  setSelectedApplicationValues([]);
                                }
                              }}
                            >
                              <div className={`w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center ${
                                replicatingQuota 
                                  ? 'border border-border-main bg-neutral-75'
                                  : applicationOption === 'channel-type' 
                                    ? 'bg-primary-base border-primary-base' 
                                    : 'border border-border-main bg-white'
                              }`}>
                                {applicationOption === 'channel-type' && !replicatingQuota && (
                                  <div className="w-2 h-2 rounded-full bg-white" />
                                )}
                                {applicationOption === 'channel-type' && replicatingQuota && (
                                  <div className="w-2 h-2 rounded-full bg-background-subtle-medium" />
                                )}
                              </div>
                              <span className={`text-sm ${replicatingQuota ? 'text-background-subtle-medium' : 'text-text-main'}`}>Channel type</span>
                            </label>
                            <label 
                              className={`flex items-center gap-2 ${replicatingQuota ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                              onClick={() => {
                                if (replicatingQuota) return;
                                if (applicationOption === 'channels') {
                                  setApplicationOption('');
                                  setSelectedApplicationValues([]);
                                } else {
                                  setApplicationOption('channels');
                                  setSelectedApplicationValues([]);
                                }
                              }}
                            >
                              <div className={`w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center ${
                                replicatingQuota 
                                  ? 'border border-border-main bg-neutral-75'
                                  : applicationOption === 'channels' 
                                    ? 'bg-primary-base border-primary-base' 
                                    : 'border border-border-main bg-white'
                              }`}>
                                {applicationOption === 'channels' && !replicatingQuota && (
                                  <div className="w-2 h-2 rounded-full bg-white" />
                                )}
                                {applicationOption === 'channels' && replicatingQuota && (
                                  <div className="w-2 h-2 rounded-full bg-background-subtle-medium" />
                                )}
                              </div>
                              <span className={`text-sm ${replicatingQuota ? 'text-background-subtle-medium' : 'text-text-main'}`}>Channels</span>
                            </label>
                            <label 
                              className={`flex items-center gap-2 ${replicatingQuota ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                              onClick={() => {
                                if (replicatingQuota) return;
                                if (applicationOption === 'businesses') {
                                  setApplicationOption('');
                                  setSelectedApplicationValues([]);
                                } else {
                                  setApplicationOption('businesses');
                                  setSelectedApplicationValues([]);
                                }
                              }}
                            >
                              <div className={`w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center ${
                                replicatingQuota 
                                  ? 'border border-border-main bg-neutral-75'
                                  : applicationOption === 'businesses' 
                                    ? 'bg-primary-base border-primary-base' 
                                    : 'border border-border-main bg-white'
                              }`}>
                                {applicationOption === 'businesses' && !replicatingQuota && (
                                  <div className="w-2 h-2 rounded-full bg-white" />
                                )}
                                {applicationOption === 'businesses' && replicatingQuota && (
                                  <div className="w-2 h-2 rounded-full bg-background-subtle-medium" />
                                )}
                              </div>
                              <span className={`text-sm ${replicatingQuota ? 'text-background-subtle-medium' : 'text-text-main'}`}>Businesses</span>
                            </label>
                          </div>

                    {/* Selection Box */}
                    {applicationOption && (
                      <div className="mt-4 relative" ref={applicationDropdownRef}>
                        <button
                          type="button"
                          onClick={() => !replicatingQuota && setApplicationSelectionOpen(!applicationSelectionOpen)}
                          disabled={!!replicatingQuota}
                          className={`w-full border border-border-main rounded-lg h-14 px-3 pr-11 flex flex-col justify-center relative ${replicatingQuota ? 'bg-neutral-75 cursor-not-allowed' : 'bg-white'}`}
                        >
                          <label className="text-text-subtle text-xs absolute top-0 left-3 pointer-events-none">
                            {applicationOption === 'channel-type' && 'Channel type'}
                            {applicationOption === 'channels' && 'Channels'}
                            {applicationOption === 'businesses' && 'Businesses'}
                          </label>
                          <div className={`pt-4 text-base text-left overflow-hidden text-ellipsis whitespace-nowrap ${
                            replicatingQuota 
                              ? 'text-background-subtle-medium' 
                              : selectedApplicationValues.length > 0 ? 'text-text-main' : 'text-background-subtle-medium'
                          }`}>
                            {selectedApplicationValues.length > 0 
                              ? selectedApplicationValues.length === 1
                                ? selectedApplicationValues[0]
                                : `${selectedApplicationValues[0]}, ${selectedApplicationValues[1] || ''}${selectedApplicationValues.length > 2 ? ` +${selectedApplicationValues.length - 2} more` : ''}`
                              : 'Select an option'}
                          </div>
                          <div className="absolute right-3 top-[18px] w-5 h-5 flex items-center justify-center pointer-events-none">
                            <img src={ICON_CHEVRON_DOWN} alt="" className="w-[14px] h-[7px]" />
                          </div>
                        </button>

                        {/* Dropdown Menu */}
                        {applicationSelectionOpen && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border-main rounded-lg shadow-lg z-10 max-h-[200px] overflow-y-auto">
                            {getApplicationOptions().map((option) => (
                              <button
                                key={option}
                                type="button"
                                onClick={() => {
                                  if (selectedApplicationValues.includes(option)) {
                                    setSelectedApplicationValues(selectedApplicationValues.filter(v => v !== option));
                                  } else {
                                    setSelectedApplicationValues([...selectedApplicationValues, option]);
                                  }
                                }}
                                className={`w-full px-3 py-3 text-left text-sm hover:bg-neutral-50 transition-colors flex items-center gap-2 ${
                                  selectedApplicationValues.includes(option) ? 'bg-neutral-75' : ''
                                }`}
                              >
                                <div className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center ${
                                  selectedApplicationValues.includes(option)
                                    ? 'bg-primary-base border-primary-base'
                                    : 'border-border-main bg-white'
                                }`}>
                                  {selectedApplicationValues.includes(option) && (
                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                  )}
                                </div>
                                <span className="text-text-main">{option}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  )}
                </div>
              )}
            </div>

            {/* Replication Section - Only show when creating or replicating, not when editing */}
            {(!editingQuota || replicatingQuota) && (
            <div className="border-t border-border-main pt-6">
              <button
                onClick={() => setReplicationExpanded(!replicationExpanded)}
                className="flex items-center gap-1 w-full mb-4"
              >
                <div className="w-[18px] h-[18px] flex items-center justify-center rotate-90">
                  <img 
                    src={ICON_CHEVRON_RIGHT} 
                    alt="" 
                    className="w-[7px] h-[14px] transition-transform"
                    style={{ transform: replicationExpanded ? 'rotate(0deg)' : 'rotate(-90deg)' }}
                  />
                </div>
                <h3 className="text-sm font-semibold text-text-main">Replication (optional)</h3>
              </button>

              {replicationExpanded && (
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="text-xs font-semibold text-text-main mb-2">In what time slots?</p>
                    <p className="text-sm text-text-main mb-4">You can replicate this quota in this group for several time slots.</p>
                    
                          <div className="flex flex-col gap-2">
                            <label 
                              className="flex items-center gap-2 cursor-pointer"
                              onClick={() => setReplicationOption(replicationOption === 'all-future' ? '' : 'all-future')}
                            >
                              <div className={`w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center ${
                                replicationOption === 'all-future' 
                                  ? 'bg-primary-base border-primary-base' 
                                  : 'border border-border-main bg-white'
                              }`}>
                                {replicationOption === 'all-future' && (
                                  <div className="w-2 h-2 rounded-full bg-white" />
                                )}
                              </div>
                              <span className="text-sm text-text-main">All future time slots</span>
                            </label>
                            <label 
                              className="flex items-center gap-2 cursor-pointer"
                              onClick={() => setReplicationOption(replicationOption === 'specific' ? '' : 'specific')}
                            >
                              <div className={`w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center ${
                                replicationOption === 'specific' 
                                  ? 'bg-primary-base border-primary-base' 
                                  : 'border border-border-main bg-white'
                              }`}>
                                {replicationOption === 'specific' && (
                                  <div className="w-2 h-2 rounded-full bg-white" />
                                )}
                              </div>
                              <span className="text-sm text-text-main">Specific selection</span>
                            </label>
                          </div>

                    {/* Date Range Selector - Only show when "specific" is selected */}
                    {replicationOption === 'specific' && (
                      <div ref={replicationSectionRef} className="mt-4 flex flex-col gap-4">
                        {dateRanges.map((range, index) => (
                          <div 
                            key={range.id} 
                            ref={(el) => { dateRangeRefs.current[range.id] = el; }}
                            className="border border-border-main rounded-lg p-4 flex flex-col gap-4 relative"
                          >
                            {/* Delete button */}
                            {dateRanges.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  setDateRanges(dateRanges.filter((_, i) => i !== index));
                                }}
                                className="absolute top-3 right-3 w-5 h-5 flex items-center justify-center"
                              >
                                <img src={ICON_TRASH} alt="" className="w-3.5 h-4" />
                              </button>
                            )}

                            {/* Dates */}
                            <div className="flex flex-col gap-2">
                              <div className="text-text-main text-xs font-semibold">Dates</div>
                              <div className="flex gap-4">
                                <div className="flex-1 min-w-0">
                                  <div className="bg-white border border-border-main rounded-lg h-14 px-3 pr-2 flex flex-col justify-center relative overflow-hidden">
                                    <label className="text-text-subtle text-xs font-semibold absolute top-1 left-3">Start date</label>
                                    <input
                                      type="date"
                                      value={range.fromDate}
                                      onChange={(e) => {
                                        const newRanges = [...dateRanges];
                                        newRanges[index].fromDate = e.target.value;
                                        setDateRanges(newRanges);
                                      }}
                                      className="pt-4 text-text-main text-base outline-none bg-transparent w-full [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                                    />
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="bg-white border border-border-main rounded-lg h-14 px-3 pr-2 flex flex-col justify-center relative overflow-hidden">
                                    <label className="text-text-subtle text-xs font-semibold absolute top-1 left-3">End date</label>
                                    <input
                                      type="date"
                                      value={range.toDate}
                                      onChange={(e) => {
                                        const newRanges = [...dateRanges];
                                        newRanges[index].toDate = e.target.value;
                                        setDateRanges(newRanges);
                                      }}
                                      className="pt-4 text-text-main text-base outline-none bg-transparent w-full [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Days of the week */}
                            <div className="flex flex-col gap-2">
                              <div className="text-text-main text-xs font-semibold">Days of the week</div>
                              <div className="flex gap-2">
                                {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day) => (
                                  <button
                                    key={day}
                                    type="button"
                                    onClick={() => {
                                      const newRanges = [...dateRanges];
                                      const weekdays = newRanges[index].weekdays;
                                      if (weekdays.includes(day)) {
                                        newRanges[index].weekdays = weekdays.filter(d => d !== day);
                                      } else {
                                        newRanges[index].weekdays = [...weekdays, day];
                                      }
                                      setDateRanges(newRanges);
                                    }}
                                    className={`flex-1 h-14 border rounded-lg flex items-center justify-center text-xs transition-colors ${
                                      range.weekdays.includes(day)
                                        ? 'border-primary-base text-text-main'
                                        : 'border-border-main text-text-main'
                                    }`}
                                  >
                                    {day}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Times */}
                            <div className="flex flex-col gap-2">
                              <div className="text-text-main text-xs font-semibold">Times</div>
                              <div className="flex gap-4">
                                {/* First timeslot */}
                                <div className="flex-1 relative" ref={(el) => { timeDropdownRefs.current[`${index}-from`] = el; }}>
                                  <div className={`w-full bg-white border rounded-lg h-14 px-3 flex flex-col justify-center relative cursor-pointer ${
                                    openTimeDropdown?.index === index && openTimeDropdown?.field === 'from' 
                                      ? 'border-primary-base border-2' 
                                      : 'border-border-main'
                                  }`}>
                                    <label className="text-text-subtle text-xs font-semibold absolute top-1 left-3 pointer-events-none">First timeslot</label>
                                    <input
                                      type="text"
                                      value={range.fromTime}
                                      readOnly
                                      placeholder="--:--"
                                      onClick={() => setOpenTimeDropdown({ index, field: 'from' })}
                                      className="pt-4 text-base outline-none bg-transparent w-full text-text-main placeholder:text-text-subtle cursor-pointer"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => setOpenTimeDropdown(openTimeDropdown?.index === index && openTimeDropdown?.field === 'from' ? null : { index, field: 'from' })}
                                      className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center"
                                    >
                                      <img src={ICON_CLOCK} alt="" className="w-4 h-4" />
                                    </button>
                                  </div>

                                  {/* Scrollable Time Picker */}
                                  {openTimeDropdown?.index === index && openTimeDropdown?.field === 'from' && (
                                    <div className="absolute bottom-full left-0 right-0 mb-1 bg-white border border-border-main rounded-lg shadow-lg z-10 overflow-hidden">
                                      <div className="flex">
                                        {/* Hour Column */}
                                        <div className="flex-1 h-[200px] overflow-y-auto border-r border-border-main [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-border-main [&::-webkit-scrollbar-thumb]:rounded-full">
                                          <div className="flex flex-col">
                                            {hours.map((hour) => (
                                              <button
                                                key={hour}
                                                type="button"
                                                onClick={() => {
                                                  const currentTime = range.fromTime || '12:00 AM';
                                                  const [, minute = '00', period = 'AM'] = currentTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/) || [];
                                                  const newTime = `${hour}:${minute} ${period}`;
                                                  const newRanges = [...dateRanges];
                                                  newRanges[index].fromTime = newTime;
                                                  setDateRanges(newRanges);
                                                }}
                                                className={`py-2 text-center text-base transition-colors ${
                                                  range.fromTime?.startsWith(hour + ':') || range.fromTime?.startsWith('0' + hour + ':') 
                                                    ? 'bg-primary-base text-white font-semibold' 
                                                    : 'text-text-main hover:bg-neutral-50'
                                                }`}
                                              >
                                                {hour.padStart(2, '0')}
                                              </button>
                                            ))}
                                          </div>
                                        </div>

                                        {/* Minute Column */}
                                        <div className="flex-1 h-[200px] overflow-y-auto border-r border-border-main [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-border-main [&::-webkit-scrollbar-thumb]:rounded-full">
                                          <div className="flex flex-col">
                                            {minutes.map((minute) => (
                                              <button
                                                key={minute}
                                                type="button"
                                                onClick={() => {
                                                  const currentTime = range.fromTime || '12:00 AM';
                                                  const [, hour = '12', , period = 'AM'] = currentTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/) || [];
                                                  const newTime = `${hour}:${minute} ${period}`;
                                                  const newRanges = [...dateRanges];
                                                  newRanges[index].fromTime = newTime;
                                                  setDateRanges(newRanges);
                                                }}
                                                className={`py-2 text-center text-base transition-colors ${
                                                  range.fromTime?.includes(':' + minute + ' ') 
                                                    ? 'bg-primary-base text-white font-semibold' 
                                                    : 'text-text-main hover:bg-neutral-50'
                                                }`}
                                              >
                                                {minute}
                                              </button>
                                            ))}
                                          </div>
                                        </div>

                                        {/* AM/PM Column */}
                                        <div className="flex-1 h-[200px] overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-border-main [&::-webkit-scrollbar-thumb]:rounded-full">
                                          <div className="flex flex-col">
                                            {periods.map((period) => (
                                              <button
                                                key={period}
                                                type="button"
                                                onClick={() => {
                                                  const currentTime = range.fromTime || '12:00 AM';
                                                  const [, hour = '12', minute = '00'] = currentTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/) || [];
                                                  const newTime = `${hour}:${minute} ${period}`;
                                                  const newRanges = [...dateRanges];
                                                  newRanges[index].fromTime = newTime;
                                                  setDateRanges(newRanges);
                                                }}
                                                className={`py-2 text-center text-base transition-colors ${
                                                  range.fromTime?.endsWith(period) 
                                                    ? 'bg-primary-base text-white font-semibold' 
                                                    : 'text-text-main hover:bg-neutral-50'
                                                }`}
                                              >
                                                {period}
                                              </button>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {/* Last timeslot */}
                                <div className="flex-1 relative" ref={(el) => { timeDropdownRefs.current[`${index}-to`] = el; }}>
                                  <div className={`w-full bg-white border rounded-lg h-14 px-3 flex flex-col justify-center relative cursor-pointer ${
                                    openTimeDropdown?.index === index && openTimeDropdown?.field === 'to' 
                                      ? 'border-primary-base border-2' 
                                      : 'border-border-main'
                                  }`}>
                                    <label className="text-text-subtle text-xs font-semibold absolute top-1 left-3 pointer-events-none">Last timeslot</label>
                                    <input
                                      type="text"
                                      value={range.toTime}
                                      readOnly
                                      placeholder="--:--"
                                      onClick={() => setOpenTimeDropdown({ index, field: 'to' })}
                                      className="pt-4 text-base outline-none bg-transparent w-full text-text-main placeholder:text-text-subtle cursor-pointer"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => setOpenTimeDropdown(openTimeDropdown?.index === index && openTimeDropdown?.field === 'to' ? null : { index, field: 'to' })}
                                      className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center"
                                    >
                                      <img src={ICON_CLOCK} alt="" className="w-4 h-4" />
                                    </button>
                                  </div>

                                  {/* Scrollable Time Picker */}
                                  {openTimeDropdown?.index === index && openTimeDropdown?.field === 'to' && (
                                    <div className="absolute bottom-full left-0 right-0 mb-1 bg-white border border-border-main rounded-lg shadow-lg z-10 overflow-hidden">
                                      <div className="flex">
                                        {/* Hour Column */}
                                        <div className="flex-1 h-[200px] overflow-y-auto border-r border-border-main [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-border-main [&::-webkit-scrollbar-thumb]:rounded-full">
                                          <div className="flex flex-col">
                                            {hours.map((hour) => (
                                              <button
                                                key={hour}
                                                type="button"
                                                onClick={() => {
                                                  const currentTime = range.toTime || '12:00 AM';
                                                  const [, minute = '00', period = 'AM'] = currentTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/) || [];
                                                  const newTime = `${hour}:${minute} ${period}`;
                                                  const newRanges = [...dateRanges];
                                                  newRanges[index].toTime = newTime;
                                                  setDateRanges(newRanges);
                                                }}
                                                className={`py-2 text-center text-base transition-colors ${
                                                  range.toTime?.startsWith(hour + ':') || range.toTime?.startsWith('0' + hour + ':') 
                                                    ? 'bg-primary-base text-white font-semibold' 
                                                    : 'text-text-main hover:bg-neutral-50'
                                                }`}
                                              >
                                                {hour.padStart(2, '0')}
                                              </button>
                                            ))}
                                          </div>
                                        </div>

                                        {/* Minute Column */}
                                        <div className="flex-1 h-[200px] overflow-y-auto border-r border-border-main [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-border-main [&::-webkit-scrollbar-thumb]:rounded-full">
                                          <div className="flex flex-col">
                                            {minutes.map((minute) => (
                                              <button
                                                key={minute}
                                                type="button"
                                                onClick={() => {
                                                  const currentTime = range.toTime || '12:00 AM';
                                                  const [, hour = '12', , period = 'AM'] = currentTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/) || [];
                                                  const newTime = `${hour}:${minute} ${period}`;
                                                  const newRanges = [...dateRanges];
                                                  newRanges[index].toTime = newTime;
                                                  setDateRanges(newRanges);
                                                }}
                                                className={`py-2 text-center text-base transition-colors ${
                                                  range.toTime?.includes(':' + minute + ' ') 
                                                    ? 'bg-primary-base text-white font-semibold' 
                                                    : 'text-text-main hover:bg-neutral-50'
                                                }`}
                                              >
                                                {minute}
                                              </button>
                                            ))}
                                          </div>
                                        </div>

                                        {/* AM/PM Column */}
                                        <div className="flex-1 h-[200px] overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-border-main [&::-webkit-scrollbar-thumb]:rounded-full">
                                          <div className="flex flex-col">
                                            {periods.map((period) => (
                                              <button
                                                key={period}
                                                type="button"
                                                onClick={() => {
                                                  const currentTime = range.toTime || '12:00 AM';
                                                  const [, hour = '12', minute = '00'] = currentTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/) || [];
                                                  const newTime = `${hour}:${minute} ${period}`;
                                                  const newRanges = [...dateRanges];
                                                  newRanges[index].toTime = newTime;
                                                  setDateRanges(newRanges);
                                                }}
                                                className={`py-2 text-center text-base transition-colors ${
                                                  range.toTime?.endsWith(period) 
                                                    ? 'bg-primary-base text-white font-semibold' 
                                                    : 'text-text-main hover:bg-neutral-50'
                                                }`}
                                              >
                                                {period}
                                              </button>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}

                        {/* Add Date Button */}
                        <button
                          ref={addDateButtonRef}
                          type="button"
                          onClick={() => {
                            const newId = Date.now();
                            setDateRanges([
                              ...dateRanges,
                              { 
                                id: newId, 
                                fromDate: '', 
                                toDate: '', 
                                weekdays: [], 
                                fromTime: '', 
                                toTime: '' 
                              }
                            ]);
                            // Scroll to show the "Add date" button, which will also show the newly added range above it
                            setTimeout(() => {
                              if (addDateButtonRef.current) {
                                addDateButtonRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
                              }
                            }, 100);
                          }}
                          className="text-primary-active text-sm font-semibold flex items-center justify-end gap-1"
                        >
                          Add date
                          <div className="w-5 h-5 flex items-center justify-center">
                            <img src={ICON_ADD} alt="" className="w-4 h-4" />
                          </div>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 pt-6 flex-shrink-0">
          <button 
            className={`w-full h-12 text-base font-semibold rounded-full transition-colors ${
              isFormValid 
                ? 'bg-primary-active text-white cursor-pointer hover:bg-primary-base' 
                : 'bg-neutral-100 text-background-subtle-medium cursor-not-allowed'
            }`}
            disabled={!isFormValid}
            onClick={() => {
              if (isFormValid) {
                // Determine assignation based on application selection
                let assignation = 'No assignation';
                
                // Blocked quotas always have "No assignation"
                if (quotaType !== 'Blocked') {
                  // If application is selected, show the selected values
                  if (applicationOption && selectedApplicationValues.length > 0) {
                    if (selectedApplicationValues.length === 1) {
                      assignation = selectedApplicationValues[0];
                    } else {
                      assignation = `${selectedApplicationValues[0]}, ${selectedApplicationValues[1]}${selectedApplicationValues.length > 2 ? ` +${selectedApplicationValues.length - 2} more` : ''}`;
                    }
                  }
                }

                if (editingQuota) {
                  // Update existing quota
                  updateQuota(editingQuota.id, {
                    name: quotaName,
                    type: quotaType as 'Exclusive' | 'Shared' | 'Blocked',
                    capacity: parseInt(capacity),
                    assignation,
                    capacityGroupName,
                    timeSlot,
                    ...(ticketOption && { ticketOption }),
                  });
                } else if (replicatingQuota) {
                  // Replicate quota to selected time slots
                  if (replicationOption === 'all-future') {
                    // In a real app, you would get all future time slots from the system
                    // For this demo, we'll just create one quota with a placeholder timeSlot
                    addQuota({
                      name: quotaName,
                      type: quotaType as 'Exclusive' | 'Shared' | 'Blocked',
                      capacity: parseInt(capacity),
                      assignation,
                      capacityGroupName,
                      timeSlot: 'All future time slots',
                      ...(ticketOption && { ticketOption }),
                    });
                  } else if (replicationOption === 'specific') {
                    // Create quota for each date range that has dates selected
                    dateRanges.forEach((range) => {
                      if (range.fromDate && range.toDate) {
                        // In a real app, you would generate time slots from the date range
                        // For this demo, we'll just use the current timeSlot format with a placeholder
                        const replicatedTimeSlot = `${range.fromDate} - ${range.fromTime || '10:30'}`;
                        addQuota({
                          name: quotaName,
                          type: quotaType as 'Exclusive' | 'Shared' | 'Blocked',
                          capacity: parseInt(capacity),
                          assignation,
                          capacityGroupName,
                          timeSlot: replicatedTimeSlot,
                          ...(ticketOption && { ticketOption }),
                        });
                      }
                    });
                  }
                } else {
                  // Add new quota
                  addQuota({
                    name: quotaName,
                    type: quotaType as 'Exclusive' | 'Shared' | 'Blocked',
                    capacity: parseInt(capacity),
                    assignation,
                    capacityGroupName,
                    timeSlot,
                    ...(ticketOption && { ticketOption }),
                  });
                }

                // Reset form
                setQuotaName('');
                setCapacity('');
                setQuotaType('');
                setCapacityError('');
                setApplicationOption('');
                setSelectedApplicationValues([]);
                setReplicationOption('');
                
                handleClose(true); // Signal that quota was created/updated
              }
            }}
          >
            Save
          </button>
        </div>
      </div>
    </>
  );
}

