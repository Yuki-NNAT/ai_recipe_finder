import { useLang } from '@/i18n/LanguageContext';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Input, Button, Checkbox, notify } from '@/ui';
import { useAuth } from '@/hooks/useAuth';
import { USE_MOCK } from '@/config/env';
import { ROUTES } from '@/constants';

/**
 * Register page — works in both mock and real Cognito mode.
 *
 * Cognito flow:
 *  1. signUp()          → Cognito sends 6-digit code to email
 *  2. Redirect to /verify-email with email in state
 *  3. VerifyEmailPage calls confirmSignUp(email, code)
 *  4. Redirect to /login
 */
export default function RegisterPage() {
  const { t } = useLang();
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { name: '', email: '', password: '', confirm: '', terms: false },
  });

  const password = watch('password');

  const onSubmit = async ({ name, email, password: pw }) => {
    try {
      const result = await registerUser({ name, email, password: pw });

      if (USE_MOCK) {
        // Mock: register returns user directly, session is set.
        notify.success(`Welcome, ${result.name?.split(' ')[0] ?? 'there'}! Your account is ready.`);
        navigate(ROUTES.HOME, { replace: true });
        return;
      }

      // Cognito: signUp triggers email verification.
      const step = result?.nextStep?.signUpStep;

      if (step === 'CONFIRM_SIGN_UP' || step === 'DONE') {
        if (step === 'CONFIRM_SIGN_UP') {
          notify.info('Check your email for a 6-digit verification code.');
          navigate('/verify-email', { state: { email }, replace: true });
        } else {
          notify.success('Account created! You can now sign in.');
          navigate(ROUTES.LOGIN, { replace: true });
        }
        return;
      }

      // Unexpected step — surface it.
      setError('root', { message: `Unexpected step: ${step}` });
    } catch (err) {
      setError('root', { message: err?.message ?? 'Registration failed' });
    }
  };

  return (
    <div className="animate-fade-up">
      <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink">
        {t('createAccount')}
      </h1>
      <p className="mt-2 text-sm text-muted">
        {t('startDiscovering')}
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
        {errors.root && (
          <div className="rounded-2xl bg-danger/10 px-4 py-3 text-sm font-medium text-danger">
            {errors.root.message}
          </div>
        )}

        <Input
          label="Full name"
          placeholder="Nhi Nguyễn"
          autoComplete="name"
          leftIcon={<User className="h-5 w-5" />}
          error={errors.name?.message}
          {...register('name', {
            required: 'Name is required',
            minLength: { value: 2, message: 'Name is too short' },
          })}
        />

        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          leftIcon={<Mail className="h-5 w-5" />}
          error={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
              message: 'Enter a valid email',
            },
          })}
        />

        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          autoComplete="new-password"
          leftIcon={<Lock className="h-5 w-5" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          }
          error={errors.password?.message}
          hint="Minimum 8 characters"
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 8, message: 'At least 8 characters required' },
          })}
        />

        <Input
          label="Confirm password"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          leftIcon={<Lock className="h-5 w-5" />}
          error={errors.confirm?.message}
          {...register('confirm', {
            required: 'Please confirm your password',
            validate: (v) => v === password || 'Passwords do not match',
          })}
        />

        <Checkbox
          label="I agree to the Terms of Service and Privacy Policy"
          {...register('terms', { required: true })}
        />
        {errors.terms && (
          <p className="text-xs font-medium text-danger">
            You must accept the terms to continue
          </p>
        )}

        <Button type="submit" fullWidth size="lg" loading={isSubmitting}>
          {t('createAccount')}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        {t('alreadyAccount')}{' '}
        <Link to={ROUTES.LOGIN} className="font-semibold text-primary-600 hover:underline">
          Sign in
        </Link>
      </p>

      {USE_MOCK && (
        <p className="mt-4 rounded-2xl bg-primary-50/60 px-4 py-3 text-center text-xs text-muted">
          Demo mode — fill any valid email + 8+ character password.
        </p>
      )}
    </div>
  );
}
