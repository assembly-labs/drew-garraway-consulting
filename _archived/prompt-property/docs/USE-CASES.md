# Prompt Property Manager AI - Use Cases & Conversation Flows

**Version:** 1.0
**Last Updated:** December 2024
**Status:** Research Complete - Ready for Implementation

---

## Executive Summary

This document defines the priority use cases for Prompt Property Manager AI based on:
- Industry research on most common HOA/apartment resident questions
- Competitive analysis (STAN AI serves 10,000+ communities, 1.5M homeowners)
- Pain point severity assessment from market research
- Legal/liability considerations requiring careful handling

**Key Finding:** 70% of property manager inquiries are repetitive questions that fall into 10 predictable categories. Automating these with accurate, sourced answers represents the core value proposition.

---

## Use Case Prioritization Framework

### Evaluation Criteria

| Criterion | Weight | Description |
|-----------|--------|-------------|
| **Frequency** | 30% | How often this question is asked |
| **Automation Potential** | 25% | Can be answered from documents without judgment |
| **User Impact** | 20% | Importance to resident (financial, legal, lifestyle) |
| **PM Time Savings** | 15% | Time saved for property manager per inquiry |
| **Risk Level** | 10% | Liability if answered incorrectly (inverse score) |

### Priority Tiers

- **P0 (Must Have):** Core use cases for MVP - high frequency, high automation potential
- **P1 (Should Have):** Important but more complex - moderate frequency, may need escalation paths
- **P2 (Nice to Have):** Lower frequency or higher complexity - future enhancement

---

## P0 Use Cases (Must Have)

### UC-01: Pet Policy Inquiry

**Priority:** P0 | **Frequency:** Very High | **Risk:** Low-Medium

**Why This Matters:**
- #1 most common resident question according to industry data
- Clear rules exist in documents (weight limits, breed restrictions, deposits)
- High resident anxiety (fear of rejection, deposits, rule violations)
- 40% of American households have dogs; 35% have cats

**User Story:**
> As a resident, I want to know if I can have a pet and what the rules are, so I can make an informed decision before getting a pet or moving in.

**Question Variations:**
- "Can I have a dog?"
- "What's the pet policy?"
- "Are there breed restrictions?"
- "How much is the pet deposit?"
- "Can I have two cats?"
- "Are emotional support animals allowed?"
- "Do I need to register my pet?"

**Required Information:**
- Allowed pet types (dogs, cats, fish, birds, etc.)
- Weight/size limits
- Breed restrictions (if any)
- Maximum number of pets
- Pet deposit amount
- Monthly pet rent (if applicable)
- Registration requirements
- Vaccination requirements
- Leash rules in common areas
- Pet waste policies

**Escalation Triggers:**
- Service animal / ESA requests → Must escalate (Fair Housing Act)
- Exotic animal requests → May need board interpretation
- Existing pet complaints → Requires human judgment

**Sample Conversation Flow:**
```
User: Can I have a dog?

Prompt Property Manager: Yes, dogs are allowed at Oakwood Commons.

**Requirements:**
- Weight limit: 50 lbs maximum
- Breed restrictions: Pit bulls, Rottweilers, and wolf hybrids not permitted
- Maximum: 2 pets per household
- Registration required within 14 days of move-in

**Costs:**
- Pet deposit: $300 (refundable)
- Monthly pet rent: $25/pet

**Rules:**
- Dogs must be leashed in all common areas
- Owners must clean up after pets immediately
- Excessive barking may result in violations

📎 Source: CC&Rs Section 7.1-7.3

Would you like help with the pet registration form?

---
*This is general policy information, not legal advice.*
```

---

### UC-02: Architectural Modification Approval

**Priority:** P0 | **Frequency:** Very High | **Risk:** Medium

**Why This Matters:**
- #2 most common HOA question
- #1 source of HOA violations (unauthorized modifications)
- Most expensive mistakes for homeowners (forced removal of improvements)
- Clear approval processes exist but residents don't understand them

**User Story:**
> As a homeowner, I want to know what I need to do before making changes to my property, so I don't get fined or forced to remove improvements.

**Question Variations:**
- "Can I put up a fence?"
- "Can I paint my front door?"
- "Do I need approval for a shed?"
- "Can I install solar panels?"
- "What colors are approved for exterior paint?"
- "How do I submit an architectural request?"
- "Can I add a deck to my backyard?"
- "Are satellite dishes allowed?"

