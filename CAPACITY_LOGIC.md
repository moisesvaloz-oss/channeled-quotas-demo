# Fever Capacity Logic Documentation

## Overview

This document describes how capacity management and quotas work in the FeverZone system, specifically for the channelized capacity feature.

## Capacity Hierarchy

There are three nested levels of capacity pools:

1. **Timeslot Level** - The top-level container (not currently supported in this demo)
2. **Group Level** - Capacity groups like "Club 54", "Fanstand", etc.
3. **Ticket Level** - Individual ticket types within groups like "Friday (July 25)", "3 days pass"

### Hierarchy Behavior
- When a ticket is sold, it is deducted from:
  1. The ticket's capacity pool
  2. The group's capacity pool
  3. The timeslot's capacity pool (if supported)
- The effective availability = min(ticket.available, group.available, timeslot.available)
- If any level goes sold out, everything below it also becomes sold out

## Quota Types

### 1. Exclusive Quota
- **Only** the assigned channels/businesses can sell from this quota
- These channels **cannot** access free capacity - they can only sell from their exclusive quota
- Other channels cannot use this capacity

### 2. Shared Quota
- Primarily for assigned channels/businesses
- If assigned channels exhaust their quota, they can fall back to free capacity
- If free capacity is exhausted, other channels can use shared quotas as a fallback

### 3. Blocked Quota
- Reserved capacity that **cannot be sold**
- Reduces overall availability
- Used for holds, VIP allocations, etc.

## Free Capacity

- Free capacity = Total capacity NOT allocated to any quota
- Represents the "general pool" that anyone can access (unless they have an exclusive quota)
- Channels/businesses with exclusive quotas **cannot** access free capacity

## Channel/Business Assignment Hierarchy

### Channels
Individual sales channels like:
- Fever marketplace
- Box office
- whitelabel-liv-golf-chicago-marketplace
- Reseller Educational Group
- Reseller Corporate Group
- etc.

### Channel Types
Groups of channels:
- **B2B Portals** - Represents ALL "Reseller *" channels
- Box Office
- Marketplace
- Affiliate Portal
- API
- Invitation
- Kiosk

### Businesses
Specific business entities created in the system (e.g., "LIV Golf Inc.", "Travel Agency XYZ")

### Business Types
Categories of businesses:
- Agency
- Corporate
- Cultural
- Educational
- Guide
- Internal operations

## Mapping for This Demo

| Entity Type | Maps To |
|-------------|---------|
| Business | Selected business in reservation flow |
| Business Type | Corresponds to "Reseller {Type}" channels |
| Channel Type "B2B Portals" | All Reseller channels |

### Business Type to Channel Mapping
- Agency → Reseller Travel Agency
- Corporate → Reseller Corporate Group
- Cultural → Reseller Cultural Group
- Educational → Reseller Educational Group
- Guide → Reseller Tourist Guide
- Internal operations → Reseller Internal Operations

## Availability Calculation for Ticket Selection

When a user selects tickets in the reservation flow, the available quantity depends on:

1. **Who is making the reservation** (which business/channel)
2. **What quotas exist** for that ticket type
3. **The quota assignments**

### Algorithm

```
function getAvailableCapacity(ticketType, business, businessType):
    
    # Get all quotas for this ticket type
    quotas = getQuotasForTicket(ticketType)
    
    # Check if there's an EXCLUSIVE quota for this business/business type
    exclusiveQuota = findExclusiveQuota(quotas, business, businessType)
    
    if exclusiveQuota exists:
        # Can ONLY use this exclusive quota
        return exclusiveQuota.available
    
    # No exclusive quota - can use free capacity + shared quotas
    freeCapacity = getFreeCapacity(ticketType)
    
    # Check for shared quotas assigned to this business/business type
    sharedQuotas = findSharedQuotas(quotas, business, businessType)
    sharedAvailable = sum(q.available for q in sharedQuotas)
    
    return freeCapacity + sharedAvailable
```

### Matching Logic

A quota matches a business if:
1. Quota is assigned to that specific **business name**
2. Quota is assigned to the **business type** (e.g., "Agency" matches business type "Agency")
3. Quota is assigned to a **channel** that corresponds to the business type (e.g., "Reseller Travel Agency" matches business type "Agency")
4. Quota is assigned to **channel type "B2B Portals"** (matches all reseller/B2B businesses)

## Example Scenarios

### Scenario 1: Exclusive Quota
- Ticket: "Fanstand | Friday (July 25)"
- Total Capacity: 150, Free Capacity: 100
- Quota: "Agency Exclusive" - 50 tickets, Exclusive, assigned to "Agency" business type

**Result for Agency business:** Can only see 50 available (their exclusive quota)
**Result for Corporate business:** Can see 100 available (free capacity only)

### Scenario 2: Shared Quota
- Ticket: "Club 54 | 3 days pass"  
- Total Capacity: 200, Free Capacity: 150
- Quota: "Corporate Shared" - 50 tickets, Shared, assigned to "Corporate" business type

**Result for Corporate business:** Can see 200 available (150 free + 50 shared)
**Result for Agency business:** Can see 150 available (free capacity only, unless free runs out)

### Scenario 3: No Matching Quota
- Business has no exclusive or shared quota for this ticket
- Can only access free capacity

## Implementation Notes

1. The `useQuotaStore` contains all quota definitions
2. The `useBusinessStore` contains business definitions with their types
3. In the reservation flow, we know which business is selected
4. The ticket selection screen should calculate available capacity based on:
   - The selected business
   - The business's type
   - Matching quotas for that business/type

