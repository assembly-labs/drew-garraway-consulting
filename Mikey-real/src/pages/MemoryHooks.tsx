import { Link } from 'react-router-dom';
import { BookOpen, Trophy, Music, MapPin, Heart, Calculator, ChevronRight } from 'lucide-react';

interface HookSection {
  icon: React.ReactNode;
  title: string;
  color: string;
  hooks: {
    concept: string;
    hook: string;
  }[];
}

const sections: HookSection[] = [
  {
    icon: <Trophy className="w-5 h-5" />,
    title: "Basketball Brain",
    color: "text-orange-500 bg-orange-500/10",
    hooks: [
      {
        concept: "Fiduciary Duties (OLDCAR)",
        hook: "Your Starting 5 + Sixth Man off the bench. Obedience, Loyalty, Disclosure, Confidentiality, Accountability, Reasonable Care. MJ needed Scottie, Rodman, and the whole squad to win rings. Your client needs ALL 6 from you."
      },
      {
        concept: "75% to Pass the Exam",
        hook: "You gotta hit 3 out of 4 free throws. MJ shot 83% from the line. You've taken harder shots than this."
      },
      {
        concept: "Dual Agency",
        hook: "Imagine coaching BOTH teams in the Finals. That's a problem, right? If you rep buyer AND seller, you need written permission from both because you can't fully go to bat for either one."
      },
      {
        concept: "Open Listing",
        hook: "Open gym. Any agent can show up with a buyer, and the seller can still score on their own without paying commission. First one to close gets paid."
      },
      {
        concept: "Exclusive Right to Sell",
        hook: "Franchise player contract. No matter WHO brings the buyer - you, another agent, or the seller themselves - the listing agent gets paid. That's why brokers want these."
      },
      {
        concept: "Exclusive Agency Listing",
        hook: "You're the only agent on the roster, BUT if the seller finds their own buyer without you, they don't owe you. You only get paid if YOU make the play."
      },
      {
        concept: "3 Years to Become a Broker",
        hook: "MJ's first 3 years - no rings yet, but putting in the work. You need 3 years as a salesperson before you can level up to broker."
      },
      {
        concept: "Earnest Money Deposit",
        hook: "Putting money down on playoff tickets. It shows you're serious. Goes toward the purchase price at closing, or you might lose it if you back out for no good reason."
      },
      {
        concept: "Due Diligence Period",
        hook: "Film study before the big game. This is when buyers inspect the property, check the title, get financing lined up. You're doing your homework before you commit."
      },
      {
        concept: "Closing Day",
        hook: "Game day. The final buzzer. Papers get signed, money changes hands, keys get handed over. You did it."
      },
    ]
  },
  {
    icon: <Music className="w-5 h-5" />,
    title: "Hip-Hop Hooks",
    color: "text-purple-500 bg-purple-500/10",
    hooks: [
      {
        concept: "Property Disclosure",
        hook: "Dave East storytelling - you gotta tell the WHOLE story of the property. The good, the bad, the water damage in '09. Don't hide verses, or it'll come back on you."
      },
      {
        concept: "Fair Housing Act",
        hook: "Kendrick's whole message is about equality and justice. Fair Housing makes that LAW in real estate. You can't discriminate. Period. Seven protected classes - remember them."
      },
      {
        concept: "The 7 Protected Classes",
        hook: "Race, Color, Religion, National Origin, Sex, Disability, Familial Status. Think: 'Real Creators Rise, Never Oppress, Stay Devoted, Forever Solid.' That's your 7."
      },
      {
        concept: "1978 - Lead Paint Disclosure",
        hook: "Year before 'Rapper's Delight' dropped and changed everything. If a house was built before '78, you gotta disclose lead paint info. Old houses, old paint, old problems."
      },
      {
        concept: "Steering (Illegal)",
        hook: "Like a biased DJ only spinning certain artists in certain neighborhoods. Pushing buyers toward or away from areas based on race or religion? That's steering. That's illegal. That's not you."
      },
      {
        concept: "Redlining (Illegal)",
        hook: "What Kendrick raps against - banks drawing red lines around Black neighborhoods, refusing to lend there. Been illegal since '68. Still gotta know it for the exam."
      },
      {
        concept: "Blockbusting (Illegal)",
        hook: "Panic selling. Telling homeowners 'this neighborhood is changing, sell now before values drop.' Playing on fear and prejudice to flip houses. Illegal and foul."
      },
      {
        concept: "Clear Title",
        hook: "Like having a clean sample - no copyright issues, no one else claiming ownership. Before you buy property, title search makes sure nobody else has claims on it."
      },
      {
        concept: "General Warranty Deed",
        hook: "The seller is saying 'I guarantee this track is 100% mine, no one will ever come at you for it.' Strongest protection for the buyer."
      },
      {
        concept: "Quitclaim Deed",
        hook: "Seller saying 'whatever rights I got, I'm giving you - but I'm not promising I got any rights at all.' No guarantees. Use this for transfers between family, clearing up title issues."
      },
    ]
  },
  {
    icon: <MapPin className="w-5 h-5" />,
    title: "Philly Rules (PA Specific)",
    color: "text-green-500 bg-green-500/10",
    hooks: [
      {
        concept: "Consumer Notice - FIRST Meeting",
        hook: "Sit down, be humble. Before you talk about ANY property, you explain to the client how agency works - who you represent, what that means. First conversation, every time."
      },
      {
        concept: "75 Hours Pre-Licensing",
        hook: "That's a lot of hours, but think about it - more time than driving from Chester to Miami. You're investing in your future. Get through the course, then take the exam."
      },
      {
        concept: "14 Hours Continuing Education",
        hook: "Every 2 years, you need 14 hours of CE to renew your license. Like staying sharp in the offseason. Two Saturdays of classes and you're good."
      },
      {
        concept: "Escrow Deposit - Next Business Day",
        hook: "Faster than SEPTA on a good day. When you get earnest money, it goes into the escrow account by end of the NEXT business day. Don't sit on people's money."
      },
      {
        concept: "3 Years = Broker Eligible",
        hook: "3 years as a salesperson, plus more education, plus another exam. Then you can run your own shop or supervise other agents."
      },
      {
        concept: "PA Recovery Fund",
        hook: "If an agent really messes up and a client loses money, this fund can help make them whole. Up to $20K per claim, $100K total per agent. It's why we pay into it."
      },
      {
        concept: "Broker Keeps Records 3 Years",
        hook: "Keep the receipts. Every transaction file, every document - broker holds onto it for 3 years minimum. Cover yourself."
      },
      {
        concept: "Salesperson Works Under Broker",
        hook: "You can't go solo as a salesperson. You MUST be affiliated with a broker. They supervise you, you work under their license. That's PA law."
      },
      {
        concept: "PA Seller Disclosure",
        hook: "Seller fills out a form disclosing everything they know about the property - roof leaks, basement floods, whatever. Buyer gets this BEFORE signing the agreement of sale."
      },
      {
        concept: "Radon Disclosure",
        hook: "PA thing. If seller knows about radon testing or mitigation, they gotta disclose it. Radon is that invisible gas that can cause problems - comes up from the ground."
      },
    ]
  },
  {
    icon: <Heart className="w-5 h-5" />,
    title: "People First (Fair Housing & Ethics)",
    color: "text-red-500 bg-red-500/10",
    hooks: [
      {
        concept: "Disability is a Protected Class",
        hook: "You already know this from your work - you show up for people every day regardless of ability. Now you know it's federal law in housing too. Can't discriminate."
      },
      {
        concept: "Familial Status Protection",
        hook: "Families with kids under 18 are protected. Can't refuse to rent or sell to someone because they have children. Exception: legit senior housing (55+ communities)."
      },
      {
        concept: "Material Facts",
        hook: "Same honesty you bring to your job - if something matters, you say it. In real estate, if a fact would affect someone's decision to buy, you disclose it. No hiding stuff."
      },
      {
        concept: "Loyalty to Your Client",
        hook: "When you're someone's agent, you're in their corner. You don't share their business with the other side. You don't work against their interests. You're loyal."
      },
      {
        concept: "Confidentiality",
        hook: "What your client tells you stays with you. Their motivation, their financial situation, how low they'd really go - that's private. Don't share it with the other party."
      },
      {
        concept: "Reasonable Care",
        hook: "Do your job right. Fill out the paperwork correctly. Meet your deadlines. Don't be careless with people's biggest purchase. Same care you'd want someone to show you."
      },
      {
        concept: "Obedience",
        hook: "Follow your client's lawful instructions. They say don't accept offers under $300K? You don't. They're the boss (as long as it's legal)."
      },
      {
        concept: "Accountability",
        hook: "Handle money right. Document everything. Don't mix client funds with your own (that's called commingling - big no-no). Be able to account for every dollar."
      },
    ]
  },
  {
    icon: <Calculator className="w-5 h-5" />,
    title: "Math Made Simple",
    color: "text-blue-500 bg-blue-500/10",
    hooks: [
      {
        concept: "43,560 Square Feet = 1 Acre",
        hook: "Weird number, but lock it in: 43,560. Picture MJ dropping 43 in the first half, finishing with 56, and losing 0 games that Finals. 4-3-5-6-0. One acre."
      },
      {
        concept: "Commission Math",
        hook: "Simple multiplication. House sells for $300,000 at 6% commission? $300,000 × 0.06 = $18,000 total commission. Then it splits between brokers and agents."
      },
      {
        concept: "Agent Split",
        hook: "If total commission is $18,000 and your split with your broker is 60/40, you get $18,000 × 0.60 = $10,800. Always multiply by YOUR percentage as a decimal."
      },
      {
        concept: "Loan-to-Value (LTV)",
        hook: "Your shooting percentage but for loans. $240,000 loan on a $300,000 house? Divide loan by value: $240K ÷ $300K = 0.80 = 80% LTV."
      },
      {
        concept: "Down Payment",
        hook: "Whatever you don't borrow, you put down. $300K house with $240K loan = $60K down payment. That's 20% down. Math: Purchase Price - Loan = Down Payment."
      },
      {
        concept: "PMI (Private Mortgage Insurance)",
        hook: "If your down payment is less than 20%, lender makes you pay PMI. It protects THEM if you default. Once you hit 20% equity, you can usually drop it."
      },
      {
        concept: "Proration",
        hook: "Splitting the bill fair. If seller paid property taxes for the whole year but sells in March, buyer owes them back for the months the buyer will own it. Annual amount ÷ 365 × days."
      },
      {
        concept: "Price Per Square Foot",
        hook: "Easy comp tool. $200,000 house that's 2,000 sq ft? $200,000 ÷ 2,000 = $100 per square foot. Use this to compare similar properties."
      },
      {
        concept: "Cap Rate (Capitalization Rate)",
        hook: "For investment properties. Net Operating Income ÷ Property Price. If a building makes $30K/year (after expenses) and costs $400K: $30K ÷ $400K = 7.5% cap rate."
      },
      {
        concept: "GRM (Gross Rent Multiplier)",
        hook: "Quick way to value rentals. Sale Price ÷ Annual Gross Rent. $200K property renting for $24K/year: $200K ÷ $24K = 8.33 GRM. Lower GRM might mean better deal."
      },
    ]
  },
  {
    icon: <BookOpen className="w-5 h-5" />,
    title: "Key Terms Quick Hits",
    color: "text-slate-500 bg-slate-500/10",
    hooks: [
      {
        concept: "Fee Simple Absolute",
        hook: "You own it ALL. No conditions, no limits, no expiration. The most complete ownership you can have. It's yours to sell, rent, pass down, whatever."
      },
      {
        concept: "Joint Tenancy",
        hook: "You own property WITH someone, and if one of you dies, the other automatically gets their share. Right of survivorship. Common with married couples."
      },
      {
        concept: "Tenancy in Common",
        hook: "You own property with someone, but if you die, your share goes to YOUR heirs, not the other owner. No automatic survivorship."
      },
      {
        concept: "Easement",
        hook: "Someone else has the right to use part of your property for a specific purpose. Like the electric company crossing your yard to get to power lines."
      },
      {
        concept: "Encumbrance",
        hook: "Anything that affects the title or limits how you can use the property. Liens, easements, deed restrictions - all encumbrances."
      },
      {
        concept: "Lien",
        hook: "A claim against your property for money you owe. Mortgage is a lien. Unpaid taxes create a lien. Contractor you didn't pay? Mechanic's lien."
      },
      {
        concept: "Eminent Domain",
        hook: "Government can take your property for public use (roads, schools, etc.) but they MUST pay you fair market value. It's in the Constitution."
      },
      {
        concept: "Police Power",
        hook: "Government's right to regulate property for public health, safety, and welfare. That's why we have zoning laws, building codes, and housing regulations."
      },
      {
        concept: "Statute of Frauds",
        hook: "Real estate contracts MUST be in writing to be enforceable. Handshake deals don't count. Get it on paper, get it signed."
      },
      {
        concept: "Adverse Possession",
        hook: "If someone uses your land openly, without permission, continuously for many years (depends on state), they might be able to claim ownership. Squatter's rights, basically."
      },
    ]
  },
];