**Required Information:**
- What requires approval vs. what doesn't
- Architectural Review Committee (ARC) process
- Application forms and fees
- Timeline for review
- Approved materials/colors/specifications
- Common denial reasons
- Appeal process

**Key Modification Categories:**
1. **Fencing:** Height limits, materials, colors, setbacks
2. **Paint:** Approved color palettes, application process
3. **Landscaping:** Tree removal, hardscaping, irrigation
4. **Structures:** Sheds, pergolas, gazebos, playsets
5. **Solar/Satellite:** Placement restrictions, visibility rules
6. **Windows/Doors:** Style, color, material requirements
7. **Roofing:** Material and color matching

**Sample Conversation Flow:**
```
User: I want to paint my front door red. Do I need approval?

Prompt Property Manager: Yes, exterior paint changes require Architectural Review Committee (ARC) approval—including front doors.

**What you need to know:**
- Front doors must be painted from the approved color palette
- "Red" colors on the approved list include: Barn Red (#7C0A02), Brick Red (#CB4154), and Sedona Clay (#A25F4D)
- Bright or neon reds are not permitted

**To get approval:**
1. Submit an ARC Application (available in resident portal)
2. Include the specific paint brand/color code
3. No fee for paint applications
4. Typical approval time: 14-21 days

**Important:** Don't paint before receiving written approval. Unapproved colors may require repainting at your expense.

📎 Source: Architectural Guidelines Section 3.2

Would you like the link to the ARC application form?

---
*This is general policy information, not legal advice.*
```

---

### UC-03: Parking Rules & Restrictions

**Priority:** P0 | **Frequency:** Very High | **Risk:** Low

**Why This Matters:**
- Top 5 most common resident question
- Top 5 most common HOA violation
- Immediate impact (towing, fines)
- Affects guests and daily life

**User Story:**
> As a resident, I want to understand parking rules so I can avoid getting my car towed or receiving fines.

**Question Variations:**
- "Where can my guests park?"
- "Can I park my RV in the driveway?"
- "How many cars am I allowed?"
- "What are the visitor parking rules?"
- "Can I park on the street overnight?"
- "Where do I get a parking pass?"
- "Can I work on my car in the parking lot?"

**Required Information:**
- Assigned parking (how many spaces per unit)
- Guest/visitor parking locations and limits
- Time restrictions (overnight, extended stays)
- Vehicle type restrictions (RVs, boats, trailers, commercial)
- Inoperable vehicle policies
- Street parking rules
- Parking pass process
- Towing policies and procedures
- Motorcycle/bicycle parking

**Sample Conversation Flow:**
```
User: Can I park my RV in my driveway?

Prompt Property Manager: No, RVs cannot be parked in driveways or on the street at Oakwood Commons.

**Vehicle restrictions include:**
- Recreational vehicles (RVs, motorhomes)
- Boats and boat trailers
- Trailers of any kind
- Commercial vehicles with visible signage

**Alternatives:**
- Temporary loading/unloading: Up to 48 hours with management notice
- Off-site storage facilities nearby (I can provide a list)
- Visitor lot may accommodate short visits—check with management

**Why this rule exists:** The policy maintains neighborhood appearance and property values.

📎 Source: CC&Rs Section 6.4

Would you like information about nearby RV storage facilities?

---
*This is general policy information, not legal advice.*
```

---

### UC-04: Pool & Amenity Hours/Rules

**Priority:** P0 | **Frequency:** High | **Risk:** Very Low

**Why This Matters:**
- Very common question, especially seasonally
- Straightforward factual answers
- Easy win for automation (no judgment needed)
- Improves resident experience

**User Story:**
> As a resident, I want to know pool hours and rules so I can plan my visits and bring guests appropriately.

**Question Variations:**
- "What are the pool hours?"
- "Can I bring guests to the pool?"
- "Is the gym open 24 hours?"
- "How do I reserve the clubhouse?"
- "Are glass containers allowed at the pool?"
- "Is there a lifeguard?"
- "When does the pool close for winter?"

