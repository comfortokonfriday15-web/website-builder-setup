import { useState, useEffect, useCallback } from "react";
import { useBookingContext } from "@/lib/booking-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import type { IntakeField } from "@/lib/api";

export function IntakeForm() {
  const { state, setIntake, nextStep, prevStep } = useBookingContext();
  const fields: IntakeField[] = state.service?.intake_template || [];
  const [answers, setAnswers] = useState<Record<string, string | string[]>>(
    state.intakeAnswers
  );
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, string>>({});

  const visibleFields = useCallback(
    (allFields: IntakeField[]): IntakeField[] => {
      return allFields.filter((field) => {
        if (!field.conditional) return true;
        const parentAnswer = answers[field.conditional.field_id];
        if (Array.isArray(parentAnswer)) {
          return parentAnswer.includes(field.conditional.value);
        }
        return parentAnswer === field.conditional.value;
      });
    },
    [answers]
  );

  const filteredFields = visibleFields(fields);
  const totalFields = fields.length;
  const completedFields = filteredFields.filter((f) => {
    const val = answers[f.id];
    if (!val) return false;
    if (Array.isArray(val)) return val.length > 0;
    return String(val).trim().length > 0;
  }).length;
  const progressPercent =
    totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;

  const handleTextChange = (fieldId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleCheckboxChange = (fieldId: string, option: string) => {
    setAnswers((prev) => {
      const current = (prev[fieldId] as string[]) || [];
      const next = current.includes(option)
        ? current.filter((o) => o !== option)
        : [...current, option];
      return { ...prev, [fieldId]: next };
    });
  };

  const handleFileUpload = (fieldId: string, file: File | null) => {
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedFiles((prev) => ({ ...prev, [fieldId]: url }));
      setAnswers((prev) => ({ ...prev, [fieldId]: file.name }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIntake(answers);
    nextStep();
  };

  if (fields.length === 0) {
    return (
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Additional Information</h2>
          <p className="mt-1 text-sm text-gray-500">
            No additional information is needed. Click continue to proceed.
          </p>
        </div>
        <div className="flex gap-3 pt-2">
          <Button variant="outline" onClick={prevStep}>
            Back
          </Button>
          <Button onClick={handleSubmit}>Continue</Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Additional Information</h2>
        <p className="mt-1 text-sm text-gray-500">
          Please fill out the following information.
        </p>
      </div>

      {totalFields > 0 && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Form progress</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-primary-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      <div className="space-y-4">
        {filteredFields.map((field) => {
          switch (field.type) {
            case "textarea":
              return (
                <div key={field.id} className="space-y-1.5">
                  <Label>
                    {field.label}
                    {field.required && <span className="ml-1 text-red-500">*</span>}
                  </Label>
                  <textarea
                    value={(answers[field.id] as string) || ""}
                    onChange={(e) => handleTextChange(field.id, e.target.value)}
                    className="flex min-h-[80px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    rows={3}
                  />
                </div>
              );

            case "select":
              return (
                <div key={field.id} className="space-y-1.5">
                  <Label>
                    {field.label}
                    {field.required && <span className="ml-1 text-red-500">*</span>}
                  </Label>
                  <Select
                    value={(answers[field.id] as string) || ""}
                    onValueChange={(val) => handleTextChange(field.id, val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options?.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              );

            case "checkbox":
              return (
                <div key={field.id} className="space-y-1.5">
                  <Label>
                    {field.label}
                    {field.required && <span className="ml-1 text-red-500">*</span>}
                  </Label>
                  <div className="space-y-2">
                    {field.options?.map((opt) => {
                      const checked = (
                        (answers[field.id] as string[]) || []
                      ).includes(opt);
                      return (
                        <label
                          key={opt}
                          className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => handleCheckboxChange(field.id, opt)}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          {opt}
                        </label>
                      );
                    })}
                  </div>
                </div>
              );

            case "file":
              return (
                <div key={field.id} className="space-y-1.5">
                  <Label>
                    {field.label}
                    {field.required && <span className="ml-1 text-red-500">*</span>}
                  </Label>
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      id={field.id}
                      accept="image/*,.pdf"
                      onChange={(e) =>
                        handleFileUpload(field.id, e.target.files?.[0] || null)
                      }
                      className="block w-full text-sm text-gray-500 file:mr-3 file:rounded-lg file:border-0 file:bg-primary-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary-700 hover:file:bg-primary-100"
                    />
                  </div>
                  {uploadedFiles[field.id] && (
                    <img
                      src={uploadedFiles[field.id]}
                      alt="Uploaded file preview"
                      className="mt-2 max-h-32 rounded-lg border object-cover"
                    />
                  )}
                </div>
              );

            default:
              return (
                <Input
                  key={field.id}
                  label={field.label}
                  required={field.required}
                  value={(answers[field.id] as string) || ""}
                  onChange={(e) => handleTextChange(field.id, e.target.value)}
                />
              );
          }
        })}
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" onClick={prevStep}>
          Back
        </Button>
        <Button type="submit">Continue</Button>
      </div>
    </form>
  );
}
