import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import AddQuotaDrawer from '../components/AddQuotaDrawer';
import TransferCapacityDrawer from '../components/TransferCapacityDrawer';
import Toast from '../components/Toast';
import DeleteQuotaModal from '../components/DeleteQuotaModal';
import { useQuotaStore } from '../stores/quotaStore';
import type { Quota } from '../stores/quotaStore';

// Icon assets
const ICON_BACK_ARROW = '/icons/back-arrow.svg';
const ICON_CALENDAR = '/icons/calendar.svg';
const ICON_CLOCK = '/icons/clock.svg';
const ICON_SEARCH = '/icons/search.svg';
const ICON_INFO = '/icons/info.svg';
const ICON_ANGLE_DOWN = '/icons/angle-down.svg';
const ICON_CHEVRON_DOWN = '/icons/chevron-down.svg';
const ICON_PEN_TO_SQUARE = '/icons/pen-to-square.svg';
const ICON_VERTICAL_DOTS = '/icons/vertical-dots.svg';
const ICON_PIE_CHART = '/icons/pie-chart.svg';
const ICON_EDIT = '/icons/edit.svg';
const ICON_TRANSFER = '/icons/transfer.svg';
const ICON_COPY = '/icons/copy.svg';
const ICON_TRASH_CAN = '/icons/trash-can.svg';
const ICON_TICKET = '/icons/ticket.svg';

// Define fixed capacity group configurations
const CAPACITY_GROUPS = {
  'Club 54': { totalCapacity: 600, sold: 250 },
  'Fanstand': { totalCapacity: 200, sold: 100 },
  'Birdie Shack': { totalCapacity: 350, sold: 0 },
  'Birdie Shack LB': { totalCapacity: 15, sold: 0 },
  'LIV Premium All Access': { totalCapacity: 10, sold: 0 }
} as const;

