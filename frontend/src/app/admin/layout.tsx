import { ProtectedRoute } from "@/components/admin/protected-route";
import { Sidebar } from "@/components/admin/sidebar";
import { Topbar } from "@/components/admin/topbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="flex w-full h-screen flex-row overflow-hidden">
        <div className="h-full">
          <Sidebar />
        </div>
        <div className="flex w-full h-full flex-col">
          <div className="flex flex-row w-full h-18">
            <Topbar />
          </div>
          <div className="h-full bg-background">
            <main className="flex-1 h-full overflow-y-scroll p-6">
              {children}
            </main>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
