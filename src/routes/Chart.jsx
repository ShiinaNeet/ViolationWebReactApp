import React from 'react'
import { PieChart } from '@mui/x-charts/PieChart';

export default function Chart() {
    return (
        <>
            <div className="h-screen w-full flex items-center justify-center">
                <div className='w-full p-2 sm:p-0 sm:w-2/3 h-1/2 flex flex-col items-center justify-center'>
                    <PieChart
                        series={[
                            {
                                data: [
                                    { id: 0, value: 40, label: 'Violation A (40%)' },
                                    { id: 1, value: 30, label: 'Violation B (30%)' },
                                    { id: 2, value: 20, label: 'Violation C (20%)' },
                                    { id: 3, value: 10, label: 'Violation D (10%)' },
                                ],
                            },
                        ]}
                    />
                </div>
            </div>
        </>
    )
}