export default function QuotaManagement() {
  const navigate = useNavigate();
  const quotas = useQuotaStore((state) => state.quotas);
  const removeQuota = useQuotaStore((state) => state.removeQuota);
  const updateQuotaCapacity = useQuotaStore((state) => state.updateQuotaCapacity);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuDirection, setMenuDirection] = useState<'down' | 'up'>('down');
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const [selectedGroup, setSelectedGroup] = useState<{ name: string; timeSlot: string }>({ 
    name: '', 
    timeSlot: 'Fri 25 Jul 2025 - 10:30' 
  });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [quotaToDelete, setQuotaToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isEditingCapacity, setIsEditingCapacity] = useState(false);
  const [editingQuota, setEditingQuota] = useState<Quota | null>(null);
  const [replicatingQuota, setReplicatingQuota] = useState<Quota | null>(null);
  const capacityEditsRef = useRef<{ [quotaId: string]: number }>({});
  const [capacityErrors, setCapacityErrors] = useState<{ [quotaId: string]: string }>({});
  const [transferDrawerOpen, setTransferDrawerOpen] = useState(false);
  const [transferSourceQuotaId, setTransferSourceQuotaId] = useState<string>('');
  const [selectedTicketOption, setSelectedTicketOption] = useState<string>('');
  const [isHeaderStuck, setIsHeaderStuck] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [collapsedGroups, setCollapsedGroups] = useState<{ [key: string]: boolean }>({});
  const [collapsedTickets, setCollapsedTickets] = useState<{ [key: string]: boolean }>({});
  const [showTicketTypes, setShowTicketTypes] = useState(true);

  const toggleGroupCollapse = (groupName: string) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  const toggleTicketCollapse = (ticketKey: string) => {
    setCollapsedTickets(prev => ({
      ...prev,
      [ticketKey]: !prev[ticketKey]
    }));
  };

  const handleAddQuota = (groupName: string, ticketOption?: string) => {
    setSelectedGroup({ 
      name: groupName, 
      timeSlot: 'Fri 25 Jul 2025 - 10:30' 
    });
    setSelectedTicketOption(ticketOption || '');
    setDrawerOpen(true);
  };

  const handleDrawerClose = (quotaCreatedOrUpdated: boolean = false) => {
    const wasEditing = editingQuota !== null;
    const wasReplicating = replicatingQuota !== null;
    setDrawerOpen(false);
    setEditingQuota(null);
    setReplicatingQuota(null);
    setSelectedTicketOption(''); // Reset ticket option on close
    if (quotaCreatedOrUpdated) {
      if (wasEditing) {
        setToastMessage('Quota successfully updated');
      } else if (wasReplicating) {
        setToastMessage('Quotas are being replicated to selected time slots.');
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

  const handleReplicateQuota = (quota: Quota) => {
    setReplicatingQuota(quota);
    setSelectedGroup({
      name: quota.capacityGroupName,
      timeSlot: quota.timeSlot,
    });
    setDrawerOpen(true);
    setOpenMenuId(null);
  };

  const handleTransferCapacity = (quotaId: string) => {
    setTransferSourceQuotaId(quotaId);
    setTransferDrawerOpen(true);
    setOpenMenuId(null);
  };

  const handleTransferDrawerClose = (transferCompleted: boolean = false) => {
    setTransferDrawerOpen(false);
    setTransferSourceQuotaId('');
    if (transferCompleted) {
      setToastMessage('Capacity transfer completed successfully');
      setShowToast(true);
    }
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

  // Detect when header becomes sticky
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeaderStuck(!entry.isIntersecting);
      },
      { threshold: [0] }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => {
      if (sentinelRef.current) {
        observer.unobserve(sentinelRef.current);
      }
    };
  }, []);

  // Get quotas for a specific group, sorted with Blocked quotas first
  const getGroupQuotas = (groupName: string) => {
    return quotas
      .filter(q => q.capacityGroupName === groupName)
      .filter(q => {
        // Filter by search query if present
        if (!searchQuery) return true;
        return q.name.toLowerCase().includes(searchQuery.toLowerCase());
      })
      .sort((a, b) => {
        // Blocked quotas always come first
        if (a.type === 'Blocked' && b.type !== 'Blocked') return -1;
        if (a.type !== 'Blocked' && b.type === 'Blocked') return 1;
        return 0; // Maintain original order for same type
      });
  };

  // Get group-level quotas (without ticketOption)
  const getGroupLevelQuotas = (groupName: string) => {
    return getGroupQuotas(groupName).filter(q => !q.ticketOption);
  };

  // Get ticket-level quotas for a specific ticket
  const getTicketLevelQuotas = (groupName: string, ticketOption: string) => {
    return getGroupQuotas(groupName).filter(q => q.ticketOption === ticketOption);
  };

  // Check if a group has any content to display (quotas or ticket types)
  const hasContentToShow = (groupName: string) => {
    const hasGroupQuotas = getGroupLevelQuotas(groupName).length > 0;
    const hasTicketTypes = showTicketTypes && ticketOptions[groupName] && ticketOptions[groupName].length > 0;
    return hasGroupQuotas || hasTicketTypes;
  };

  // Define ticket options for each group
  const ticketOptions: { [key: string]: string[] } = {
    'Club 54': ['Friday (July 25)', '3 days pass'],
    'Fanstand': ['Friday (July 25)', '3 days pass'],
    'Birdie Shack': [],
    'Birdie Shack LB': [],
    'LIV Premium All Access': []
  };

  // Define ticket type capacities (sold, available, total)
  // 
  // IMPORTANT: Ticket capacities are INDEPENDENT LIMITS, not subdivisions!
  // - Each ticket type has its own capacity limit
  // - Sales count towards BOTH ticket AND group levels simultaneously
  // - Effective availability = min(ticket.available, group.available)
  // 
  // The SOLD values MUST be consistent across hierarchy:
  // - Sum of ticket sold = group sold (same sales counted at both levels)
  // 
  // Club 54: Group sold=250, Group total=600
  // Fanstand: Group sold=100, Group total=200
  const ticketTypeCapacities: { [key: string]: { [ticket: string]: { sold: number; available: number; total: number } } } = {
    'Club 54': {
      'Friday (July 25)': { sold: 180, available: 220, total: 400 },  // Independent capacity limit
      '3 days pass': { sold: 70, available: 130, total: 200 }         // Independent capacity limit
      // Sold sum: 180 + 70 = 250 = Group sold ✓ (same sales counted at both levels)
    },
    'Fanstand': {
      'Friday (July 25)': { sold: 70, available: 80, total: 150 },    // Independent capacity limit
      '3 days pass': { sold: 30, available: 20, total: 50 }           // Independent capacity limit
      // Sold sum: 70 + 30 = 100 = Group sold ✓ (same sales counted at both levels)
    }
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

  // Calculate ticket type totals
  // The ticket header shows the BASE capacity - quotas subdivide this but don't reduce it
  // Only BLOCKED quotas reduce availability
  const calculateTicketTypeTotals = (groupName: string, ticketOption: string) => {
    const baseCapacity = ticketTypeCapacities[groupName]?.[ticketOption];
    if (!baseCapacity) return { sold: 0, available: 0, capacity: 0 };

    // Get all quotas for this specific ticket type
    const ticketQuotas = getTicketLevelQuotas(groupName, ticketOption);
    
    // Only BLOCKED quotas reduce the ticket's available capacity
    const blockedCapacity = ticketQuotas
      .filter(q => q.type === 'Blocked')
      .reduce((sum, q) => sum + q.capacity, 0);

    return {
      sold: baseCapacity.sold,
      available: Math.max(0, baseCapacity.available - blockedCapacity),
      capacity: baseCapacity.total
    };
  };

  // Validate capacity doesn't exceed available capacity
  // For group-level quotas: validate against group's available capacity
  // For ticket-level quotas: validate against ticket's available capacity
  const validateCapacity = (groupName: string, newCapacity: number, excludeQuotaId?: string, ticketOption?: string) => {
    // If this is a ticket-level quota, validate against ticket capacity
    if (ticketOption) {
      const baseCapacity = ticketTypeCapacities[groupName]?.[ticketOption];
      if (!baseCapacity) return { isValid: true, maxAvailable: 0, message: '' };

      // Get all other ticket-level quotas for this specific ticket
      const ticketQuotas = getTicketLevelQuotas(groupName, ticketOption);
      const otherQuotasCapacity = ticketQuotas
        .filter(q => q.id !== excludeQuotaId)
        .reduce((sum, q) => sum + q.capacity, 0);

      // The maximum available for this quota is the ticket's available capacity minus other quotas
      const maxAvailable = baseCapacity.available - otherQuotasCapacity;
      const isValid = newCapacity <= maxAvailable;

      return {
        isValid,
        maxAvailable,
        message: isValid ? '' : `Value exceeds available capacity (max: ${maxAvailable})`
      };
    }

    // Group-level quota validation
    const groupConfig = CAPACITY_GROUPS[groupName as keyof typeof CAPACITY_GROUPS];
    if (!groupConfig) return { isValid: true, maxAvailable: 0, message: '' };

    // Get the group's available capacity (total - sold - blocked)
    const groupTotals = calculateGroupTotals(groupName);
    
    // Calculate total capacity already allocated to other GROUP-LEVEL quotas (excluding the one being edited)
    const groupLevelQuotas = getGroupLevelQuotas(groupName);
    const otherQuotasCapacity = groupLevelQuotas
      .filter(q => q.id !== excludeQuotaId)
      .reduce((sum, q) => sum + q.capacity, 0);

    // The maximum available for this quota is the group's available capacity minus other quotas
    const maxAvailable = groupTotals.available - otherQuotasCapacity;
    const isValid = newCapacity <= maxAvailable;

    return {
      isValid,
      maxAvailable,
      message: isValid ? '' : `Value exceeds available capacity (max: ${maxAvailable})`
    };
  };

  // Calculate free capacity for a group
  // Free capacity represents the portion of group capacity NOT allocated to any group-level quota
  // It's a visualization of the "general pool" that anyone can access
  const calculateFreeCapacity = (groupName: string) => {
    const groupConfig = CAPACITY_GROUPS[groupName as keyof typeof CAPACITY_GROUPS];
    if (!groupConfig) return { sold: 0, available: 0, capacity: 0 };

    // Only count GROUP-LEVEL quotas (ticket-level quotas don't affect group free capacity)
    const groupLevelQuotas = getGroupLevelQuotas(groupName);
    const totalQuotaCapacity = groupLevelQuotas.reduce((sum, q) => sum + q.capacity, 0);
    const totalQuotaSold = groupLevelQuotas.reduce((sum, q) => sum + q.sold, 0);
    // Sum of available from all group-level quotas (capacity - sold for each quota)
    const totalQuotaAvailable = groupLevelQuotas.reduce((sum, q) => sum + (q.capacity - q.sold), 0);

    // Free capacity = total capacity not allocated to group-level quotas
    const freeCapacity = groupConfig.totalCapacity - totalQuotaCapacity;
    
    // Free sold = group's total sold minus what was sold through group-level quotas
    // This represents tickets sold from the "general pool"
    const freeSold = groupConfig.sold - totalQuotaSold;
    
    // Get the group header's available (which already accounts for quota capacity deductions)
    const groupTotals = calculateGroupTotals(groupName);
    
    // Free available = group's overall available minus quota's available
    // This ensures Free + Quota availables = Group header available
    const freeAvailable = groupTotals.available - totalQuotaAvailable;

    return {
      sold: Math.max(0, freeSold),
      available: Math.max(0, freeAvailable),
      capacity: Math.max(0, freeCapacity)
    };
  };

  // Calculate free capacity for a ticket type
  // Free capacity = ticket's base capacity minus what's allocated to quotas
  const calculateTicketFreeCapacity = (groupName: string, ticketOption: string) => {
    const baseCapacity = ticketTypeCapacities[groupName]?.[ticketOption];
    if (!baseCapacity) return { sold: 0, available: 0, capacity: 0 };

    // Only count TICKET-LEVEL quotas for this specific ticket
    const ticketLevelQuotas = getTicketLevelQuotas(groupName, ticketOption);
    
    const totalQuotaCapacity = ticketLevelQuotas.reduce((sum, q) => sum + q.capacity, 0);
    const totalQuotaSold = ticketLevelQuotas.reduce((sum, q) => sum + q.sold, 0);
    // Sum of available from all quotas (capacity - sold for each quota)
    const totalQuotaAvailable = ticketLevelQuotas.reduce((sum, q) => sum + (q.capacity - q.sold), 0);

    // Free capacity = total ticket capacity not allocated to ticket-level quotas
    const freeCapacity = baseCapacity.total - totalQuotaCapacity;
    
    // Free sold = ticket's total sold minus what was sold through ticket-level quotas
    const freeSold = baseCapacity.sold - totalQuotaSold;
    
    // Free available = ticket's base available minus quota's available
    // This ensures Free available + Quota availables = Ticket header available
    const freeAvailable = baseCapacity.available - totalQuotaAvailable;

    return {
      sold: Math.max(0, freeSold),
      available: Math.max(0, freeAvailable),
      capacity: Math.max(0, freeCapacity)
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
                      <div className="pt-4 text-text-main text-base">07/25</div>
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
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 text-text-subtle text-base outline-none bg-transparent"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer ml-4">
                  <input
                    type="checkbox"
                    checked={showTicketTypes}
                    onChange={(e) => setShowTicketTypes(e.target.checked)}
                    className="w-4 h-4 rounded border-border-main cursor-pointer accent-[#0089e3]"
                    style={{ accentColor: '#0089e3' }}
                  />
                  <span className="text-sm text-text-main font-medium">Show ticket level</span>
                </label>

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

             {/* Sentinel element to detect sticky state */}
             <div ref={sentinelRef} className="h-0" />

             {/* Time Slot Header */}
             <div 
               className={`sticky top-0 z-30 bg-neutral-75 rounded-lg py-2 px-2 mb-6 transition-shadow duration-200 ${isHeaderStuck ? 'shadow-md' : ''}`}
             >
                <div className="flex items-center">
                  {/* Date/Time - Flexible */}
                  <div className="flex-1 min-w-0">
                    <div className="text-text-main text-base font-semibold">Fri, 25 Jul 2025 - 10:30 AM</div>
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
                         <div className="border-l border-border-main pl-2 pr-2 flex items-center gap-0 flex-shrink-0">
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
                  <div className="relative px-2 py-3 flex items-center">
                    {!collapsedGroups['Club 54'] && hasContentToShow('Club 54') && (
                      <div className="absolute left-2 right-2 bottom-0 border-b border-border-main"></div>
                    )}
                    {/* Left: Chevron + Name - Flexible */}
                    <div className="flex-1 min-w-0 flex items-center gap-3">
                      <div 
                        className="w-[26px] h-[26px] flex items-center justify-center cursor-pointer flex-shrink-0"
                        onClick={() => toggleGroupCollapse('Club 54')}
                      >
                        <img 
                          src={ICON_ANGLE_DOWN} 
                          alt="" 
                          className={`w-[15px] h-[9px] transition-transform duration-200 ${collapsedGroups['Club 54'] ? '-rotate-90' : ''}`} 
                        />
                      </div>
                      <div className="flex-shrink-0">
                        <div className="text-text-subtle text-xs">Capacity Group</div>
                        <div className="text-text-main text-base font-semibold">Club 54</div>
                        <button 
                          onClick={() => handleAddQuota('Club 54')}
                          className="text-primary-active text-sm font-semibold hover:underline cursor-pointer"
                        >
                          + Add quota
                        </button>
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
                           <div className="w-[40px]"></div>
                         </div>
                       );
                     })()}
                   </div>

              {/* Collapsible Content */}
              <div className={`transition-all duration-200 ease-out ${collapsedGroups['Club 54'] ? 'max-h-0 overflow-hidden' : 'max-h-[10000px]'}`}>
                  {/* Free Capacity Row - Only show if quotas exist */}
                  {getGroupLevelQuotas('Club 54').length > 0 && (() => {
                    const freeCapacity = calculateFreeCapacity('Club 54');
                    return (
                      <div className="mx-2 my-2 border border-border-main rounded px-2 py-4 flex items-center min-h-[52px]">
                        {/* Left: Name - Flexible */}
                        <div className="flex-1 min-w-0 flex items-center gap-1">
                          <div className="w-[14px]"></div>
                          <div className="text-text-main text-sm font-semibold">Free capacity (no quota)</div>
                        </div>
                        
                        {/* Quota Type */}
                        <div className="w-[200px] flex-shrink-0 text-center text-text-main text-sm">-</div>
                        
                        {/* Quota Assignation */}
                        <div className="w-[200px] flex-shrink-0 text-center text-text-main text-sm">General*</div>
                        
                        {/* Numbers with left border */}
                        <div className="border-l border-border-main pl-2 flex items-center gap-0 flex-shrink-0">
                          <div className="w-[100px] flex items-center justify-end text-text-main text-sm">{freeCapacity.sold}</div>
                          <div className="w-[100px] flex items-center justify-end text-text-main text-sm">{freeCapacity.available}</div>
                          <div className="w-[100px] flex items-center justify-end text-text-main text-sm">{freeCapacity.capacity}</div>
                          <div className="w-[40px]"></div>
                        </div>
                      </div>
                    );
                  })()}

              {/* Render Club 54 Group-Level Quotas (without ticketOption) */}
              {getGroupLevelQuotas('Club 54').map((quota) => {
                const isBlocked = quota.type === 'Blocked';
                return (
                  <div 
                    key={quota.id} 
                    className={`mx-2 my-2 border rounded px-2 py-4 flex items-center min-h-[52px] relative ${
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
                      <div className="w-[100px] flex items-center justify-end text-text-main text-sm">{quota.sold}</div>
                      <div className="w-[100px] flex items-center justify-end text-text-main text-sm">
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
                                  
                                  // Validate - pass ticketOption for ticket-level quotas
                                  const validation = validateCapacity(quota.capacityGroupName, newValue, quota.id, quota.ticketOption);
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
                          <span className="text-text-main text-sm">{quota.capacity}</span>
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
                              onClick={() => handleTransferCapacity(quota.id)}
                              className="w-full flex items-center gap-2 px-3 py-3 hover:bg-[#E6F4FF] text-sm text-text-main"
                            >
                              <img src={ICON_TRANSFER} alt="" className="w-[14px] h-[8.7px]" />
                              Transfer capacity
                            </button>
                            <button
                              onClick={() => handleReplicateQuota(quota)}
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
                          src={ICON_PIE_CHART} 
                          alt="" 
                          className="w-3 h-3" 
                        />
                        <p className="text-xs text-status-danger whitespace-nowrap">{capacityErrors[quota.id]}</p>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Tickets Section */}
              {showTicketTypes && ticketOptions['Club 54'] && ticketOptions['Club 54'].length > 0 && (
                <>
                  <div className="pl-6">

                  {/* Render each ticket type */}
                  {ticketOptions['Club 54'].map((ticketOption) => {
                    const ticketKey = `Club 54-${ticketOption}`;
                    return (
                    <div key={ticketOption} className="mb-4">
                      {/* Ticket Header Row */}
                      <div className="mx-2 my-2 px-2 py-3 flex items-center">
                        {/* Left: Chevron + Icon + Name - Flexible */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-[18px] h-[18px] flex items-center justify-center cursor-pointer flex-shrink-0"
                              onClick={() => toggleTicketCollapse(ticketKey)}
                            >
                              <img 
                                src={ICON_CHEVRON_DOWN} 
                                alt="" 
                                className={`w-[14px] h-[7px] transition-transform duration-200 ${collapsedTickets[ticketKey] ? '-rotate-90' : ''}`} 
                              />
                            </div>
                            <div className="w-[18px] h-[18px] flex items-center justify-center">
                              <img src={ICON_TICKET} alt="" className="w-4 h-[11px]" />
                            </div>
                            <div className="text-text-main text-sm font-semibold">Club 54 | {ticketOption}</div>
                          </div>
                          <button 
                            onClick={() => handleAddQuota('Club 54', ticketOption)}
                            className="text-primary-active text-sm font-semibold hover:underline cursor-pointer ml-[44px]"
                          >
                            + Add quota
                          </button>
                        </div>
                        
                        {/* Quota Type */}
                        <div className="w-[200px] flex-shrink-0"></div>
                        
                        {/* Quota Assignation */}
                        <div className="w-[200px] flex-shrink-0"></div>
                        
                        {/* Numbers with left border */}
                        <div className="border-l border-border-main pl-2 flex items-center gap-0 flex-shrink-0">
                          <div className="w-[100px] flex items-center justify-end text-text-main text-sm font-semibold">
                            {calculateTicketTypeTotals('Club 54', ticketOption).sold}
                          </div>
                          <div className="w-[100px] flex items-center justify-end text-text-main text-sm font-semibold">
                            {calculateTicketTypeTotals('Club 54', ticketOption).available}
                          </div>
                          <div className="w-[100px] flex items-center justify-end text-text-main text-sm font-semibold">
                            {calculateTicketTypeTotals('Club 54', ticketOption).capacity}
                          </div>
                          <div className="w-[40px]"></div>
                        </div>
                      </div>

                      {/* Collapsible Quotas Section */}
                      <div className={`transition-all duration-200 ease-out ${collapsedTickets[ticketKey] ? 'max-h-0 overflow-hidden' : 'max-h-[10000px]'}`}>
                      
                      {/* Free Capacity Row for Ticket Type - Only show if quotas exist */}
                      {getTicketLevelQuotas('Club 54', ticketOption).length > 0 && (() => {
                        const ticketFreeCapacity = calculateTicketFreeCapacity('Club 54', ticketOption);
                        
                        return (
                          <div className="mx-2 my-2 border border-border-main rounded px-2 py-4 flex items-center min-h-[52px] bg-white">
                            {/* Left: Name - Flexible */}
                            <div className="flex-1 min-w-0 flex items-center gap-1">
                              <div className="text-text-main text-sm font-semibold">Free capacity (no quota)</div>
                            </div>
                            
                            {/* Quota Type */}
                            <div className="w-[200px] flex-shrink-0 text-center text-text-main text-sm">-</div>
                            
                            {/* Quota Assignation */}
                            <div className="w-[200px] flex-shrink-0 text-center text-text-main text-sm">General*</div>
                            
                            {/* Numbers with left border */}
                            <div className="border-l border-border-main pl-2 flex items-center gap-0 flex-shrink-0">
                              <div className="w-[100px] flex items-center justify-end text-text-main text-sm">
                                {ticketFreeCapacity.sold}
                              </div>
                              <div className="w-[100px] flex items-center justify-end text-text-main text-sm">
                                {ticketFreeCapacity.available}
                              </div>
                              <div className="w-[100px] flex items-center justify-end text-text-main text-sm">
                                {ticketFreeCapacity.capacity}
                              </div>
                              <div className="w-[40px]"></div>
                            </div>
                          </div>
                        );
                      })()}

                      {/* Render Ticket-Level Quotas */}
                      {getTicketLevelQuotas('Club 54', ticketOption).map((quota) => {
                        const isBlocked = quota.type === 'Blocked';
                        return (
                          <div 
                            key={quota.id} 
                            className={`mx-2 my-2 border rounded px-2 py-4 flex items-center min-h-[52px] relative ${
                              isBlocked 
                                ? 'bg-neutral-100 border-border-main' 
                                : 'bg-accent-100 border-accent-200'
                            }`}
                          >
                            {/* Quota content - same as group-level quotas */}
                            <div className="flex-1 min-w-0 flex items-center gap-1">
                              <div className="w-[14px] h-[14px] flex-shrink-0">
                                <img src={ICON_PIE_CHART} alt="" className="w-full h-full" />
                              </div>
                              <div className="text-text-main text-sm font-semibold">{quota.name}</div>
                            </div>
                            
                            <div className="w-[200px] flex-shrink-0 text-center text-text-main text-sm">{quota.type}</div>
                            
                            <div className="w-[200px] flex-shrink-0 text-center text-text-main text-sm">
                              {quota.assignation}
                            </div>
                            
                            <div className="border-l border-border-main pl-2 flex items-center gap-0 flex-shrink-0">
                              <div className="w-[100px] flex items-center justify-end text-text-main text-sm">{quota.sold}</div>
                              <div className="w-[100px] flex items-center justify-end text-text-main text-sm">
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
                                          const validation = validateCapacity(quota.capacityGroupName, newValue, quota.id, quota.ticketOption);
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
                                  <span className="text-text-main text-sm">{quota.capacity}</span>
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
                                      onClick={() => handleTransferCapacity(quota.id)}
                                      className="w-full flex items-center gap-2 px-3 py-3 hover:bg-[#E6F4FF] text-sm text-text-main"
                                    >
                                      <img src={ICON_TRANSFER} alt="" className="w-[14px] h-[8.7px]" />
                                      Transfer capacity
                                    </button>
                                    <button
                                      onClick={() => handleReplicateQuota(quota)}
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
                            
                            {capacityErrors[quota.id] && isEditingCapacity && (
                              <div className="absolute right-[60px] top-full mt-1 flex items-center gap-1">
                                <img 
                                  src={ICON_PIE_CHART} 
                                  alt="" 
                                  className="w-3 h-3" 
                                />
                                <p className="text-xs text-status-danger whitespace-nowrap">{capacityErrors[quota.id]}</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                      </div>
                    </div>
                    );
                  })}
                  </div>
                </>
              )}
              </div>
            </div>

            {/* Fanstand Group */}
            <div className="bg-white border border-border-main rounded-lg py-1 overflow-visible">
                  {/* Group Header */}
                  <div className="relative px-2 py-3 flex items-center">
                    {!collapsedGroups['Fanstand'] && hasContentToShow('Fanstand') && (
                      <div className="absolute left-2 right-2 bottom-0 border-b border-border-main"></div>
                    )}
                    {/* Left: Chevron + Name - Flexible */}
                    <div className="flex-1 min-w-0 flex items-center gap-3">
                      <div 
                        className="w-[26px] h-[26px] flex items-center justify-center cursor-pointer flex-shrink-0"
                        onClick={() => toggleGroupCollapse('Fanstand')}
                      >
                        <img 
                          src={ICON_ANGLE_DOWN} 
                          alt="" 
                          className={`w-[15px] h-[9px] transition-transform duration-200 ${collapsedGroups['Fanstand'] ? '-rotate-90' : ''}`} 
                        />
                      </div>
                      <div className="flex-shrink-0">
                        <div className="text-text-subtle text-xs">Capacity Group</div>
                        <div className="text-text-main text-base font-semibold">Fanstand</div>
                        <button 
                          onClick={() => handleAddQuota('Fanstand')}
                          className="text-primary-active text-sm font-semibold hover:underline cursor-pointer"
                        >
                          + Add quota
                        </button>
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
                           <div className="w-[40px]"></div>
                         </div>
                       );
                     })()}
                   </div>

              {/* Collapsible Content */}
              <div className={`transition-all duration-200 ease-out ${collapsedGroups['Fanstand'] ? 'max-h-0 overflow-hidden' : 'max-h-[10000px]'}`}>
                  {/* Free Capacity Row - Only show if quotas exist */}
                  {getGroupLevelQuotas('Fanstand').length > 0 && (() => {
                    const freeCapacity = calculateFreeCapacity('Fanstand');
                    return (
                      <div className="mx-2 my-2 border border-border-main rounded px-2 py-4 flex items-center min-h-[52px]">
                        {/* Left: Name - Flexible */}
                        <div className="flex-1 min-w-0 flex items-center gap-1">
                          <div className="w-[14px]"></div>
                          <div className="text-text-main text-sm font-semibold">Free capacity (no quota)</div>
                        </div>
                        
                        {/* Quota Type */}
                        <div className="w-[200px] flex-shrink-0 text-center text-text-main text-sm">-</div>
                        
                        {/* Quota Assignation */}
                        <div className="w-[200px] flex-shrink-0 text-center text-text-main text-sm">General*</div>
                        
                        {/* Numbers with left border */}
                        <div className="border-l border-border-main pl-2 flex items-center gap-0 flex-shrink-0">
                          <div className="w-[100px] flex items-center justify-end text-text-main text-sm">{freeCapacity.sold}</div>
                          <div className="w-[100px] flex items-center justify-end text-text-main text-sm">{freeCapacity.available}</div>
                          <div className="w-[100px] flex items-center justify-end text-text-main text-sm">{freeCapacity.capacity}</div>
                          <div className="w-[40px]"></div>
                        </div>
                      </div>
                    );
                  })()}

                {/* Render Fanstand Group-Level Quotas (without ticketOption) */}
                {getGroupLevelQuotas('Fanstand').map((quota) => {
                  const isBlocked = quota.type === 'Blocked';
                  return (
                    <div 
                      key={quota.id} 
                      className={`mx-2 my-2 border rounded px-2 py-4 flex items-center min-h-[52px] relative ${
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
                      <div className="border-l border-border-main pl-2 pr-2 flex items-center gap-0 flex-shrink-0">
                        <div className="w-[100px] flex items-center justify-end text-text-main text-sm">{quota.sold}</div>
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
                                    const validation = validateCapacity(quota.capacityGroupName, newValue, quota.id, quota.ticketOption);
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
                            <span className="text-text-main text-sm">{quota.capacity}</span>
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
                                onClick={() => handleTransferCapacity(quota.id)}
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
                          src={ICON_PIE_CHART} 
                          alt="" 
                          className="w-3 h-3" 
                        />
                        <p className="text-xs text-status-danger whitespace-nowrap">{capacityErrors[quota.id]}</p>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Tickets Section */}
              {showTicketTypes && ticketOptions['Fanstand'] && ticketOptions['Fanstand'].length > 0 && (
                <>
                  <div className="pl-6">

                  {/* Render each ticket type */}
                  {ticketOptions['Fanstand'].map((ticketOption) => {
                    const ticketKey = `Fanstand-${ticketOption}`;
                    return (
                    <div key={ticketOption} className="mb-4">
                      {/* Ticket Header Row */}
                      <div className="mx-2 my-2 px-2 py-3 flex items-center">
                        {/* Left: Chevron + Icon + Name - Flexible */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-[18px] h-[18px] flex items-center justify-center cursor-pointer flex-shrink-0"
                              onClick={() => toggleTicketCollapse(ticketKey)}
                            >
                              <img 
                                src={ICON_CHEVRON_DOWN} 
                                alt="" 
                                className={`w-[14px] h-[7px] transition-transform duration-200 ${collapsedTickets[ticketKey] ? '-rotate-90' : ''}`} 
                              />
                            </div>
                            <div className="w-[18px] h-[18px] flex items-center justify-center">
                              <img src={ICON_TICKET} alt="" className="w-4 h-[11px]" />
                            </div>
                            <div className="text-text-main text-sm font-semibold">Fanstand | {ticketOption}</div>
                          </div>
                          <button 
                            onClick={() => handleAddQuota('Fanstand', ticketOption)}
                            className="text-primary-active text-sm font-semibold hover:underline cursor-pointer ml-[44px]"
                          >
                            + Add quota
                          </button>
                        </div>
                        
                        {/* Quota Type */}
                        <div className="w-[200px] flex-shrink-0"></div>
                        
                        {/* Quota Assignation */}
                        <div className="w-[200px] flex-shrink-0"></div>
                        
                        {/* Numbers with left border */}
                        <div className="border-l border-border-main pl-2 flex items-center gap-0 flex-shrink-0">
                          <div className="w-[100px] flex items-center justify-end text-text-main text-sm font-semibold">
                            {calculateTicketTypeTotals('Fanstand', ticketOption).sold}
                          </div>
                          <div className="w-[100px] flex items-center justify-end text-text-main text-sm font-semibold">
                            {calculateTicketTypeTotals('Fanstand', ticketOption).available}
                          </div>
                          <div className="w-[100px] flex items-center justify-end text-text-main text-sm font-semibold">
                            {calculateTicketTypeTotals('Fanstand', ticketOption).capacity}
                          </div>
                          <div className="w-[40px]"></div>
                        </div>
                      </div>

                      {/* Collapsible Quotas Section */}
                      <div className={`transition-all duration-200 ease-out ${collapsedTickets[ticketKey] ? 'max-h-0 overflow-hidden' : 'max-h-[10000px]'}`}>
                      
                      {/* Free Capacity Row for Ticket Type - Only show if quotas exist */}
                      {getTicketLevelQuotas('Fanstand', ticketOption).length > 0 && (() => {
                        const ticketFreeCapacity = calculateTicketFreeCapacity('Fanstand', ticketOption);
                        
                        return (
                          <div className="mx-2 my-2 border border-border-main rounded px-2 py-4 flex items-center min-h-[52px] bg-white">
                            {/* Left: Name - Flexible */}
                            <div className="flex-1 min-w-0 flex items-center gap-1">
                              <div className="text-text-main text-sm font-semibold">Free capacity (no quota)</div>
                            </div>
                            
                            {/* Quota Type */}
                            <div className="w-[200px] flex-shrink-0 text-center text-text-main text-sm">-</div>
                            
                            {/* Quota Assignation */}
                            <div className="w-[200px] flex-shrink-0 text-center text-text-main text-sm">General*</div>
                            
                            {/* Numbers with left border */}
                            <div className="border-l border-border-main pl-2 flex items-center gap-0 flex-shrink-0">
                              <div className="w-[100px] flex items-center justify-end text-text-main text-sm">
                                {ticketFreeCapacity.sold}
                              </div>
                              <div className="w-[100px] flex items-center justify-end text-text-main text-sm">
                                {ticketFreeCapacity.available}
                              </div>
                              <div className="w-[100px] flex items-center justify-end text-text-main text-sm">
                                {ticketFreeCapacity.capacity}
                              </div>
                              <div className="w-[40px]"></div>
                            </div>
                          </div>
                        );
                      })()}

                      {/* Render Ticket-Level Quotas */}
                      {getTicketLevelQuotas('Fanstand', ticketOption).map((quota) => {
                        const isBlocked = quota.type === 'Blocked';
                        return (
                          <div 
                            key={quota.id} 
                            className={`mx-2 my-2 border rounded px-2 py-4 flex items-center min-h-[52px] relative ${
                              isBlocked 
                                ? 'bg-neutral-100 border-border-main' 
                                : 'bg-accent-100 border-accent-200'
                            }`}
                          >
                            {/* Quota content - same as group-level quotas */}
                            <div className="flex-1 min-w-0 flex items-center gap-1">
                              <div className="w-[14px] h-[14px] flex-shrink-0">
                                <img src={ICON_PIE_CHART} alt="" className="w-full h-full" />
                              </div>
                              <div className="text-text-main text-sm font-semibold">{quota.name}</div>
                            </div>
                            
                            <div className="w-[200px] flex-shrink-0 text-center text-text-main text-sm">{quota.type}</div>
                            
                            <div className="w-[200px] flex-shrink-0 text-center text-text-main text-sm">
                              {quota.assignation}
                            </div>
                            
                            <div className="border-l border-border-main pl-2 flex items-center gap-0 flex-shrink-0">
                              <div className="w-[100px] flex items-center justify-end text-text-main text-sm">{quota.sold}</div>
                              <div className="w-[100px] flex items-center justify-end text-text-main text-sm">
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
                                          const validation = validateCapacity(quota.capacityGroupName, newValue, quota.id, quota.ticketOption);
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
                                  <span className="text-text-main text-sm">{quota.capacity}</span>
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
                                      onClick={() => handleTransferCapacity(quota.id)}
                                      className="w-full flex items-center gap-2 px-3 py-3 hover:bg-[#E6F4FF] text-sm text-text-main"
                                    >
                                      <img src={ICON_TRANSFER} alt="" className="w-[14px] h-[8.7px]" />
                                      Transfer capacity
                                    </button>
                                    <button
                                      onClick={() => handleReplicateQuota(quota)}
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
                            
                            {capacityErrors[quota.id] && isEditingCapacity && (
                              <div className="absolute right-[60px] top-full mt-1 flex items-center gap-1">
                                <img 
                                  src={ICON_PIE_CHART} 
                                  alt="" 
                                  className="w-3 h-3" 
                                />
                                <p className="text-xs text-status-danger whitespace-nowrap">{capacityErrors[quota.id]}</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                      </div>
                    </div>
                    );
                  })}
                  </div>
                </>
              )}
              </div>
             </div>

           {/* Birdie Shack capacity group */}
            <div className="bg-white border border-border-main rounded-lg py-1 overflow-visible">
                  {/* Group Header */}
                  <div className="relative px-2 py-3 flex items-center">
                    {!collapsedGroups['Birdie Shack'] && hasContentToShow('Birdie Shack') && (
                      <div className="absolute left-2 right-2 bottom-0 border-b border-border-main"></div>
                    )}
                    {/* Left: Chevron + Name - Flexible */}
                    <div className="flex-1 min-w-0 flex items-center gap-3">
                      <div 
                        className="w-[26px] h-[26px] flex items-center justify-center cursor-pointer flex-shrink-0"
                        onClick={() => toggleGroupCollapse('Birdie Shack')}
                      >
                        <img 
                          src={ICON_ANGLE_DOWN} 
                          alt="" 
                          className={`w-[15px] h-[9px] transition-transform duration-200 ${collapsedGroups['Birdie Shack'] ? '-rotate-90' : ''}`} 
                        />
                      </div>
                      <div className="flex-shrink-0">
                        <div className="text-text-subtle text-xs">Capacity Group</div>
                        <div className="text-text-main text-base font-semibold">Birdie Shack</div>
                        <button 
                          onClick={() => handleAddQuota('Birdie Shack')}
                          className="text-primary-active text-sm font-semibold hover:underline cursor-pointer"
                        >
                          + Add quota
                        </button>
                      </div>
                    </div>
                    
                    {/* Quota Type */}
                    <div className="w-[200px] flex-shrink-0"></div>
                    
                    {/* Quota Assignation */}
                    <div className="w-[200px] flex-shrink-0"></div>
                      
                      {/* Numbers with left border */}
                     {(() => {
                       const groupTotals = calculateGroupTotals('Birdie Shack');
                       return (
                         <div className="border-l border-border-main pl-2 pr-2 flex items-center gap-0 flex-shrink-0">
                           <div className="w-[100px] flex items-center justify-end text-text-main text-base font-semibold">{groupTotals.sold}</div>
                           <div className="w-[100px] flex items-center justify-end text-text-main text-base font-semibold">{groupTotals.available}</div>
                           <div className="w-[100px] flex items-center justify-end text-text-main text-base font-semibold">{groupTotals.capacity}</div>
                           <div className="w-[40px]"></div>
                         </div>
                       );
                     })()}
                   </div>

              {/* Collapsible Content */}
              <div className={`transition-all duration-200 ease-out ${collapsedGroups['Birdie Shack'] ? 'max-h-0 overflow-hidden' : 'max-h-[10000px]'}`}>
                   {/* Free Capacity Row - Only show if quotas exist */}
                  {getGroupQuotas('Birdie Shack').length > 0 && (() => {
                    const freeCapacity = calculateFreeCapacity('Birdie Shack');
                    return (
                      <div className="mx-2 my-2 border border-border-main rounded px-2 py-4 flex items-center min-h-[52px]">
                        {/* Left: Name - Flexible */}
                        <div className="flex-1 min-w-0 flex items-center gap-1">
                          <div className="w-[14px]"></div>
                          <div className="text-text-main text-sm font-semibold">Free capacity (no quota)</div>
                        </div>
                        
                        {/* Quota Type */}
                        <div className="w-[200px] flex-shrink-0 text-center text-text-main text-sm">-</div>
                        
                        {/* Quota Assignation */}
                        <div className="w-[200px] flex-shrink-0 text-center text-text-main text-sm">General*</div>
                        
                        {/* Numbers with left border */}
                        <div className="border-l border-border-main pl-2 flex items-center gap-0 flex-shrink-0">
                          <div className="w-[100px] flex items-center justify-end text-text-main text-sm">{freeCapacity.sold}</div>
                          <div className="w-[100px] flex items-center justify-end text-text-main text-sm">{freeCapacity.available}</div>
                          <div className="w-[100px] flex items-center justify-end text-text-main text-sm">{freeCapacity.capacity}</div>
                          <div className="w-[40px]"></div>
                        </div>
                      </div>
                    );
                  })()}

                {/* Render Birdie Shack Quotas */}
                {getGroupQuotas('Birdie Shack').map((quota) => {
                  const isBlocked = quota.type === 'Blocked';
                  return (
                    <div 
                      key={quota.id} 
                      className={`mx-2 my-2 border rounded px-2 py-4 flex items-center min-h-[52px] relative ${
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
                      <div className="border-l border-border-main pl-2 pr-2 flex items-center gap-0 flex-shrink-0">
                        <div className="w-[100px] flex items-center justify-end text-text-main text-sm">{quota.sold}</div>
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
                                    const validation = validateCapacity(quota.capacityGroupName, newValue, quota.id, quota.ticketOption);
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
                            <span className="text-text-main text-sm">{quota.capacity}</span>
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
                                onClick={() => handleTransferCapacity(quota.id)}
                                className="w-full flex items-center gap-2 px-3 py-3 hover:bg-[#E6F4FF] text-sm text-text-main"
                              >
                                <img src={ICON_TRANSFER} alt="" className="w-[14px] h-[8.7px]" />
                                Transfer capacity
                              </button>
                              <button
                                onClick={() => handleReplicateQuota(quota)}
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
                          src={ICON_PIE_CHART} 
                          alt="" 
                          className="w-3 h-3" 
                        />
                        <p className="text-xs text-status-danger whitespace-nowrap">{capacityErrors[quota.id]}</p>
                      </div>
                    )}
                  </div>
                );
              })}
              </div>
            </div>

           {/* Birdie Shack LB capacity group */}
            <div className="bg-white border border-border-main rounded-lg py-1 overflow-visible">
                  {/* Group Header */}
                  <div className="relative px-2 py-3 flex items-center">
                    {!collapsedGroups['Birdie Shack LB'] && hasContentToShow('Birdie Shack LB') && (
                      <div className="absolute left-2 right-2 bottom-0 border-b border-border-main"></div>
                    )}
                    {/* Left: Chevron + Name - Flexible */}
                    <div className="flex-1 min-w-0 flex items-center gap-3">
                      <div 
                        className="w-[26px] h-[26px] flex items-center justify-center cursor-pointer flex-shrink-0"
                        onClick={() => toggleGroupCollapse('Birdie Shack LB')}
                      >
                        <img 
                          src={ICON_ANGLE_DOWN} 
                          alt="" 
                          className={`w-[15px] h-[9px] transition-transform duration-200 ${collapsedGroups['Birdie Shack LB'] ? '-rotate-90' : ''}`} 
                        />
                      </div>
                      <div className="flex-shrink-0">
                        <div className="text-text-subtle text-xs">Capacity Group</div>
                        <div className="text-text-main text-base font-semibold">Birdie Shack LB</div>
                        <button 
                          onClick={() => handleAddQuota('Birdie Shack LB')}
                          className="text-primary-active text-sm font-semibold hover:underline cursor-pointer"
                        >
                          + Add quota
                        </button>
                      </div>
                    </div>
                    
                    {/* Quota Type */}
                    <div className="w-[200px] flex-shrink-0"></div>
                    
                    {/* Quota Assignation */}
                    <div className="w-[200px] flex-shrink-0"></div>
                      
                      {/* Numbers with left border */}
                     {(() => {
                       const groupTotals = calculateGroupTotals('Birdie Shack LB');
                       return (
                         <div className="border-l border-border-main pl-2 pr-2 flex items-center gap-0 flex-shrink-0">
                           <div className="w-[100px] flex items-center justify-end text-text-main text-base font-semibold">{groupTotals.sold}</div>
                           <div className="w-[100px] flex items-center justify-end text-text-main text-base font-semibold">{groupTotals.available}</div>
                           <div className="w-[100px] flex items-center justify-end text-text-main text-base font-semibold">{groupTotals.capacity}</div>
                           <div className="w-[40px]"></div>
                         </div>
                       );
                     })()}
                   </div>

              {/* Collapsible Content */}
              <div className={`transition-all duration-200 ease-out ${collapsedGroups['Birdie Shack LB'] ? 'max-h-0 overflow-hidden' : 'max-h-[10000px]'}`}>
                   {/* Free Capacity Row - Only show if quotas exist */}
                  {getGroupQuotas('Birdie Shack LB').length > 0 && (() => {
                    const freeCapacity = calculateFreeCapacity('Birdie Shack LB');
                    return (
                      <div className="mx-2 my-2 border border-border-main rounded px-2 py-4 flex items-center min-h-[52px]">
                        {/* Left: Name - Flexible */}
                        <div className="flex-1 min-w-0 flex items-center gap-1">
                          <div className="w-[14px]"></div>
                          <div className="text-text-main text-sm font-semibold">Free capacity (no quota)</div>
                        </div>
                        
                        {/* Quota Type */}
                        <div className="w-[200px] flex-shrink-0 text-center text-text-main text-sm">-</div>
                        
                        {/* Quota Assignation */}
                        <div className="w-[200px] flex-shrink-0 text-center text-text-main text-sm">General*</div>
                        
                        {/* Numbers with left border */}
                        <div className="border-l border-border-main pl-2 flex items-center gap-0 flex-shrink-0">
                          <div className="w-[100px] flex items-center justify-end text-text-main text-sm">{freeCapacity.sold}</div>
                          <div className="w-[100px] flex items-center justify-end text-text-main text-sm">{freeCapacity.available}</div>
                          <div className="w-[100px] flex items-center justify-end text-text-main text-sm">{freeCapacity.capacity}</div>
                          <div className="w-[40px]"></div>
                        </div>
                      </div>
                    );
                  })()}

                {/* Render Birdie Shack LB Quotas */}
                {getGroupQuotas('Birdie Shack LB').map((quota) => {
                  const isBlocked = quota.type === 'Blocked';
                  return (
                    <div 
                      key={quota.id} 
                      className={`mx-2 my-2 border rounded px-2 py-4 flex items-center min-h-[52px] relative ${
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
                      <div className="border-l border-border-main pl-2 pr-2 flex items-center gap-0 flex-shrink-0">
                        <div className="w-[100px] flex items-center justify-end text-text-main text-sm">{quota.sold}</div>
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
                                    const validation = validateCapacity(quota.capacityGroupName, newValue, quota.id, quota.ticketOption);
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
                            <span className="text-text-main text-sm">{quota.capacity}</span>
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
                                onClick={() => handleTransferCapacity(quota.id)}
                                className="w-full flex items-center gap-2 px-3 py-3 hover:bg-[#E6F4FF] text-sm text-text-main"
                              >
                                <img src={ICON_TRANSFER} alt="" className="w-[14px] h-[8.7px]" />
                                Transfer capacity
                              </button>
                              <button
                                onClick={() => handleReplicateQuota(quota)}
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
                          src={ICON_PIE_CHART} 
                          alt="" 
                          className="w-3 h-3" 
                        />
                        <p className="text-xs text-status-danger whitespace-nowrap">{capacityErrors[quota.id]}</p>
                      </div>
                    )}
                  </div>
                );
              })}
              </div>
            </div>

           {/* LIV Premium All Access capacity group */}
            <div className="bg-white border border-border-main rounded-lg py-1 overflow-visible">
                  {/* Group Header */}
                  <div className="relative px-2 py-3 flex items-center">
                    {!collapsedGroups['LIV Premium All Access'] && hasContentToShow('LIV Premium All Access') && (
                      <div className="absolute left-2 right-2 bottom-0 border-b border-border-main"></div>
                    )}
                    {/* Left: Chevron + Name - Flexible */}
                    <div className="flex-1 min-w-0 flex items-center gap-3">
                      <div 
                        className="w-[26px] h-[26px] flex items-center justify-center cursor-pointer flex-shrink-0"
                        onClick={() => toggleGroupCollapse('LIV Premium All Access')}
                      >
                        <img 
                          src={ICON_ANGLE_DOWN} 
                          alt="" 
                          className={`w-[15px] h-[9px] transition-transform duration-200 ${collapsedGroups['LIV Premium All Access'] ? '-rotate-90' : ''}`} 
                        />
                      </div>
                      <div className="flex-shrink-0">
                        <div className="text-text-subtle text-xs">Capacity Group</div>
                        <div className="text-text-main text-base font-semibold">LIV Premium All Access</div>
                        <button 
                          onClick={() => handleAddQuota('LIV Premium All Access')}
                          className="text-primary-active text-sm font-semibold hover:underline cursor-pointer"
                        >
                          + Add quota
                        </button>
                      </div>
                    </div>
                    
                    {/* Quota Type */}
                    <div className="w-[200px] flex-shrink-0"></div>
                    
                    {/* Quota Assignation */}
                    <div className="w-[200px] flex-shrink-0"></div>
                      
                      {/* Numbers with left border */}
                     {(() => {
                       const groupTotals = calculateGroupTotals('LIV Premium All Access');
                       return (
                         <div className="border-l border-border-main pl-2 pr-2 flex items-center gap-0 flex-shrink-0">
                           <div className="w-[100px] flex items-center justify-end text-text-main text-base font-semibold">{groupTotals.sold}</div>
                           <div className="w-[100px] flex items-center justify-end text-text-main text-base font-semibold">{groupTotals.available}</div>
                           <div className="w-[100px] flex items-center justify-end text-text-main text-base font-semibold">{groupTotals.capacity}</div>
                           <div className="w-[40px]"></div>
                         </div>
                       );
                     })()}
                   </div>

              {/* Collapsible Content */}
              <div className={`transition-all duration-200 ease-out ${collapsedGroups['LIV Premium All Access'] ? 'max-h-0 overflow-hidden' : 'max-h-[10000px]'}`}>
                   {/* Free Capacity Row - Only show if quotas exist */}
                  {getGroupQuotas('LIV Premium All Access').length > 0 && (() => {
                    const freeCapacity = calculateFreeCapacity('LIV Premium All Access');
                    return (
                      <div className="mx-2 my-2 border border-border-main rounded px-2 py-4 flex items-center min-h-[52px]">
                        {/* Left: Name - Flexible */}
                        <div className="flex-1 min-w-0 flex items-center gap-1">
                          <div className="w-[14px]"></div>
                          <div className="text-text-main text-sm font-semibold">Free capacity (no quota)</div>
                        </div>
                        
                        {/* Quota Type */}
                        <div className="w-[200px] flex-shrink-0 text-center text-text-main text-sm">-</div>
                        
                        {/* Quota Assignation */}
                        <div className="w-[200px] flex-shrink-0 text-center text-text-main text-sm">General*</div>
                        
                        {/* Numbers with left border */}
                        <div className="border-l border-border-main pl-2 flex items-center gap-0 flex-shrink-0">
                          <div className="w-[100px] flex items-center justify-end text-text-main text-sm">{freeCapacity.sold}</div>
                          <div className="w-[100px] flex items-center justify-end text-text-main text-sm">{freeCapacity.available}</div>
                          <div className="w-[100px] flex items-center justify-end text-text-main text-sm">{freeCapacity.capacity}</div>
                          <div className="w-[40px]"></div>
                        </div>
                      </div>
                    );
                  })()}

                {/* Render LIV Premium All Access Quotas */}
                {getGroupQuotas('LIV Premium All Access').map((quota) => {
                  const isBlocked = quota.type === 'Blocked';
                  return (
                    <div 
                      key={quota.id} 
                      className={`mx-2 my-2 border rounded px-2 py-4 flex items-center min-h-[52px] relative ${
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
                      <div className="border-l border-border-main pl-2 pr-2 flex items-center gap-0 flex-shrink-0">
                        <div className="w-[100px] flex items-center justify-end text-text-main text-sm">{quota.sold}</div>
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
                                    const validation = validateCapacity(quota.capacityGroupName, newValue, quota.id, quota.ticketOption);
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
                            <span className="text-text-main text-sm">{quota.capacity}</span>
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
                                onClick={() => handleTransferCapacity(quota.id)}
                                className="w-full flex items-center gap-2 px-3 py-3 hover:bg-[#E6F4FF] text-sm text-text-main"
                              >
                                <img src={ICON_TRANSFER} alt="" className="w-[14px] h-[8.7px]" />
                                Transfer capacity
                              </button>
                              <button
                                onClick={() => handleReplicateQuota(quota)}
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
                          src={ICON_PIE_CHART} 
                          alt="" 
                          className="w-3 h-3" 
                        />
                        <p className="text-xs text-status-danger whitespace-nowrap">{capacityErrors[quota.id]}</p>
                      </div>
                    )}
                  </div>
                );
              })}
              </div>
            </div>
        </div>
          </div>
        </div>
        <Footer />
      </div>

       {/* Add Quota Drawer */}
       <AddQuotaDrawer
         isOpen={drawerOpen}
         onClose={handleDrawerClose}
         capacityGroupName={selectedGroup.name}
         timeSlot={selectedGroup.timeSlot}
         editingQuota={editingQuota}
         replicatingQuota={replicatingQuota}
         validateCapacity={validateCapacity}
         initialTicketOption={selectedTicketOption}
       />

       {/* Transfer Capacity Drawer */}
       <TransferCapacityDrawer
         isOpen={transferDrawerOpen}
         onClose={handleTransferDrawerClose}
         sourceQuotaId={transferSourceQuotaId}
         timeSlot="Fri 25 Jul 2025 - 10:30"
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
    </div>
    );
  }
