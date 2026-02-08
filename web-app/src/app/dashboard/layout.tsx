import ChatWindow from '@/components/ChatWindow'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="relative min-h-screen">
            {children}
            <ChatWindow />
        </div>
    )
}
