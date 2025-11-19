import { useState, useEffect, useRef } from 'react';

const ICON_CHEVRON_DOWN = '/icons/chevron-down.svg';
const ICON_CLOSE = '/icons/close.svg';

interface AddBusinessDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (business: BusinessFormData) => void;
  onDelete?: () => void;
  editingBusiness?: { id: string; name: string; type: string; enabled: boolean } | null;
}

export interface BusinessFormData {
  name: string;
  type: string;
  phone?: string;
  email?: string;
  contactName?: string;
  contactPhone?: string;
  address?: string;
  enabled: boolean;
}

const businessTypeOptions = [
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

export default function AddBusinessDrawer({ isOpen, onClose, onSave, onDelete, editingBusiness }: AddBusinessDrawerProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [name, setName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const typeDropdownRef = useRef<HTMLDivElement>(null);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target as Node)) {
        setIsTypeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Initialize form when drawer opens
  useEffect(() => {
    if (isOpen) {
      if (editingBusiness) {
        setName(editingBusiness.name);
        setBusinessType(editingBusiness.type);
      } else {
        setName('');
        setBusinessType('');
      }
      setErrors({});
      setIsClosing(false);
    }
  }, [isOpen, editingBusiness]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) newErrors.name = 'Business name is required';
    if (!businessType) newErrors.businessType = 'Business type is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const businessData: BusinessFormData = {
      name: name.trim(),
      type: businessType,
      enabled: true,
    };

    onSave(businessData);
    handleClose();
  };

  if (!isOpen && !isClosing) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
          isClosing ? 'opacity-0' : 'opacity-50'
        }`}
        onClick={handleClose}
      />

      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-[480px] bg-white shadow-xl z-50 flex flex-col transition-transform duration-300 ${
          isClosing ? 'translate-x-full' : 'translate-x-0'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-main">
          <h2 className="text-xl font-semibold text-text-main">
            {editingBusiness ? 'Edit business' : 'Add new business'}
          </h2>
          <button 
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-neutral-75 transition-colors"
          >
            <img src={ICON_CLOSE} alt="Close" className="w-4 h-4" />
          </button>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="flex flex-col gap-6">
            {/* Business Name */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-text-main">
                Business name <span className="text-status-danger">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter business name"
                  className={`w-full h-14 px-3 rounded-lg border text-base placeholder:text-background-subtle-medium focus:outline-none focus:border-action-primary focus:ring-1 focus:ring-action-primary ${
                    errors.name ? 'border-status-danger' : 'border-border-main'
                  } ${name ? 'pt-4' : ''}`}
                />
                {name && (
                  <label className="absolute top-2 left-3 text-xs font-semibold text-text-subtle pointer-events-none">
                    Enter business name
                  </label>
                )}
              </div>
              {errors.name && <span className="text-sm text-status-danger">{errors.name}</span>}
            </div>

            {/* Business Type */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-text-main">
                Business type <span className="text-status-danger">*</span>
              </label>
              <div className="relative" ref={typeDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                  className={`w-full h-14 px-3 pr-10 rounded-lg border text-left relative bg-white transition-colors ${
                    errors.businessType ? 'border-status-danger' : isTypeDropdownOpen ? 'border-action-primary ring-1 ring-action-primary' : 'border-border-main hover:border-text-subtle'
                  }`}
                >
                  {businessType && (
                    <label className="absolute top-2 left-3 text-xs font-semibold text-text-subtle pointer-events-none">
                      Business type
                    </label>
                  )}
                  <div className={`text-base truncate ${businessType ? 'pt-4 text-text-main' : 'text-background-subtle-medium'}`}>
                    {businessType || 'Select business type'}
                  </div>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <img
                      src={ICON_CHEVRON_DOWN}
                      alt=""
                      className={`w-[14px] h-[7px] transition-transform duration-200 ${isTypeDropdownOpen ? 'rotate-180' : ''}`}
                    />
                  </div>
                </button>

                {isTypeDropdownOpen && (
                  <div className="absolute top-full left-0 w-full mt-1 bg-white border border-border-main rounded shadow-lg z-10 py-1 max-h-[300px] overflow-y-auto">
                    {businessTypeOptions.map((type) => (
                      <div
                        key={type}
                        className={`px-3 py-2 text-sm cursor-pointer hover:bg-neutral-50 ${
                          type === businessType ? 'font-semibold text-text-main' : 'text-text-main'
                        }`}
                        onClick={() => {
                          setBusinessType(type);
                          setIsTypeDropdownOpen(false);
                          setErrors({ ...errors, businessType: '' });
                        }}
                      >
                        {type}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {errors.businessType && <span className="text-sm text-status-danger">{errors.businessType}</span>}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border-main">
          {editingBusiness && onDelete ? (
            <button
              onClick={onDelete}
              className="h-10 px-6 rounded-full border border-status-danger text-sm font-semibold text-status-danger hover:bg-status-danger hover:text-white transition-colors"
            >
              Delete business
            </button>
          ) : (
            <div />
          )}
          <button
            onClick={handleSave}
            className="h-10 px-6 rounded-full bg-action-primary hover:bg-action-primary-hover text-white text-sm font-semibold transition-colors"
          >
            {editingBusiness ? 'Save changes' : 'Save business'}
          </button>
        </div>
      </div>
    </>
  );
}

