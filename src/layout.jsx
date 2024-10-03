
import Navigationbar from './components/Navigationbar';
import { Outlet } from "react-router-dom";
import './index.css'
const Layout = () => {
    return (
        <div className='overflow-x-scroll'>
            <Navigationbar />
            <Outlet />
        </div>
    );

};
export default Layout;