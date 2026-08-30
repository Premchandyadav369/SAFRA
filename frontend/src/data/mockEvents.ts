export interface PaymentEventItem {
  id: string;
  timestamp: string;
  customer_id: string;
  customer_name: string;
  merchant: string;
  amount: number;
  currency: string;
  payment_method: string;
  payment_status: "PENDING" | "FAILED" | "ABANDONED" | "RECOVERED" | "COMPLETED";
  checkout_status: string;
  failure_reason: string;
  bank: string;
  retry_count: number;
  customer_history: string;
  recovery_probability: number;
  estimated_recovery_value: number;
  recommended_action: string;
  actual_outcome: "RECOVERED" | "STOPPED_SAFELY" | "CUSTOMER_DECLINED" | "ESCALATED";
  signals: string[];
}

const merchants = [
  "Zenith Electronics",
  "HyperMart Groceries",
  "AeroWings Bookings",
  "CloudScale SaaS",
  "UrbanCrafters",
  "QuickDine Orders",
  "FitPulse Subscriptions",
  "VogueLane Apparel",
  "EduSprint Learning",
  "OmniPay Merchant Core",
];

const customerNames = [
  "Aryan Sharma",
  "Priya Deshmukh",
  "Rohan Mehta",
  "Ananya Iyer",
  "Devendra Singh",
  "Kavita Patel",
  "Vikram Malhotra",
  "Ayesha Khan",
  "Rahul Nair",
  "Sneha Sen",
  "Aditya Joshi",
  "Meera Pillai",
  "Tanmay Verma",
  "Ritika Choudhury",
  "Siddharth Roy",
  "Elena Rostova",
  "David Miller",
  "Pooja Bhatia",
  "Harsh Vardhan",
  "Deepika Reddy",
];

const banks = [
  "HDFC Bank",
  "State Bank of India",
  "ICICI Bank",
  "Axis Bank",
  "Kotak Mahindra",
  "Citibank Global",
];

const paymentMethods = ["UPI", "Credit Card", "Debit Card", "NetBanking", "Card Token"];

const failureScenarios = [
  {
    reason: "UPI Pending - Bank Callback Delayed",
    status: "PENDING" as const,
    checkout: "BANK_DEBITED_AWAITING_WEBHOOK",
    signals: ["Bank Debited ✓", "NPCI Acknowledged ✓", "Merchant Webhook 504 Timeout"],
    recAction: "Wait 5 minutes. Do not ask customer to pay again.",
    probRange: [0.72, 0.91],
    outcome: "RECOVERED" as const,
  },
  {
    reason: "Card Authentication Failed (OTP Timeout)",
    status: "FAILED" as const,
    checkout: "DROPPED_AT_OTP",
    signals: ["SMS OTP Delayed", "High Purchase Intent", "Previous Successful Checkout"],
    recAction: "Send seamless 1-click fallback link via WhatsApp / SMS.",
    probRange: [0.55, 0.78],
    outcome: "RECOVERED" as const,
  },
  {
    reason: "Temporary Bank Core Switch Timeout",
    status: "PENDING" as const,
    checkout: "CBS_SWITCH_TIMEOUT",
    signals: ["Bank Pending Surge", "Rail Active", "Retry Collision Risk"],
    recAction: "Hold merchant order lock. Await bank batch reconciliation.",
    probRange: [0.65, 0.84],
    outcome: "RECOVERED" as const,
  },
  {
    reason: "Checkout Abandoned at Final Step",
    status: "ABANDONED" as const,
    checkout: "CART_ABANDONED_STEP_3",
    signals: ["Cart Value > ₹3,000", "Lapsed Customer", "Price Comparison Behavior"],
    recAction: "Trigger targeted 10% instant checkout voucher.",
    probRange: [0.38, 0.62],
    outcome: "RECOVERED" as const,
  },
  {
    reason: "Duplicate Payment Attempt Prevented",
    status: "PENDING" as const,
    checkout: "RETRY_INTENT_INTERCEPTED",
    signals: ["Identical Amount (₹4,999)", "Same Merchant", "Prior Debit Pending (81% P(Succ))"],
    recAction: "Display Duplicate Payment Barrier banner. Prevent double debit.",
    probRange: [0.88, 0.98],
    outcome: "STOPPED_SAFELY" as const,
  },
  {
    reason: "Insufficient Account Balance",
    status: "FAILED" as const,
    checkout: "INSUFFICIENT_FUNDS",
    signals: ["Low Balance Code 51", "Frequent Shopper", "Alternate Cards on File"],
    recAction: "Prompt alternate saved card without restarting checkout.",
    probRange: [0.42, 0.68],
    outcome: "RECOVERED" as const,
  },
  {
    reason: "Recurring SaaS Subscription Auth Lapsed",
    status: "FAILED" as const,
    checkout: "SUBSCRIPTION_RENEWAL_REJECTED",
    signals: ["Mandate Expired", "Active Daily User", "High LTV Account"],
    recAction: "Trigger in-app smart mandate update prompt with 3-day grace window.",
    probRange: [0.70, 0.89],
    outcome: "RECOVERED" as const,
  },
  {
    reason: "Payment Gateway 504 Gateway Timeout",
    status: "PENDING" as const,
    checkout: "GATEWAY_INGESTION_TIMEOUT",
    signals: ["Cluster Anomaly Detected", "Gateway Degraded", "Idempotency Active"],
    recAction: "Automated webhook resync with exponential backoff.",
    probRange: [0.80, 0.94],
    outcome: "RECOVERED" as const,
  },
];

