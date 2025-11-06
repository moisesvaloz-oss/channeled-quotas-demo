const ICON_CLOSE = '/icons/close.svg';

interface DeleteQuotaModalProps {
  isOpen: boolean;
  quotaName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteQuotaModal({ isOpen, quotaName, onConfirm, onCancel }: DeleteQuotaModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-[rgba(6,35,44,0.88)] z-50 flex items-center justify-center p-14"
        onClick={onCancel}
      >
        {/* Modal Card */}
        <div 
          className="bg-white rounded-2xl shadow-[0px_24px_24px_0px_rgba(0,70,121,0.2)] p-6 max-w-[480px] w-full relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button 
            onClick={onCancel}
            className="absolute top-[14px] right-[14px] w-11 h-11 flex items-center justify-center cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center">
              <img src={ICON_CLOSE} alt="" className="w-[10px] h-[10px]" />
            </div>
          </button>

          {/* Header */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-center px-8">
              <h2 className="text-text-main text-base font-semibold text-center w-full">
                Delete Quota
              </h2>
            </div>
            <div className="h-px w-full border-t border-border-main" />
          </div>

          {/* Content */}
          <div className="pt-4 pb-0">
            <div className="text-text-main text-base leading-6">
              <p className="mb-0">
                Your {quotaName} quota will be deleted for this time slot in this ticket group.
              </p>
              <p className="mt-6 mb-0">This action can't be undone.</p>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-6">
            <div className="flex items-center justify-between w-full">
              {/* Cancel Button */}
              <button
                onClick={onCancel}
                className="h-12 min-w-[112px] px-6 rounded-full flex items-center justify-center"
              >
                <span className="text-primary-active text-base font-semibold">Cancel</span>
              </button>

              {/* Delete Button */}
              <button
                onClick={onConfirm}
                className="h-12 min-w-[112px] px-6 rounded-full bg-primary-active flex items-center justify-center"
              >
                <span className="text-white text-base font-semibold">Delete quota</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

