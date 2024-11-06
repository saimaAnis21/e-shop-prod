import { Metadata } from "next";
import AdminNav from "../components/admin/AdminNav";


export const metadata: Metadata = {
  title: "E-Shop Admin",
  description:"E-Shop Admin Dashboard",
}

const AdminLayout = ({children}:{children: React.ReactNode}) => {
  return (
    <div>
      <AdminNav />
      <div>{children}</div>
    </div>
  );
};

export default AdminLayout
