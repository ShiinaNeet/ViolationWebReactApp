
import Navigationbar from './components/Navigationbar';
import { Outlet } from "react-router-dom";
import './index.css'
const Layout = () => {
    return (
        <div className='overflow-x-scroll:hidden'>
            <Navigationbar />
            <Outlet />
        </div>
    );

};
export default Layout;