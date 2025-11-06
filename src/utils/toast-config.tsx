import { toast, ToastOptions } from "react-toastify";

const defaultToastConfig: ToastOptions = {
  position: "top-right",
  autoClose: 5000,
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
        {message}
      </div>,
      { ...defaultToastConfig, ...config }
    );
  },

  success: (message: React.ReactNode, config?: ToastOptions) => {
    toast.dismiss();
    toast.success(
      <div className="flex items-start gap-2">
        {message}
      </div>,
      { ...defaultToastConfig, ...config }
    );
  }
};
