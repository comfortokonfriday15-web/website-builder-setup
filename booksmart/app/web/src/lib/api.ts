import { supabase } from "./supabase";

const BASE_URL = "/api";

interface ApiOptions {
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (session?.access_token) {
    headers["Authorization"] = `Bearer ${session.access_token}`;
  }
  return headers;
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  options?: ApiOptions
): Promise<T> {
  const headers = await getAuthHeaders();
  const url = `${BASE_URL}${path}`;

  const response = await fetch(url, {
    method,
    headers: { ...headers, ...options?.headers },
    body: body ? JSON.stringify(body) : undefined,
    signal: options?.signal,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new ApiError(response.status, error.message || "Request failed", error);
  }

  if (response.status === 204) return undefined as T;
  return response.json();
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function get<T>(path: string, options?: ApiOptions): Promise<T> {
  return request<T>("GET", path, undefined, options);
}

export function post<T>(path: string, body?: unknown, options?: ApiOptions): Promise<T> {
  return request<T>("POST", path, body, options);
}

export function put<T>(path: string, body?: unknown, options?: ApiOptions): Promise<T> {
  return request<T>("PUT", path, body, options);
}

export function del<T>(path: string, options?: ApiOptions): Promise<T> {
  return request<T>("DELETE", path, undefined, options);
}

export interface Business {
  id: string;
  slug: string;
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  logo_url: string | null;
  timezone: string;
  booking_settings: {
    reminder_timing_hours: number[];
    cancellation_window_minutes: number;
    default_appointment_length: number;
  } | null;
  review_links: {
    google?: string;
    yelp?: string;
    facebook?: string;
  } | null;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  business_id: string;
  name: string;
  description: string | null;
  duration_minutes: number;
  price_cents: number | null;
  is_active: boolean;
  sort_order: number;
  intake_template: IntakeField[] | null;
  created_at: string;
  updated_at: string;
}

export interface IntakeField {
  id: string;
  type: "text" | "textarea" | "select" | "checkbox" | "file";
  label: string;
  required: boolean;
  options?: string[];
  conditional?: {
    field_id: string;
    value: string;
  };
}

export interface Staff {
  id: string;
  business_id: string;
  name: string;
  title: string | null;
  email: string | null;
  phone: string | null;
  photo_url: string | null;
  is_active: boolean;
  weekly_hours: Record<string, { start: string; end: string } | null>;
  buffer_minutes: number;
  blackout_dates: string[];
  created_at: string;
  updated_at: string;
}

export interface StaffService {
  staff_id: string;
  service_id: string;
}

export interface TimeSlot {
  date: string;
  start_time: string;
  end_time: string;
  available: boolean;
  staff_id: string;
}

export interface Client {
  id: string;
  business_id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  date_of_birth: string | null;
  tags: string[];
  merged_into_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  business_id: string;
  client_id: string;
  staff_id: string;
  service_id: string;
  start_time: string;
  end_time: string;
  status: BookingStatus;
  client_name: string;
  client_email: string;
  client_phone: string | null;
  intake_answers: Record<string, string | string[] | File | null> | null;
  waiver_signed: boolean;
  waiver_signature_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionInfo {
  plan: string;
  status: string;
  current_period_start: string;
  current_period_end: string;
  billing_amount_cents: number;
}

export type { BookingStatus };

export interface CreateAppointmentPayload {
  business_id: string;
  staff_id: string;
  service_id: string;
  start_time: string;
  end_time: string;
  client_name: string;
  client_email: string;
  client_phone?: string;
  intake_answers?: Record<string, unknown>;
  waiver_signature?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
}