// Generate 300 realistic events
export function generateDataset(): PaymentEventItem[] {
  const events: PaymentEventItem[] = [];

  // Hero Scenario 1: Aryan Sharma ₹4,999 UPI Pending
  events.push({
    id: "evt_pay_4999_hero",
    timestamp: "2026-08-30T10:14:22Z",
    customer_id: "cust_aryan_01",
    customer_name: "Aryan Sharma",
    merchant: "Zenith Electronics",
    amount: 4999,
    currency: "INR",
    payment_method: "UPI",
    payment_status: "PENDING",
    checkout_status: "BANK_DEBITED_AWAITING_WEBHOOK",
    failure_reason: "UPI Pending - Bank Callback Delayed",
    bank: "HDFC Bank",
    retry_count: 1,
    customer_history: "HIGH_INTENT_REPEAT_BUYER",
    recovery_probability: 0.81,
    estimated_recovery_value: 4999,
    recommended_action: "Wait 5 minutes. Do not ask customer to pay again.",
    actual_outcome: "RECOVERED",
    signals: [
      "Bank Debited (HDFC) ✓",
      "NPCI UPI Rail Acknowledged ✓",
      "Merchant Webhook 504 Timeout",
      "Customer Retry Risk: HIGH (88%)",
    ],
  });

  // Hero Scenario 2: Global SaaS USD transaction
  events.push({
    id: "evt_pay_usd_global",
    timestamp: "2026-08-30T09:42:15Z",
    customer_id: "cust_david_99",
    customer_name: "David Miller",
    merchant: "CloudScale SaaS",
    amount: 120,
    currency: "USD",
    payment_method: "Credit Card",
    payment_status: "PENDING",
    checkout_status: "CROSS_BORDER_SETTLEMENT_HOLD",
    failure_reason: "Cross-Border Fraud Check Latency",
    bank: "Citibank Global",
    retry_count: 0,
    customer_history: "ANNUAL_ENTERPRISE_TIER",
    recovery_probability: 0.89,
    estimated_recovery_value: 120,
    recommended_action: "Release 3D Secure fallback token. Auto-clear within 4 minutes.",
    actual_outcome: "RECOVERED",
    signals: ["3DS2 Authenticated", "Foreign Exchange Validated", "Settlement Awaiting Clearance"],
  });

  // Generate 298 more realistic events
  const nowMs = Date.now();
  for (let i = 1; i <= 298; i++) {
    const scenario = failureScenarios[i % failureScenarios.length];
    const customer = customerNames[i % customerNames.length];
    const merchant = merchants[i % merchants.length];
    const bank = banks[i % banks.length];
    const method = paymentMethods[i % paymentMethods.length];

    // Amounts spread realistically
    const isUSD = i % 18 === 0;
    const amount = isUSD
      ? [24, 48, 120, 240, 480][i % 5]
      : [299, 599, 1249, 2499, 4999, 8990, 14999, 28000][i % 8];

    const prob = Number(
      (
        scenario.probRange[0] +
        Math.random() * (scenario.probRange[1] - scenario.probRange[0])
      ).toFixed(2)
    );

    const timeOffsetMinutes = i * 4 + Math.floor(Math.random() * 8);
    const eventTime = new Date(nowMs - timeOffsetMinutes * 60 * 1000).toISOString();

    events.push({
      id: `evt_pay_${100000 + i}`,
      timestamp: eventTime,
      customer_id: `cust_${customer.toLowerCase().replace(" ", "_")}_${i}`,
      customer_name: customer,
      merchant,
      amount,
      currency: isUSD ? "USD" : "INR",
      payment_method: method,
      payment_status: scenario.status,
      checkout_status: scenario.checkout,
      failure_reason: scenario.reason,
      bank,
      retry_count: i % 3,
      customer_history: i % 2 === 0 ? "HIGH_INTENT_REPEAT_BUYER" : "NEW_CUSTOMER",
      recovery_probability: prob,
      estimated_recovery_value: amount,
      recommended_action: scenario.recAction,
      actual_outcome: scenario.outcome,
      signals: scenario.signals,
    });
  }

  return events;
}

export const mockDataset = generateDataset();
