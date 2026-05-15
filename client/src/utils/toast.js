import { enqueueSnackbar, closeSnackbar } from "notistack";

const getOptions = (options = {}, variant = "default") => {
  const { duration, ...rest } = options;
  return {
    autoHideDuration: duration !== undefined ? duration : 2000,
    preventDuplicate: true,
    persist: false,
    transitionDuration: 0,
    className: `toast-base toast-${variant}`,
    ...rest,
    style: {
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
