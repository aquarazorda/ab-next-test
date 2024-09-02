import { Header } from "@/components/cms/header"
import { Sidebar } from '@/components/cms/sidebar'
import { ReactNode } from 'react'

interface CMSLayoutProps {
    children: ReactNode
}

export default function CMSLayout({ children }: CMSLayoutProps) {
    return (
        <div className="flex h-screen flex-col">
            <Header />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}
