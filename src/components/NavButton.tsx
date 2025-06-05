'use client';
import Link from 'next/link';

type NavButtonProps = {
  href: string;
  label: string;
  className?: string;
};

export function NavButton({ href, label, className = '' }: NavButtonProps) {
  return (
    <Link
      href={href}
      className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition ${className}`}
    >
      {label}
    </Link>
  );
}
