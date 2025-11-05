import { useState, useEffect, useRef } from 'react';
import { useQuotaStore } from '../stores/quotaStore';
import type { Quota } from '../stores/quotaStore';

interface TransferCapacityDrawerProps {
  isOpen: boolean;
  onClose: (transferCompleted: boolean) => void;
  sourceQuotaId?: string;
  timeSlot: string;
}

const ICON_CHEVRON_DOWN = 'http://localhost:3845/assets/72cc5b1d8215c30d3681996aab247393376ffdaf.svg';
const ICON_PIE_CHART = 'http://localhost:3845/assets/88fbf3da8c1bcb99a31aede702cd8f32889d21b1.svg';

export default function TransferCapacityDrawer({
  isOpen,
  onClose,
  sourceQuotaId,
  timeSlot
}: TransferCapacityDrawerProps) {
  const { quotas, updateQuotaCapacity } = useQuotaStore();
  const [isClosing, setIsClosing] = useState(false);
  const [fromQuotaId, setFromQuotaId] = useState(sourceQuotaId || '');
  const [toQuotaId, setToQuotaId] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [fromDropdownOpen, setFromDropdownOpen] = useState(false);
  const [toDropdownOpen, setToDropdownOpen] = useState(false);
  const fromDropdownRef = useRef<HTMLDivElement>(null);
  const toDropdownRef = useRef<HTMLDivElement>(null);

  // Filter quotas for the same time slot
  const availableQuotas = quotas.filter(q => q.timeSlot === timeSlot);
  const fromQuota = quotas.find(q => q.id === fromQuotaId);
  const toQuota = quotas.find(q => q.id === toQuotaId);

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

  const handleSave = () => {
    const amount = parseInt(transferAmount);
    if (!fromQuotaId || !toQuotaId || !amount || amount <= 0 || !fromQuota || !toQuota) {
      return;
    }

    // Validate transfer amount doesn't exceed available capacity
    if (amount > fromQuota.available) {
      return;
    }

    // Update both quotas
    updateQuotaCapacity(fromQuotaId, fromQuota.capacity - amount);
    updateQuotaCapacity(toQuotaId, toQuota.capacity + amount);

    handleClose(true);
  };

  const canSave = () => {
    const amount = parseInt(transferAmount);
    return (
      fromQuotaId &&
      toQuotaId &&
      fromQuotaId !== toQuotaId &&
      amount > 0 &&
      fromQuota &&
      amount <= fromQuota.available
    );
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
        <div className="flex-1 overflow-y-auto px-6 pt-0 pb-0 flex flex-col gap-4 items-center">
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
                              setTransferAmount('');
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
                          </button>
                        ))}
                    </div>
                  )}
                </div>

                {/* Transfer Amount Input */}
                <div className="w-[79px] bg-white border border-border-main rounded-lg h-[56px] px-3 relative">
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
            </div>
          </div>

          {/* Transfer Icon */}
          <div className="flex items-center justify-center w-full">
            <div className="flex flex-col items-center justify-center rounded-[64px] w-12 h-12">
              <img 
                src="http://localhost:3845/assets/afaaf690851c1cb3a6739ceced6c5111a06f2e80.svg" 
                alt="Transfer" 
                className="w-6 h-6"
              />
            </div>
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

                  {/* Dropdown Menu */}
                  {toDropdownOpen && fromQuotaId && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border-main rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                      {availableQuotas
                        .filter(q => q.id !== fromQuotaId)
                        .map((quota) => (
                          <button
                            key={quota.id}
                            type="button"
                            onClick={() => {
                              setToQuotaId(quota.id);
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
                          </button>
                        ))}
                    </div>
                  )}
                </div>

                {/* Transfer Amount Display */}
                <div className="w-[79px] bg-white border border-border-main rounded-lg h-[56px] px-3 relative">
                  <div className="flex flex-col gap-1 grow items-start justify-center h-full relative">
                    <div className="flex gap-1 items-center justify-end pt-4 w-full">
                      <div className={`flex-1 text-base text-right h-6 leading-none flex items-center justify-end ${transferAmount ? 'text-text-main' : 'text-background-subtle-medium'}`}>
                        +{transferAmount || '0'}
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
        <div className="flex flex-col gap-2 items-center pb-0 pt-6 px-6 w-full">
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

