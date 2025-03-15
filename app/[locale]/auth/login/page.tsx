'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Image from 'next/image';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const t = useTranslations('auth.login');
  const v = useTranslations('auth.validation');
  const locale = useLocale();
  const isArabic = locale === 'ar';
  const { login } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      const success = await login(data.email, data.password);
      if (success) {
        toast.success(t('loginSuccess'));
        router.push('/');
      } else {
        toast.error(t('loginError'));
      }
    } catch (error) {
      toast.error(t('loginError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EFEDEA] px-4 py-12" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Image
              src="/logo_2.png"
              alt="RAF Advanced Logo"
              width={80}
              height={80}
              className="mx-auto mb-4"
            />
          </Link>
          <h1 className="text-2xl font-bold text-[#34222E]">{t('title')}</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-[#34222E] font-bold text-sm">
              {t('email')}
            </label>
            <input
              {...register('email')}
              type="email"
              className="w-full p-3 rounded-lg border-2 border-[#34222e] focus:outline-none focus:border-[#c48765] transition-colors"
              placeholder="example@domain.com"
              dir="ltr"
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{v('emailInvalid')}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-[#34222E] font-bold text-sm">
              {t('password')}
            </label>
            <input
              {...register('password')}
              type="password"
              className="w-full p-3 rounded-lg border-2 border-[#34222e] focus:outline-none focus:border-[#c48765] transition-colors"
              dir="ltr"
            />
            {errors.password && (
              <p className="text-red-500 text-xs">{v('passwordLength')}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                {...register('rememberMe')}
                type="checkbox"
                id="rememberMe"
                className="w-4 h-4 text-[#c48765] border-2 border-[#34222e] rounded focus:ring-[#c48765]"
              />
              <label htmlFor="rememberMe" className="ml-2 text-sm text-[#34222E]">
                {t('rememberMe')}
              </label>
            </div>
            <Link 
              href="/auth/reset-password" 
              className="text-sm text-[#c48765] hover:underline"
            >
              {t('forgotPassword')}
            </Link>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#34222e] text-white rounded-lg py-3 font-bold text-sm hover:bg-[#2a1c26] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '...' : t('loginButton')}
          </button>

          <div className="text-center mt-6">
            <p className="text-sm text-[#34222E]">
              {t('noAccount')} <Link href="/auth/signup" className="text-[#c48765] hover:underline font-medium">{t('signUp')}</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
