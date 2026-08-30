import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

export const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface FinancialRealityScore {
  overall_reality_score: number;
  score_status: string;
  sub_scores: {
    payment_integrity: number;
    settlement_health: number;
    financial_consistency: number;
    pending_risk: number;
    duplicate_risk_prevention: number;
    system_confidence: number;
  };
  kpi_metrics: {
    active_incidents: number;
    pending_transactions_count: number;
    total_pending_exposure_inr: number;
    unexplained_financial_drift_inr: number;
    duplicate_retries_prevented: number;
    total_monitored_volume_inr: number;
  };
  component_health_matrix: Array<{
    component: string;
    type: string;
    status: string;
    latency_ms: number;
    pending_rate: string;
  }>;
}

export interface PaymentItem {
  id: string;
  payment_reference: string;
  merchant_id: string;
  customer_id: string;
  amount: number;
  currency: string;
  payment_method: string;
  bank: string;
  payment_rail: string;
  gateway: string;
  status: string;
  reality_score: number;
  bank_debited: string;
  rail_acknowledged: string;
  gateway_status: string;
  merchant_confirmed: string;
  settlement_status: string;
  success_probability?: number;
  reversal_probability?: number;
  intervention_probability?: number;
  estimated_resolution_minutes?: number;
  duplicate_risk: number;
  recommendation: string;
  created_at?: string;
  events?: Array<{
    id: string;
    event_type: string;
    source: string;
    status: string;
    latency_ms: number;
    event_timestamp: string;
  }>;
}

export interface InvestigationData {
  payment_id: string;
  summary: string;
  root_cause: string;
  confidence: number;
  hypotheses: Array<{
    cause: string;
    probability: number;
    evidence: string;
  }>;
  recommendation: string;
  duplicate_risk: number;
  reasoning_steps: Array<{
    step: string;
    title: string;
    status: string;
    detail?: string;
  }>;
  requires_human_review: boolean;
  reality_validation?: {
    reality_score: number;
    is_drift_detected: boolean;
    missing_edges: Array<any>;
    observed_edges: Array<any>;
    risk_level: string;
    diagnosis: string;
  };
}

export interface IncidentItem {
  id: string;
  incident_reference: string;
  incident_type: string;
  severity: string;
  status: string;
  affected_bank?: string;
  affected_rail?: string;
  root_cause?: string;
  confidence: number;
  affected_transactions: number;
  affected_merchants: number;
  estimated_exposure: number;
  predicted_pending_30m: number;
  predicted_exposure_30m: number;
  counterfactual_baseline: number;
  counterfactual_excess: number;
  counterfactual_attribution_pct: number;
  created_at?: string;
}

export interface MerchantTwinData {
  merchant_id: string;
  merchant_name: string;
  merchant_category: string;
  expected_financial_reality: number;
  observed_financial_reality: number;
  unexplained_drift: number;
  drift_percentage: number;
  settlement_health_score: number;
  financial_consistency_score: number;
  drift_breakdown: Array<{
    category: string;
    missing_edge: string;
    amount: number;
    affected_transactions: number;
    status: string;
    risk: string;
  }>;
  reconciliation_status: string;
}

export interface Track03Event {
  id: string;
  timestamp: string;
  merchant: string;
  customer_name: string;
  customer_segment: string;
  amount: number;
  currency: string;
  payment_method: string;
  payment_status: string;
  checkout_status: string;
  failure_reason: string;
  bank: string;
  retry_count: number;
  customer_history_score: number;
  recovery_probability: number;
  estimated_recovery_value: number;
  recommended_action: string;
  actual_outcome: string;
  signals: Array<any>;
}

