import { toast, ToastOptions } from "react-toastify";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

const defaultToastConfig: ToastOptions = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light"
};

export const showToast = {
  error: (message: React.ReactNode, config?: ToastOptions) => {
    toast.dismiss();
    toast.error(
      <div className="flex items-start gap-2">
        {/* <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" /> */}
        {message}
      </div>,
      { ...defaultToastConfig, ...config }
    );
  },

  success: (message: React.ReactNode, config?: ToastOptions) => {
    toast.dismiss();
    toast.success(
      <div className="flex items-start gap-2">
        {/* <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" /> */}
        {message}
      </div>,
      { ...defaultToastConfig, ...config }
    );
  }
};
