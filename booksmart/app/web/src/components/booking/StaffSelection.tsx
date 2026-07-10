import { useBookingContext } from "@/lib/booking-store";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";


export function StaffSelection() {
  const { state, selectStaff, nextStep, prevStep } = useBookingContext();

  const availableStaff = state.staffList.filter((s) => s.is_active);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Select Staff</h2>
        <p className="mt-1 text-sm text-gray-500">
          Choose who you'd like to see, or select "Any Available."
        </p>
      </div>

      <div className="grid gap-3">
        {availableStaff.map((staff) => (
          <button
            key={staff.id}
            onClick={() => {
              selectStaff(staff);
              nextStep();
            }}
            className="w-full text-left transition-all"
          >
            <Card
              className={`cursor-pointer hover:shadow-md ${
                state.staff?.id === staff.id
                  ? "border-primary-500 bg-primary-50 ring-2 ring-primary-500"
                  : ""
              }`}
            >
              <CardContent className="flex items-center gap-4 p-4">
                <Avatar
                  src={staff.photo_url}
                  name={staff.name}
                  size="md"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{staff.name}</h3>
                  {staff.title && (
                    <p className="text-sm text-gray-500">{staff.title}</p>
                  )}
                  <Badge variant="success" className="mt-1">
                    Next available
                  </Badge>
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

      <div className="flex gap-3 pt-4">
        <button
          onClick={prevStep}
          className="flex h-10 items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Back
        </button>
      </div>
    </div>
  );
}
