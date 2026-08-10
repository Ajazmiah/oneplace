import Link from "next/link";
// TEMPORARY: remove this import (and the <WorkInProgressNotice /> below) once billing is live.
import WorkInProgressNotice from "./WorkInProgressNotice";

export const metadata = {
  title: "Pricing – OnePlace",
  description:
    "Simple, transparent pricing for OnePlace. Track unlimited job applications, store resumes and cover letters, and stay interview-ready. Start free, upgrade anytime.",
  keywords: [
    "job application tracker pricing",
    "resume manager pricing",
    "OnePlace pricing",
    "job search tool cost",
  ],
  alternates: {
    canonical: "/pricing",
  },
  openGraph: {
    title: "Pricing – OnePlace",
    description:
      "Simple, transparent pricing to track your job applications and stay interview-ready. Start free, upgrade anytime.",
    url: "/pricing",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing – OnePlace",
    description:
      "Simple, transparent pricing to track your job applications and stay interview-ready.",
  },
};

const paidFeatures = [
  "Unlimited application tracking",
  "Store resumes & cover letters",
  "Status tracking & analytics",
  "Interview answer library",
  "Priority support",
];

const plans = [
  {
    name: "Free",
    tagline: "For getting started",
    price: 0,
    period: "forever",
    cta: "Get started",
    href: "/signup",
    highlighted: false,
    features: [
      "Track up to 10 applications",
      "Store resumes & cover letters",
      "Status tracking & analytics",
      "Interview answer library",
      "No customer support",
    ],
  },
  {
    name: "Pro",
    tagline: "Full access for 1 month",
    price: 5,
    period: "/month",
    cta: "Get Pro",
    href: "/signup",
    highlighted: false,
    features: paidFeatures,
  },
  {
    name: "Premium",
    tagline: "Full access for 3 months — enough time to land the job",
    price: 12,
    period: "/3 months",
    cta: "Get Premium",
    href: "/signup",
    highlighted: true,
    badge: "Best value",
    features: paidFeatures,
  },
];

const faqs = [
  {
    question: "Can I try OnePlace for free?",
    answer:
      "Yes. The Free plan lets you track up to 10 applications with no time limit and no credit card required. Upgrade to Pro whenever you need more.",
  },
  {
    question: "Can I change or cancel my plan later?",
    answer:
      "Absolutely. You can upgrade, downgrade, or cancel at any time from your account settings. Changes take effect at the end of your billing cycle.",
  },
  {
    question: "What happens to my data if I downgrade?",
    answer:
      "Your data is never deleted. If you exceed the limits of a lower plan, older items become read-only until you upgrade again or free up space.",
  },
  {
    question: "What's the difference between Pro and Premium?",
    answer:
      "The features are exactly the same — both give you unlimited tracking, document storage, the interview answer library, and priority support. Pro covers 1 month for $5, while Premium covers 3 months for $12. Since most job searches take a few months, Premium works out about 20% cheaper than paying monthly.",
  },
];

function CheckIcon() {
  return (
    <svg
      className="mt-0.5 size-5 flex-none text-brand"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.5 7.6a1 1 0 0 1-1.42.006l-3.5-3.5a1 1 0 1 1 1.414-1.414l2.79 2.79 6.796-6.89a1 1 0 0 1 1.414-.006Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

// Structured data helps search engines understand the offering.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "OnePlace",
  description:
    "Track job applications, store resumes and cover letters, and stay interview-ready — all in one place.",
  offers: plans.map((plan) => ({
    "@type": "Offer",
    name: plan.name,
    price: String(plan.price),
    priceCurrency: "USD",
  })),
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export default function PricingPage() {
  return (
    <div className="relative overflow-hidden">
      {/* TEMPORARY: work-in-progress popup for pricing/payments — remove when billing is live */}
      <WorkInProgressNotice />

      {/* Structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Background teal glow */}
      <div
        className="pointer-events-none absolute"
        style={{
          width: "800px",
          height: "800px",
          background: "radial-gradient(circle, #0bbcaa 0%, transparent 70%)",
          opacity: 0.06,
          top: "-10%",
          right: "-15%",
        }}
      />

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-24 sm:py-32">
        {/* Header */}
        <header className="mx-auto max-w-2xl text-center">
          <div className="mb-8 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand/5 px-3.5 py-1.5">
              <span className="size-1.5 animate-pulse rounded-full bg-brand" />
              <span className="text-xs font-semibold uppercase tracking-widest text-brand">
                Pricing
              </span>
            </div>
          </div>
          <h1 className="text-4xl font-bold leading-[1.08] tracking-tight text-gray-900 sm:text-5xl">
            Simple pricing for every job search
          </h1>
          <p className="mt-6 text-lg text-gray-500">
            Start free and upgrade when you&apos;re ready. No hidden fees, cancel
            anytime.
          </p>
        </header>

        {/* Plans */}
        <section className="mt-16" aria-label="Pricing plans">
          <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`flex flex-col rounded-3xl p-8 ring-1 transition-shadow ${
                  plan.highlighted
                    ? "bg-white ring-2 ring-brand shadow-xl"
                    : "bg-white/60 ring-gray-200 hover:shadow-md"
                }`}
              >
                <div className="flex items-center justify-between gap-x-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {plan.name}
                  </h3>
                  {plan.badge && (
                    <span className="rounded-full bg-brand/10 px-2.5 py-1 text-xs font-semibold text-brand">
                      {plan.badge}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-gray-500">{plan.tagline}</p>

                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight text-gray-900">
                    ${plan.price}
                  </span>
                  <span className="text-sm font-medium text-gray-500">
                    {plan.period}
                  </span>
                </p>

                <Link
                  href={plan.href}
                  className={`mt-6 block rounded-xl px-4 py-2.5 text-center text-sm font-medium transition-colors ${
                    plan.highlighted
                      ? "bg-brand text-white hover:bg-brand/90"
                      : "bg-brand/10 text-brand hover:bg-brand/20"
                  }`}
                >
                  {plan.cta}
                </Link>

                <ul className="mt-8 space-y-3 text-sm text-gray-600">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <CheckIcon />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section
          className="mx-auto mt-24 max-w-3xl"
          aria-label="Frequently asked questions"
        >
          <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Frequently asked questions
          </h2>
          <dl className="mt-10 divide-y divide-gray-100">
            {faqs.map((faq) => (
              <div key={faq.question} className="py-6">
                <dt className="text-base font-semibold text-gray-900">
                  {faq.question}
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-gray-500">
                  {faq.answer}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </div>
  );
}
