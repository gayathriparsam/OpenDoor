import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, ArrowRight } from 'lucide-react';
import '../styles/login.css';

const Login = () => {
    // View State: 'LOGIN' | 'SIGNUP' | 'VERIFY' | 'SUCCESS'
    const [view, setView] = useState('LOGIN');

    // Form States
    const [loginData, setLoginData] = useState({ email: '', password: '', role: 'Admin' });
    const [signupData, setSignupData] = useState({ fullName: '', phone: '', email: '', password: '', role: 'Admin' });
    const [verificationCode, setVerificationCode] = useState('');
    const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: '' }); // 0-3
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [demoCode, setDemoCode] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    // Password Strength Logic
    useEffect(() => {
        const pass = signupData.password;
        let score = 0;
        if (!pass) {
            setPasswordStrength({ score: 0, label: '' });
            return;
        }

        if (pass.length > 5) score += 1;
        if (pass.length >= 10) score += 1;
        if (/[A-Z]/.test(pass) && /[0-9]/.test(pass)) score += 1;

        const labels = ['Weak', 'Fair', 'Strong', 'Strong'];
        setPasswordStrength({ score, label: labels[score] });
    }, [signupData.password]);

    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!isValidEmail(loginData.email)) {
            setError('Please enter a valid email address.');
            return;
        }

        setIsLoading(true);

        // Mock API Call for Login (Backend login wasn't requested, keeping mock)
        setTimeout(() => {
            if (login(loginData.email, loginData.password, loginData.role)) {
                navigate(loginData.role === 'Admin' ? '/dashboard' : '/simulator');
            } else {
                // For demo, allow any login
                login(loginData.email, loginData.password, loginData.role);
                navigate(loginData.role === 'Admin' ? '/dashboard' : '/simulator');
            }
            setIsLoading(false);
        }, 1500);
    };

    const handleSignupSubmit = async (e) => {
        e.preventDefault();

        if (!isValidEmail(signupData.email)) {
            setError('Please enter a valid email address.');
            return;
        }

        if (signupData.password.length < 10) {
            setError('Password must be at least 10 characters.');
            return;
        }
        setError('');
        setIsLoading(true);

        try {
            // Updated to use the backend running on port 3001
            const response = await fetch('http://localhost:3001/api/send-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: signupData.email })
            });

            const data = await response.json();

            if (data.success) {
                // If backend provides a debug code (dev mode), save it to show in UI
                if (data.debugCode) {
                    setDemoCode(data.debugCode);
                }
                setView('VERIFY');
            } else {
                setError(data.message || 'Failed to send verification code.');
            }
        } catch (err) {
            console.error(err);
            setError(err.message || 'Failed to connect to server. Ensure backend/.env is configured and server is running.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifySubmit = async (e) => {
        e.preventDefault();
        if (verificationCode.length < 6) {
            setError('Please enter a valid 6-digit code.');
            return;
        }
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:3001/api/verify-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: signupData.email, code: verificationCode })
            });

            const data = await response.json();

            if (data.success) {
                setView('SUCCESS');
            } else {
                setError(data.message || 'Verification failed.');
            }
        } catch (err) {
            console.error(err);
            setError('Verification error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleAuth = () => {
        setIsLoading(true);
        // This redirects to the Mock Google Page which then signs the user in
        // In a real app, this would trigger the window.google.accounts.id popup
        setTimeout(() => {
            navigate('/google-auth');
        }, 800);
    };

    // Render Components
    const renderLogo = () => (
        <div className="login-header">
            <div className="logo-circle-container" style={{ justifyContent: 'center', flexDirection: 'column', gap: '15px' }}>
                <div className="logo-circle" style={{ width: '80px', height: '80px', paddingBottom: '10px' }}>
                    <div className="logo-buildings" style={{ gap: '2px' }}>
                        <div className="b-1" style={{ width: '15px', height: '30px' }}></div>
                        <div className="b-2" style={{ width: '20px', height: '50px' }}></div>
                        <div className="b-3" style={{ width: '15px', height: '35px' }}></div>
                    </div>
                </div>
                <div className="logo-text-serif">OpenDoor</div>
            </div>
        </div>
    );

    if (view === 'SUCCESS') {
        return (
            <div className="login-container">
                <div className="login-glass-panel">
                    <div className="success-view">
                        <CheckCircle className="success-icon animate-bounce" />
                        <h2 className="success-title">You are all set!</h2>
                        <p className="text-secondary mb-6">Your account has been successfully verified.</p>
                        <button className="btn-login" onClick={() => {
                            // Ensure user is logged in upon success before navigating
                            login(signupData.email, signupData.password, signupData.role);
                            navigate(signupData.role === 'Admin' ? '/dashboard' : '/simulator');
                        }}>
                            Go to {signupData.role === 'Admin' ? 'Dashboard' : 'Simulator'} <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (view === 'VERIFY') {
        return (
            <div className="login-container">
                <div className="login-glass-panel">
                    {renderLogo()}
                    <h3 className="login-title text-center">Verify your email</h3>
                    <p className="text-center text-sm text-secondary mb-2">
                        We sent a code to <b>{signupData.email}</b>.
                    </p>

                    <form onSubmit={handleVerifySubmit} className="login-form">
                        <div className="form-group">
                            <div className="input-wrapper">
                                <input
                                    type="text"
                                    placeholder="Enter verification code"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                    className="text-center tracking-widest text-lg"
                                    maxLength={6}
                                    autoFocus
                                />
                            </div>
                        </div>
                        {error && <div className="error-msg">{error}</div>}
                        <button type="submit" className="btn-login" disabled={isLoading}>
                            {isLoading ? 'Verifying...' : 'Verify Email'}
                        </button>
                    </form>

                    <div className="login-footer">
                        <button className="text-link" onClick={() => setView('SIGNUP')}>Back</button>
                    </div>
                </div>
            </div>
        );
    }

    // LOGIN VIEW
    if (view === 'LOGIN') {
        return (
            <div className="login-container">
                <div className="login-glass-panel">
                    {renderLogo()}

                    <h2 className="text-xl font-bold text-center mb-6">Welcome back!</h2>

                    <button className="btn-google mb-6" onClick={handleGoogleAuth} style={{ border: '1px solid #dadce0', height: '48px', borderRadius: '8px' }}>
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width="20" height="20" />
                        <span style={{ fontWeight: '500' }}>Sign in with Google</span>
                    </button>

                    <div className="divider">OR USE EMAIL</div>

                    <form onSubmit={handleLoginSubmit} className="login-form">
                        <div className="form-group">
                            <div className="input-wrapper">
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    value={loginData.email}
                                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="input-wrapper">
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={loginData.password}
                                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group role-selection-group">
                            <label className="input-label">I am an:</label>
                            <select
                                className="role-select"
                                value={loginData.role}
                                onChange={(e) => setLoginData({ ...loginData, role: e.target.value })}
                            >
                                <option value="Admin">Admin</option>
                                <option value="User">User</option>
                            </select>
                        </div>

                        <a href="#" className="forgot-password">Forgot password?</a>

                        <button type="submit" className="btn-login" disabled={isLoading}>
                            {isLoading ? 'Logging in...' : 'LOGIN →'}
                        </button>

                        <div className="remember-me">
                            <input type="checkbox" id="remember" />
                            <label htmlFor="remember" style={{ display: 'inline' }}>Remember me</label>
                        </div>
                    </form>



                    <div className="login-footer">
                        Don't have an account? <button className="text-link" onClick={() => setView('SIGNUP')}>Sign up</button>
                    </div>
                </div>
            </div>
        );
    }

    // SIGNUP VIEW (Default Fallback)
    return (
        <div className="login-container">
            <div className="login-glass-panel">
                {renderLogo()}

                <h2 className="text-xl font-bold text-center mb-6">Create your account</h2>

                <button className="btn-google mb-6" onClick={handleGoogleAuth} style={{ border: '1px solid #dadce0', height: '48px', borderRadius: '8px' }}>
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width="20" height="20" />
                    <span style={{ fontWeight: '500' }}>Sign up with Google</span>
                </button>

                <div className="divider">OR FILL OUT FORM</div>

                <form onSubmit={handleSignupSubmit} className="login-form">
                    <div className="form-group">
                        <div className="input-wrapper">
                            <input
                                type="text"
                                placeholder="Full name"
                                value={signupData.fullName}
                                onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="input-wrapper">
                            <input
                                type="tel"
                                placeholder="Cell phone"
                                value={signupData.phone}
                                onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="input-wrapper">
                            <input
                                type="email"
                                placeholder="Email"
                                value={signupData.email}
                                onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-group role-selection-group">
                        <label className="input-label">Register as:</label>
                        <select
                            className="role-select"
                            value={signupData.role}
                            onChange={(e) => setSignupData({ ...signupData, role: e.target.value })}
                        >
                            <option value="Admin">Admin</option>
                            <option value="User">User</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <div className="input-wrapper">
                            <input
                                type="password"
                                placeholder="Password (at least 10 characters)"
                                value={signupData.password}
                                onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                                required
                            />
                        </div>
                        {/* Password Strength Meter */}
                        {signupData.password && (
                            <div className="password-strength">
                                <div className="strength-bars">
                                    <div className={`bar ${passwordStrength.score >= 1 ? 'filled ' + (passwordStrength.score === 1 ? 'weak' : passwordStrength.score === 2 ? 'medium' : 'strong') : ''}`}></div>
                                    <div className={`bar ${passwordStrength.score >= 2 ? 'filled ' + (passwordStrength.score === 2 ? 'medium' : 'strong') : ''}`}></div>
                                    <div className={`bar ${passwordStrength.score >= 3 ? 'filled strong' : ''}`}></div>
                                </div>
                                <div className="strength-text">{passwordStrength.label}</div>
                            </div>
                        )}
                        <div className="password-hint">Passwords must be 10 characters</div>
                    </div>

                    {error && <div className="error-msg">{error}</div>}

                    <button type="submit" className="btn-login" disabled={isLoading}>
                        {isLoading ? 'Signing up...' : 'Sign Up'}
                    </button>
                </form>

                <div className="login-footer">
                    Already have an account? <button className="text-link" onClick={() => setView('LOGIN')}>Log In</button>
                </div>
            </div>
        </div>
    );
};

export default Login;
