import React from 'react'
import { PieChart } from '@mui/x-charts/PieChart';

export default function Chart() {
return (
    <>
        <div className="container mx-auto p-4">
            <h1>
                Violation Chart
            </h1>
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
                height={200}
            />
        </div>
    </>
)
}
