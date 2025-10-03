'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useTransition } from 'react';

type Props = {
  locale: string;
};

export default function LocaleSwitcher({ locale }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function onSelectChange(nextLocale: string) {
    const segments = pathname.split('/');
    segments[1] = nextLocale;
    const newPathname = segments.join('/');

    startTransition(() => {
      router.replace(newPathname);
    });
  }

  return (
    <div className='flex items-center space-x-2'>
      <select
        value={locale}
        onChange={(e) => onSelectChange(e.target.value)}
        disabled={isPending}
        className='px-2 py-1 border rounded text-sm'
      >
        <option value='fr'>Français</option>
        <option value='en'>English</option>
      </select>
    </div>
  );
}
