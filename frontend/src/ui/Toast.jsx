import { Toaster, toast } from 'react-hot-toast';
import { colors } from '@/theme/tokens';

/**
 * App-wide toast surface. Mount <ToastHost/> once at the root; call the
 * exported `notify` helpers anywhere. Wrapping react-hot-toast here keeps the
 * brand styling in one place.
 */
export function ToastHost() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3200,
        style: {
          borderRadius: '18px',
          background: colors.surface,
          color: colors.text,
          boxShadow: '0 12px 40px -12px rgba(255, 79, 135, 0.28)',
          border: '1px solid rgba(255,79,135,0.12)',
          fontSize: '14px',
          fontWeight: 500,
        },
        success: { iconTheme: { primary: colors.success, secondary: '#fff' } },
        error: { iconTheme: { primary: colors.danger, secondary: '#fff' } },
      }}
    />
  );
}

export const notify = {
  success: (msg) => toast.success(msg),
  error: (msg) => toast.error(msg),
  info: (msg) => toast(msg),
  promise: (promise, msgs) => toast.promise(promise, msgs),
};

export default ToastHost;