**Required Information:**
- Operating hours (daily, seasonal variations)
- Guest policies (number allowed, sign-in requirements)
- Reservation procedures (clubhouse, party areas)
- Rules and restrictions (food, alcohol, glass, music)
- Age restrictions (if any)
- Key fob/access requirements
- Holiday hours
- Capacity limits

**Sample Conversation Flow:**
```
User: What are the pool hours?

Prompt Property Manager: The pool is open **6 AM - 10 PM daily** from Memorial Day through Labor Day.

**Off-season hours (September-May):** 8 AM - 8 PM (weather permitting)

**Guest policy:**
- Up to 4 guests per household
- Residents must accompany guests at all times
- Sign in at the pool entrance

**Pool rules:**
- No glass containers
- No diving (shallow end)
- Children under 14 must have adult supervision
- No alcohol without clubhouse reservation

**Reservations:** For parties of 8+, reserve 48 hours in advance through the resident portal.

📎 Source: Community Rules Section 5.1-5.3

Anything else about amenities?

---
*This is general policy information, not legal advice.*
```

---

### UC-05: Noise & Quiet Hours

**Priority:** P0 | **Frequency:** High | **Risk:** Low

**Why This Matters:**
- Top 10 resident question
- Common source of neighbor disputes
- Clear rules typically exist
- Prevents escalation to complaints

**User Story:**
> As a resident, I want to know quiet hours and noise rules so I can be a good neighbor and know my rights if disturbed.

**Question Variations:**
- "What are the quiet hours?"
- "Can I have a party?"
- "My neighbor is too loud—what can I do?"
- "When can construction work be done?"
- "Is there a noise limit?"
- "Can I play music by the pool?"

**Required Information:**
- Quiet hours (start/end times, weekday vs weekend)
- Construction/renovation hours
- Party/gathering guidelines
- Noise complaint process
- Violation consequences
- Exceptions (emergencies, holidays)

**Sample Conversation Flow:**
```
User: What are the quiet hours?

Prompt Property Manager: **Quiet hours at Oakwood Commons are 10 PM - 7 AM daily.**

During quiet hours, please keep noise at a level that doesn't disturb neighbors:
- Music and TV volume
- Parties and gatherings
- Pet noise (barking)

**Construction hours:**
- Weekdays: 8 AM - 6 PM
- Saturdays: 9 AM - 5 PM
- Sundays: No construction allowed

**Having a party?**
Large gatherings (20+ guests) should notify management 48 hours in advance as a courtesy.

**Noise concerns?**
If you're being disturbed, you can file a noise complaint through the resident portal or contact management.

📎 Source: CC&Rs Section 9.2

Is there something specific about noise policies I can help with?

---
*This is general policy information, not legal advice.*
```

---

### UC-06: Move-In/Move-Out Procedures

**Priority:** P0 | **Frequency:** High | **Risk:** Medium

**Why This Matters:**
- Critical timing for new and departing residents
- Affects security deposit return (high anxiety topic)
- Clear procedures prevent disputes
- High impact on resident experience

**User Story:**
> As a resident moving in or out, I want to understand the procedures and timeline so I avoid fees and get my deposit back.

**Question Variations:**
- "How do I schedule a move?"
- "Do I need to reserve the elevator?"
- "What's the move-out checklist?"
- "How do I get my security deposit back?"
- "How much notice do I need to give?"
- "What cleaning is required before move-out?"
- "When is the move-out inspection?"

**Required Information:**
- Notice requirements (30 days, 60 days)
- Elevator/loading dock reservation process
- Move-in/move-out fees
- Required condition for deposit return
- Inspection scheduling
- Key return process
- Forwarding address requirements
- Timeline for deposit return (state-specific)

**Sample Conversation Flow:**
```
User: I'm moving out next month. What do I need to do?

Prompt Property Manager: Here's your move-out checklist for Oakwood Commons:

**Required notice:**
- Provide written notice at least **30 days** before move-out
- Submit via resident portal or email to management

**Schedule your move:**
- Reserve the elevator/loading dock 72 hours in advance
- Moving hours: 8 AM - 6 PM (no Sundays)
- $50 refundable moving deposit required

**Before move-out:**
☐ Remove all personal belongings
☐ Clean unit (professional cleaning recommended)
☐ Patch small nail holes (large holes may be deducted)
☐ Replace burned-out light bulbs
☐ Remove all trash
☐ Return all keys and access devices

**Move-out inspection:**
- Request a walk-through inspection (recommended)
- You'll receive itemized deductions within 21 days
- Security deposit returned within 21 days of move-out

📎 Source: Lease Agreement Section 12

Would you like the move-out inspection scheduling link?

---
*This is general policy information, not legal advice.*
```

