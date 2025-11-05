import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import AddQuotaDrawer from '../components/AddQuotaDrawer';
import Toast from '../components/Toast';
import DeleteQuotaModal from '../components/DeleteQuotaModal';
import { useQuotaStore } from '../stores/quotaStore';
import type { Quota } from '../stores/quotaStore';

// Figma icon assets
const ICON_BACK_ARROW = 'http://localhost:3845/assets/c9098c25966c76877cc26d2e2a76a4e9d5eaaedd.svg';
const ICON_CALENDAR = 'http://localhost:3845/assets/f540097310d95b0899ca769b6c05aee18c861096.svg';
const ICON_CLOCK = 'http://localhost:3845/assets/cd487be1ea0c7bec00ecaee3311d5774b90df4af.svg';
const ICON_SEARCH = 'http://localhost:3845/assets/fd1b24bc93b77cd1a821d5fca186ea30167e4fff.svg';
const ICON_INFO = 'http://localhost:3845/assets/c277c3c69d094a5a05da822ee0a6672f1023abae.svg';
const ICON_ANGLE_DOWN = 'http://localhost:3845/assets/b9d8079bd319a753b8c203fbf72ae4430e0e030b.svg';
const ICON_PEN_TO_SQUARE = 'http://localhost:3845/assets/f6d06be5d02a88c4ce028ee177e86ee317822fda.svg';
const ICON_ADD_QUOTA = 'http://localhost:3845/assets/3b98c240ad5647f6728cb4f4b223d7b2d7ae339c.svg';
const ICON_VERTICAL_DOTS = 'http://localhost:3845/assets/9bf622ddbf92eb6e519925bcd2a25e2ab52ea786.svg';
const ICON_PIE_CHART = 'http://localhost:3845/assets/88fbf3da8c1bcb99a31aede702cd8f32889d21b1.svg';
const ICON_EDIT = 'http://localhost:3845/assets/12306911d87e1d24621b0c977ed3525d4f1e9b11.svg';
const ICON_TRANSFER = 'http://localhost:3845/assets/5f34d4646c97a6674e3f35fd7dd4c6ba2703c062.svg';
const ICON_COPY = 'http://localhost:3845/assets/b894d1507407975e89ba631d8c341a21fc043adc.svg';
const ICON_TRASH_CAN = 'http://localhost:3845/assets/3858559fd7f77d9823ecf1d258f36c21005196b3.svg';

// Define fixed capacity group configurations
const CAPACITY_GROUPS = {
  'Club 54': { totalCapacity: 600, sold: 250 },
  'Fanstand': { totalCapacity: 200, sold: 100 }
} as const;

