import type { Quota } from '../stores/quotaStore';
import type { Business } from '../stores/businessStore';
import { BUSINESS_TYPE_TO_CHANNEL } from './capacityCalculator';

/**
 * Get the specificity level of a quota match for a business
 * Returns: 1 = business name (most specific), 2 = channel/business type, 3 = channel type (least specific)
 */
function getQuotaSpecificity(quota: Quota, business: Business): number | null {
  const assignation = quota.assignation;
  
  if (!assignation || assignation === 'No assignation') {
    return null;
  }
  
  const assignedValues = assignation
    .split(',')
    .map(v => v.trim())
    .filter(v => !v.includes('+') && !v.includes('more'));
  
  for (const value of assignedValues) {
    // Level 1: Direct business name match (most specific)
    if (value === business.name) {
      return 1;
    }
    
    // Level 2: Business type or channel match
    if (value === business.type) {
      return 2;
    }
    
    const channelForBusinessType = BUSINESS_TYPE_TO_CHANNEL[business.type];
    if (channelForBusinessType && value === channelForBusinessType) {
      return 2;
    }
    
    // Level 3: Channel type "B2B Portals" (least specific)
    if (value === 'B2B Portals' && BUSINESS_TYPE_TO_CHANNEL[business.type]) {
      return 3;
    }
  }
  
  return null;
}

/**
 * Find matching quotas for a business in priority order (most specific first)
 * Returns quotas sorted by specificity: business name > channel/business type > channel type
 */
export function findMatchingQuotasInPriorityOrder(
  quotas: Quota[],
  business: Business,
  capacityGroup: string,
  ticketOption?: string
): Quota[] {
  // Filter relevant quotas
  const relevantQuotas = quotas.filter(q => {
    if (q.capacityGroupName !== capacityGroup) return false;
    if (q.type === 'Blocked') return false; // Blocked quotas can't be consumed
    if (ticketOption) return q.ticketOption === ticketOption;
    return !q.ticketOption;
  });
  
  // Find matching quotas with their specificity levels
  const matchingQuotas: Array<{ quota: Quota; specificity: number }> = [];
  
  for (const quota of relevantQuotas) {
    const specificity = getQuotaSpecificity(quota, business);
    if (specificity !== null) {
      matchingQuotas.push({ quota, specificity });
    }
  }
  
  // Sort by specificity (1 = most specific, 3 = least specific)
  matchingQuotas.sort((a, b) => a.specificity - b.specificity);
  
  return matchingQuotas.map(m => m.quota);
}

/**
 * Consume capacity from quotas in priority order
 * Returns the quotas that were consumed from and remaining quantity if not all could be consumed
 */
export function consumeCapacityFromQuotas(
  quotas: Quota[],
  business: Business,
  capacityGroup: string,
  quantity: number,
  ticketOption?: string
): { consumedQuotas: Array<{ quotaId: string; consumed: number }>; remaining: number } {
  const matchingQuotas = findMatchingQuotasInPriorityOrder(quotas, business, capacityGroup, ticketOption);
  
  let remaining = quantity;
  const consumedQuotas: Array<{ quotaId: string; consumed: number }> = [];
  
  // First, try to consume from Exclusive quotas (they must be used first)
  const exclusiveQuotas = matchingQuotas.filter(q => q.type === 'Exclusive');
  for (const quota of exclusiveQuotas) {
    if (remaining <= 0) break;
    
    const available = quota.available;
    const consume = Math.min(remaining, available);
    
    if (consume > 0) {
      consumedQuotas.push({ quotaId: quota.id, consumed: consume });
      remaining -= consume;
    }
  }
  
  // If still remaining and no exclusive quotas, consume from Shared quotas
  if (remaining > 0 && exclusiveQuotas.length === 0) {
    const sharedQuotas = matchingQuotas.filter(q => q.type === 'Shared');
    for (const quota of sharedQuotas) {
      if (remaining <= 0) break;
      
      const available = quota.available;
      const consume = Math.min(remaining, available);
      
      if (consume > 0) {
        consumedQuotas.push({ quotaId: quota.id, consumed: consume });
        remaining -= consume;
      }
    }
  }
  
  // If still remaining, it will be consumed from free capacity (handled separately)
  
  return { consumedQuotas, remaining };
}

/**
 * Parse ticket name to extract capacity group and ticket option
 * Example: "Fanstand | Friday (July 25)" -> { group: "Fanstand", ticketOption: "Friday (July 25)" }
 */
export function parseTicketName(ticketName: string): { group: string; ticketOption: string | undefined } {
  const parts = ticketName.split('|').map(p => p.trim());
  
  if (parts.length === 2) {
    return { group: parts[0], ticketOption: parts[1] };
  }
  
  // Fallback: assume it's just a group name
  return { group: ticketName, ticketOption: undefined };
}

