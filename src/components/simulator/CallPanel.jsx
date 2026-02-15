import React, { useEffect, useRef, useState } from 'react';
import { Play, RotateCcw, MessageSquare, Mic, User, Bot } from 'lucide-react';
import { useCall } from '../../context/CallContext';
import '../../styles/simulator.css';
import SentimentGauge from './SentimentGauge';

const CallPanel = () => {
    const { isPlaying, messages, startCall, playNextLine, resetSimulation, mode, setMode, lead, addUserMessage, processVoicemail, isProcessing, processingStep, processUserVoice, currentAudioClip, quickReplies, sentiment } = useCall();
    const transcriptRef = useRef(null);
    const [inputValue, setInputValue] = useState('');
    const [isListening, setIsListening] = useState(false);

    const handleMicClick = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    const startListening = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert("Browser does not support speech recognition. Please use Chrome.");
            return;
        }

        // Stop AI from speaking when user wants to talk
        window.speechSynthesis.cancel();

        const recognition = new window.webkitSpeechRecognition();
        recognition.continuous = true; // CHANGED: Don't stop automatically on pause
        recognition.interimResults = true; // Enable real-time feedback
        recognition.lang = 'en-US';

        // Store recognition instance to stop it later
        window.currentRecognition = recognition;

        recognition.onstart = () => {
            setIsListening(true);
            setInputValue(''); // Clear previous input
        };

        let silenceTimer = null;

        recognition.onresult = (event) => {
            let interim = '';
            let final = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    final += event.results[i][0].transcript;
                } else {
                    interim += event.results[i][0].transcript;
                }
            }

            // Clear existing silence timer on every new result
            if (silenceTimer) clearTimeout(silenceTimer);

            if (final) {
                console.log('Final:', final);
                if (final.trim().length > 0) {
                    processUserVoice(final);
                    setInputValue('');
                    stopListening();
                }
            } else if (interim) {
                setInputValue(interim);

                // If the user pauses for 1.2 seconds, treat interim as final
                silenceTimer = setTimeout(() => {
                    console.log('Silence detected, forcing final:', interim);
                    if (interim.trim().length > 0) {
                        processUserVoice(interim);
                        setInputValue('');
                        stopListening();
                    }
                }, 1200);
            }
        };

        recognition.onerror = (event) => {
            console.error('Speech error', event.error);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.start();
    };

    const stopListening = () => {
        if (window.currentRecognition) {
            window.currentRecognition.stop();
            window.currentRecognition = null;
        }
        setIsListening(false);
    };

    const handleSendMessage = () => {
        if (!inputValue.trim()) return;
        addUserMessage(inputValue);
        setInputValue('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    // Auto-scroll to bottom
    useEffect(() => {
        if (transcriptRef.current) {
            transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="call-panel glass-panel">
            {/* 1) Call Controls */}
            <div className="panel-header">
                <div className="controls-left">
                    <button className="btn btn-primary" onClick={() => startCall('Buyer')} disabled={isPlaying && messages.length > 0}>
                        <Play size={16} />
                        Start Call
                    </button>
                    <button className="btn btn-outline" onClick={() => processVoicemail()} disabled={isProcessing}>
                        {isProcessing ? 'Processing' : 'Upload Call'}
                    </button>
                    <button className="btn btn-outline" onClick={() => playNextLine()} disabled={!isPlaying}>
                        Play Next
                    </button>
                    <button className="btn btn-ghost" onClick={resetSimulation}>
                        <RotateCcw size={16} />
                    </button>
                </div>

                <div className="flex gap-2">
                    <button className="btn btn-sm btn-outline text-xs" onClick={() => startCall('Just Browsing')}>
                        Demo: Browsing
                    </button>
                    <button className="btn btn-sm btn-outline text-xs" onClick={() => startCall('Invalid JSON')}>
                        Demo: Error
                    </button>
                </div>

                <div className="mode-toggle">
                    <button
                        className={`toggle-btn ${mode === 'Call_Sim' ? 'active' : ''}`}
                        onClick={() => setMode('Call_Sim')}
                    >
                        Standard Sim
                    </button>
                    <button
                        className={`toggle-btn ${mode === 'Interactive' ? 'active' : ''}`}
                        onClick={() => setMode('Interactive')}
                    >
                        Interactive Voice
                    </button>
                </div>
            </div>

            {/* LIVE SENTIMENT GAUGE */}
            <div style={{ padding: '0 20px', marginTop: '10px' }}>
                <SentimentGauge score={sentiment} />
            </div>

            {/* 2) Transcript Window */}
            <div className="transcript-window" ref={transcriptRef}>
                {/* Processing Overlay */}
                {isProcessing && (
                    <div className="processing-overlay">
                        <div className="spinner"></div>
                        <div className="processing-text">{processingStep}</div>
                        <div className="processing-steps">
                            <div className={`step-dot ${processingStep.includes('Transcribing') ? 'active' : 'done'}`}></div>
                            <div className={`step-dot ${processingStep.includes('Analyzing') ? 'active' : (processingStep.includes('Transcribing') ? '' : 'done')}`}></div>
                            <div className={`step-dot ${processingStep.includes('Extracting') ? 'active' : (processingStep.includes('Transcribing') || processingStep.includes('Analyzing') ? '' : 'done')}`}></div>
                            <div className={`step-dot ${processingStep.includes('Scoring') ? 'active' : ''}`}></div>
                        </div>
                    </div>
                )}

                {/* Audio Playback Overlay */}
                {currentAudioClip && (
                    <div className="audio-overlay">
                        <div className="audio-wave">
                            <span></span><span></span><span></span><span></span><span></span>
                        </div>
                        <div className="audio-text">Playing: {currentAudioClip}</div>
                    </div>
                )}

                {messages.length === 0 && !isProcessing && (
                    <div className="empty-state">
                        <div className="icon-circle">
                            <Mic size={24} />
                        </div>
                        <p>Ready to start simulation.</p>
                        <span className="text-secondary text-sm">Click 'Start Call' to begin.</span>
                    </div>
                )}

                {messages.map((msg, idx) => (
                    <div key={idx} className={`message-bubble ${msg.role === 'agent' ? 'agent' : 'user'}`}>
                        <div className="msg-avatar">
                            {msg.role === 'agent' ? <Bot size={16} /> : <User size={16} />}
                        </div>
                        <div className="msg-content">
                            <div className="msg-meta">
                                <span className="msg-sender">{msg.role === 'agent' ? 'AI Agent' : 'Sarah (Lead)'}</span>
                                <span className="msg-time">{msg.timestamp}</span>
                            </div>
                            <p className="msg-text">{msg.text}</p>
                            {msg.type && <span className="msg-tag">{msg.type}</span>}
                        </div>
                    </div>
                ))}
            </div>

            {/* 3) Manual Input & Quick Replies */}
            <div className="input-area flex-col gap-2">
                {/* Quick Reply Chips */}
                {mode === 'Interactive' && quickReplies && quickReplies.length > 0 && (
                    <div className="quick-replies flex gap-2 overflow-x-auto pb-2 w-full no-scrollbar">
                        {quickReplies.map((reply, idx) => (
                            <button
                                key={idx}
                                className="chip-btn animate-fade-in"
                                onClick={() => processUserVoice(reply)}
                            >
                                {reply}
                            </button>
                        ))}
                    </div>
                )}

                <div className="flex w-full gap-2">
                    {mode === 'Interactive' ? (
                        <button
                            className={`btn btn-block ${isListening ? 'btn-danger' : 'btn-primary'}`}
                            onClick={handleMicClick}
                            style={{ width: '100%', justifyContent: 'center' }}
                        >
                            <Mic size={18} className={isListening ? 'animate-pulse' : ''} />
                            {isListening ? 'Listening... (Speak Now)' : 'Push to Speak'}
                        </button>
                    ) : (
                        <>
                            <input
                                type="text"
                                placeholder="Type caller response..."
                                className="chat-input"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                            <button className="btn btn-primary btn-sm" onClick={handleSendMessage}>
                                <MessageSquare size={16} />
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* 4) Reasoning Summary */}
            <div className="reasoning-box">
                <div className="reasoning-header">
                    <span className="reasoning-title">✨ AI Reasoning</span>
                </div>
                <p className="reasoning-text">
                    {lead.reasoning || "Waiting for interaction..."}
                </p>
            </div>
        </div>
    );
};

export default CallPanel;
