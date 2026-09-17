
import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Decides where a user lands after login.
// Must match the actual routes in App.jsx.
export function getRedirectPath(user) {
  if (!user) return '/login';

  if (user.role === 'super_admin') return '/super-admin';

  if (user.role === 'admin') return '/dashboard';

  if (user.role === 'staff') {
    if (user.staffRole === 'Counsellor') return '/Cdashboard';
    return '/Sdashboard';
  }

  if (user.role === 'student') return '/Stdashboard';

  if (user.role === 'teacher') return '/Tdashboard';

  if (user.role === 'bursar') return '/Bdashboard';

  if (user.role === 'parent') return '/Pdashboard';

  // Unknown/unhandled role
  return '/login';
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { login, user } = useAuth();
  const navigate = useNavigate();

  if (user) {
    return <Navigate to={getRedirectPath(user)} replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const result = await login(email, password);

    console.log('Login result:', result);

    if (result.success) {
      navigate(getRedirectPath(result.user));
    } else {
      setError(result.message);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-header">
          <div className="brand-icon-lg">E</div>
          <h1>EduNigeria</h1>
          <p>School Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">

          {error && (
            <div className="error-msg">
              {error}
            </div>
          )}

          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@school.ng"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>

          <button type="submit" className="btn-primary">
            Sign In
          </button>

        </form>
      </div>
    </div>
  );
}

