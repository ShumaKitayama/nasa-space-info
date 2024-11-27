import React, { useState } from "react";

const NeoWs = () => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    const isValidDate = (dateString) => {
        // YYYY-MM-DD フォーマットの正規表現で検証
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        return regex.test(dateString);
    };

    const fetchNeoWsData = async () => {
        if (!startDate || !endDate) {
            setError("Both start and end dates are required.");
            return;
        }

        if (!isValidDate(startDate) || !isValidDate(endDate)) {
            setError("Dates must be in the format YYYY-MM-DD.");
            return;
        }

        const apiKey = process.env.REACT_APP_NASA_API_KEY;
        const url = `/api/neows?start_date=${startDate}&end_date=${endDate}`;

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


    return (
        <div>
            <h1>Near Earth Objects</h1>
            <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
            />
            <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
            />
            <button onClick={fetchNeoWsData}>Fetch NEO Data</button>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {data && (
                <div>
                    <h2>NEO Data:</h2>
                    <pre>{JSON.stringify(data, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};
export default NeoWs;
