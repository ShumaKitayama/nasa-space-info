import React, { useState, useEffect } from 'react';

const MarsRover = () => {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&api_key=DEMO_KEY`)
            .then((response) => response.json())
            .then((result) => {
                setPhotos(result.photos);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>読み込み中...</p>;
    if (error) return <p>エラー: {error}</p>;

    return (
        <div>
            <h2>火星ローバーの写真</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {photos.map((photo) => (
                    <img key={photo.id} src={photo.img_src} alt={photo.earth_date} className="rounded" />
                ))}
            </div>
        </div>
    );
};

export default MarsRover;
