import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// ISSのアイコンを設定
const issIcon = new L.Icon({
    iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/International_Space_Station.svg', // ISSのイラストURL
    iconSize: [50, 50],
    iconAnchor: [25, 25]
});

const IssLocation = () => {
    const [position, setPosition] = useState([0, 0]);

    useEffect(() => {
        const fetchISSLocation = () => {
            fetch('http://api.open-notify.org/iss-now.json')
                .then((response) => response.json())
                .then((data) => {
                    const lat = parseFloat(data.iss_position.latitude);
                    const lon = parseFloat(data.iss_position.longitude);
                    setPosition([lat, lon]);
                })
                .catch((error) => console.error('ISSデータの取得に失敗しました: ', error));
        };

        // 初回データ取得と5秒ごとの更新
        fetchISSLocation();
        const interval = setInterval(fetchISSLocation, 5000);

        // クリーンアップ関数
        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">宇宙ステーションの現在地</h2>
            <MapContainer center={position} zoom={2} style={{ height: '500px', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={position} icon={issIcon}>
                    <Popup>
                        現在のISSの位置<br />
                        緯度: {position[0].toFixed(2)} 経度: {position[1].toFixed(2)}
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};

export default IssLocation;
