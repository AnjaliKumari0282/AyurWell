import Link from 'next/link';
import { AppLogo } from '@/components/icons';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <AppLogo className="h-8 w-8" />
            <span className="font-bold">AyurWell</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
