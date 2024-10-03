import React from 'react';
import reactsvg from '../assets/react.svg';

import { Link } from "react-router-dom";

const Navigationbar = () => {
    return (
        <nav className="h-fit w-screen bg-red-500 p-3 justify-between flex text-white sticky">
            <div className="flex p-2 hover:bg-red-700 hover:rounded-md hover:cursor-pointer gap-x-2">
                <img src={reactsvg} alt="React Logo" className="h-fit" />
                <label className='flex justify-center self-center'>Student Violation</label>
            </div>
            <div className="flex gap-x-5 justify-center self-center">
                <Link className='p-2 hover:bg-red-700 hover:rounded-md hover:cursor-pointer' to="/">Home</Link>
                <Link className='p-2 hover:bg-red-700 hover:rounded-md hover:cursor-pointer' to="/Students">Students</Link>
                <Link className='p-2 hover:bg-red-700 hover:rounded-md hover:cursor-pointer' to="/violations">Violation</Link>
            </div>
        </nav>
    );
};

export default Navigationbar;