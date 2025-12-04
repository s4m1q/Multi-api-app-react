// src/pages/AnimeCatalog.tsx
import { useState, useCallback } from 'react';
import { fetchAnimeList } from '../services/shikimoriApi';
import type { ShikimoriAnime } from '../types/anime';
import Loading from '../components/Loading';
import ErrorDisplay from '../components/ErrorDisplay';

const PLACEHOLDER_IMAGE = 'image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDMwMCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iNDUwIiBmaWxsPSIjRjBGMEYwIi8+CjxwYXRoIGQ9Ik0xNTAgMjI1QzE2Ni41NDMgMjI1IDE4MCAyMTEuNTQzIDE4MCAxOTVDMTgwIDE3OC40NTcgMTY2LjU0MyAxNjUgMTUwIDE2NUMxMzMuNDU3IDE2NSAxMjAgMTc4LjQ1NyAxMjAgMTk1QzEyMCAyMTEuNTQzIDEzMy40NTcgMjI1IDE1MCAyMjVaIiBmaWxsPSIjQ0VDRUNFIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMjc1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTk5OTkiPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K';

const AnimeCatalog = () => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [kind, setKind] = useState('');
  const [order, setOrder] = useState('popularity');
  const [animeList, setAnimeList] = useState<ShikimoriAnime[]>([]);
  const [selectedAnime, setSelectedAnime] = useState<ShikimoriAnime | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadAnime = useCallback(async (reset = false) => {
    if (loading) return;
    setLoading(true);
    setError('');
    try {
      const data = await fetchAnimeList({
        search,
        status,
        kind,
        order,
        page: reset ? 1 : page,
      });

      setAnimeList(prev => reset ? data : [...prev, ...data]);
      setHasMore(data.length === 20);
      if (reset) {
        setPage(2);
      } else {
        setPage(p => p + 1);
      }
    } catch (err: any) {
      setError(err.message || 'Не удалось загрузить аниме');
    } finally {
      setLoading(false);
    }
  }, [search, status, kind, order, page, loading]);

  const handleSearch = () => loadAnime(true);
  const handleLoadMore = () => loadAnime(false);
  const closeModal = () => setSelectedAnime(null);
  const openModal = (anime: ShikimoriAnime) => setSelectedAnime(anime);

  const getStatusText = (status: string) => {
    const map: Record<string, string> = {
      released: 'Вышедшее',
      ongoing: 'Онгоинг',
      anons: 'Анонс',
    };
    return map[status] || status;
  };

  const getYear = (airedOn: string | null) => {
    if (!airedOn) return '—';
    const year = new Date(airedOn).getFullYear();
    return isNaN(year) ? '—' : String(year);
  };

  const getImageUrl = (anime: ShikimoriAnime) => {
    if (anime.image?.original) {
      if (anime.image.original.startsWith('/')) {
        return `https://shikimori.one${anime.image.original}`;
      }
      return anime.image.original;
    }
    return PLACEHOLDER_IMAGE;
  };

  return (
    <main className="container">
      <header className="anime-header">
        <h2>Аниме каталог</h2>
        <p className="subtitle">Поиск и просмотр аниме через Shikimori API</p>
      </header>

      <div className="controls">
        <div className="filter-group">
          <label htmlFor="search">Поиск аниме:</label>
          <input
            id="search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Введите название аниме..."
          />
        </div>
        <div className="filter-group">
          <label htmlFor="status">Статус:</label>
          <select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Все</option>
            <option value="released">Вышедшие</option>
            <option value="ongoing">Онгоинг</option>
            <option value="anons">Анонсировано</option>
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="kind">Тип:</label>
          <select id="kind" value={kind} onChange={(e) => setKind(e.target.value)}>
            <option value="">Все</option>
            <option value="tv">TV Сериал</option>
            <option value="movie">Фильм</option>
            <option value="ova">OVA</option>
            <option value="ona">ONA</option>
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="order">Сортировка:</label>
          <select id="order" value={order} onChange={(e) => setOrder(e.target.value)}>
            <option value="popularity">По популярности</option>
            <option value="ranked">По рейтингу</option>
            <option value="name">По названию</option>
            <option value="aired_on">По дате выхода</option>
          </select>
        </div>
        <div className="button-group">
          <button className="search-btn" onClick={handleSearch} disabled={loading}>
            Поиск
          </button>
          {/* ⚠️ "Загрузить ещё" НЕ здесь */}
        </div>
      </div>

      {loading && <Loading />}
      {error && <ErrorDisplay message={error} />}

      <div className="anime-list">
        {animeList.map((anime) => (
          <div key={anime.id} className="anime-item" onClick={() => openModal(anime)}>
            <div className="anime-image">
              <img
                src={getImageUrl(anime)}
                alt={anime.russian || anime.name}
                onError={(e) => (e.currentTarget.src = PLACEHOLDER_IMAGE)}
              />
              {anime.score > 0 && <div className="anime-score">★ {anime.score}</div>}
            </div>
            <div className="anime-content">
              <h3 className="anime-title">{anime.russian || anime.name}</h3>
              {anime.japanese?.[0] && (
                <p className="anime-japanese-title">{anime.japanese[0]}</p>
              )}
              <div className="anime-info">
                <span className="anime-episodes">Эпизоды: {anime.episodes || '?'}</span>
                <span className="anime-status">{getStatusText(anime.status)}</span>
              </div>
              <div className="anime-year">Год: {getYear(anime.aired_on)}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ Кнопка "Загрузить ещё" — в самом низу */}
      {hasMore && (
        <div className="load-more-container">
          <button
            className="next-btn"
            onClick={handleLoadMore}
            disabled={loading}
          >
            Загрузить еще
          </button>
        </div>
      )}

      {/* Modal */}
      {selectedAnime && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-background" onClick={closeModal}></div>
          <div className="modal-container">
            <span className="close" onClick={closeModal}>&times;</span>
            <div className="modal-content">
              <div className="modal-image-section">
                <img
                  src={getImageUrl(selectedAnime)}
                  alt={selectedAnime.russian || selectedAnime.name}
                  className="modal-image"
                  onError={(e) => (e.currentTarget.src = PLACEHOLDER_IMAGE)}
                />
              </div>
              <div className="modal-info-section">
                <h3 className="modal-title">{selectedAnime.russian || selectedAnime.name}</h3>
                {selectedAnime.japanese?.[0] && (
                  <p className="modal-japanese-title">{selectedAnime.japanese[0]}</p>
                )}
                <div className="modal-stats">
                  <div className="stat-item">
                    <span className="stat-label">Рейтинг:</span>
                    <span className="stat-value score">{selectedAnime.score || 'N/A'}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Эпизоды:</span>
                    <span className="stat-value">{selectedAnime.episodes || '?'}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Статус:</span>
                    <span className="stat-value">{getStatusText(selectedAnime.status)}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Год:</span>
                    <span className="stat-value">{getYear(selectedAnime.aired_on)}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Тип:</span>
                    <span className="stat-value">{selectedAnime.kind ? selectedAnime.kind.toUpperCase() : '—'}</span>
                  </div>
                </div>
                <div className="modal-links">
                  <a
                    href={`https://shikimori.one/animes/z${selectedAnime.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="source-link"
                  >
                    Открыть в Shikimori
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default AnimeCatalog;