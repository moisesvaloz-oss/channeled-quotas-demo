import type { Quota } from '../stores/quotaStore';
import type { Business } from '../stores/businessStore';

/**
 * Maps business types to their corresponding reseller channel names
 */
export const BUSINESS_TYPE_TO_CHANNEL: Record<string, string> = {
  'Agency': 'Reseller Travel Agency',
  'Corporate': 'Reseller Corporate Group',
  'Cultural': 'Reseller Cultural Group',
  'Educational': 'Reseller Educational Group',
  'Guide': 'Reseller Tourist Guide',
  'Internal operations': 'Reseller Internal Operations',
  'Partnerships': 'Reseller Partnerships',
  'Premium Services': 'Reseller Premium Services',
  'Sales Representative': 'Reseller Sales Representative',
};

/**
 * All reseller channels (matched by "B2B Portals" channel type)
 */
const RESELLER_CHANNELS = [
  'Reseller Educational Group',
  'Reseller Corporate Group',
  'Reseller Large Group',
  'Reseller Travel Agency',
  'Reseller Cultural Group',
  'Reseller Tourist Guide',
  'Reseller Internal Operations',
  'Reseller Partnerships',
  'Reseller Premium Services',
  'Reseller Sales Representative',
];

/**
 * Check if a quota's assignation matches the given business
 * 
 * A quota matches if:
 * 1. Assigned to the specific business name
 * 2. Assigned to the business type (e.g., "Agency")
 * 3. Assigned to a channel that corresponds to the business type (e.g., "Reseller Travel Agency")
 * 4. Assigned to channel type "B2B Portals" (matches all reseller/B2B businesses)
 */