export default function QuotaManagement() {
  const navigate = useNavigate();
  const quotas = useQuotaStore((state) => state.quotas);
  const removeQuota = useQuotaStore((state) => state.removeQuota);
  const updateQuotaCapacity = useQuotaStore((state) => state.updateQuotaCapacity);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuDirection, setMenuDirection] = useState<'down' | 'up'>('down');
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const [selectedGroup, setSelectedGroup] = useState<{ name: string; timeSlot: string }>({ 
    name: '', 
    timeSlot: 'Sun 27 Jul 2025 - 10:30' 
  });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [quotaToDelete, setQuotaToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isEditingCapacity, setIsEditingCapacity] = useState(false);
  const [editingQuota, setEditingQuota] = useState<Quota | null>(null);
  const capacityEditsRef = useRef<{ [quotaId: string]: number }>({});
  const [capacityErrors, setCapacityErrors] = useState<{ [quotaId: string]: string }>({});

  const handleAddQuota = (groupName: string) => {
    setSelectedGroup({ 
      name: groupName, 
      timeSlot: 'Sun 27 Jul 2025 - 10:30' 
    });
    setDrawerOpen(true);
  };

  const handleDrawerClose = (quotaCreatedOrUpdated: boolean = false) => {
    const wasEditing = editingQuota !== null;
    setDrawerOpen(false);
    setEditingQuota(null);
    if (quotaCreatedOrUpdated) {
      if (wasEditing) {
        setToastMessage('Quota successfully updated');
      } else {
        setToastMessage('Quotas are being created in all time slots selected.');
      }
      setShowToast(true);
    }
  };

  const handleEditQuota = (quota: Quota) => {
    setEditingQuota(quota);
    setSelectedGroup({
      name: quota.capacityGroupName,
      timeSlot: quota.timeSlot,
    });
    setDrawerOpen(true);
    setOpenMenuId(null);
  };

  const toggleMenu = (quotaId: string) => {
    if (openMenuId === quotaId) {
      setOpenMenuId(null);
      return;
    }

    // Calculate if menu should open upwards or downwards
    const button = buttonRefs.current[quotaId];
    if (button) {
      const buttonRect = button.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const menuHeight = 200; // Approximate height of the menu
      const spaceBelow = viewportHeight - buttonRect.bottom;
      
      // If not enough space below, open upwards
      if (spaceBelow < menuHeight) {
        setMenuDirection('up');
      } else {
        setMenuDirection('down');
      }
    }
    
    setOpenMenuId(quotaId);
  };

  const handleDeleteQuota = (quotaId: string, quotaName: string) => {
    setQuotaToDelete({ id: quotaId, name: quotaName });
    setDeleteModalOpen(true);
    setOpenMenuId(null);
  };

  const confirmDeleteQuota = () => {
    if (quotaToDelete) {
      removeQuota(quotaToDelete.id);
    }
    setDeleteModalOpen(false);
    setQuotaToDelete(null);
  };

  const cancelDeleteQuota = () => {
    setDeleteModalOpen(false);
    setQuotaToDelete(null);
  };

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    }

    if (openMenuId) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [openMenuId]);

  // Get quotas for a specific group, sorted with Blocked quotas first
  const getGroupQuotas = (groupName: string) => {
    return quotas
      .filter(q => q.capacityGroupName === groupName)
      .sort((a, b) => {
        // Blocked quotas always come first
        if (a.type === 'Blocked' && b.type !== 'Blocked') return -1;
        if (a.type !== 'Blocked' && b.type === 'Blocked') return 1;
        return 0; // Maintain original order for same type
      });
  };

  // Validate capacity doesn't exceed group total
  const validateCapacity = (groupName: string, newCapacity: number, excludeQuotaId?: string) => {
    const groupConfig = CAPACITY_GROUPS[groupName as keyof typeof CAPACITY_GROUPS];
    if (!groupConfig) return { isValid: true, maxAvailable: 0, message: '' };

    // Calculate total capacity used by other quotas
    const groupQuotas = getGroupQuotas(groupName);
    const otherQuotasCapacity = groupQuotas
      .filter(q => q.id !== excludeQuotaId)
      .reduce((sum, q) => sum + q.capacity, 0);

    const maxAvailable = groupConfig.totalCapacity - otherQuotasCapacity;
    const isValid = newCapacity <= maxAvailable;

    return {
      isValid,
      maxAvailable,
      message: isValid ? '' : `Value exceeds available quota (max: ${maxAvailable})`
    };
  };

  // Calculate free capacity for a group
  const calculateFreeCapacity = (groupName: string) => {
    const groupConfig = CAPACITY_GROUPS[groupName as keyof typeof CAPACITY_GROUPS];
    if (!groupConfig) return { sold: 0, available: 0, capacity: 0 };

    const groupQuotas = getGroupQuotas(groupName);
    const totalQuotaCapacity = groupQuotas.reduce((sum, q) => sum + q.capacity, 0);
    const totalQuotaSold = groupQuotas.reduce((sum, q) => sum + q.sold, 0);

    // Free capacity is what's left after quotas are allocated
    const freeCapacity = groupConfig.totalCapacity - totalQuotaCapacity;
    const freeSold = groupConfig.sold - totalQuotaSold;
    const freeAvailable = freeCapacity - freeSold;

    return {
      sold: Math.max(0, freeSold),
      available: Math.max(0, freeAvailable),
      capacity: Math.max(0, freeCapacity)
    };
  };

  // Calculate group totals
  const calculateGroupTotals = (groupName: string) => {
    const groupConfig = CAPACITY_GROUPS[groupName as keyof typeof CAPACITY_GROUPS];
    if (!groupConfig) return { sold: 0, available: 0, capacity: 0 };

    // Calculate total blocked capacity for this group
    const groupQuotas = getGroupQuotas(groupName);
    const totalBlockedCapacity = groupQuotas
      .filter(q => q.type === 'Blocked')
      .reduce((sum, q) => sum + q.capacity, 0);

    return {
      sold: groupConfig.sold,
      available: groupConfig.totalCapacity - groupConfig.sold - totalBlockedCapacity,
      capacity: groupConfig.totalCapacity
    };
  };

  // Calculate time slot totals (sum of all groups)
  const calculateTimeSlotTotals = () => {
    const allGroups = Object.keys(CAPACITY_GROUPS);
    let totalSold = 0;
    let totalCapacity = 0;
    let totalBlockedCapacity = 0;

    allGroups.forEach(groupName => {
      const groupConfig = CAPACITY_GROUPS[groupName as keyof typeof CAPACITY_GROUPS];
      totalSold += groupConfig.sold;
      totalCapacity += groupConfig.totalCapacity;
      
      // Add blocked capacity from this group
      const groupQuotas = getGroupQuotas(groupName);
      const groupBlockedCapacity = groupQuotas
        .filter(q => q.type === 'Blocked')
        .reduce((sum, q) => sum + q.capacity, 0);
      totalBlockedCapacity += groupBlockedCapacity;
    });

    return {
      sold: totalSold,
      available: totalCapacity - totalSold - totalBlockedCapacity,
      capacity: totalCapacity
    };
  };

  return (
    <div className="h-screen flex flex-col bg-neutral-50">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          {/* Hero Section */}
          <div className="bg-background-contrast p-6">
            <div className="mb-4">
              <p className="text-neutral-100 text-base">Events</p>
              <h1 className="text-white text-2xl font-semibold">Schedule & tickets</h1>
            </div>
            <div className="flex gap-6">
              <div className="bg-white border border-border-main rounded-sm h-14 px-3 flex flex-col justify-center relative flex-1 max-w-[386px]">
                <label className="text-text-subtle text-xs font-semibold absolute top-0 left-3">City</label>
                <div className="pt-4 text-text-main text-base">Chicago</div>
                <svg className="absolute right-3 top-[18px] w-5 h-5 text-text-main" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="bg-white border border-border-main rounded-sm h-14 px-3 flex flex-col justify-center relative flex-1">
                <label className="text-text-subtle text-xs font-semibold absolute top-0 left-3">Search or type event</label>
                <div className="pt-4 text-text-main text-base">LIV Golf Chicago 2025</div>
                <svg className="absolute right-3 top-[18px] w-5 h-5 text-text-main" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="bg-white border border-border-main rounded-sm h-14 px-3 flex flex-col justify-center relative flex-1 max-w-[386px]">
                <label className="text-text-subtle text-xs font-semibold absolute top-0 left-3">Venue</label>
                <div className="pt-4 text-text-main text-base">Bolingbrook Golf Club</div>
                <svg className="absolute right-3 top-[18px] w-5 h-5 text-text-main" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-4">
            <div className="bg-white rounded-lg shadow-[0px_6px_6px_0px_rgba(0,70,121,0.2)] p-6">
              {/* Back Link */}
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-primary-active text-sm font-semibold mb-6 cursor-pointer hover:underline"
              >
                <img src={ICON_BACK_ARROW} alt="" className="w-[7px] h-[14px]" />
                Back to Capacity view
              </button>

              {/* Header Controls */}
              <div className="flex items-center mb-6">
                <div className="w-[297px]">
                  <div className="bg-white border border-border-main rounded-lg h-14 flex items-center">
                    <div className="flex-1 px-3 pr-11 flex flex-col justify-center relative">
                      <label className="text-text-subtle text-xs absolute top-0 left-3">Date</label>
                      <div className="pt-4 text-text-main text-base">07/27</div>
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center">
                        <img src={ICON_CALENDAR} alt="" className="w-[14px] h-4" />
                      </div>
                    </div>
                    <div className="w-px h-8 bg-border-main"></div>
                    <div className="flex-1 px-3 pr-11 flex flex-col justify-center relative">
                      <label className="text-text-subtle text-xs absolute top-0 left-3">Hour</label>
                      <div className="pt-4 text-text-main text-base">10:30</div>
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center">
                        <img src={ICON_CLOCK} alt="" className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-[450px] ml-4">
                  <div className="bg-white border border-border-main rounded-lg h-14 px-3 flex items-center gap-2">
                    <img src={ICON_SEARCH} alt="" className="w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search quota names"
                      className="flex-1 text-text-subtle text-base outline-none bg-transparent"
                    />
                  </div>
                </div>

                <div className="flex-1"></div>

                {!isEditingCapacity ? (
                  <button 
                    onClick={() => setIsEditingCapacity(true)}
                    className="border-2 border-border-main rounded-full px-3 h-8 text-primary-active text-sm font-semibold hover:bg-neutral-50 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Enable Capacity Editing
                  </button>
                ) : (
                  <div className="flex items-center gap-[14px]">
                    <button
                      onClick={() => {
                        // Clear edits without saving
                        capacityEditsRef.current = {};
                        setCapacityErrors({});
                        setIsEditingCapacity(false);
                      }}
                      className="text-primary-active text-sm font-semibold px-3 h-8 cursor-pointer"
                    >
                      Exit without saving
                    </button>
                    <button
                      onClick={() => {
                        // Save all capacity edits
                        const hasEdits = Object.keys(capacityEditsRef.current).length > 0;
                        Object.entries(capacityEditsRef.current).forEach(([quotaId, newCapacity]) => {
                          updateQuotaCapacity(quotaId, newCapacity);
                        });
                        // Clear edits and exit editing mode
                        capacityEditsRef.current = {};
                        setCapacityErrors({});
                        setIsEditingCapacity(false);
                        // Show success toast only if there were edits
                        if (hasEdits) {
                          setToastMessage('Quotas successfully updated');
                          setShowToast(true);
                        }
                      }}
                      disabled={Object.keys(capacityErrors).length > 0}
                      className={`border-2 border-border-main rounded-full px-3 h-8 text-sm font-semibold ${
                        Object.keys(capacityErrors).length > 0
                          ? 'text-background-subtle-medium cursor-not-allowed opacity-50'
                          : 'text-primary-active cursor-pointer'
                      }`}
                    >
                      Save changes
                    </button>
                  </div>
                )}
              </div>

              {/* Time Slot Header */}
              <div className="bg-neutral-75 rounded-lg py-2 px-2 mb-6">
                <div className="flex items-center">
                  {/* Date/Time - Flexible */}
                  <div className="flex-1 min-w-0">
                    <div className="text-text-main text-base font-semibold">Sun, 27 Jul 2025 - 10:30 AM</div>
                  </div>
                  
                  {/* Quota Type */}
                  <div className="w-[200px] flex-shrink-0">
                    <div className="text-text-subtle text-xs text-center">Quota type</div>
                  </div>
                  
                  {/* Quota Assignation */}
                  <div className="w-[200px] flex-shrink-0">
                    <div className="text-text-subtle text-xs text-center">Quota</div>
                    <div className="text-text-subtle text-xs text-center">Assignation</div>
                  </div>
                  
                    {/* Numbers Section with left border */}
                   {(() => {
                     const timeSlotTotals = calculateTimeSlotTotals();
                     return (
                       <div className="border-l border-border-main pl-2 flex items-center gap-0 flex-shrink-0">
                         <div className="w-[100px] flex flex-col items-end">
                           <div className="flex items-center gap-1 mb-0.5">
                             <span className="text-text-subtle text-xs">Sold</span>
                             <img src={ICON_INFO} alt="" className="w-3 h-3" />
                           </div>
                           <div className="text-text-main text-base font-semibold">{timeSlotTotals.sold}</div>
                         </div>
                         <div className="w-[100px] flex flex-col items-end">
                           <div className="text-text-subtle text-xs mb-0.5">Available</div>
                           <div className="text-text-main text-base font-semibold">{timeSlotTotals.available}</div>
                         </div>
                         <div className="w-[100px] flex flex-col items-end">
                           <div className="text-text-subtle text-xs mb-0.5">Capacity</div>
                           <div className="text-text-main text-base font-semibold">{timeSlotTotals.capacity}</div>
                         </div>
                         <div className="w-[20px]"></div>
                         <div className="w-[20px] flex items-center justify-center">
                           <img src={ICON_PEN_TO_SQUARE} alt="" className="w-4 h-4" />
                         </div>
                       </div>
                     );
                   })()}
                </div>
              </div>

              {/* Capacity Groups */}
              <div className="space-y-4">
            {/* Club 54 Group */}
            <div className="bg-white border border-border-main rounded-lg py-1 overflow-visible">
                  {/* Group Header */}
                  <div className="border-b border-border-main py-3 flex items-center">
                    {/* Left: Chevron + Name - Flexible */}
                    <div className="flex-1 min-w-0 flex items-center gap-3 pl-2">
                      <div className="w-[26px] h-[26px] flex items-center justify-center cursor-pointer flex-shrink-0">
                        <img src={ICON_ANGLE_DOWN} alt="" className="w-[15px] h-[9px]" />
                      </div>
                      <div className="flex-shrink-0">
                        <div className="text-text-subtle text-xs">Capacity Group</div>
                        <div className="text-text-main text-base font-semibold">Club 54</div>
                      </div>
                    </div>
                    
                    {/* Quota Type */}
                    <div className="w-[200px] flex-shrink-0"></div>
                    
                    {/* Quota Assignation */}
                    <div className="w-[200px] flex-shrink-0"></div>
                      
                      {/* Numbers with left border */}
                     {(() => {
                       const groupTotals = calculateGroupTotals('Club 54');
                       return (
                         <div className="border-l border-border-main pl-2 pr-2 flex items-center gap-0 flex-shrink-0">
                           <div className="w-[100px] flex items-center justify-end text-text-main text-base font-semibold">{groupTotals.sold}</div>
                           <div className="w-[100px] flex items-center justify-end text-text-main text-base font-semibold">{groupTotals.available}</div>
                           <div className="w-[100px] flex items-center justify-end text-text-main text-base font-semibold">{groupTotals.capacity}</div>
                           <div className="w-[20px]"></div>
                           <div className="w-[20px]"></div>
                         </div>
                       );
                     })()}
                   </div>

                  {/* Free Capacity Row */}
                  {(() => {
                    const freeCapacity = calculateFreeCapacity('Club 54');
                    return (
                      <div className="mx-2 my-2 border border-border-main rounded p-4 flex items-center min-h-[52px]">
                        {/* Left: Name - Flexible */}
                        <div className="flex-1 min-w-0">
                          <div className="text-text-main text-sm font-semibold">Free capacity (no quota)</div>
                        </div>
                        
                        {/* Quota Type */}
                        <div className="w-[200px] flex-shrink-0 text-center text-text-main text-sm">-</div>
                        
                        {/* Quota Assignation */}
                        <div className="w-[200px] flex-shrink-0 text-center text-text-main text-sm">General*</div>
                        
                        {/* Numbers with left border */}
                        <div className="border-l border-border-main pl-2 flex items-center gap-0 flex-shrink-0">
                          <div className="w-[100px] flex items-center justify-end text-text-main text-sm font-semibold">{freeCapacity.sold}</div>
                          <div className="w-[100px] flex items-center justify-end text-text-main text-sm font-semibold">{freeCapacity.available}</div>
                          <div className="w-[100px] flex items-center justify-end text-text-main text-sm font-semibold">{freeCapacity.capacity}</div>
                          <div className="w-[20px]"></div>
                          <div className="w-[20px] flex items-center justify-center">
                            <img src={ICON_VERTICAL_DOTS} alt="" className="w-[3.5px] h-[13.5px] cursor-pointer" />
                          </div>
                        </div>
                      </div>
                    );
                  })()}

              {/* Render Club 54 Quotas */}
              {getGroupQuotas('Club 54').map((quota) => {
                const isBlocked = quota.type === 'Blocked';
                return (
                  <div 
                    key={quota.id} 
                    className={`mx-2 my-2 border rounded p-4 flex items-center min-h-[52px] relative ${
                      isBlocked 
                        ? 'bg-neutral-100 border-border-main' 
                        : 'bg-accent-100 border-accent-200'
                    }`}
                  >
                    {/* Left: Icon + Name - Flexible */}
                    <div className="flex-1 min-w-0 flex items-center gap-1">
                      <div className="w-[14px] h-[14px] flex-shrink-0">
                        <img src={ICON_PIE_CHART} alt="" className="w-full h-full" />
                      </div>
                      <div className="text-text-main text-sm font-semibold">{quota.name}</div>
                    </div>
                    
                    {/* Quota Type */}
                    <div className="w-[200px] flex-shrink-0 text-center text-text-main text-sm">{quota.type}</div>
                    
                    {/* Quota Assignation */}
                    <div className="w-[200px] flex-shrink-0 text-center text-text-main text-sm">
                      {quota.assignation}
                    </div>
                    
                    {/* Numbers with left border */}
                    <div className="border-l border-border-main pl-2 flex items-center gap-0 flex-shrink-0">
                      <div className="w-[100px] flex items-center justify-end text-text-main text-sm font-semibold">{quota.sold}</div>
                      <div className="w-[100px] flex items-center justify-end text-text-main text-sm font-semibold">
                        {isBlocked ? '-' : quota.available}
                      </div>
                      <div className="w-[100px] flex items-center justify-end relative">
                        {isEditingCapacity ? (
                          <div className="relative">
                            <input
                              type="number"
                              defaultValue={quota.capacity}
                              onChange={(e) => {
                                const newValue = parseInt(e.target.value);
                                if (!isNaN(newValue)) {
                                  capacityEditsRef.current[quota.id] = newValue;
                                  
                                  // Validate
                                  const validation = validateCapacity(quota.capacityGroupName, newValue, quota.id);
                                  setCapacityErrors(prev => {
                                    if (validation.isValid) {
                                      const newErrors = { ...prev };
                                      delete newErrors[quota.id];
                                      return newErrors;
                                    }
                                    return { ...prev, [quota.id]: validation.message };
                                  });
                                }
                              }}
                              className={`w-[77px] h-[40px] bg-white border rounded-lg px-3 text-right text-sm text-text-main outline-none ${
                                capacityErrors[quota.id] ? 'border-status-danger' : 'border-border-main'
                              }`}
                            />
                          </div>
                        ) : (
                          <span className="text-text-main text-sm font-semibold">{quota.capacity}</span>
                        )}
                      </div>
                      <div className="w-[20px]"></div>
                      <div className="w-[20px] flex items-center justify-center relative">
                        <button 
                          ref={(el) => { buttonRefs.current[quota.id] = el; }}
                          onClick={() => toggleMenu(quota.id)} 
                          className="cursor-pointer"
                        >
                          <img src={ICON_VERTICAL_DOTS} alt="" className="w-[3.5px] h-[13.5px]" />
                        </button>
                        
                        {/* Dropdown Menu */}
                        {openMenuId === quota.id && (
                          <div 
                            ref={menuRef}
                            className={`absolute right-0 bg-white border border-neutral-100 rounded-lg shadow-lg z-50 min-w-[180px] ${
                              menuDirection === 'up' ? 'bottom-6' : 'top-6'
                            }`}
                          >
                             <button
                               onClick={() => handleEditQuota(quota)}
                               className="w-full flex items-center gap-2 px-3 py-3 hover:bg-[#E6F4FF] text-sm text-text-main rounded-t-lg"
                             >
                               <img src={ICON_EDIT} alt="" className="w-[12px] h-[12px]" />
                               Edit quota
                             </button>
                            <button
                              onClick={() => { console.log('Transfer capacity:', quota.id); setOpenMenuId(null); }}
                              className="w-full flex items-center gap-2 px-3 py-3 hover:bg-[#E6F4FF] text-sm text-text-main"
                            >
                              <img src={ICON_TRANSFER} alt="" className="w-[14px] h-[8.7px]" />
                              Transfer capacity
                            </button>
                            <button
                              onClick={() => { console.log('Replicate quota:', quota.id); setOpenMenuId(null); }}
                              className="w-full flex items-center gap-2 px-3 py-3 hover:bg-[#E6F4FF] text-sm text-text-main"
                            >
                              <img src={ICON_COPY} alt="" className="w-[14px] h-[14px]" />
                              Replicate quota
                            </button>
                            <button
                              onClick={() => handleDeleteQuota(quota.id, quota.name)}
                              className="w-full flex items-center gap-2 px-3 py-3 hover:bg-[#E6F4FF] text-sm text-text-main rounded-b-lg"
                            >
                              <img src={ICON_TRASH_CAN} alt="" className="w-[12.25px] h-[14px]" />
                              Delete quota
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Error message */}
                    {capacityErrors[quota.id] && isEditingCapacity && (
                      <div className="absolute right-[60px] top-full mt-1 flex items-center gap-1">
                        <img 
                          src="http://localhost:3845/assets/88fbf3da8c1bcb99a31aede702cd8f32889d21b1.svg" 
                          alt="" 
                          className="w-3 h-3" 
                        />
                        <p className="text-xs text-status-danger whitespace-nowrap">{capacityErrors[quota.id]}</p>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Add Quota Link */}
              <div className="px-2 pb-2 flex justify-end">
                <button 
                  onClick={() => handleAddQuota('Club 54')}
                  className="flex items-center gap-1 text-primary-active text-sm font-semibold hover:underline cursor-pointer"
                >
                  <div className="w-[18px] h-[18px] flex items-center justify-center">
                    <img src={ICON_ADD_QUOTA} alt="" className="w-[13.85px] h-[13.85px]" />
                  </div>
                  Add quota
                </button>
              </div>
            </div>

            {/* Fanstand Group */}
            <div className="bg-white border border-border-main rounded-lg py-1 overflow-visible">
                  {/* Group Header */}
                  <div className="border-b border-border-main py-3 flex items-center">
                    {/* Left: Chevron + Name - Flexible */}
                    <div className="flex-1 min-w-0 flex items-center gap-3 pl-2">
                      <div className="w-[26px] h-[26px] flex items-center justify-center cursor-pointer flex-shrink-0">
                        <img src={ICON_ANGLE_DOWN} alt="" className="w-[15px] h-[9px]" />
                      </div>
                      <div className="flex-shrink-0">
                        <div className="text-text-subtle text-xs">Capacity Group</div>
                        <div className="text-text-main text-base font-semibold">Fanstand</div>
                      </div>
                    </div>
                    
                    {/* Quota Type */}
                    <div className="w-[200px] flex-shrink-0"></div>
                    
                    {/* Quota Assignation */}
                    <div className="w-[200px] flex-shrink-0"></div>
                      
                      {/* Numbers with left border */}
                     {(() => {
                       const groupTotals = calculateGroupTotals('Fanstand');
                       return (
                         <div className="border-l border-border-main pl-2 pr-2 flex items-center gap-0 flex-shrink-0">
                           <div className="w-[100px] flex items-center justify-end text-text-main text-base font-semibold">{groupTotals.sold}</div>
                           <div className="w-[100px] flex items-center justify-end text-text-main text-base font-semibold">{groupTotals.available}</div>
                           <div className="w-[100px] flex items-center justify-end text-text-main text-base font-semibold">{groupTotals.capacity}</div>
                           <div className="w-[20px]"></div>
                           <div className="w-[20px]"></div>
                         </div>
                       );
                     })()}
                   </div>

                  {/* Free Capacity Row */}
                  {(() => {
                    const freeCapacity = calculateFreeCapacity('Fanstand');
                    return (
                      <div className="mx-2 my-2 border border-border-main rounded p-4 flex items-center min-h-[52px]">
                        {/* Left: Name - Flexible */}
                        <div className="flex-1 min-w-0">
                          <div className="text-text-main text-sm font-semibold">Free capacity (no quota)</div>
                        </div>
                        
                        {/* Quota Type */}
                        <div className="w-[200px] flex-shrink-0 text-center text-text-main text-sm">-</div>
                        
                        {/* Quota Assignation */}
                        <div className="w-[200px] flex-shrink-0 text-center text-text-main text-sm">General*</div>
                        
                        {/* Numbers with left border */}
                        <div className="border-l border-border-main pl-2 flex items-center gap-0 flex-shrink-0">
                          <div className="w-[100px] flex items-center justify-end text-text-main text-sm font-semibold">{freeCapacity.sold}</div>
                          <div className="w-[100px] flex items-center justify-end text-text-main text-sm font-semibold">{freeCapacity.available}</div>
                          <div className="w-[100px] flex items-center justify-end text-text-main text-sm font-semibold">{freeCapacity.capacity}</div>
                          <div className="w-[20px]"></div>
                          <div className="w-[20px] flex items-center justify-center">
                            <img src={ICON_VERTICAL_DOTS} alt="" className="w-[3.5px] h-[13.5px] cursor-pointer" />
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                {/* Render Fanstand Quotas */}
                {getGroupQuotas('Fanstand').map((quota) => {
                  const isBlocked = quota.type === 'Blocked';
                  return (
                    <div 
                      key={quota.id} 
                      className={`mx-2 my-2 border rounded p-4 flex items-center min-h-[52px] relative ${
                        isBlocked 
                          ? 'bg-neutral-100 border-border-main' 
                          : 'bg-accent-100 border-accent-200'
                      }`}
                    >
                      {/* Left: Icon + Name - Flexible */}
                      <div className="flex-1 min-w-0 flex items-center gap-1">
                        <div className="w-[14px] h-[14px] flex-shrink-0">
                          <img src={ICON_PIE_CHART} alt="" className="w-full h-full" />
                        </div>
                        <div className="text-text-main text-sm font-semibold">{quota.name}</div>
                      </div>
                      
                      {/* Quota Type */}
                      <div className="w-[200px] flex-shrink-0 text-center text-text-main text-sm">{quota.type}</div>
                      
                      {/* Quota Assignation */}
                      <div className="w-[200px] flex-shrink-0 text-center text-text-main text-sm">
                        {quota.assignation}
                      </div>
                      
                      {/* Numbers with left border */}
                      <div className="border-l border-border-main pl-2 flex items-center gap-0 flex-shrink-0">
                        <div className="w-[100px] flex items-center justify-end text-text-main text-sm font-semibold">{quota.sold}</div>
                        <div className="w-[100px] flex items-center justify-end text-text-main text-sm font-semibold">
                          {isBlocked ? '-' : quota.available}
                        </div>
                        <div className="w-[100px] flex items-center justify-end relative">
                          {isEditingCapacity ? (
                            <div className="relative">
                              <input
                                type="number"
                                defaultValue={quota.capacity}
                                onChange={(e) => {
                                  const newValue = parseInt(e.target.value);
                                  if (!isNaN(newValue)) {
                                    capacityEditsRef.current[quota.id] = newValue;
                                    
                                    // Validate
                                    const validation = validateCapacity(quota.capacityGroupName, newValue, quota.id);
                                    setCapacityErrors(prev => {
                                      if (validation.isValid) {
                                        const newErrors = { ...prev };
                                        delete newErrors[quota.id];
                                        return newErrors;
                                      }
                                      return { ...prev, [quota.id]: validation.message };
                                    });
                                  }
                                }}
                                className={`w-[77px] h-[40px] bg-white border rounded-lg px-3 text-right text-sm text-text-main outline-none ${
                                  capacityErrors[quota.id] ? 'border-status-danger' : 'border-border-main'
                                }`}
                              />
                            </div>
                          ) : (
                            <span className="text-text-main text-sm font-semibold">{quota.capacity}</span>
                          )}
                        </div>
                        <div className="w-[20px]"></div>
                        <div className="w-[20px] flex items-center justify-center relative">
                          <button 
                            ref={(el) => { buttonRefs.current[quota.id] = el; }}
                            onClick={() => toggleMenu(quota.id)} 
                            className="cursor-pointer"
                          >
                            <img src={ICON_VERTICAL_DOTS} alt="" className="w-[3.5px] h-[13.5px]" />
                          </button>
                          
                          {/* Dropdown Menu */}
                          {openMenuId === quota.id && (
                            <div 
                              ref={menuRef}
                              className={`absolute right-0 bg-white border border-neutral-100 rounded-lg shadow-lg z-50 min-w-[180px] ${
                                menuDirection === 'up' ? 'bottom-6' : 'top-6'
                              }`}
                            >
                             <button
                               onClick={() => handleEditQuota(quota)}
                               className="w-full flex items-center gap-2 px-3 py-3 hover:bg-[#E6F4FF] text-sm text-text-main rounded-t-lg"
                             >
                               <img src={ICON_EDIT} alt="" className="w-[12px] h-[12px]" />
                               Edit quota
                             </button>
                              <button
                                onClick={() => { console.log('Transfer capacity:', quota.id); setOpenMenuId(null); }}
                                className="w-full flex items-center gap-2 px-3 py-3 hover:bg-[#E6F4FF] text-sm text-text-main"
                              >
                                <img src={ICON_TRANSFER} alt="" className="w-[14px] h-[8.7px]" />
                                Transfer capacity
                              </button>
                              <button
                                onClick={() => { console.log('Replicate quota:', quota.id); setOpenMenuId(null); }}
                                className="w-full flex items-center gap-2 px-3 py-3 hover:bg-[#E6F4FF] text-sm text-text-main"
                              >
                                <img src={ICON_COPY} alt="" className="w-[14px] h-[14px]" />
                                Replicate quota
                              </button>
                              <button
                                onClick={() => handleDeleteQuota(quota.id, quota.name)}
                                className="w-full flex items-center gap-2 px-3 py-3 hover:bg-[#E6F4FF] text-sm text-text-main rounded-b-lg"
                              >
                                <img src={ICON_TRASH_CAN} alt="" className="w-[12.25px] h-[14px]" />
                                Delete quota
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    
                    {/* Error message */}
                    {capacityErrors[quota.id] && isEditingCapacity && (
                      <div className="absolute right-[60px] top-full mt-1 flex items-center gap-1">
                        <img 
                          src="http://localhost:3845/assets/88fbf3da8c1bcb99a31aede702cd8f32889d21b1.svg" 
                          alt="" 
                          className="w-3 h-3" 
                        />
                        <p className="text-xs text-status-danger whitespace-nowrap">{capacityErrors[quota.id]}</p>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Add Quota Link */}
              <div className="px-2 pb-2 flex justify-end">
                <button 
                  onClick={() => handleAddQuota('Fanstand')}
                  className="flex items-center gap-1 text-primary-active text-sm font-semibold hover:underline cursor-pointer"
                >
                  <div className="w-[18px] h-[18px] flex items-center justify-center">
                    <img src={ICON_ADD_QUOTA} alt="" className="w-[13.85px] h-[13.85px]" />
                  </div>
                  Add quota
                </button>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>

       {/* Add Quota Drawer */}
       <AddQuotaDrawer
         isOpen={drawerOpen}
         onClose={handleDrawerClose}
         capacityGroupName={selectedGroup.name}
         timeSlot={selectedGroup.timeSlot}
         editingQuota={editingQuota}
         validateCapacity={validateCapacity}
       />

        {/* Success Toast */}
        <Toast
          message={toastMessage}
          isVisible={showToast}
          onClose={() => setShowToast(false)}
        />

        {/* Delete Confirmation Modal */}
        <DeleteQuotaModal
          isOpen={deleteModalOpen}
          quotaName={quotaToDelete?.name || ''}
          onConfirm={confirmDeleteQuota}
          onCancel={cancelDeleteQuota}
        />
      </div>
    );
  }
