import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { ProtectedRoute } from "./protected-route";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        <Sidebar />

        <div className="flex flex-1 flex-col overflow-hidden">
          <Topbar />

          <main className="flex-1 overflow-auto p-6">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
