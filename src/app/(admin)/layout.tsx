import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";
import 'react-toastify/dist/ReactToastify.css';
export default function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <AdminPanelLayout>{children}</AdminPanelLayout>;
}
