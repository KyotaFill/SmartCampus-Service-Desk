import { NavLink } from 'react-router-dom';
import AppLogo from './AppLogo.jsx';
import Icon from './Icon.jsx';

const navItems = [
  { label: 'Tổng quan', icon: 'dashboard', to: '/dashboard' },
  { label: 'Danh sách yêu cầu', icon: 'ticket' },
  { label: 'Tạo yêu cầu mới', icon: 'plus' },
  { label: 'Người dùng', icon: 'users' }
];

export default function DashboardSidebar({ open, onClose }) {
  return (
    <>
      {open && <button className="sidebar-backdrop" type="button" onClick={onClose} aria-label="Đóng menu" />}
      <aside className={`sidebar${open ? ' sidebar--open' : ''}`}>
        <div className="sidebar__brand">
          <AppLogo />
          <button className="icon-button sidebar__close" type="button" onClick={onClose} aria-label="Đóng menu">
            <Icon name="close" />
          </button>
        </div>
        <nav className="sidebar__nav" aria-label="Điều hướng chính">
          <p className="sidebar__label">Không gian làm việc</p>
          {navItems.map((item) => item.to ? (
            <NavLink key={item.label} to={item.to} className={({ isActive }) => `nav-item${isActive ? ' nav-item--active' : ''}`} onClick={onClose}>
              <Icon name={item.icon} /><span>{item.label}</span>
            </NavLink>
          ) : (
            <button key={item.label} className="nav-item nav-item--future" type="button" title="Sẽ được phát triển ở bước tiếp theo">
              <Icon name={item.icon} /><span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar__footer">
          <a className="nav-item" href="#settings"><Icon name="settings" /><span>Cài đặt</span></a>
          <div className="sidebar-help">
            <span className="sidebar-help__icon">?</span>
            <div><strong>Bạn cần hỗ trợ?</strong><small>Xem hướng dẫn sử dụng</small></div>
            <Icon name="arrow" size={16} />
          </div>
        </div>
      </aside>
    </>
  );
}