---

## P1 Use Cases (Should Have)

### UC-07: Rental & Subletting Policies

**Priority:** P1 | **Frequency:** Medium-High | **Risk:** Medium

**Why This Matters:**
- Critical for investment property owners
- Airbnb/short-term rental restrictions common and contentious
- Clear rules but often misunderstood
- Can have significant financial impact

**Question Variations:**
- "Can I rent my unit on Airbnb?"
- "Can I sublet my apartment?"
- "What are the rental requirements?"
- "Do I need board approval to rent?"
- "How long must a lease be?"

**Escalation Triggers:**
- Specific lease review requests
- Existing rental violations
- Board exception requests

**Sample Conversation Flow:**
```
User: Can I rent my unit on Airbnb?

Prompt Property Manager: **No, short-term rentals under 30 days are not permitted** at Oakwood Commons.

I understand this may affect your plans—this policy exists to maintain community stability and comply with local regulations.

**What IS allowed:**
- Rentals of 30 days or longer
- Board notification required before renting
- Tenant must receive and acknowledge community rules
- Owner remains responsible for tenant compliance

**Requirements for long-term rental:**
1. Submit Rental Notification Form to management
2. Provide tenant contact information
3. Tenant must receive CC&R summary
4. No more than 25% of units may be rented at any time

📎 Source: CC&Rs Section 8.2-8.4

Would you like information about the long-term rental process?

---
*This is general policy information, not legal advice.*
```

---

### UC-08: HOA Fees & Assessments

**Priority:** P1 | **Frequency:** Medium | **Risk:** Low

**Why This Matters:**
- Financial questions always high priority
- Due dates and late fees cause anxiety
- Special assessments confusing
- Clear documentation exists

**Question Variations:**
- "When are HOA dues due?"
- "How much are the monthly fees?"
- "What's the late fee?"
- "Why is there a special assessment?"
- "How do I pay my dues?"
- "What do my HOA fees cover?"

**Sample Conversation Flow:**
```
User: When are HOA dues due?

Prompt Property Manager: **HOA dues are due on the 1st of each month.**

**Payment details:**
- Monthly assessment: $285
- Grace period: Through the 15th (no late fee)
- Late fee: $25 after the 15th
- Interest: 1.5% per month on unpaid balances after 30 days

**Payment options:**
- Online via resident portal (ACH or credit card)
- Auto-pay (recommended—set up in portal)
- Check mailed to management office

**Your dues cover:**
- Common area maintenance
- Landscaping
- Pool and amenity maintenance
- Insurance for common elements
- Reserve fund contributions

📎 Source: CC&Rs Section 5.1; Assessment Schedule 2024

Would you like the link to set up auto-pay?

---
*This is general policy information, not legal advice.*
```

---

### UC-09: Guest & Visitor Policies

**Priority:** P1 | **Frequency:** Medium | **Risk:** Low

**Why This Matters:**
- Affects daily life
- Common source of confusion (how long can guests stay?)
- Often tied to parking and amenity access
- Roommate additions a gray area

**Question Variations:**
- "How long can a guest stay?"
- "Do guests need to register?"
- "Can my boyfriend move in?"
- "How do I add a roommate?"
- "Can guests use the pool?"

**Escalation Triggers:**
- Long-term guest becoming unauthorized occupant
- Adding someone to lease (requires management)

**Sample Conversation Flow:**
```
User: How long can a guest stay?

Prompt Property Manager: Guests may stay up to **14 consecutive days** without registration.

**Guest guidelines:**
- Guests staying 15+ days must be registered with management
- Maximum 30 days per guest per calendar year
- Guests must follow all community rules
- Resident is responsible for guest behavior

**Amenity access:**
- Guests may use pool/gym when accompanied by resident
- Limit: 4 guests per household at amenities
- Guest parking: Visitor lot or with temporary pass

**Adding an occupant:**
If someone will live with you permanently, they must be added to your lease. Contact management to begin the application process.

📎 Source: Community Rules Section 8.1

Does this answer your question?

---
*This is general policy information, not legal advice.*
```

