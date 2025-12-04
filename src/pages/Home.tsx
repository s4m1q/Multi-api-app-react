// src/pages/Home.tsx
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container">
      <div className="hero">
        <h2>Добро пожаловать в API-приложение</h2>
        <p>Исследуйте различные сервисы и функции</p>
      </div>
      <div className="cards">
        <Link to="/currency" className="card">
          <h3>Курс валют</h3>
          <p>Актуальные курсы валют с обновлением в реальном времени</p>
        </Link>
        <Link to="/waifu" className="card">
          <h3>Аниме арты</h3>
          <p>Коллекция аниме изображений с возможностью поиска по тегам</p>
        </Link>
        <Link to="/anime" className="card">
          <h3>Аниме каталог</h3>
          <p>Поиск и просмотр аниме через Shikimori API с детальной информацией</p>
        </Link>
      </div>
    </div>
  );
};

export default Home;