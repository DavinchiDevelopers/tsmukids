import clsx from 'clsx';
import { SITE_LOGO_PATH } from '@/lib/branding';

interface LogoProps {
  alt: string;
  size?: 'sm' | 'md';
  className?: string;
}

const sizes = {
  sm: 36,
  md: 40,
} as const;

export default function Logo({ alt, size = 'md', className }: LogoProps) {
  const px = sizes[size];
  return (
    <img
      src={SITE_LOGO_PATH}
      alt={alt}
      width={px}
      height={px}
      className={clsx('shrink-0 object-contain', className)}
    />
  );
}
