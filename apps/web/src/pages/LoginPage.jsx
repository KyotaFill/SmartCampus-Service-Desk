import AppLogo from '../components/AppLogo.jsx';
import LoginForm from '../components/LoginForm.jsx';

export default function LoginPage() {
  return (
    <main className="login-page">
      <section className="login-visual" aria-label="Giới thiệu SmartCampus Service Desk">
        <AppLogo inverse />
        <div className="login-visual__content">
          <span className="eyebrow eyebrow--light">Cổng hỗ trợ sinh viên</span>
          <h1>Mọi yêu cầu,<br />một nơi xử lý.</h1>
          <p>Gửi yêu cầu, theo dõi tiến độ và trao đổi trực tiếp với bộ phận phụ trách trong trường.</p>
        </div>
        <div className="login-visual__art" aria-hidden="true">
          <span className="art-ring art-ring--one" />
          <span className="art-ring art-ring--two" />
          <span className="art-dot art-dot--one" />
          <span className="art-dot art-dot--two" />
          <div className="art-card art-card--main">
            <span className="art-icon">✓</span>
            <span><strong>Yêu cầu đã tiếp nhận</strong><small>#SC-2048 · Phòng Đào tạo</small></span>
          </div>
          <div className="art-card art-card--small">
            <span className="status-dot" />
            Đang xử lý
          </div>
        </div>
        <p className="login-visual__footer">© 2026 SmartCampus · Team 4</p>
      </section>

      <section className="login-panel">
        <div className="login-panel__mobile-logo"><AppLogo /></div>
        <div className="login-panel__content">
          <span className="eyebrow">Chào mừng trở lại</span>
          <h2>Đăng nhập vào hệ thống</h2>
          <p className="login-panel__intro">Sử dụng tài khoản trường để tiếp tục.</p>
          <LoginForm />
        </div>
        <p className="support-link">Cần trợ giúp? <a href="mailto:support@smartcampus.edu.vn">Liên hệ bộ phận kỹ thuật</a></p>
      </section>
    </main>
  );
}
