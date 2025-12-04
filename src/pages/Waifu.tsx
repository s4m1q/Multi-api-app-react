// src/pages/Waifu.tsx
import { useState } from 'react';
import { fetchWaifuImages } from '../services/waifuApi';
import type { WaifuImage } from '../types/waifu';
import Loading from '../components/Loading';
import ErrorDisplay from '../components/ErrorDisplay';

const Waifu = () => {
  const [tags, setTags] = useState('maid');
  const [orientation, setOrientation] = useState('');
  const [isNsfw, setIsNsfw] = useState(false);
  const [images, setImages] = useState<WaifuImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetch = async () => {
    setLoading(true);
    setError('');
    try {
      const newImages = await fetchWaifuImages({
        included_tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        orientation: orientation as any,
        is_nsfw: isNsfw,
      });
      if (newImages[0]) {
        // Добавляем новое изображение в начало или конец
        setImages(prev => [...prev, newImages[0]]); // в конец
        // или: setImages(prev => [newImages[0], ...prev]); // в начало
      }
    } catch (err: any) {
      setError(err.message || 'Не удалось загрузить изображение');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container">
      <header className="waifu-header">
        <h2>Waifu Gallery</h2>
        <p className="subtitle">Галерея рандомных аниме изображений с Waifu.im</p>
      </header>

      <div className="controls">
        <div className="filter-group">
          <label>Теги (через запятую):</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="maid, neko..."
          />
        </div>
        <div className="filter-group">
          <label>Ориентация:</label>
          <select value={orientation} onChange={(e) => setOrientation(e.target.value)}>
            <option value="">Любая</option>
            <option value="PORTRAIT">Портрет</option>
            <option value="LANDSCAPE">Ландшафт</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Контент:</label>
          <select
            value={isNsfw ? 'true' : 'false'}
            onChange={(e) => setIsNsfw(e.target.value === 'true')}
          >
            <option value="false">SFW</option>
            <option value="true">NSFW</option>
          </select>
        </div>
        <div className="button-group">
          <button className="search-btn" onClick={() => fetch()}>
            Поиск
          </button>
          <button className="next-btn" onClick={() => fetch()} disabled={loading}>
            Смотреть следующий
          </button>
        </div>
      </div>

      {loading && <Loading />}
      {error && <ErrorDisplay message={error} />}

          {images.length > 0 && (
            <div className="gallery">
              {images.map((img, index) => (
                <div className="gallery-item" key={`${img.url}-${index}`}>
                  <img
                    src={img.url}
                    alt={img.tags.map(t => t.name).join(', ')}
                  />
                  <div className="image-info">
                    <div className="tags">
                      {img.tags.slice(0, 5).map((tag, i) => (
                        <span key={i} className="tag">{tag.name}</span>
                      ))}
                    </div>
                    <a
                      href={img.source}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="source-link"
                    >
                      🔗 Источник
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
    </main>
  );
};

export default Waifu;