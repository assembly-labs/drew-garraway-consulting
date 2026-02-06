'use client';

import Button from '@/components/ui/Button';

const amounts = ['$25', '$50', '$100', '$250', '$500', 'Other'];

export function DonationAmountButtons() {
  const handleDonationClick = (amount: string) => {
    // TODO: Integrate with Stripe, PayPal Giving, or Every Action
    alert(`Donation of ${amount} - Integration coming soon! This is a placeholder.`);
  };

  return (
    <div className="mt-8 flex flex-wrap justify-center gap-3">
      {amounts.map((amount) => (
        <button
          key={amount}
          className="rounded-full border-2 border-white px-6 py-3 font-medium text-white transition-colors hover:bg-white hover:text-forest"
          onClick={() => handleDonationClick(amount)}
        >
          {amount}
        </button>
      ))}
    </div>
  );
}

export function MonthlyDonorButton() {
  const handleClick = () => {
    // TODO: Integrate with recurring donation processor
    alert('Monthly giving integration coming soon!');
  };

  return (
    <Button
      variant="primary"
      size="lg"
      onClick={handleClick}
    >
      Become a Monthly Donor
    </Button>
  );
}