export function MemoryHooks() {
  return (
    <div className="p-4 max-w-lg mx-auto pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Memory Hooks
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Lock these concepts in your brain for good
        </p>
      </div>

      {/* Quick tip */}
      <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-4 mb-4">
        <p className="text-sm text-primary-700 dark:text-primary-300">
          <strong>How to use this:</strong> Read through before studying, then come back when a concept isn't clicking. The weird connections help it stick.
        </p>
      </div>

      {/* Link to formulas */}
      <Link
        to="/formulas"
        className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-xl p-4 mb-6 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-500/10 text-blue-500">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <p className="font-medium text-slate-900 dark:text-white">Math Formulas</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Quick reference for calculations</p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-slate-400" />
      </Link>

      {/* Sections */}
      <div className="space-y-6">
        {sections.map((section) => (
          <div key={section.title} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
            {/* Section header */}
            <div className={`flex items-center gap-3 p-4 border-b border-slate-100 dark:border-slate-700`}>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${section.color}`}>
                {section.icon}
              </div>
              <h2 className="font-semibold text-slate-900 dark:text-white">
                {section.title}
              </h2>
            </div>

            {/* Hooks */}
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {section.hooks.map((hook, index) => (
                <div key={index} className="p-4">
                  <p className="font-medium text-slate-900 dark:text-white text-sm mb-2">
                    {hook.concept}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {hook.hook}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer motivation */}
      <div className="mt-8 text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400 italic">
          "Started from the bottom, now we're here."
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          You got this. Lock it in.
        </p>
      </div>
    </div>
  );
}
