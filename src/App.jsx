import { useState } from 'react';
import Header from './components/Header';
import OutfitRater from './components/OutfitRater';
import OutfitGenerator from './components/OutfitGenerator';
import FashionArena from './components/FashionArena';
import './App.css';

function App() {
  const [currentMode, setCurrentMode] = useState('rater');

  const renderMode = () => {
    switch (currentMode) {
      case 'rater':
        return <OutfitRater />;
      case 'generator':
        return <OutfitGenerator />;
      case 'arena':
        return <FashionArena />;
      default:
        return <OutfitRater />;
    }
  };

  return (
    <div className="app">
      <Header currentMode={currentMode} onModeChange={setCurrentMode} />
      <main className="main-content">{renderMode()}</main>
      <footer className="app-footer">
        <p>
          Lumora - AI-Powered Fashion Assistant | Developed by Lumora Team
        </p>
      </footer>
    </div>
  );
}

export default App;
