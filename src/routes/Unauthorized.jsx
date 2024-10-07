import React from 'react';
import Notfound from '../assets/NotFound.svg';

export default function Unauthorized() {
  return (
    <div className='h-screen w-full flex items-center justify-center'>
      <div className='flex items-center justify-center'>
        <img src={Notfound} alt="Not Found" className='w-11/12'/>
        {/* <label htmlFor="" className='text-3xl text-red-500'>Please go back!</label> */}
      </div>
    </div>
  );

}