export function quotaMatchesBusiness(quota: Quota, business: Business): boolean {
  const assignation = quota.assignation;
  
  if (!assignation || assignation === 'No assignation') {
    return false;
  }
  
  // Parse assignation - it can be comma-separated with "+X more" suffix
  const assignedValues = assignation
    .split(',')
    .map(v => v.trim())
    .filter(v => !v.includes('+') && !v.includes('more'));
  
  // Check each assigned value
  for (const value of assignedValues) {
    // 1. Direct business name match
    if (value === business.name) {
      return true;
    }
    
    // 2. Business type match (e.g., quota assigned to "Agency" matches business with type "Agency")
    if (value === business.type) {
      return true;
    }
    
    // 3. Channel match - check if the channel corresponds to the business type
    const channelForBusinessType = BUSINESS_TYPE_TO_CHANNEL[business.type];
    if (channelForBusinessType && value === channelForBusinessType) {
      return true;
    }
    
    // 4. Channel type "B2B Portals" matches all reseller businesses
    if (value === 'B2B Portals' && RESELLER_CHANNELS.some(ch => ch.includes('Reseller'))) {
      // Check if business type maps to a reseller channel
      if (BUSINESS_TYPE_TO_CHANNEL[business.type]) {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Calculate available capacity for a ticket based on quotas and the selected business
 * 
 * Logic:
 * 1. If there's an EXCLUSIVE quota matching the business → can ONLY use that quota
 * 2. Otherwise → can use FREE capacity + any SHARED quotas matching the business
 * 
 * @param ticketId - The ticket identifier (group + ticket option)
 * @param baseAvailable - The base available capacity for the ticket (without quota restrictions)
 * @param quotas - All quotas in the system
 * @param business - The selected business making the reservation
 * @param capacityGroup - The capacity group name
 * @param ticketOption - The ticket option name (optional for group-level)
 */
export function calculateChannelizedAvailability(
  baseAvailable: number,
  quotas: Quota[],
  business: Business | null,
  capacityGroup: string,
  ticketOption?: string
): { available: number; reason: string; matchingQuotas: Quota[] } {
  
  // If no business selected, return base availability
  if (!business) {
    return {
      available: baseAvailable,
      reason: 'No business selected - showing base availability',
      matchingQuotas: []
    };
  }
  
  // Filter quotas for this specific ticket/group
  const relevantQuotas = quotas.filter(q => {
    if (q.capacityGroupName !== capacityGroup) return false;
    
    // If ticketOption is provided, match ticket-level quotas
    if (ticketOption) {
      return q.ticketOption === ticketOption;
    }
    
    // Otherwise, match group-level quotas (no ticketOption)
    return !q.ticketOption;
  });
  
  // Find quotas that match this business
  const matchingQuotas = relevantQuotas.filter(q => quotaMatchesBusiness(q, business));
  
  // Separate by type
  const exclusiveQuotas = matchingQuotas.filter(q => q.type === 'Exclusive');
  const sharedQuotas = matchingQuotas.filter(q => q.type === 'Shared');
  
  // Check for exclusive quota - if exists, can ONLY use that
  if (exclusiveQuotas.length > 0) {
    const totalExclusiveAvailable = exclusiveQuotas.reduce((sum, q) => sum + q.available, 0);
    return {
      available: totalExclusiveAvailable,
      reason: `Exclusive quota for ${business.name} (${business.type})`,
      matchingQuotas: exclusiveQuotas
    };
  }
  
  // No exclusive quota - calculate free capacity
  // Free capacity = base available - all quota capacities (except blocked which already reduced base)
  const allQuotaCapacity = relevantQuotas
    .filter(q => q.type !== 'Blocked') // Blocked already reduced base
    .reduce((sum, q) => sum + q.capacity, 0);
  
  const freeCapacity = Math.max(0, baseAvailable - allQuotaCapacity);
  
  // Add shared quota availability
  const sharedAvailable = sharedQuotas.reduce((sum, q) => sum + q.available, 0);
  
  const totalAvailable = freeCapacity + sharedAvailable;
  
  let reason = 'Free capacity';
  if (sharedQuotas.length > 0) {
    reason += ` + shared quota for ${business.type}`;
  }
  
  return {
    available: totalAvailable,
    reason,
    matchingQuotas: sharedQuotas
  };
}

/**
 * Get a summary of capacity breakdown for display
 */
export function getCapacityBreakdown(
  baseAvailable: number,
  quotas: Quota[],
  business: Business | null,
  capacityGroup: string,
  ticketOption?: string
): {
  totalAvailable: number;
  freeCapacity: number;
  exclusiveCapacity: number;
  sharedCapacity: number;
  isExclusiveOnly: boolean;
  quotaNames: string[];
} {
  const result = calculateChannelizedAvailability(baseAvailable, quotas, business, capacityGroup, ticketOption);
  
  // Get relevant quotas
  const relevantQuotas = quotas.filter(q => {
    if (q.capacityGroupName !== capacityGroup) return false;
    if (ticketOption) return q.ticketOption === ticketOption;
    return !q.ticketOption;
  });
  
  const matchingQuotas = business 
    ? relevantQuotas.filter(q => quotaMatchesBusiness(q, business))
    : [];
  
  const exclusiveQuotas = matchingQuotas.filter(q => q.type === 'Exclusive');
  const sharedQuotas = matchingQuotas.filter(q => q.type === 'Shared');
  
  const isExclusiveOnly = exclusiveQuotas.length > 0;
  
  const allNonBlockedQuotaCapacity = relevantQuotas
    .filter(q => q.type !== 'Blocked')
    .reduce((sum, q) => sum + q.capacity, 0);
  
  const freeCapacity = isExclusiveOnly ? 0 : Math.max(0, baseAvailable - allNonBlockedQuotaCapacity);
  
  return {
    totalAvailable: result.available,
    freeCapacity,
    exclusiveCapacity: exclusiveQuotas.reduce((sum, q) => sum + q.available, 0),
    sharedCapacity: sharedQuotas.reduce((sum, q) => sum + q.available, 0),
    isExclusiveOnly,
    quotaNames: result.matchingQuotas.map(q => q.name)
  };
}

