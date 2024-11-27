import React, { useState, useEffect } from 'react';

const getYesterday = () => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date.toISOString().split('T')[0];
};

const AstronomyPicture = () => {
    const [date, setDate] = useState(getYesterday());
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async (selectedDate) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&date=${selectedDate}`);
            const result = await response.json();
            if (!response.ok) throw new Error(result.error.message || 'エラーが発生しました。');
            setData(result);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(date);
    }, [date]);

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">天文学写真</h2>
            <input
                type="date"
                value={date}
                max={getYesterday()}
                onChange={(e) => setDate(e.target.value)}
                className="border p-2 rounded mb-4"
            />
            {loading ? (
                <p>読み込み中...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <div>
                    <h3>{data.title}</h3>
                    {data.media_type === 'image' ? (
                        <img src={data.url} alt={data.title} className="rounded w-full" />
                    ) : (
                        <iframe src={data.url} title={data.title} className="w-full h-64" allowFullScreen />
                    )}
                    <p>{data.explanation}</p>
                </div>
            )}
        </div>
    );
};

export default AstronomyPicture;
