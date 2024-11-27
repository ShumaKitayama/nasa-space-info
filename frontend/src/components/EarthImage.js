import React, { useState, useEffect } from 'react';

const getYesterday = () => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date.toISOString().split('T')[0];
};

const EarthImage = () => {
    const [date, setDate] = useState(getYesterday());
    const [image, setImage] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchImage = async () => {
            setError(null);
            try {
                const response = await fetch(`https://api.nasa.gov/EPIC/api/natural/images?api_key=DEMO_KEY`);
                const data = await response.json();
                const filtered = data.find((img) => img.date.startsWith(date));
                if (filtered) {
                    const formattedDate = filtered.date.split(' ')[0].replace(/-/g, '/');
                    setImage(`https://epic.gsfc.nasa.gov/archive/natural/${formattedDate}/png/${filtered.image}.png`);
                } else {
                    setError('指定された日の画像が見つかりません。');
                }
            } catch (err) {
                setError('エラー: ' + err.message);
            }
        };
        fetchImage();
    }, [date]);

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">地球の画像</h2>
            <input
                type="date"
                value={date}
                max={getYesterday()}
                onChange={(e) => setDate(e.target.value)}
                className="border p-2 rounded mb-4"
            />
            {error ? <p className="text-red-500">{error}</p> : image && <img src={image} alt="Earth" className="rounded w-full" />}
        </div>
    );
};

export default EarthImage;
