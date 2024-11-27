import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AstronomyPicture from './components/AstronomyPicture';
import MarsRover from './components/MarsRover';
import EarthImage from './components/EarthImage';
import NeoWs from './components/NeoWs';
import IssLocation from './components/IssLocation';

const App = () => {
    return (
        <Router>
            <header className="bg-black text-white py-4">
                <div className="max-w-4xl mx-auto flex justify-between">
                    <h1 className="text-2xl font-bold">NASA Explorer</h1>
                    <nav>
                        <ul className="flex space-x-4">
                            <li><Link to="/">メインページ</Link></li>
                            <li><Link to="/astronomy-picture">天文学写真</Link></li>
                            <li><Link to="/mars-rover">火星ローバー</Link></li>
                            <li><Link to="/earth-image">地球の画像</Link></li>
                            <li><Link to="/neows">近傍小天体</Link></li>
                            <li><Link to="/iss-location">宇宙ステーション</Link></li>
                        </ul>
                    </nav>
                </div>
            </header>
            <main className="max-w-4xl mx-auto p-4">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/astronomy-picture" element={<AstronomyPicture />} />
                    <Route path="/mars-rover" element={<MarsRover />} />
                    <Route path="/earth-image" element={<EarthImage />} />
                    <Route path="/neows" element={<NeoWs />} />
                    <Route path="/iss-location" element={<IssLocation />} />
                </Routes>
            </main>
        </Router>
    );
};

const HomePage = () => (
    <div>
        <h2 className="text-xl font-semibold mb-4">ようこそ！NASA Explorerへ</h2>
        <p>このサイトでは、以下の情報をご覧いただけます：</p>
        <ul className="list-disc pl-6">
            <li>天文学写真（APOD）</li>
            <li>火星ローバーの写真</li>
            <li>地球の画像（EPIC）</li>
            <li>近傍小天体（NeoWs）</li>
            <li>宇宙ステーションの現在地</li>
        </ul>
        <p>上記の各ページにアクセスするには、ヘッダーのリンクをご利用ください。</p>
    </div>
);

export default App;
