import { useState } from 'react';
import DashboardSidebar from '../components/DashboardSidebar.jsx';
import Icon from '../components/Icon.jsx';

const stats = [
  { label: 'Tổng yêu cầu', value: '24', note: '+3 trong tuần này', tone: 'blue', icon: 'ticket' },
  { label: 'Đang xử lý', value: '08', note: '2 yêu cầu ưu tiên cao', tone: 'amber', icon: 'settings' },
  { label: 'Đã giải quyết', value: '16', note: 'Tỉ lệ hoàn thành 67%', tone: 'green', icon: 'dashboard' }
];

const tickets = [
  { id: '#SC-2048', title: 'Không truy cập được cổng học tập', category: 'Công nghệ thông tin', priority: 'Khẩn cấp', status: 'Đang xử lý', date: '12/08/2026', priorityTone: 'urgent', statusTone: 'progress' },
  { id: '#SC-2047', title: 'Cập nhật thông tin sinh viên', category: 'Phòng Đào tạo', priority: 'Trung bình', status: 'Mới', date: '12/08/2026', priorityTone: 'medium', statusTone: 'open' },
  { id: '#SC-2046', title: 'Điều hòa phòng B204 gặp sự cố', category: 'Cơ sở vật chất', priority: 'Cao', status: 'Đã giải quyết', date: '11/08/2026', priorityTone: 'high', statusTone: 'resolved' },
  { id: '#SC-2045', title: 'Đăng ký mượn phòng tự học', category: 'Công tác sinh viên', priority: 'Thấp', status: 'Đã đóng', date: '10/08/2026', priorityTone: 'low', statusTone: 'closed' }
];

export default function DashboardPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="dashboard-layout">
      <DashboardSidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="dashboard-main">
        <header className="topbar">
          <button
            className="icon-button topbar__menu"
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Mở menu"
            aria-expanded={menuOpen}
            aria-controls="dashboard-sidebar"
          >
            <Icon name="menu" />
          </button>
          <div className="topbar__search">
            <Icon name="search" size={19} />
            <input aria-label="Tìm kiếm" placeholder="Tìm kiếm yêu cầu..." />
            <kbd>⌘ K</kbd>
          </div>
          <div className="topbar__actions">
            <button className="icon-button notification-button" type="button" aria-label="Thông báo">
              <Icon name="bell" />
              <span />
            </button>
            <div className="user-menu">
              <div className="avatar">NK</div>
              <div className="user-menu__text"><strong>Nguyễn Minh Kiên</strong><small>Quản trị viên</small></div>
              <span className="user-menu__chevron">⌄</span>
            </div>
          </div>
        </header>

        <main className="dashboard-content">
          <div className="page-heading">
            <div>
              <p className="eyebrow">Thứ Tư, 12 tháng 8</p>
              <h1>Chào buổi sáng, Kiên!</h1>
              <p>Đây là tình hình hỗ trợ trong khuôn viên hôm nay.</p>
            </div>
            <button className="primary-button primary-button--compact" type="button" title="Sẽ được phát triển ở bước tiếp theo"><Icon name="plus" size={18} />Tạo yêu cầu</button>
          </div>

          <section className="stats-grid" aria-label="Thống kê yêu cầu">
            {stats.map((stat) => (
              <article className="stat-card" key={stat.label}>
                <div className={`stat-card__icon stat-card__icon--${stat.tone}`}><Icon name={stat.icon} /></div>
                <div><p>{stat.label}</p><strong>{stat.value}</strong><small>{stat.note}</small></div>
              </article>
            ))}
          </section>

          <section className="tickets-card">
            <div className="section-heading">
              <div><h2>Yêu cầu gần đây</h2><p>Theo dõi những cập nhật mới nhất</p></div>
              <button type="button" title="Sẽ được phát triển ở bước tiếp theo">Xem tất cả <Icon name="arrow" size={16} /></button>
            </div>
            <div className="table-scroll">
              <table>
                <thead><tr><th>Mã yêu cầu</th><th>Nội dung</th><th>Ưu tiên</th><th>Trạng thái</th><th>Ngày tạo</th><th aria-label="Thao tác" /></tr></thead>
                <tbody>
                  {tickets.map((ticket) => (
                    <tr key={ticket.id}>
                      <td><strong className="ticket-id">{ticket.id}</strong></td>
                      <td><strong className="ticket-title">{ticket.title}</strong><small className="ticket-category">{ticket.category}</small></td>
                      <td><span className={`badge badge--${ticket.priorityTone}`}>{ticket.priority}</span></td>
                      <td><span className={`badge badge--${ticket.statusTone}`}><i />{ticket.status}</span></td>
                      <td>{ticket.date}</td>
                      <td><button className="row-action" type="button" aria-label={`Xem ${ticket.id}`}>•••</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
