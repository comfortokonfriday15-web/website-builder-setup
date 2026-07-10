import {
  forwardRef,
  createContext,
  useContext,
  useState,
  useCallback,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import {
  Root as ToastRoot,
  Provider as ToastProvider,
  Viewport as ToastViewport,
  Title as ToastTitle,
  Description as ToastDescription,
  Close as ToastClose,
  Action as ToastAction,
} from "@radix-ui/react-toast";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastVariant = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
}

interface ToastContextValue {
  toast: (title: string, description?: string, variant?: ToastVariant) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a Toaster");
  return ctx;
}

const iconMap: Record<ToastVariant, ReactNode> = {
  success: <CheckCircle className="h-5 w-5 text-green-500" />,
  error: <AlertCircle className="h-5 w-5 text-red-500" />,
  warning: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
  info: <Info className="h-5 w-5 text-blue-500" />,
};

const Toast = forwardRef<
  React.ComponentRef<typeof ToastRoot>,
  ComponentPropsWithoutRef<typeof ToastRoot> & {
    variant?: ToastVariant;
  }
>(({ className, variant = "info", ...props }, ref) => (
  <ToastRoot
    ref={ref}
    className={cn(
      "group pointer-events-auto relative flex w-full items-start gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-lg",
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out",
      "data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full",
      "data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
      className
    )}
    {...props}
  />
));
Toast.displayName = "Toast";

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback(
    (title: string, description?: string, variant: ToastVariant = "info") => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { id, title, description, variant }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 5000);
    },
    []
  );

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      <ToastProvider swipeDirection="right">
        {toasts.map((t) => (
          <Toast key={t.id} variant={t.variant}>
            <span className="shrink-0">{iconMap[t.variant || "info"]}</span>
            <div className="flex-1 space-y-1">
              <ToastTitle className="text-sm font-medium text-gray-900">
                {t.title}
              </ToastTitle>
              {t.description && (
                <ToastDescription className="text-xs text-gray-500">
                  {t.description}
                </ToastDescription>
              )}
            </div>
            <ToastClose className="shrink-0 rounded-md p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500">
              <X className="h-4 w-4" />
            </ToastClose>
          </Toast>
        ))}
        <ToastViewport className="fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse gap-2 p-4 sm:max-w-[420px]" />
      </ToastProvider>
    </ToastContext.Provider>
  );
}