---

### UC-10: Violation & Fine Information

**Priority:** P1 | **Frequency:** Medium | **Risk:** Medium

**Why This Matters:**
- High anxiety topic
- Residents often don't understand the process
- Clear procedures exist
- Can prevent escalation

**Question Variations:**
- "I got a violation notice—what do I do?"
- "How do I appeal a fine?"
- "What's the fine for [violation]?"
- "How long do I have to fix a violation?"
- "Will this affect my credit?"

**Escalation Triggers:**
- Specific violation disputes
- Appeal requests
- Threat of legal action

**Sample Conversation Flow:**
```
User: I got a violation notice. What do I do?

Prompt Property Manager: I understand receiving a violation notice can be stressful. Here's how the process works:

**Violation process at Oakwood Commons:**

1. **First Notice (Warning)**
   - You have 14 days to correct the issue
   - No fine for first offense (most violations)

2. **Second Notice**
   - Fine: $50
   - Additional 14 days to correct

3. **Third Notice**
   - Fine: $100
   - 7 days to correct

4. **Continued Violation**
   - $25/day until resolved
   - May result in loss of amenity access

**To respond:**
- Correct the violation within the timeframe
- OR submit an appeal within 10 days if you believe the notice is in error

**Appeal process:**
- Submit written appeal to the board
- Request a hearing (optional)
- Board decision is final

📎 Source: CC&Rs Section 11.3

Would you like help understanding your specific violation or the appeal process?

---
*This is general policy information, not legal advice.*
```

---

## P2 Use Cases (Nice to Have)

### UC-11: Maintenance Requests & Responsibilities

**Priority:** P2 | **Frequency:** Medium | **Risk:** Low

**Question Variations:**
- "Who is responsible for fixing my [item]?"
- "How do I submit a maintenance request?"
- "Is plumbing the HOA's responsibility?"

**Note:** Often requires integration with maintenance ticketing systems.

---

### UC-12: Insurance Requirements

**Priority:** P2 | **Frequency:** Low-Medium | **Risk:** Medium

**Question Variations:**
- "Do I need renters insurance?"
- "What does HOA insurance cover?"
- "How much liability coverage do I need?"

**Note:** Answers can be complex; may need professional guidance.

---

### UC-13: Holiday Decoration Policies

**Priority:** P2 | **Frequency:** Seasonal | **Risk:** Low

**Question Variations:**
- "When can I put up holiday decorations?"
- "Are exterior lights allowed?"
- "When do decorations need to come down?"

**Note:** Very seasonal but easy to answer from documents.

---

### UC-14: Trash & Recycling Schedules

**Priority:** P2 | **Frequency:** Medium | **Risk:** Very Low

**Question Variations:**
- "What day is trash pickup?"
- "When do I put out the bins?"
- "What can be recycled?"

**Note:** Simple factual information; high automation potential.

---

## High-Risk Use Cases (Require Careful Handling)

### UC-HR-01: Service Animals & ESAs

**Risk Level:** HIGH | **Action:** Always Escalate

**Why High Risk:**
- Fair Housing Act protections
- Cannot deny reasonable accommodation
- Cannot charge pet deposits for service animals
- Documentation requests have strict limits
- Recent case: Building paid $750,000+ in damages for ESA discrimination

**Prompt Property Manager Behavior:**
- Provide general information about service animal rights
- Never deny or discourage service animal requests
- Immediately offer to connect with property manager
- Never ask for disability details

**Sample Response:**
```
User: I have an emotional support animal. What do I need to do?

Prompt Property Manager: Service animals and emotional support animals (ESAs) are accommodated under the Fair Housing Act.

**General information:**
- Pet policies (breed restrictions, deposits) do not apply to assistance animals
- You may be asked to provide documentation of disability-related need
- The HOA cannot charge pet deposits or fees for assistance animals

**Important:** Because assistance animal requests involve individual circumstances and legal protections, I recommend speaking directly with your property manager.

**Sarah Chen** can help you with:
- Reasonable accommodation request process
- Required documentation
- Any questions about your specific situation

📎 Contact: schen@oakwoodmgmt.com | (555) 123-4567

Would you like me to note that you have a question about assistance animal accommodations?

---
*This is general information about Fair Housing protections, not legal advice. For specific guidance, contact your property manager or a fair housing specialist.*
```

