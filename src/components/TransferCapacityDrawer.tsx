import { useState, useEffect, useRef } from 'react';
import { useQuotaStore } from '../stores/quotaStore';

interface TransferCapacityDrawerProps {
  isOpen: boolean;
  onClose: (transferCompleted: boolean) => void;
  sourceQuotaId?: string;
  timeSlot: string;
  validateCapacity?: (groupName: string, capacity: number, excludeQuotaId?: string, ticketOption?: string) => {
    isValid: boolean;
    maxAvailable: number;
    message: string;
  };
}

const ICON_CHEVRON_DOWN = '/icons/chevron-down.svg';
const ICON_PIE_CHART = '/icons/pie-chart.svg';

export default function TransferCapacityDrawer({
  isOpen,
  onClose,
  sourceQuotaId,
  timeSlot,
  validateCapacity
}: TransferCapacityDrawerProps) {
  const { quotas, updateQuotaCapacity } = useQuotaStore();
  const [isClosing, setIsClosing] = useState(false);
  const [fromQuotaId, setFromQuotaId] = useState(sourceQuotaId || '');
  const [toQuotaId, setToQuotaId] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [fromDropdownOpen, setFromDropdownOpen] = useState(false);
  const [toDropdownOpen, setToDropdownOpen] = useState(false);
  const [transferError, setTransferError] = useState('');
  const fromDropdownRef = useRef<HTMLDivElement>(null);
  const toDropdownRef = useRef<HTMLDivElement>(null);

  // Filter quotas for the same time slot
  const availableQuotas = quotas.filter(q => q.timeSlot === timeSlot);
  const fromQuota = quotas.find(q => q.id === fromQuotaId);
  const toQuota = quotas.find(q => q.id === toQuotaId);

  // Get compatible quotas for transfer (same level: group-to-group or same ticket type)
  const getCompatibleQuotas = (sourceQuota: typeof fromQuota) => {
    if (!sourceQuota) return availableQuotas;
    
    return availableQuotas.filter(q => {
      // Must be same capacity group
      if (q.capacityGroupName !== sourceQuota.capacityGroupName) return false;
      
      // Must be same level (both group-level or both same ticket type)
      if (sourceQuota.ticketOption) {
        // Source is ticket-level, destination must be same ticket type
        return q.ticketOption === sourceQuota.ticketOption;
      } else {
        // Source is group-level, destination must also be group-level
        return !q.ticketOption;
      }
    });
  };

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
      setFromQuotaId(sourceQuotaId || '');
      setToQuotaId('');
      setTransferAmount('');
      setFromDropdownOpen(false);
      setToDropdownOpen(false);
    }
  }, [isOpen, sourceQuotaId]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (fromDropdownRef.current && !fromDropdownRef.current.contains(event.target as Node)) {
        setFromDropdownOpen(false);
      }
      if (toDropdownRef.current && !toDropdownRef.current.contains(event.target as Node)) {
        setToDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClose = (transferCompleted: boolean = false) => {
    setIsClosing(true);
    setTimeout(() => {
      onClose(transferCompleted);
    }, 300);
  };

  // Validate the transfer amount for the destination quota
  const validateTransfer = (amount: number): { isValid: boolean; message: string } => {
    if (!fromQuota || !toQuota || !validateCapacity) {
      return { isValid: true, message: '' };
    }

    // Check source has enough available
    if (amount > fromQuota.available) {
      return { isValid: false, message: `Source quota only has ${fromQuota.available} available` };
    }

    // Check destination can receive this amount
    const newDestinationCapacity = toQuota.capacity + amount;
    const validation = validateCapacity(
      toQuota.capacityGroupName,
      newDestinationCapacity,
      toQuota.id,
      toQuota.ticketOption
    );

    if (!validation.isValid) {
      return { 
        isValid: false, 
        message: `Destination exceeds available capacity (max additional: ${validation.maxAvailable - toQuota.capacity})` 
      };
    }

    return { isValid: true, message: '' };
  };

  const handleSave = () => {
    const amount = parseInt(transferAmount);
    if (!fromQuotaId || !toQuotaId || !amount || amount <= 0 || !fromQuota || !toQuota) {
      return;
    }

    // Validate transfer
    const validation = validateTransfer(amount);
    if (!validation.isValid) {
      setTransferError(validation.message);
      return;
    }

    // Update both quotas
    updateQuotaCapacity(fromQuotaId, fromQuota.capacity - amount);
    updateQuotaCapacity(toQuotaId, toQuota.capacity + amount);

    handleClose(true);
  };

  const canSave = () => {
    const amount = parseInt(transferAmount);
    if (!fromQuotaId || !toQuotaId || fromQuotaId === toQuotaId || !amount || amount <= 0 || !fromQuota) {
      return false;
    }
    
    // Check basic source availability
    if (amount > fromQuota.available) {
      return false;
    }

    // Check destination validation if validateCapacity is provided
    if (validateCapacity && toQuota) {
      const validation = validateTransfer(amount);
      return validation.isValid;
    }

    return true;
  };

  if (!isOpen) return null;

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
      <div
        className={`fixed right-0 top-0 bottom-0 w-[375px] bg-white shadow-[-6px_0px_6px_0px_rgba(0,70,121,0.2)] z-50 flex flex-col rounded-tl-2xl rounded-bl-2xl ${
          isClosing ? 'animate-slideOutToRight' : 'animate-slideInFromRight'
        }`}
      >
        {/* Header */}
        <div className="flex flex-col h-[57px] items-center px-8 pb-2 pt-0 relative w-full">
          <div className="flex h-6 items-center justify-center w-full">
            <h2 className="text-base font-semibold text-text-main text-center leading-6">
              Transfer Capacity
            </h2>
          </div>
          <div className="flex grow items-center justify-center w-full min-h-0">
            <p className="text-sm font-bold text-text-main text-center leading-6">
              {timeSlot}
            </p>
          </div>
          {/* Divider */}
          <div className="absolute left-6 top-[56px] h-px w-[327px]">
            <div className="border-t border-border-main h-px w-full"></div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 pt-0 pb-0 flex flex-col gap-4 items-center min-h-0">
          {/* Spacing hack */}
          <div className="h-0 w-20" />
          
          {/* From Section */}
          <div className="w-[327px]">
            <div className="bg-accent-100 border border-accent-200 rounded flex flex-col gap-2 px-2 py-4">
              <div className="flex gap-2 items-center justify-end w-full">
                {/* From Quota Dropdown */}
                <div className="flex-1 relative" ref={fromDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setFromDropdownOpen(!fromDropdownOpen)}
                    className="w-full bg-white border border-border-main rounded-lg h-[56px] px-3 pr-11 flex flex-col justify-center relative"
                  >
                    <label className="text-text-subtle text-xs font-bold absolute top-2 left-3 pointer-events-none">From</label>
                    <div className="pt-4 flex items-center gap-1">
                      {fromQuota && (
                        <img 
                          src={ICON_PIE_CHART} 
                          alt="" 
                          className="w-3.5 h-3.5"
                        />
                      )}
                      <div className={`text-base text-left ${fromQuota ? 'text-text-main' : 'text-background-subtle-medium'}`}>
                        {fromQuota ? fromQuota.name : 'Select a quota'}
                      </div>
                    </div>
                    <div className="absolute right-3 top-[18px] w-5 h-5 flex items-center justify-center pointer-events-none">
                      <img src={ICON_CHEVRON_DOWN} alt="" className="w-3.5 h-[7px]" />
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {fromDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border-main rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                      {availableQuotas
                        .filter(q => q.id !== toQuotaId)
                        .map((quota) => (
                          <button
                            key={quota.id}
                            type="button"
                            onClick={() => {
                              setFromQuotaId(quota.id);
                              setToQuotaId(''); // Reset destination when source changes
                              setTransferAmount('');
                              setTransferError('');
                              setFromDropdownOpen(false);
                            }}
                            className="w-full px-3 py-3 text-left hover:bg-neutral-50 flex items-center gap-1 text-base text-text-main"
                          >
                            <img 
                              src={ICON_PIE_CHART} 
                              alt="" 
                              className="w-3.5 h-3.5"
                            />
                            {quota.name}
                            {quota.ticketOption && (
                              <span className="text-xs text-text-subtle ml-1">({quota.ticketOption})</span>
                            )}
                          </button>
                        ))}
                    </div>
                  )}
                </div>

                {/* Transfer Amount Input */}
                <div className={`w-[79px] bg-white border rounded-lg h-[56px] px-3 relative ${transferError ? 'border-status-danger' : 'border-border-main'}`}>
                  <div className="flex flex-col gap-1 grow items-start justify-center h-full relative">
                    <div className="flex items-center justify-end pt-4 w-full">
                      <div className="flex items-center justify-end flex-1">
                        <span className={`text-base ${transferAmount ? 'text-text-main' : 'text-background-subtle-medium'}`}>-</span>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={transferAmount}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, '');
                            setTransferAmount(value);
                            setTransferError(''); // Clear error on change
                          }}
                          disabled={!fromQuotaId}
                          className={`bg-transparent border-none outline-none text-base text-right h-6 leading-none p-0 ${transferAmount ? 'text-text-main' : 'text-background-subtle-medium'}`}
                          placeholder="0"
                          style={{ width: `${Math.max(12, (transferAmount?.length || 1) * 10)}px`, maxWidth: '40px' }}
                        />
                      </div>
                    </div>
                    {/* Label */}
                    <div className="absolute left-0 right-0 top-2 flex gap-1 items-center justify-center">
                      <p className="text-xs font-bold text-text-subtle leading-none">Transfer</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Available Quota Text */}
              {fromQuota && (
                <div className="flex gap-2.5 items-center justify-start px-2">
                  <p className="text-sm font-bold text-black leading-none">
                    Available quota: {fromQuota.available}
                  </p>
                </div>
              )}
              
              {/* Error message */}
              {transferError && (
                <div className="flex gap-1 items-center px-2">
                  <p className="text-xs text-status-danger">{transferError}</p>
                </div>
              )}
            </div>
          </div>

          {/* Transfer Icon */}
          <div className="flex items-center justify-center w-full">
            <button
              type="button"
              onClick={() => {
                // Swap From and To selections
                const tempFrom = fromQuotaId;
                setFromQuotaId(toQuotaId || '');
                setToQuotaId(tempFrom || '');
              }}
              disabled={!fromQuotaId && !toQuotaId}
              className="flex flex-col items-center justify-center rounded-[64px] w-12 h-12 cursor-pointer hover:bg-neutral-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <img 
                src="/icons/transfer-arrows.svg" 
                alt="Transfer" 
                className="w-6 h-6"
              />
            </button>
          </div>

          {/* To Section */}
          <div className="w-[327px]">
            <div className="bg-accent-100 border border-accent-200 rounded flex flex-col gap-2 px-2 py-4">
              <div className="flex gap-2 items-center justify-end w-full">
                {/* To Quota Dropdown */}
                <div className="flex-1 relative" ref={toDropdownRef}>
                  <button
                    type="button"
                    onClick={() => fromQuotaId && setToDropdownOpen(!toDropdownOpen)}
                    disabled={!fromQuotaId}
                    className="w-full bg-white border border-border-main rounded-lg h-[56px] px-3 pr-11 flex flex-col justify-center relative disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <label className="text-text-subtle text-xs font-bold absolute top-2 left-3 pointer-events-none">To</label>
                    <div className="pt-4 flex items-center gap-1">
                      {toQuota && (
                        <img 
                          src={ICON_PIE_CHART} 
                          alt="" 
                          className="w-3.5 h-3.5"
                        />
                      )}
                      <div className={`text-base text-left ${toQuota ? 'text-text-main' : 'text-background-subtle-medium'}`}>
                        {toQuota ? toQuota.name : 'Select an option'}
                      </div>
                    </div>
                    <div className="absolute right-3 top-[18px] w-5 h-5 flex items-center justify-center pointer-events-none">
                      <img src={ICON_CHEVRON_DOWN} alt="" className="w-3.5 h-[7px]" />
                    </div>
                  </button>

                  {/* Dropdown Menu - Only show compatible quotas (same level) */}
                  {toDropdownOpen && fromQuotaId && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border-main rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                      {getCompatibleQuotas(fromQuota)
                        .filter(q => q.id !== fromQuotaId)
                        .map((quota) => (
                          <button
                            key={quota.id}
                            type="button"
                            onClick={() => {
                              setToQuotaId(quota.id);
                              setTransferError('');
                              setToDropdownOpen(false);
                            }}
                            className="w-full px-3 py-3 text-left hover:bg-neutral-50 flex items-center gap-1 text-base text-text-main"
                          >
                            <img 
                              src={ICON_PIE_CHART} 
                              alt="" 
                              className="w-3.5 h-3.5"
                            />
                            {quota.name}
                            {quota.ticketOption && (
                              <span className="text-xs text-text-subtle ml-1">({quota.ticketOption})</span>
                            )}
                          </button>
                        ))}
                      {getCompatibleQuotas(fromQuota).filter(q => q.id !== fromQuotaId).length === 0 && (
                        <div className="px-3 py-3 text-sm text-text-subtle italic">
                          No compatible quotas available
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Transfer Amount Input */}
                <div className="w-[79px] bg-white border border-border-main rounded-lg h-[56px] px-3 relative">
                  <div className="flex flex-col gap-1 grow items-start justify-center h-full relative">
                    <div className="flex items-center justify-end pt-4 w-full">
                      <div className="flex items-center justify-end flex-1">
                        <span className={`text-base ${transferAmount ? 'text-text-main' : 'text-background-subtle-medium'}`}>+</span>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={transferAmount}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, '');
                            setTransferAmount(value);
                          }}
                          disabled={!toQuotaId}
                          className={`bg-transparent border-none outline-none text-base text-right h-6 leading-none p-0 ${transferAmount ? 'text-text-main' : 'text-background-subtle-medium'}`}
                          placeholder="0"
                          style={{ width: `${Math.max(12, (transferAmount?.length || 1) * 10)}px`, maxWidth: '40px' }}
                        />
                      </div>
                    </div>
                    {/* Label */}
                    <div className="absolute left-0 right-0 top-2 flex gap-1 items-center justify-center">
                      <p className="text-xs font-bold text-text-subtle leading-none">Transfer</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Available Quota Text */}
              {toQuota && (
                <div className="flex gap-2.5 items-center justify-start px-2">
                  <p className="text-sm font-bold text-black leading-none">
                    Available quota: {toQuota.available}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-2 items-center pb-6 pt-6 px-6 w-full flex-shrink-0">
          <button
            onClick={handleSave}
            disabled={!canSave()}
            className={`flex gap-1 h-12 items-center justify-center max-h-12 min-w-28 px-6 rounded-[64px] w-full ${
              canSave()
                ? 'bg-action-primary text-white hover:bg-action-primary-hover'
                : 'bg-neutral-100 text-text-subtle cursor-not-allowed'
            }`}
          >
            <p className="font-semibold text-sm leading-none">Save</p>
          </button>
        </div>
      </div>
    </>
  );
}

