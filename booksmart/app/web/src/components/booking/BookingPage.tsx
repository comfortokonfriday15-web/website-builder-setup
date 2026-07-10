import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { BookingProvider, useBookingContext } from "@/lib/booking-store";
import { BOOKING_STEPS } from "@/lib/constants";
import { useBusiness } from "@/hooks/useBusiness";
import { ServiceSelection } from "./ServiceSelection";
import { StaffSelection } from "./StaffSelection";
import { DateTimePicker } from "./DateTimePicker";
import { ClientInfoForm } from "./ClientInfoForm";
import { IntakeForm } from "./IntakeForm";
import { SignaturePad } from "./SignaturePad";
import { BookingConfirmation } from "./BookingConfirmation";

const stepComponents = [
  ServiceSelection,
  StaffSelection,
  DateTimePicker,
  ClientInfoForm,
  IntakeForm,
  SignaturePad,
  BookingConfirmation,
];

function BookingFlow() {
  const { state, goToStep, setBusinessData } = useBookingContext();
  const { business, services, staffList } = useBusiness(state.businessSlug || undefined);

  useEffect(() => {
    if (business && services.length > 0) {
      setBusinessData({ business, services, staffList });
    }
  }, [business, services, staffList, setBusinessData]);

  if (!business) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
      </div>
    );
  }

  const StepComponent = stepComponents[state.currentStep];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            {business.name}
          </h1>
          {state.service && (
            <p className="mt-1 text-sm text-gray-500">
              {state.service.name} &middot; {state.service.duration_minutes} min
              {state.service.price_cents != null &&
                ` · $${(state.service.price_cents / 100).toFixed(2)}`}
            </p>
          )}
        </div>

        <div className="mb-8">
          <nav aria-label="Progress">
            <ol className="flex items-center">
              {BOOKING_STEPS.slice(0, 6).map((step, index) => (
                <li
                  key={step}
                  className={`relative flex items-center ${
                    index < BOOKING_STEPS.slice(0, 6).length - 1 ? "flex-1" : ""
                  }`}
                >
                  <button
                    onClick={() => {
                      if (index < state.currentStep) goToStep(index);
                    }}
                    className={`flex items-center gap-2 text-sm font-medium ${
                      index <= state.currentStep
                        ? "text-primary-600"
                        : "text-gray-400"
                    } ${index < state.currentStep ? "cursor-pointer hover:text-primary-700" : "cursor-default"}`}
                  >
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                        index < state.currentStep
                          ? "bg-primary-600 text-white"
                          : index === state.currentStep
                            ? "border-2 border-primary-600 text-primary-600"
                            : "border-2 border-gray-300 text-gray-400"
                      }`}
                    >
                      {index < state.currentStep ? (
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        index + 1
                      )}
                    </span>
                    <span className="hidden sm:inline">{step}</span>
                  </button>
                  {index < BOOKING_STEPS.slice(0, 6).length - 1 && (
                    <div
                      className={`mx-2 h-px flex-1 ${
                        index < state.currentStep ? "bg-primary-600" : "bg-gray-300"
                      }`}
                    />
                  )}
                </li>
              ))}
            </ol>
          </nav>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={state.currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <StepComponent />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export function BookingPage() {
  const { businessSlug } = useParams<{ businessSlug: string }>();
  const { business, loading, error } = useBusiness(businessSlug);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Business not found</h2>
          <p className="mt-2 text-sm text-gray-500">
            {error || "The business you're looking for doesn't exist."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <BookingProvider businessSlug={businessSlug}>
      <BookingFlow />
    </BookingProvider>
  );
}
