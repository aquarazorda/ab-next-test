import { Button } from '@/components/ui/button'

export function Header() {
  return (
    <header className="flex items-center justify-between border-b px-6 py-4">
      <h1 className="text-2xl font-bold">CMS Dashboard</h1>
      <Button>Log out</Button>
    </header>
  )
}
