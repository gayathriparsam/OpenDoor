import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';
import '../styles/login.css';

const MockGoogleAuth = () => {
    const navigate = useNavigate();
    const { loginWithGoogle } = useAuth();
    const [step, setStep] = useState(0); // 0: Email Input, 1: Loading/Redirect
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleNext = (e) => {
        e.preventDefault();
        if (!email.includes('@')) {
            alert("Please enter a valid email address.");
            return;
        }
        setIsLoading(true);
        setStep(1); // Move to loading state

        // Simulate Authenticating with Google
        setTimeout(() => {
            loginWithGoogle(email);
            navigate('/dashboard');
        }, 1500);
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', fontFamily: "'Roboto', sans-serif", background: '#f0f2f5' }}>

            {/* Google Card */}
            <div style={{
                background: '#fff',
                width: '450px',
                minHeight: '500px',
                borderRadius: '8px',
                padding: '48px 40px 36px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>

                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width="48" height="48" style={{ marginBottom: '16px' }} />

                {step === 0 ? (
                    <>
                        <h2 style={{ fontSize: '24px', fontWeight: '400', color: '#202124', marginBottom: '8px' }}>Sign in</h2>
                        <p style={{ fontSize: '16px', color: '#202124', marginBottom: '40px' }}>to continue to OpenDoor</p>

                        <form onSubmit={handleNext} style={{ width: '100%' }}>
                            <div style={{ marginBottom: '40px', position: 'relative' }}>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email or phone"
                                    style={{
                                        width: '100%',
                                        padding: '13px 15px',
                                        fontSize: '16px',
                                        border: '1px solid #dadce0',
                                        borderRadius: '4px',
                                        outline: 'none',
                                        color: '#202124'
                                    }}
                                    autoFocus
                                    required
                                />
                            </div>

                            <div style={{ fontSize: '14px', color: '#1a73e8', fontWeight: '500', marginBottom: '40px', cursor: 'pointer' }}>
                                Forgot email?
                            </div>

                            <div style={{ fontSize: '14px', color: '#5f6368', marginBottom: '40px', lineHeight: '1.4' }}>
                                Not your computer? Use Guest mode to sign in privately. <br />
                                <span style={{ color: '#1a73e8', cursor: 'pointer', fontWeight: '500' }}>Learn more</span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ color: '#1a73e8', fontWeight: '500', fontSize: '14px', cursor: 'pointer' }}>
                                    Create account
                                </div>
                                <button
                                    type="submit"
                                    style={{
                                        background: '#1a73e8',
                                        color: '#fff',
                                        border: 'none',
                                        padding: '10px 24px',
                                        borderRadius: '4px',
                                        fontWeight: '500',
                                        cursor: 'pointer',
                                        fontSize: '14px'
                                    }}
                                >
                                    Next
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <>
                        <h2 style={{ fontSize: '24px', fontWeight: '400', color: '#202124', marginBottom: '16px' }}>Welcome</h2>
                        <div style={{ border: '1px solid #dadce0', borderRadius: '20px', padding: '4px 12px 4px 4px', display: 'flex', alignItems: 'center', marginBottom: '40px', fontSize: '14px', fontWeight: '500', color: '#3c4043' }}>
                            <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#1a73e8', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '8px', fontSize: '12px' }}>
                                {email[0]?.toUpperCase()}
                            </div>
                            {email}
                        </div>

                        <Loader2 className="animate-spin text-blue-500 mb-6" size={32} />
                        <p style={{ color: '#5f6368', fontSize: '14px' }}>Redirecting...</p>
                    </>
                )}
            </div>

            <div style={{ width: '450px', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#5f6368', marginTop: '24px' }}>
                <div>English (United States)</div>
                <div style={{ display: 'flex', gap: '24px' }}>
                    <span>Help</span>
                    <span>Privacy</span>
                    <span>Terms</span>
                </div>
            </div>
        </div>
    );
};

export default MockGoogleAuth;