export const SafraAPI = {
  // Track 03 AI Revenue Recovery Endpoints
  getEvents: async (params?: { status?: string; currency?: string; page?: number; limit?: number }) => {
    const res = await apiClient.get("/events", { params });
    return res.data;
  },
  getMetrics: async () => {
    const res = await apiClient.get("/metrics");
    return res.data;
  },
  getEventById: async (id: string) => {
    const res = await apiClient.get(`/events/${id}`);
    return res.data;
  },
  getEventSignals: async (id: string) => {
    const res = await apiClient.get(`/events/${id}/signals`);
    return res.data;
  },
  getEventGraph: async (id: string) => {
    const res = await apiClient.get(`/events/${id}/graph`);
    return res.data;
  },
  analyzeEvent: async (id: string) => {
    const res = await apiClient.post(`/events/${id}/analyze`);
    return res.data;
  },
  recoverEvent: async (id: string, action: string = "AUTO") => {
    const res = await apiClient.post(`/events/${id}/recover`, { action });
    return res.data;
  },
  explainEvent: async (id: string, question?: string) => {
    const res = await apiClient.post(`/events/${id}/explain`, { question });
    return res.data;
  },
  runBatchSimulation: async () => {
    const res = await apiClient.post("/batch/run");
    return res.data;
  },
  getStrategyComparison: async () => {
    const res = await apiClient.get("/analytics/comparison");
    return res.data;
  },

  // Reality Engine Endpoints
  getRealityScore: async (): Promise<FinancialRealityScore> => {
    const res = await apiClient.get("/analytics/financial-reality");
    return res.data;
  },
  getPayments: async (status?: string): Promise<PaymentItem[]> => {
    const url = status ? `/payments?status=${status}` : "/payments";
    const res = await apiClient.get(url);
    return res.data;
  },
  getPaymentById: async (id: string): Promise<PaymentItem> => {
    const res = await apiClient.get(`/payments/${id}`);
    return res.data;
  },
  getPaymentTimeline: async (id: string) => {
    const res = await apiClient.get(`/payments/${id}/timeline`);
    return res.data;
  },
  checkDuplicate: async (payload: { customer_id: string; merchant_id: string; amount: number; payment_method?: string }) => {
    const res = await apiClient.post("/payments/check-duplicate", payload);
    return res.data;
  },
  runInvestigation: async (id: string): Promise<InvestigationData> => {
    const res = await apiClient.post(`/investigations/${id}`);
    return res.data;
  },
  getGraph: async () => {
    const res = await apiClient.get("/graph");
    return res.data;
  },
  getPaymentGraph: async (id: string) => {
    const res = await apiClient.get(`/graph/payment/${id}`);
    return res.data;
  },
  getIncidents: async (): Promise<IncidentItem[]> => {
    const res = await apiClient.get("/incidents");
    return res.data;
  },
  getIncidentBlastRadius: async (id: string) => {
    const res = await apiClient.get(`/incidents/${id}/blast-radius`);
    return res.data;
  },
  getIncidentCounterfactual: async (id: string) => {
    const res = await apiClient.get(`/incidents/${id}/counterfactual`);
    return res.data;
  },
  getMerchantTwin: async (id?: string): Promise<MerchantTwinData> => {
    const url = id ? `/merchants/twin?merchant_id=${id}` : "/merchants/twin";
    const res = await apiClient.get(url);
    return res.data;
  },
  getRecoveryScenarios: async (exposure?: number, count?: number) => {
    const res = await apiClient.get(`/recovery/simulate?exposure=${exposure || 4270000}&affected_count=${count || 1842}`);
    return res.data;
  },
  getRecoveryActions: async () => {
    const res = await apiClient.get("/recovery/actions");
    return res.data;
  },
  approveRecoveryAction: async (actionId: string, approverName: string = "Lead Finance Engineer") => {
    const res = await apiClient.post(`/recovery/actions/${actionId}/approve`, { approver_name: approverName });
    return res.data;
  },
  injectIncident: async (bank: string = "HDFC Bank", txns: number = 1842, exposure: number = 4270000) => {
    const res = await apiClient.post("/simulator/inject-incident", {
      affected_bank: bank,
      affected_transactions: txns,
      exposure_inr: exposure
    });
    return res.data;
  },
  injectCallbackFailure: async () => {
    const res = await apiClient.post("/simulator/inject-callback-failure");
    return res.data;
  },
  resetTopology: async () => {
    const res = await apiClient.post("/simulator/reset-topology");
    return res.data;
  }
};
