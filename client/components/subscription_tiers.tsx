import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function SubscriptionTiers() {
  return (
    <div className="container py-10 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-10">Choose Your Plan</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {tiers.map((tier) => (
          <Card
            key={tier.name}
            className={`relative flex flex-col ${tier.name === "Pro" ? "border-2 border-green-500  rounded-r-[4px]" : ""}`} // Add border to Pro tier
          >
            {/* Badge for Most Preferred */}
            {tier.name === "Pro" && (
              <div className="absolute top-0 right-0 bg-green-500 text-white text-sm font-bold py-1 px-3 rounded-bl-lg">
                Most Preferred
              </div>
            )}
            <CardHeader>
              <CardTitle>{tier.name}</CardTitle>
              <CardDescription>{tier.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-4xl font-bold">
                ${tier.price}<span className="text-xl font-normal">/mo</span>
              </p>
              <ul className="mt-4 space-y-2">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="text-green-500 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              {/* Change button style for Pro tier */}
              <Button className={`w-full ${tier.name === "Pro" ? "bg-green-500 text-white hover:bg-green-600" : ""}`}>
                {tier.buttonText}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

const tiers = [
  {
    name: "Basic",
    description: "For casual quote collectors",
    price: 0,
    buttonText: "Start Basic",
    features: [
      "Save up to 100 quotes",
      "5 custom tags",
      "1 level of folders",
      "Basic search functionality",
      "Web access",
    ],
  },
  {
    name: "Pro",
    description: "For serious quote enthusiasts",
    price: 19,
    buttonText: "Upgrade to Pro",
    features: [
      "Unlimited quotes",
      "Unlimited custom tags",
      "Nested folders (up to 3 levels)",
      "Advanced search with filters",
      "Web and mobile access",
      "Quote sharing",
      "Daily quote notifications",
    ],
  },
  {
    name: "Enterprise",
    description: "For teams and power users",
    price: 49,
    buttonText: "Contact Sales",
    features: [
      "All Pro features",
      "Unlimited nested folders",
      "Team collaboration",
      "API access",
      "Custom integrations",
      "Priority support",
      "Advanced analytics",
    ],
  },
];
