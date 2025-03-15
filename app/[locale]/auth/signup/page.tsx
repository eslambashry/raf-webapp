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

const signupSchema = z.object({
  fullName: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
  agreeTerms: z.boolean().refine(val => val === true),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const t = useTranslations('auth.signup');
  const v = useTranslations('auth.validation');
  const locale = useLocale();
  const isArabic = locale === 'ar';
  const { signup } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      agreeTerms: false,
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsSubmitting(true);
    try {
      const success = await signup(data.fullName, data.email, data.password);
      if (success) {
        toast.success(t('signupSuccess'));
        router.push('/');
      } else {
        toast.error(t('signupError'));
      }
    } catch (error) {
      toast.error(t('signupError'));
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
              {t('fullName')}
            </label>
            <input
              {...register('fullName')}
              type="text"
              className="w-full p-3 rounded-lg border-2 border-[#34222e] focus:outline-none focus:border-[#c48765] transition-colors"
            />
            {errors.fullName && (
              <p className="text-red-500 text-xs">{v('fullNameLength')}</p>
            )}
          </div>

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

          <div className="space-y-2">
            <label className="block text-[#34222E] font-bold text-sm">
              {t('confirmPassword')}
            </label>
            <input
              {...register('confirmPassword')}
              type="password"
              className="w-full p-3 rounded-lg border-2 border-[#34222e] focus:outline-none focus:border-[#c48765] transition-colors"
              dir="ltr"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs">{v('passwordMatch')}</p>
            )}
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                {...register('agreeTerms')}
                type="checkbox"
                id="agreeTerms"
                className="w-4 h-4 text-[#c48765] border-2 border-[#34222e] rounded focus:ring-[#c48765]"
              />
            </div>
            <label htmlFor="agreeTerms" className="ml-2 text-sm text-[#34222E]">
              {t('agreeTerms')}
            </label>
          </div>
          {errors.agreeTerms && (
            <p className="text-red-500 text-xs">{v('termsRequired')}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#34222e] text-white rounded-lg py-3 font-bold text-sm hover:bg-[#2a1c26] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '...' : t('signupButton')}
          </button>

          <div className="text-center mt-6">
            <p className="text-sm text-[#34222E]">
              {t('haveAccount')} <Link href="/auth/login" className="text-[#c48765] hover:underline font-medium">{t('login')}</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
