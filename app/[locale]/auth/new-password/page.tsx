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
import { useSearchParams } from 'next/navigation';

const newPasswordSchema = z.object({
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type NewPasswordFormData = z.infer<typeof newPasswordSchema>;

export default function NewPasswordPage() {
  const t = useTranslations('auth.resetPassword');
  const v = useTranslations('auth.validation');
  const locale = useLocale();
  const isArabic = locale === 'ar';
  const { resetPassword } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<NewPasswordFormData>({
    resolver: zodResolver(newPasswordSchema),
  });

  const onSubmit = async (data: NewPasswordFormData) => {
    setIsSubmitting(true);
    try {
      const success = await resetPassword(token, data.password);
      if (success) {
        toast.success(t('passwordResetSuccess'));
        router.push('/auth/login');
      } else {
        toast.error(t('resetError'));
      }
    } catch (error) {
      toast.error(t('resetError'));
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
              {t('newPassword')}
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

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#34222e] text-white rounded-lg py-3 font-bold text-sm hover:bg-[#2a1c26] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '...' : t('resetButton')}
          </button>
        </form>
      </div>
    </div>
  );
}
