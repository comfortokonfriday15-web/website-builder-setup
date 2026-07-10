import { useRef, useState, useEffect, useCallback } from "react";
import { useBookingContext } from "@/lib/booking-store";
import { useBooking } from "@/hooks/useBooking";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pen, RotateCcw, Check, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/toast";

export function SignaturePad() {
  const { state, setSignature, nextStep, prevStep } = useBookingContext();
  const { submitAppointment } = useBooking();
  const { toast } = useToast();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);
    ctx.strokeStyle = "#1f2937";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const handleResize = () => {
      const dataUrl = canvas.toDataURL();
      const r = canvas.getBoundingClientRect();
      canvas.width = r.width * 2;
      canvas.height = r.height * 2;
      ctx.scale(2, 2);
      ctx.strokeStyle = "#1f2937";
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0, r.width, r.height);
      img.src = dataUrl;
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    setSignature("");
  };

  const getSignatureData = (): string => {
    const canvas = canvasRef.current;
    if (!canvas) return "";
    return canvas.toDataURL("image/png");
  };

  const handleSubmit = async () => {
    if (!hasDrawn || !agreed) return;

    const sigData = getSignatureData();
    setSignature(sigData);

    setSubmitting(true);
    try {
      await submitAppointment();
      nextStep();
    } catch (err) {
      toast(
        "Booking failed",
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Sign Waiver</h2>
        <p className="mt-1 text-sm text-gray-500">
          Please read and sign the waiver below.
        </p>
      </div>

      <Card>
        <CardContent className="max-h-48 overflow-y-auto p-4 text-sm leading-relaxed text-gray-600">
          <h4 className="font-medium text-gray-900 mb-2">Waiver & Release of Liability</h4>
          <p>
            By signing below, I acknowledge that I have been informed of the nature of the
            procedure(s) to be performed and the associated risks. I consent to the treatment
            and agree to the terms and conditions set forth by the practice.
          </p>
          <p className="mt-2">
            I understand that I am responsible for all charges associated with my visit and
            that insurance coverage, if applicable, will be verified prior to treatment.
          </p>
          <p className="mt-2">
            I agree to the cancellation policy and understand that missed appointments may
            result in a fee.
          </p>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <Label>Signature</Label>
        <Card className="relative overflow-hidden">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="h-40 w-full touch-none cursor-crosshair bg-white"
            style={{ touchAction: "none" }}
          />
          {!hasDrawn && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-gray-400">
              <Pen className="mr-2 h-5 w-5" />
              <span className="text-sm">Sign above</span>
            </div>
          )}
        </Card>
        <button
          onClick={clearCanvas}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Clear signature
        </button>
      </div>

      <label className="flex items-start gap-2 text-sm text-gray-700 cursor-pointer">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-0.5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        />
        <span>
          I agree to the waiver and cancellation policy above
        </span>
      </label>

      <div className="flex gap-3 pt-2">
        <Button variant="outline" onClick={prevStep} disabled={submitting}>
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!hasDrawn || !agreed || submitting}
        >
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Booking...
            </>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              Confirm Booking
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-sm font-medium text-gray-700">{children}</label>
  );
}
