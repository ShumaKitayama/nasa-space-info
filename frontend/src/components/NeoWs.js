import React, { useState } from "react";
import { Pie, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const NeoWs = () => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    const isValidDate = (dateString) => {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        return regex.test(dateString);
    };

    const fetchNeoWsData = async () => {
        if (!startDate || !endDate) {
            setError("Both start and end dates are required.");
            setData(null);
            return;
        }

        if (!isValidDate(startDate) || !isValidDate(endDate)) {
            setError("Dates must be in the format YYYY-MM-DD.");
            setData(null);
            return;
        }

        const now = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (start > now || end > now) {
            setError("Dates cannot be in the future.");
            setData(null);
            return;
        }

        if (start > end) {
            setError("Start date must be before or equal to end date.");
            setData(null);
            return;
        }

        const url = `http://localhost:8080/api/neows?start_date=${startDate}&end_date=${endDate}`;
        console.log("Request URL:", url);

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Failed to fetch data from the server.");
            }
            const result = await response.json();
            setData(result);
            setError(null);
        } catch (err) {
            console.error("Error fetching NeoWs data:", err.message);
            setError("Failed to fetch NEO data. Please try again.");
            setData(null);
        }
    };

    const sizeChartData = data ? {
        labels: data.sizes.labels,
        datasets: [
            {
                label: 'Count by Size',
                data: data.sizes.values,
                backgroundColor: [
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(255, 99, 132, 0.6)'
                ],
                borderWidth: 1
            }
        ]
    } : null;

    const speedChartData = data ? {
        labels: data.speeds.labels,
        datasets: [
            {
                label: 'Count by Speed',
                data: data.speeds.values,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderWidth: 1
            }
        ]
    } : null;

    return (
        <div style={{ padding: "20px" }}>
            <h1>Near Earth Objects</h1>
            <label>
                Start Date:
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
            </label>
            <br />
            <label>
                End Date:
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
            </label>
            <br />
            <button onClick={fetchNeoWsData}>Fetch NEO Data</button>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {data && (
                <div>
                    <h3>Size Distribution (Pie Chart)</h3>
                    {sizeChartData && <Pie data={sizeChartData} />}
                    <h3>Speed Distribution (Bar Chart)</h3>
                    {speedChartData && (
                        <div style={{ maxWidth: "600px" }}>
                            <Bar
                                data={speedChartData}
                                options={{
                                    responsive: true,
                                    scales: {
                                        y: { beginAtZero: true }
                                    }
                                }}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NeoWs;
