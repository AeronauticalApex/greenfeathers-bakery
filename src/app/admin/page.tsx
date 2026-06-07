import AdminLogin from "./AdminLogin";
import AdminEditor from "./AdminEditor";
import { isAuthenticated } from "@/lib/auth";
import { getAdminMenu } from "@/lib/menu";
import { isAdminWriteConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAuthenticated())) {
    return <AdminLogin />;
  }

  const { menu, items } = await getAdminMenu();
  return (
    <AdminEditor
      initialMenu={menu}
      initialItems={items}
      writeEnabled={isAdminWriteConfigured()}
    />
  );
}
