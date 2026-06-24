import AdminLogin from "./AdminLogin";
import AdminEditor from "./AdminEditor";
import { isAuthenticated } from "@/lib/auth";
import { getAdminMenu } from "@/lib/menu";
import { getAdminSettings } from "@/lib/settings";
import { isAdminWriteConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAuthenticated())) {
    return <AdminLogin />;
  }

  const [{ menu, items }, settings] = await Promise.all([getAdminMenu(), getAdminSettings()]);
  return (
    <AdminEditor
      initialMenu={menu}
      initialItems={items}
      initialSettings={settings}
      writeEnabled={isAdminWriteConfigured()}
    />
  );
}
