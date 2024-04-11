import toast from 'react-hot-toast';

const TOASTER_SETTINGS = {
  position: 'bottom-right',
};

export const successToast = (message) => {
  toast.success(message, TOASTER_SETTINGS);
};

export const errorToast = (message) => {
  toast.error(message, TOASTER_SETTINGS);
};
