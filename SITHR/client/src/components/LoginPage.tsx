import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
    }
    setLoading(false);
  };

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
    } else {
      setSignUpSuccess(true);
    }
    setLoading(false);
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setSignUpSuccess(false);
    setConfirmPassword('');
  };

  if (signUpSuccess) {
    return (
      <div className="login-page">
        <div className="login-card">
          <div className="login-header">
            <h1 className="login-title">SIT-HR</h1>
            <p className="login-subtitle">HR Advisory</p>
            <p className="login-company">LWBC Solutions Ltd</p>
          </div>
          <div className="signup-success">
            <p>Account created successfully. Please check your email to confirm your account, then sign in.</p>
            <button className="login-btn" onClick={toggleMode}>
              Back to Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">SIT-HR</h1>
          <p className="login-subtitle">HR Advisory</p>
          <p className="login-company">LWBC Solutions Ltd</p>
        </div>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
            />
          </div>

          {isSignUp && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
                autoComplete="new-password"
              />
            </div>
          )}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Please wait...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div className="login-toggle">
          {isSignUp ? (
            <button className="link-btn" onClick={toggleMode}>
              Back to sign in
            </button>
          ) : (
            <button className="link-btn" onClick={toggleMode}>
              Create account
            </button>
          )}
        </div>

        <div className="login-legal-links">
          <Link to="/privacy">Privacy Policy</Link>
          <span className="login-legal-separator">|</span>
          <Link to="/terms">Terms of Use</Link>
        </div>
      </div>
    </div>
  );
}
