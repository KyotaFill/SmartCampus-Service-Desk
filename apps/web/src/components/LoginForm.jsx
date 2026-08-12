import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ApiError } from '../api/client.js';
import { useAuth } from '../auth/context.js';
import Icon from './Icon.jsx';

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = form.get('email').trim();
    const password = form.get('password');
    const remember = form.get('remember') === 'on';
    const nextErrors = {};

    if (!email) nextErrors.email = 'Vui lòng nhập email trường.';
    else if (!/^\S+@\S+\.\S+$/.test(email)) nextErrors.email = 'Email chưa đúng định dạng.';
    if (!password) nextErrors.password = 'Vui lòng nhập mật khẩu.';

    setErrors(nextErrors);
    setSubmitError('');
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      await login({ email, password }, remember);
      const destination = location.state?.from?.pathname ?? '/dashboard';
      navigate(destination, { replace: true });
    } catch (error) {
      if (error instanceof ApiError) {
        const fieldErrors = Object.fromEntries(
          (error.details ?? []).map((detail) => [detail.field, detail.message])
        );
        setErrors(fieldErrors);
        setSubmitError(error.message);
      } else {
        setSubmitError('Đã xảy ra lỗi. Vui lòng thử lại.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="login-form" onSubmit={handleSubmit} noValidate>
      <div className="form-field">
        <label htmlFor="email">Email trường</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="name@smartcampus.edu.vn"
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && <span className="field-error" id="email-error">{errors.email}</span>}
      </div>

      <div className="form-field">
        <div className="label-row">
          <label htmlFor="password">Mật khẩu</label>
          <button className="text-button" type="button">Quên mật khẩu?</button>
        </div>
        <div className="password-field">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Nhập mật khẩu"
            autoComplete="current-password"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? 'password-error' : undefined}
          />
          <button
            className="password-toggle"
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
          >
            <Icon name="eye" size={19} />
          </button>
        </div>
        {errors.password && <span className="field-error" id="password-error">{errors.password}</span>}
      </div>

      <label className="remember-option">
        <input name="remember" type="checkbox" />
        <span>Ghi nhớ đăng nhập trên thiết bị này</span>
      </label>

      {submitError && <p className="form-alert" role="alert">{submitError}</p>}

      <button className="primary-button" type="submit" disabled={submitting} aria-busy={submitting}>
        {submitting ? 'Đang đăng nhập…' : 'Đăng nhập'}
        {!submitting && <Icon name="arrow" size={18} />}
      </button>
    </form>
  );
}
