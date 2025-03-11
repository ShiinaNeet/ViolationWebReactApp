import { Outlet } from "react-router-dom";
import Navigationbar from "../components/Professor/NavigationBar";

const ProfessorLayout = () => (
  <div className="overflow-x-scroll:hidden">
    <Navigationbar />
    <Outlet />
  </div>
);

export default ProfessorLayout;
