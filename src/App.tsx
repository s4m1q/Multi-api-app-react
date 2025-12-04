// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Currency from './pages/Currency';
import Waifu from './pages/Waifu';
import AnimeCatalog from './pages/AnimeCatalog';

function App() {
  const basename = import.meta.env.BASE_URL === '/' ? undefined : import.meta.env.BASE_URL;

  return (
    <BrowserRouter basename={basename}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/currency" element={<Currency />} />
        <Route path="/waifu" element={<Waifu />} />
        <Route path="/anime" element={<AnimeCatalog />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;