'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '../../lib/utils';

export function Sidebar() {
  const pathname = usePathname()

  const navItems = [
    { label: 'Dashboard', href: '/cms' },
    { label: 'Posts', href: '/cms/posts' },
    { label: 'Users', href: '/cms/users' },
    { label: 'Settings', href: '/cms/settings' },
  ]

  return (
    <aside className="w-64 border-r p-6">
      <nav className="space-y-2">
        {navItems.map((item) => (
          <Button
            key={item.href}
            variant={pathname === item.href ? 'secondary' : 'ghost'}
            className={cn("w-full justify-start transition-all duration-200 ease-in-out", pathname === item.href ? 'bg-secondary text-secondary-foreground' : 'hover:bg-secondary/80 hover:text-secondary-foreground')}
            asChild
          >
            <Link href={item.href}>{item.label}</Link>
          </Button>
        ))}
      </nav>
    </aside>
  )
}
