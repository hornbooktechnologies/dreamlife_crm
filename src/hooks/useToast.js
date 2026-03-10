import { toast } from 'sonner';

const useToast = () => {
    const showSuccessToast = (message) => {
        toast.success(message);
    };

    const showErrorToast = (message) => {
        toast.error(message);
    };

    const showInfoToast = (message) => {
        toast.info(message);
    };

    const showWarningToast = (message) => {
        toast.warning(message);
    };

    return {
        showSuccessToast,
        showErrorToast,
        showInfoToast,
        showWarningToast,
    };
};

export default useToast;
