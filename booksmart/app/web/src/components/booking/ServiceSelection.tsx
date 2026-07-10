import { useBookingContext } from "@/lib/booking-store";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, DollarSign } from "lucide-react";

export function ServiceSelection() {
  const { state, selectService, nextStep } = useBookingContext();

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Select a Service</h2>
        <p className="mt-1 text-sm text-gray-500">
          Choose the service you'd like to book.
        </p>
      </div>

      <div className="grid gap-3">
        {state.services.map((service) => (
          <button
            key={service.id}
            onClick={() => {
              selectService(service);
              nextStep();
            }}
            className="w-full text-left transition-all"
          >
            <Card
              className={`cursor-pointer hover:shadow-md ${
                state.service?.id === service.id
                  ? "border-primary-500 bg-primary-50 ring-2 ring-primary-500"
                  : ""
              }`}
            >
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{service.name}</h3>
                  {service.description && (
                    <p className="mt-0.5 text-sm text-gray-500 line-clamp-2">
                      {service.description}
                    </p>
                  )}
                  <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {service.duration_minutes} min
                    </span>
                    {service.price_cents != null && (
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-3.5 w-3.5" />
                        ${(service.price_cents / 100).toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
                <svg
                  className="h-5 w-5 shrink-0 text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </CardContent>
            </Card>
          </button>
        ))}
      </div>
    </div>
  );
}
