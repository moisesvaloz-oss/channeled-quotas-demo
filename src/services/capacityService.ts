import { useQuotaStore } from '../stores/quotaStore';
import { useCapacityStore } from '../stores/capacityStore';
import type { Business } from '../stores/businessStore';
import { consumeCapacityFromQuotas, parseTicketName } from '../utils/quotaConsumption';

/**
 * Consume capacity for a reservation's tickets
 * This updates quota sold/available counts and returns the quota consumption record
 */
export function consumeReservationCapacity(
  tickets: Array<{ name: string; quantity: number }>,
  business: Business | null | undefined
): Array<{ quotaId: string; consumed: number; ticketName: string }> {
  const quotaStore = useQuotaStore.getState();
  const capacityStore = useCapacityStore.getState();
  const quotas = quotaStore.quotas;
  const consumptionRecord: Array<{ quotaId: string; consumed: number; ticketName: string }> = [];
  
  for (const ticket of tickets) {
    const { group, ticketOption } = parseTicketName(ticket.name);
    
    if (business) {
      // Find matching quotas and consume capacity in priority order
      const result = consumeCapacityFromQuotas(
        quotas,
        business,
        group,
        ticket.quantity,
        ticketOption
      );
      
      // Consume from quotas
      for (const { quotaId, consumed } of result.consumedQuotas) {
        quotaStore.consumeQuotaCapacity(quotaId, consumed);
        consumptionRecord.push({ quotaId, consumed, ticketName: ticket.name });
      }
      
      // Remaining quantity (if any) is consumed from free capacity
    }
    // If no business, all capacity is consumed from free capacity
    
    // Update base capacity sold counts (always, regardless of quota consumption)
    // Update ticket-level sold count
    if (ticketOption) {
      capacityStore.incrementTicketSold(group, ticketOption, ticket.quantity);
    }
    // Update group-level sold count
    capacityStore.incrementGroupSold(group, ticket.quantity);
  }
  
  return consumptionRecord;
}

/**
 * Release capacity back to quotas when a reservation is cancelled or deleted
 */
export function releaseReservationCapacity(
  quotaConsumption: Array<{ quotaId: string; consumed: number; ticketName: string }>,
  tickets: Array<{ name: string; quantity: number }>
): void {
  const quotaStore = useQuotaStore.getState();
  const capacityStore = useCapacityStore.getState();
  
  // Release quota capacity
  for (const { quotaId, consumed } of quotaConsumption) {
    quotaStore.releaseQuotaCapacity(quotaId, consumed);
  }
  
  // Release base capacity sold counts
  for (const ticket of tickets) {
    const { group, ticketOption } = parseTicketName(ticket.name);
    
    // Decrement ticket-level sold count
    if (ticketOption) {
      capacityStore.decrementTicketSold(group, ticketOption, ticket.quantity);
    }
    // Decrement group-level sold count
    capacityStore.decrementGroupSold(group, ticket.quantity);
  }
}

