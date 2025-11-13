import { Header, Footer, GlobalChatButton } from "@/libs/components";

export default function CampHubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main content */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 md:px-8 py-6">
        {children}
        <GlobalChatButton />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
