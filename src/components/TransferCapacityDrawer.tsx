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
          <div className="absolute left-0 top-[56px] h-px w-[327px]">
            <div className="border-t border-border-main grow h-px"></div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 pt-0 pb-0 flex flex-col gap-4">
          {/* Spacing hack */}
          <div className="h-0 w-20" />
          
          {/* From Section */}
          <div className="flex gap-6 items-start w-[327px]">
            <div className="bg-accent-100 border border-accent-200 rounded flex flex-col gap-2 px-2 py-4 grow">
              <div className="flex gap-2 items-center justify-end w-full">
                {/* From Quota Dropdown */}
                <div className="flex-1 bg-white border border-border-main rounded-lg h-[56px] pl-3 pr-11 relative">
                  <div className="flex flex-col gap-1 grow items-start justify-center h-full relative">
                    <div className="flex gap-1 items-center pt-4 w-full">
                      {fromQuota && (
                        <img 
                          src="http://localhost:3845/assets/88fbf3da8c1bcb99a31aede702cd8f32889d21b1.svg" 
                          alt="" 
                          className="w-3.5 h-3.5"
                        />
                      )}
                      <select
                        value={fromQuotaId}
                        onChange={(e) => {
                          setFromQuotaId(e.target.value);
                          setTransferAmount('');
                        }}
                        className="flex-1 bg-transparent border-none outline-none text-base text-text-main appearance-none cursor-pointer h-6 leading-none"
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
                    </div>
                    {/* Label */}
                    <div className="absolute left-0 right-8 top-0 flex gap-1 items-center">
                      <p className="text-xs font-light text-text-subtle leading-none">From</p>
                    </div>
                  </div>
                  {/* Chevron Icon */}
                  <div className="absolute right-3 top-[18px] w-5 h-5">
                    <img 
                      src="http://localhost:3845/assets/72cc5b1d8215c30d3681996aab247393376ffdaf.svg" 
                      alt="" 
                      className="w-full h-full"
                    />
                  </div>
                </div>

                {/* Transfer Amount Input */}
                <div className="w-[79px] bg-white border border-border-main rounded-lg h-[56px] px-3 relative">
                  <div className="flex flex-col gap-1 grow items-start justify-center h-full relative">
                    <div className="flex gap-1 items-center justify-end pt-4 w-full">
                      <input
                        type="number"
                        value={transferAmount}
                        onChange={(e) => {
                          const value = e.target.value.replace('-', '');
                          setTransferAmount(value);
                        }}
                        disabled={!fromQuotaId}
                        className="flex-1 bg-transparent border-none outline-none text-base text-text-main text-right h-6 leading-none"
                        placeholder="0"
                      />
                    </div>
                    {/* Label */}
                    <div className="absolute left-0 top-0 flex gap-1 items-center">
                      <p className="text-xs font-light text-text-subtle leading-none">Transfer</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Available Quota Text */}
              {fromQuota && (
                <div className="flex gap-2.5 items-center justify-center px-2">
                  <p className="text-sm font-bold text-black leading-none">
                    Available quota: {fromQuota.available}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Transfer Icon */}
          <div className="flex gap-6 items-center justify-center w-full">
            <div className="flex flex-col items-center justify-center rounded-[64px] w-12 h-12">
              <img 
                src="http://localhost:3845/assets/afaaf690851c1cb3a6739ceced6c5111a06f2e80.svg" 
                alt="Transfer" 
                className="w-6 h-6"
              />
            </div>
          </div>

          {/* To Section */}
          <div className="flex gap-6 items-start w-[327px]">
            <div className="bg-accent-100 border border-accent-200 rounded flex flex-col gap-2 px-2 py-4 grow">
              <div className="flex gap-2 items-center justify-end w-full">
                {/* To Quota Dropdown */}
                <div className="flex-1 bg-white border border-border-main rounded-lg h-[56px] pl-3 pr-11 relative">
                  <div className="flex flex-col gap-1 grow items-start justify-center h-full relative">
                    <div className="flex gap-1 items-center pt-4 w-full">
                      {toQuota && (
                        <img 
                          src="http://localhost:3845/assets/88fbf3da8c1bcb99a31aede702cd8f32889d21b1.svg" 
                          alt="" 
                          className="w-3.5 h-3.5"
                        />
                      )}
                      <select
                        value={toQuotaId}
                        onChange={(e) => setToQuotaId(e.target.value)}
                        disabled={!fromQuotaId}
                        className="flex-1 bg-transparent border-none outline-none text-base text-text-main appearance-none cursor-pointer disabled:cursor-not-allowed disabled:text-text-subtle h-6 leading-none"
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
                    </div>
                    {/* Label */}
                    <div className="absolute left-0 right-8 top-0 flex gap-1 items-center">
                      <p className="text-xs font-light text-text-subtle leading-none">To</p>
                    </div>
                  </div>
                  {/* Chevron Icon */}
                  <div className="absolute right-3 top-[18px] w-5 h-5">
                    <img 
                      src="http://localhost:3845/assets/72cc5b1d8215c30d3681996aab247393376ffdaf.svg" 
                      alt="" 
                      className="w-full h-full"
                    />
                  </div>
                </div>

                {/* Transfer Amount Display */}
                <div className="w-[79px] bg-white border border-border-main rounded-lg h-[56px] px-3 relative">
                  <div className="flex flex-col gap-1 grow items-start justify-center h-full relative">
                    <div className="flex gap-1 items-center justify-end pt-4 w-full">
                      <div className="flex-1 text-base text-text-main text-right h-6 leading-none flex items-center justify-end">
                        +{transferAmount || '0'}
                      </div>
                    </div>
                    {/* Label */}
                    <div className="absolute left-0 top-0 flex gap-1 items-center">
                      <p className="text-xs font-light text-text-subtle leading-none">Transfer</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-2 items-center pb-0 pt-6 px-0 w-full">
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

