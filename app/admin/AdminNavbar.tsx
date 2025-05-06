import AppNavbar from "&/dashboard/AppNavbar";
import AppNavLink from "&/dashboard/AppNavLink";
import NavUser from "&/dashboard/NavUser";
import { LucideLayoutGrid, LucideList } from "lucide-react";

const AdminNavbar = async () => {
  return (
    <AppNavbar title="Studentské Rady ČR" footer={<NavUser />}>
      <AppNavLink
        text="Přehled"
        icon={<LucideLayoutGrid size="1rem" />}
        to="/admin"
        exact
      />

      <AppNavLink
        text="Studentské rady"
        icon={<LucideList size="1rem" />}
        to="/admin/councils"
        exact
      />
    </AppNavbar>
  );
};

export default AdminNavbar;
