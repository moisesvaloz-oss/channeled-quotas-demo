import { useState, useEffect } from 'react';
import { useQuotaStore } from '../stores/quotaStore';
import type { Quota } from '../stores/quotaStore';

interface TransferCapacityDrawerProps {
  isOpen: boolean;
  onClose: (transferCompleted: boolean) => void;
  sourceQuotaId?: string;
  timeSlot: string;
}

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
    }
  }, [isOpen, sourceQuotaId]);

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
        <div className="flex flex-col items-center pt-6 px-6 pb-2 border-b border-border-main">
          <h2 className="text-base font-semibold text-text-main text-center">
            Transfer Capacity
          </h2>
          <p className="text-sm font-bold text-text-main text-center mt-1">
            {timeSlot}
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 pt-8 pb-6">
          {/* From Section */}
          <div className="bg-accent-100 border border-accent-200 rounded p-2 mb-4">
            <div className="flex gap-2 items-center mb-2">
              {/* From Quota Dropdown */}
              <div className="flex-1 bg-white border border-border-main rounded-lg h-14 px-3 relative">
                <label className="absolute top-0 left-3 text-xs font-light text-text-subtle">
                  From
                </label>
                <select
                  value={fromQuotaId}
                  onChange={(e) => {
                    setFromQuotaId(e.target.value);
                    setTransferAmount('');
                  }}
                  className="w-full h-full pt-4 bg-transparent border-none outline-none text-sm text-text-main appearance-none cursor-pointer"
                >
                  <option value="">Select a quota</option>
                  {availableQuotas
                    .filter(q => q.type !== 'Blocked' && q.id !== toQuotaId)
                    .map((quota) => (
                      <option key={quota.id} value={quota.id}>
                        {quota.name}
                      </option>
                    ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg width="14" height="8" viewBox="0 0 14 8" fill="none">
                    <path d="M1 1L7 7L13 1" stroke="#031419" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                {fromQuota && (
                  <div className="absolute left-11 top-1/2 -translate-y-1/2 pointer-events-none">
                    <img 
                      src="http://localhost:3845/assets/88fbf3da8c1bcb99a31aede702cd8f32889d21b1.svg" 
                      alt="" 
                      className="w-3.5 h-3.5"
                    />
                  </div>
                )}
              </div>

              {/* Transfer Amount Input */}
              <div className="w-[79px] bg-white border border-border-main rounded-lg h-14 px-3 relative">
                <label className="absolute top-0 left-3 text-xs font-light text-text-subtle">
                  Transfer
                </label>
                <input
                  type="number"
                  value={transferAmount ? `-${transferAmount}` : '-0'}
                  onChange={(e) => {
                    const value = e.target.value.replace('-', '');
                    setTransferAmount(value);
                  }}
                  disabled={!fromQuotaId}
                  className="w-full h-full pt-4 bg-transparent border-none outline-none text-sm text-text-main text-right"
                  placeholder="-0"
                />
              </div>
            </div>

            {/* Available Quota Text */}
            {fromQuota && (
              <div className="text-center">
                <p className="text-sm font-bold text-text-main">
                  Available quota: {fromQuota.available}
                </p>
              </div>
            )}
          </div>

          {/* Transfer Icon */}
          <div className="flex justify-center my-4">
            <div className="w-12 h-12 flex items-center justify-center">
              <img 
                src="http://localhost:3845/assets/afaaf690851c1cb3a6739ceced6c5111a06f2e80.svg" 
                alt="Transfer" 
                className="w-6 h-6"
              />
            </div>
          </div>

          {/* To Section */}
          <div className="bg-accent-100 border border-accent-200 rounded p-2">
            <div className="flex gap-2 items-center">
              {/* To Quota Dropdown */}
              <div className="flex-1 bg-white border border-border-main rounded-lg h-14 px-3 relative">
                <label className="absolute top-0 left-3 text-xs font-light text-text-subtle">
                  To
                </label>
                <select
                  value={toQuotaId}
                  onChange={(e) => setToQuotaId(e.target.value)}
                  disabled={!fromQuotaId}
                  className="w-full h-full pt-4 bg-transparent border-none outline-none text-sm text-text-main appearance-none cursor-pointer disabled:cursor-not-allowed disabled:text-text-subtle"
                >
                  <option value="">Select an option</option>
                  {availableQuotas
                    .filter(q => q.type !== 'Blocked' && q.id !== fromQuotaId)
                    .map((quota) => (
                      <option key={quota.id} value={quota.id}>
                        {quota.name}
                      </option>
                    ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg width="14" height="8" viewBox="0 0 14 8" fill="none">
                    <path d="M1 1L7 7L13 1" stroke="#031419" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                {toQuota && (
                  <div className="absolute left-11 top-1/2 -translate-y-1/2 pointer-events-none">
                    <img 
                      src="http://localhost:3845/assets/88fbf3da8c1bcb99a31aede702cd8f32889d21b1.svg" 
                      alt="" 
                      className="w-3.5 h-3.5"
                    />
                  </div>
                )}
              </div>

              {/* Transfer Amount Display */}
              <div className="w-[79px] bg-white border border-border-main rounded-lg h-14 px-3 relative">
                <label className="absolute top-0 left-3 text-xs font-light text-text-subtle">
                  Transfer
                </label>
                <div className="w-full h-full pt-4 flex items-center justify-end text-sm text-text-main">
                  +{transferAmount || '0'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border-main">
          <button
            onClick={handleSave}
            disabled={!canSave()}
            className={`w-full h-12 rounded-full font-semibold text-sm transition-colors ${
              canSave()
                ? 'bg-action-primary text-white hover:bg-action-primary-hover'
                : 'bg-neutral-100 text-text-subtle cursor-not-allowed'
            }`}
          >
            Save
          </button>
        </div>
      </div>
    </>
  );
}

