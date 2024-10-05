import React from 'react';

export default function Unauthorized() {
  return (
    <div className='h-screen w-full flex items-center justify-center'>
      <div className='flex items-center justify-center'>
        <label htmlFor="" className='text-3xl text-red-500'>Please go back!</label>
      </div>
    </div>
  );
}
