import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

function App() {
  return (
    <main className="welcome">
      <section className="welcome__card">
        <span className="welcome__eyebrow">TEAM 4 · SPRINT 1</span>
        <h1>SmartCampus Service Desk</h1>
        <p>Nền tảng tiếp nhận và xử lý yêu cầu hỗ trợ trong trường học.</p>
        <p className="welcome__status">Bộ khung dự án đã sẵn sàng.</p>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);

