import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Input, Button, notify } from '@/ui';
import { useLang } from '@/i18n/LanguageContext';
import { ROUTES } from '@/constants';

export default function VerifyEmailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLang();
  const email = location.state?.email ?? '';
  const [resending, setResending] = useState(false);

  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm({ defaultValues: { code: '' } });

  const onSubmit = async ({ code }) => {
    try {
      const { cognitoConfirmSignUp } = await import('@/lib/cognitoAuth');
      await cognitoConfirmSignUp(email, code.trim());
      notify.success('Email verified! You can now sign in.');
      navigate(ROUTES.LOGIN, { replace: true });
    } catch (err) {
      setError('root', { message: err?.message ?? 'Verification failed' });
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      const { cognitoResendCode } = await import('@/lib/cognitoAuth');
      await cognitoResendCode(email);
      notify.success('A new code has been sent to your email.');
    } catch (err) {
      notify.error(err?.message ?? 'Could not resend code');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="animate-fade-up">
      <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink">
        {t('verifyEmail')}
      </h1>
      <p className="mt-2 text-sm text-muted">
        {t('verifyDesc')} <strong>{email || 'your email'}</strong>
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
        {errors.root && (
          <div className="rounded-2xl bg-danger/10 px-4 py-3 text-sm font-medium text-danger">
            {errors.root.message}
          </div>
        )}
        <Input
          label={t('verifyCode')}
          type="text"
          inputMode="numeric"
          placeholder="123456"
          maxLength={6}
          autoComplete="one-time-code"
          error={errors.code?.message}
          {...register('code', {
            required: 'Code is required',
            minLength: { value: 6, message: 'Code must be 6 digits' },
            maxLength: { value: 6, message: 'Code must be 6 digits' },
          })}
        />
        <Button type="submit" fullWidth size="lg" loading={isSubmitting}>
          {t('verifyEmail')}
        </Button>
      </form>

      <div className="mt-6 flex flex-col items-center gap-2 text-sm text-muted">
        <span>
          Didn't receive the code?{' '}
          <button type="button" disabled={resending} onClick={handleResend}
            className="font-semibold text-primary-600 hover:underline disabled:opacity-50">
            {resending ? t('loading') : t('resend')}
          </button>
        </span>
        <Link to={ROUTES.LOGIN} className="text-primary-600 hover:underline">
          {t('welcomeBack')}
        </Link>
      </div>
    </div>
  );
}
