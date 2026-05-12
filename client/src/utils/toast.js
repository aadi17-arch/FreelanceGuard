import { enqueueSnackbar, closeSnackbar } from "notistack";

const variantStyles = {
  success: {
    background: "rgba(16, 185, 129, 0.09)",
    border: "1px solid rgba(16, 185, 129, 0.22)",
    color: "#34d399",
    boxShadow: "0 12px 30px rgba(16, 185, 129, 0.06)"
  },
  error: {
    background: "rgba(244, 63, 94, 0.09)",
    border: "1px solid rgba(244, 63, 94, 0.22)",
    color: "#fb7185",
    boxShadow: "0 12px 30px rgba(244, 63, 94, 0.06)"
  },
  info: {
    background: "rgba(14, 165, 233, 0.09)",
    border: "1px solid rgba(14, 165, 233, 0.22)",
    color: "#38bdf8",
    boxShadow: "0 12px 30px rgba(14, 165, 233, 0.06)"
  },
  warning: {
    background: "rgba(245, 158, 11, 0.09)",
    border: "1px solid rgba(245, 158, 11, 0.22)",
    color: "#fbbf24",
    boxShadow: "0 12px 30px rgba(245, 158, 11, 0.06)"
  },
  default: {
    background: "rgba(30, 41, 59, 0.85)",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    color: "#f8fafc",
    boxShadow: "0 12px 30px rgba(0, 0, 0, 0.25)"
  }
};

const getOptions = (options = {}, variant = "default") => {
  const { duration, ...rest } = options;
  const styles = variantStyles[variant] || variantStyles.default;
  return {
    autoHideDuration: duration !== undefined ? duration : 3000,
    ...rest,
    style: {
      background: styles.background,
      color: styles.color,
      borderRadius: "14px",
      padding: "10px 18px",
      fontSize: "11px",
      fontWeight: "700",
      letterSpacing: "0.03em",
      border: styles.border,
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      boxShadow: styles.boxShadow,
      ...rest.style
    }
  };
};

export const toast = {
  success: (message, options = {}) => {
    return enqueueSnackbar(message, {
      variant: "success",
      ...getOptions(options, "success")
    });
  },
  error: (message, options = {}) => {
    return enqueueSnackbar(message, {
      variant: "error",
      ...getOptions(options, "error")
    });
  },
  info: (message, options = {}) => {
    return enqueueSnackbar(message, {
      variant: "info",
      ...getOptions(options, "info")
    });
  },
  warning: (message, options = {}) => {
    return enqueueSnackbar(message, {
      variant: "warning",
      ...getOptions(options, "warning")
    });
  },
  dismiss: (id) => {
    closeSnackbar(id);
  }
};

export default toast;
