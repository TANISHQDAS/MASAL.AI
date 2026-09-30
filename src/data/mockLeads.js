export const INITIAL_LEADS = [
  {
    id: 'lead-001',
    name: 'Marcus Vance',
    location: 'Downtown / Waterfront District',
    propertyRequirement: '3-4 Bed Luxury Penthouse or High-Rise Condo with Bay Views & Parking',
    budget: '$2,500,000 - $3,000,000 (All-Cash)',
    budgetNumeric: 2750000,
    buyingTimeline: 'Immediate (Within 14-30 days)',
    customerMessage: "Hi, I just sold my logistics company and relocating to the city next month. Looking for a high-floor penthouse or corner luxury unit overlooking the water. Must have at least 3 bedrooms, private terrace, and 2 dedicated parking spots. I am ready to close all-cash within 20 days if the property is right. I saw your listing at the Harborview tower—is it still available or do you have off-market units?",
    receivedAt: '2026-09-30T07:45:00Z',
    channel: 'Inbound Web Form',
    status: 'New',
    aiAnalysis: {
      score: 96,
      priority: 'HOT',
      urgency: 'Immediate (Next 48h Action)',
      leadSummary: 'Ultra-high-intent cash buyer relocating next month following liquidity event; ready for a 14-20 day close on luxury waterfront penthouses.',
      customerIntent: 'Primary Residence / Executive Luxury Relocation with high liquidity and short closing timeline.',
      keyRequirements: [
        '3-4 Bedrooms with private terrace',
        'Waterfront / High-floor bay views',
        '2 Dedicated private parking spaces',
        'Turnkey condition & concierge amenities'
      ],
      objections: [
        'Low tolerance for prolonged closing or seller contingencies',
        'High privacy requirement; will likely demand NDA for off-market previews',
        'High expectations on building security and HOA management caliber'
      ],
      recommendedNextAction: 'Call immediately within 15 minutes. Acknowledge cash capability, offer exclusive off-market penthouse walkthrough at Harborview & Skyline tower tomorrow morning.',
      suggestedResponse: "Hi Marcus, congratulations on the sale of your company! We have two premier waterfront options fitting your exact criteria, including a private-access corner penthouse with panoramic bay views and dual EV parking. Since you are prepared for a swift cash closing, I can arrange a private tour tomorrow morning. What time works best for your schedule?",
      battlecard: {
        buyerPersona: 'Decisive C-Suite Executive / Liquidity event buyer who values time and privacy over price haggling.',
        openingHook: "Marcus, great connecting. I have the keys to two off-market waterfront penthouses that match your exact 3-bed + terrace specs with clean title for a 14-day close.",
        commonObjections: [
          {
            objection: "I don't want to get into a bidding war or wait for slow sellers.",
            rebuttal: "Understood Marcus. Both units I selected have motivated owners with zero contingencies who are explicitly looking for clean cash buyers like yourself."
          },
          {
            objection: "Are there high HOA fees or rental restrictions?",
            rebuttal: "The HOA is well-capitalized with low reserve liabilities, and allows unrestricted owner occupancy with full 24/7 security."
          }
        ]
      }
    },
    chatHistory: [
      {
        id: 'msg-1',
        sender: 'ai',
        text: 'Lead analysis complete. Marcus is an A+ priority cash buyer ($2.5M - $3M). How would you like to proceed with this lead?',
        timestamp: '2026-09-30T07:46:00Z'
      }
    ]
  },
  {
    id: 'lead-002',
    name: 'Elena & David Rostova',
    location: 'West Suburbs / North Hills',
    propertyRequirement: '4 Bed Single Family Home with Large Fenced Yard near top-rated elementary schools',
    budget: '$850,000 - $950,000 (Pre-approved Mortgage)',
    budgetNumeric: 900000,
    buyingTimeline: '60 - 90 Days (Before Fall School Semester)',
    customerMessage: "Hello! We have a 6-year-old starting 1st grade in August and another baby on the way. We currently live in a 2-bed rental and urgently need more space in the West Suburbs, specifically within the Oakridge School District. We have pre-approval up to $950k from Chase. We are worried about high interest rates and bidding wars. Can you help us find something that won't require a total renovation?",
    receivedAt: '2026-09-30T06:15:00Z',
    channel: 'Zillow Referral',
    status: 'In Review',
    aiAnalysis: {
      score: 84,
      priority: 'WARM',
      urgency: 'Moderate (School Deadline)',
      leadSummary: 'Motivated family needing 4-bed suburban home in Oakridge school district before school year starts; pre-approved with rate anxiety.',
      customerIntent: 'Long-term Family Home Upgrade driven by growing family and strict school enrollment timeline.',
      keyRequirements: [
        '4 Bedrooms / 2.5+ Bathrooms',
        'Strictly within Oakridge School District catchment',
        'Fenced yard safe for children & pets',
        'Move-in ready (no major renovations)'
      ],
      objections: [
        'Anxiety over current mortgage interest rates and monthly payments',
        'Fear of bidding wars and overpaying above appraisal value',
        'Strict deadline before school starts in August'
      ],
      recommendedNextAction: 'Send 2 move-in ready homes in Oakridge district. Pair with lender 1-year rate buydown option to ease payment anxiety and schedule Saturday family tour.',
      suggestedResponse: "Hello Elena and David! Congratulations on the growing family. Oakridge is a fantastic school district and we have two move-in ready 4-bedroom homes just listed with spacious fenced backyards. We also work with lenders offering 1% rate buydown programs to keep your monthly payments comfortable. Would you and David be open for a quick 10-minute call today to review the school boundary maps and tour times?",
      battlecard: {
        buyerPersona: 'Protective Family Nurturers. Driven by school reputation, safety, and payment predictability.',
        openingHook: "Elena & David, we've helped over 20 families settle into Oakridge schools. I already filtered homes specifically within the elementary attendance boundary so you don't risk missing enrollment.",
        commonObjections: [
          {
            objection: "Interest rates feel too high right now, maybe we should wait another year.",
            rebuttal: "I completely understand. If prices climb when rates drop later, you face stiffer bidding wars. We can negotiate seller-paid rate buydowns today so you get both the right home and a lower rate."
          }
        ]
      }
    },
    chatHistory: []
  },
  {
    id: 'lead-003',
    name: 'Vikram Malhotra (Kiran Capital)',
    location: 'Eastside Opportunity Zone / Downtown Fringe',
    propertyRequirement: 'Multi-family duplex or triplex for rental yield / BRRRR investment',
    budget: '$400,000 - $550,000 (Hard Money / Private Financing)',
    budgetNumeric: 475000,
    buyingTimeline: 'Flexible / Opportunistic (Looking for discount)',
    customerMessage: "Looking for distressed duplexes or triplexes that need cosmetic work in the 78702/78704 area. Must hit at least 8.5% cap rate pro forma. Send only properties with motivated sellers or probate situations. Don't waste my time with retail MLS listings at 4% cap.",
    receivedAt: '2026-09-29T21:30:00Z',
    channel: 'SMS Inbound',
    status: 'Contacted',
    aiAnalysis: {
      score: 68,
      priority: 'WARM',
      urgency: 'Low (Price & Cap-Rate Sensitive)',
      leadSummary: 'Analytical investor seeking distressed multi-family value-add deals with minimum 8.5% pro-forma cap rates in growth submarkets.',
      customerIntent: 'Pure Investment / BRRRR value-add strategy targeting high yield and forced equity.',
      keyRequirements: [
        'Multi-family 2-4 units in Eastside Opportunity Zone',
        'Cosmetic / light rehab opportunity (ARV upside)',
        'Pro-forma cap rate >= 8.5%',
        'Motivated / off-market / distressed sellers'
      ],
      objections: [
        'Extremely price sensitive; refuses retail MLS pricing',
        'Will walk away if cap rate or renovation estimates do not pencil out',
        'Demands immediate access to off-market inventory'
      ],
      recommendedNextAction: 'Send deal-sheet for Greenbrier Duplex ($450k, 9.2% pro forma cap rate after cosmetic rehab). Emphasize below-market purchase price.',
      suggestedResponse: "Vikram, noted. We have an off-market duplex in Eastside under an REO agreement priced at $450k ($60k rehab budget for an estimated 9.2% stabilized cap rate). Attached is the pro-forma breakdown and rent roll comparables. Let me know if you want the contractor walk-through report.",
      battlecard: {
        buyerPersona: 'Numbers-driven real estate investor. Pragmatic, concise, zero fluff.',
        openingHook: "Vikram, here is the net operating income and ARV breakdown for the Eastside duplex. It pencils out to a 9.2% pro-forma cap rate.",
        commonObjections: [
          {
            objection: "Your rehab estimate of $60k is too low.",
            rebuttal: "We have an itemized bid from a licensed local GC who did two identical units on the same street last month; happy to share their line-item breakdown."
          }
        ]
      }
    },
    chatHistory: []
  },
  {
    id: 'lead-004',
    name: 'Samantha Lee',
    location: 'Downtown Arts District',
    propertyRequirement: '1-2 Bed Modern Condo with low HOA and high walkability',
    budget: '$500,000 - $600,000 (First-time Buyer FHA/Conventional)',
    budgetNumeric: 550000,
    buyingTimeline: 'Undecided / Exploring (3-6 Months)',
    customerMessage: "Hi, I'm thinking about buying my first place instead of renewing my lease in October. Not sure if I can afford downtown or if I should keep renting. Just browsing right now.",
    receivedAt: '2026-09-29T14:10:00Z',
    channel: 'Instagram Ad Lead',
    status: 'New',
    aiAnalysis: {
      score: 42,
      priority: 'COLD',
      urgency: 'Low (Nurture Stage)',
      leadSummary: 'First-time buyer in early research phase; lease expires in 4+ months, hesitant on affordability vs renting.',
      customerIntent: 'First-Time Homeownership Exploration / Rent vs Own analysis.',
      keyRequirements: [
        '1-2 Bed modern condo in Arts District',
        'Low monthly HOA fees',
        'High walkability score to cafes & transit',
        'Affordability comparison against renting'
      ],
      objections: [
        'Fear of high down payment and hidden HOA special assessments',
        'Lack of clarity on mortgage qualification vs current rent'
      ],
      recommendedNextAction: 'Add to automated first-time buyer nurture email sequence. Send free "Rent vs. Own Downtown Cost Guide" without pushy sales pressure.',
      suggestedResponse: "Hi Samantha! Taking the step from renting to owning is exciting. To help you compare costs without any pressure, I put together a quick 'Downtown Rent vs. Own 2026 Breakdown' showing monthly payments vs equity building on 1-bed condos. Would you like me to email that over?",
      battlecard: {
        buyerPersona: 'Cautious Millennial First-Time Buyer needing education and confidence building.',
        openingHook: "Samantha, no rush at all! Many of our clients start looking 4-6 months before lease renewal so they have total control over their moving date.",
        commonObjections: [
          {
            objection: "I probably don't have enough saved for 20% down.",
            rebuttal: "Most of our first-time buyers put down 3% to 5% through conventional first-time buyer programs, which keeps your cash reserves intact."
          }
        ]
      }
    },
    chatHistory: []
  }
];

