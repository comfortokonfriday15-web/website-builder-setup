import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  type ReactNode,
} from "react";
import type { Service, Staff, Client, Business } from "./api";

export interface BookingState {
  businessSlug: string | null;
  business: Business | null;
  services: Service[];
  staffList: Staff[];
  currentStep: number;
  service: Service | null;
  staff: Staff | null;
  dateTime: { date: string; startTime: string; endTime: string } | null;
  client: {
    name: string;
    email: string;
    phone: string;
    address: string;
    dateOfBirth: string;
  } | null;
  intakeAnswers: Record<string, string | string[]>;
  signature: string | null;
  matchingClient: Client | null;
}

type BookingAction =
  | { type: "SET_BUSINESS_DATA"; payload: { business: Business; services: Service[]; staffList: Staff[] } }
  | { type: "SELECT_SERVICE"; payload: Service }
  | { type: "SELECT_STAFF"; payload: Staff }
  | { type: "SELECT_TIME"; payload: { date: string; startTime: string; endTime: string } }
  | { type: "SET_CLIENT"; payload: BookingState["client"] }
  | { type: "SET_MATCHING_CLIENT"; payload: Client | null }
  | { type: "SET_INTAKE"; payload: Record<string, string | string[]> }
  | { type: "SET_SIGNATURE"; payload: string }
  | { type: "SET_STEP"; payload: number }
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "RESET"; payload?: string };

const initialState: BookingState = {
  businessSlug: null,
  business: null,
  services: [],
  staffList: [],
  currentStep: 0,
  service: null,
  staff: null,
  dateTime: null,
  client: null,
  intakeAnswers: {},
  signature: null,
  matchingClient: null,
};

function bookingReducer(state: BookingState, action: BookingAction): BookingState {
  switch (action.type) {
    case "SET_BUSINESS_DATA":
      return {
        ...state,
        business: action.payload.business,
        services: action.payload.services,
        staffList: action.payload.staffList,
      };
    case "SELECT_SERVICE":
      return { ...state, service: action.payload, staff: null, dateTime: null };
    case "SELECT_STAFF":
      return { ...state, staff: action.payload, dateTime: null };
    case "SELECT_TIME":
      return { ...state, dateTime: action.payload };
    case "SET_CLIENT":
      return { ...state, client: action.payload };
    case "SET_MATCHING_CLIENT":
      return { ...state, matchingClient: action.payload };
    case "SET_INTAKE":
      return { ...state, intakeAnswers: action.payload };
    case "SET_SIGNATURE":
      return { ...state, signature: action.payload };
    case "SET_STEP":
      return { ...state, currentStep: action.payload };
    case "NEXT_STEP":
      return { ...state, currentStep: Math.min(state.currentStep + 1, 6) };
    case "PREV_STEP":
      return { ...state, currentStep: Math.max(state.currentStep - 1, 0) };
    case "RESET":
      return { ...initialState, businessSlug: action.payload || null };
    default:
      return state;
  }
}

interface BookingContextValue {
  state: BookingState;
  dispatch: React.Dispatch<BookingAction>;
  setBusinessData: (data: { business: Business; services: Service[]; staffList: Staff[] }) => void;
  selectService: (service: Service) => void;
  selectStaff: (staff: Staff) => void;
  selectTime: (date: string, startTime: string, endTime: string) => void;
  setClient: (client: BookingState["client"]) => void;
  setMatchingClient: (client: Client | null) => void;
  setIntake: (answers: Record<string, string | string[]>) => void;
  setSignature: (sig: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  reset: (slug?: string) => void;
}

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({
  children,
  businessSlug,
}: {
  children: ReactNode;
  businessSlug?: string;
}) {
  const [state, dispatch] = useReducer(bookingReducer, {
    ...initialState,
    businessSlug: businessSlug || null,
  });

  const setBusinessData = useCallback(
    (data: { business: Business; services: Service[]; staffList: Staff[] }) =>
      dispatch({ type: "SET_BUSINESS_DATA", payload: data }),
    []
  );
  const selectService = useCallback(
    (service: Service) => dispatch({ type: "SELECT_SERVICE", payload: service }),
    []
  );
  const selectStaff = useCallback(
    (staff: Staff) => dispatch({ type: "SELECT_STAFF", payload: staff }),
    []
  );
  const selectTime = useCallback(
    (date: string, startTime: string, endTime: string) =>
      dispatch({ type: "SELECT_TIME", payload: { date, startTime, endTime } }),
    []
  );
  const setClient = useCallback(
    (client: BookingState["client"]) => dispatch({ type: "SET_CLIENT", payload: client }),
    []
  );
  const setMatchingClient = useCallback(
    (client: Client | null) => dispatch({ type: "SET_MATCHING_CLIENT", payload: client }),
    []
  );
  const setIntake = useCallback(
    (answers: Record<string, string | string[]>) =>
      dispatch({ type: "SET_INTAKE", payload: answers }),
    []
  );
  const setSignature = useCallback(
    (sig: string) => dispatch({ type: "SET_SIGNATURE", payload: sig }),
    []
  );
  const nextStep = useCallback(() => dispatch({ type: "NEXT_STEP" }), []);
  const prevStep = useCallback(() => dispatch({ type: "PREV_STEP" }), []);
  const goToStep = useCallback(
    (step: number) => dispatch({ type: "SET_STEP", payload: step }),
    []
  );
  const reset = useCallback(
    (slug?: string) => dispatch({ type: "RESET", payload: slug }),
    []
  );

  return (
    <BookingContext.Provider
      value={{
        state,
        dispatch,
        setBusinessData,
        selectService,
        selectStaff,
        selectTime,
        setClient,
        setMatchingClient,
        setIntake,
        setSignature,
        nextStep,
        prevStep,
        goToStep,
        reset,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBookingContext() {
  const ctx = useContext(BookingContext);
  if (!ctx) {
    throw new Error("useBookingContext must be used within a BookingProvider");
  }
  return ctx;
}
