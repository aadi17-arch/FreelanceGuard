import { enqueueSnackbar, closeSnackbar } from "notistack";

const variantStyles = {
  success: {
    background: "#ffffff",
    borderLeft: "4px solid #10b981", // Emerald solid
    color: "#111111",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)"
  },
  error: {
    background: "#ffffff",
    borderLeft: "4px solid #ef4444", // Rose solid
    color: "#111111",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)"
  },
  info: {
    background: "#ffffff",
    borderLeft: "4px solid #3b82f6", // Blue solid
    color: "#111111",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)"
  },
  warning: {
    background: "#ffffff",
    borderLeft: "4px solid #f59e0b", // Amber solid
    color: "#111111",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)"
  },
  default: {
    background: "#ffffff",
    borderLeft: "4px solid #111111",
    color: "#111111",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)"
  }
};

const getOptions = (options = {}, variant = "default") => {
  const { duration, ...rest } = options;
  const styles = variantStyles[variant] || variantStyles.default;
  return {
    autoHideDuration: duration !== undefined ? duration : 2000,
    preventDuplicate: true,
    persist: false,
    transitionDuration: 0, // Kill internal animation
    ...rest,
    style: {
      background: styles.background,
      color: styles.color,
      borderRadius: "8px",
      padding: "12px 20px",
      fontSize: "12px",
      fontWeight: "700",
      letterSpacing: "-0.01em",
      borderLeft: styles.borderLeft,
      borderTop: "1px solid #f4f4f5",
      borderRight: "1px solid #f4f4f5",
      borderBottom: "1px solid #f4f4f5",
      boxShadow: styles.boxShadow,
      opacity: 1,
      minWidth: "280px",
      marginTop: "10px", // Gap from the top of the screen
      ...rest.style
    }
  };
};

export const toast = {
  success: (message, options = {}) => {
    closeSnackbar();
    return enqueueSnackbar(message, {
      variant: "success",
      ...getOptions(options, "success")
    });
  },
  error: (message, options = {}) => {
    closeSnackbar();
    return enqueueSnackbar(message, {
      variant: "error",
      ...getOptions(options, "error")
    });
  },
  info: (message, options = {}) => {
    closeSnackbar();
    return enqueueSnackbar(message, {
      variant: "info",
      ...getOptions(options, "info")
    });
  },
  warning: (message, options = {}) => {
    closeSnackbar();
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