export const SAMPLE_PERSONAS = [
  {
    label: 'High-Net-Worth Cash Buyer',
    data: {
      name: 'Arthur Sterling',
      location: 'Uptown / Financial District',
      propertyRequirement: 'Luxury 3-4 Bedroom Penthouse with skyline terrace and private garage',
      budget: '$3,200,000 (All-Cash Proof of Funds)',
      buyingTimeline: 'Immediate (Close within 14 days)',
      customerMessage: "Relocating from London for a 3-year hedge fund advisory role. Need a turnkey, furnished or unfurnished penthouse with unobstructed skyline views, concierge, and private parking for 2 vehicles. Ready to make an immediate non-contingent cash offer upon virtual or physical viewing this week."
    }
  },
  {
    label: 'Suburban Family Relocation',
    data: {
      name: 'Claire & Michael Bennett',
      location: 'West Suburbs / Pinehurst',
      propertyRequirement: '4-5 Bed Single Family Home with swimming pool & yard near top high schools',
      budget: '$1,100,000 - $1,300,000',
      buyingTimeline: '30 - 45 Days',
      customerMessage: "We have two teenagers transferring to Pinehurst High in the upcoming quarter. We need at least 4 bedrooms, a home office for remote work, and a private backyard. We have our pre-approval letter ready from Wells Fargo. Need to move quickly to secure enrollment."
    }
  },
  {
    label: 'First-Time Condo Buyer',
    data: {
      name: 'Jordan Rivera',
      location: 'Midtown / Arts Quarter',
      propertyRequirement: '1 Bedroom starter condo or loft with low HOA',
      budget: '$350,000 - $420,000',
      buyingTimeline: '6 Months (Lease ends in Q4)',
      customerMessage: "Hi there, just wondering if it's even possible to find a clean 1-bedroom loft under $400k in the arts quarter? My lease isn't up until the end of the year, but I wanted to see if monthly mortgage payments would be lower than my $2,400 rent."
    }
  },
  {
    label: '1031 Exchange Investor',
    data: {
      name: 'Tariq Al-Mansoor',
      location: 'East Tech Corridor',
      propertyRequirement: 'Commercial Mixed-Use or Triplex with high rental occupancy',
      budget: '$1,500,000 - $2,000,000',
      buyingTimeline: '60 Days (1031 Exchange)',
      customerMessage: "Executing a 1031 Exchange with $750k in equity. Must identify replacement target properties within 45 days. Looking for multi-tenant retail or boutique multi-family with minimum 7.5% cap rate. Need audited rent rolls and operating statements."
    }
  }
];
