import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface PageBackButtonProps {
  href: string;
  label: string;
  className?: string;
}

export default function PageBackButton({ href, label, className = '' }: PageBackButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 text-sm font-semibold rounded-xl px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm transition-colors relative z-20 ${className}`}
    >
      <ArrowLeft size={16} className="shrink-0" />
      <span>{label}</span>
    </Link>
  );
}