---

### UC-HR-02: Legal Disputes & Complaints

**Risk Level:** HIGH | **Action:** Always Escalate

**Examples:**
- Neighbor disputes
- Harassment claims
- Discrimination allegations
- Legal threats
- Board complaints

**Prompt Property Manager Behavior:**
- Acknowledge concern
- Do not provide legal interpretation
- Connect to appropriate resource immediately

---

### UC-HR-03: Safety & Emergency Issues

**Risk Level:** HIGH | **Action:** Always Escalate (or redirect to 911)

**Examples:**
- Dangerous conditions
- Security concerns
- Emergency maintenance
- Threats to safety

**Prompt Property Manager Behavior:**
- For true emergencies: Direct to 911
- For urgent issues: Provide emergency maintenance number
- Never delay emergency response with information

---

## Use Case Priority Matrix

| Use Case | Frequency | Automation | Impact | PM Savings | Risk | **Score** |
|----------|-----------|------------|--------|------------|------|-----------|
| UC-01: Pet Policy | Very High | High | High | High | Low | **92** |
| UC-02: Architectural | Very High | High | Very High | High | Med | **90** |
| UC-03: Parking | Very High | High | High | High | Low | **89** |
| UC-04: Pool/Amenities | High | Very High | Medium | High | Very Low | **87** |
| UC-05: Noise/Quiet Hours | High | High | Medium | Med | Low | **82** |
| UC-06: Move In/Out | High | High | High | High | Med | **85** |
| UC-07: Rentals | Med-High | Medium | High | Med | Med | **74** |
| UC-08: Fees/Assessments | Medium | High | High | Med | Low | **76** |
| UC-09: Guest Policy | Medium | High | Medium | Med | Low | **72** |
| UC-10: Violations | Medium | Medium | High | Med | Med | **70** |
| UC-11: Maintenance | Medium | Medium | Medium | Med | Low | **65** |
| UC-12: Insurance | Low-Med | Medium | Medium | Low | Med | **55** |
| UC-13: Decorations | Seasonal | High | Low | Low | Very Low | **52** |
| UC-14: Trash | Medium | Very High | Low | Med | Very Low | **60** |

---

## Implementation Recommendations

### Phase 1 (MVP)
Implement UC-01 through UC-06:
- Pet policies
- Architectural modifications
- Parking rules
- Pool/amenity hours
- Noise/quiet hours
- Move-in/move-out

**Rationale:** These represent 70%+ of routine inquiries and are safest to automate.

### Phase 2
Add UC-07 through UC-10:
- Rental policies
- Fees/assessments
- Guest policies
- Violation information

**Rationale:** Slightly more complex but clear documentation exists.

### Phase 3
Add UC-11 through UC-14:
- Maintenance responsibilities
- Insurance requirements
- Holiday decorations
- Trash schedules

**Rationale:** Lower frequency; may require integrations.

### Always Escalate
- Service animal / ESA requests
- Legal disputes
- Safety concerns
- Fair housing questions
- Board-level decisions

---

## Appendix: Sources

### Industry Research
- [Community Associations Institute - Homeowner Satisfaction Survey 2024](https://foundation.caionline.org/research/survey_homeowner/)
- [First Service Residential - Common HOA Violations](https://www.fsresidential.com/corporate/news-and-articles/articles/5-most-common-hoa-violations/)
- [STAN AI - AI for HOA Management](https://www.stan.ai/ai-for-hoa)
- [HUD - Assistance Animals and Fair Housing](https://www.hud.gov/program_offices/fair_housing_equal_opp/assistance_animals)

### Competitive Analysis
- STAN AI: 10,000+ communities, 1.5M homeowners served
- 90% call automation achieved in holiday weekend pilot
- 45% workload reduction, 20% CSAT improvement

### Legal Considerations
- [Fair Housing Act - Service Animals](https://www.cedarmanagementgroup.com/service-animals-in-hoas/)
- [Security Deposit Laws by State](https://selfhelp.courts.ca.gov/guide-security-deposits-california)
- [HOA Violation Enforcement](https://www.buildium.com/dictionary/hoa-violations/)
