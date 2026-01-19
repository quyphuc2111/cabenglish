"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Volume2, Check, X, Trophy, Mic, MicOff, Square } from "lucide-react";
import { GameType, VocabularyItem } from "@/mock/data";

export type VocabularyQuestion = VocabularyItem;

type VocabularyGameProps = {
    data: VocabularyQuestion[];
    gameType?: GameType;
};

// ============================================
// TYPING GAME - Gõ lại từ vựng
// ============================================
function TypingGame({ data }: { data: VocabularyQuestion[] }) {
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [userInput, setUserInput] = useState("");
    const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
    const [score, setScore] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);

    const currentQuestion = data[currentQuestionIdx];
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setUserInput("");
        setFeedback(null);
        if (inputRef.current) inputRef.current.focus();
    }, [currentQuestionIdx]);

    const handlePlayAudio = () => {
        if (currentQuestion?.audio) {
            const audio = new Audio(currentQuestion.audio);
            audio.play().catch(console.error);
        }
    };

    const handleSubmit = () => {
        if (!currentQuestion) return;
        
        if (userInput.toLowerCase().trim() === currentQuestion.word.toLowerCase()) {
            setFeedback("correct");
            setScore((prev) => prev + 10);
            setTimeout(() => {
                if (currentQuestionIdx < data.length - 1) {
                    setCurrentQuestionIdx((prev) => prev + 1);
                } else {
                    setIsCompleted(true);
                }
            }, 1500);
        } else {
            setFeedback("incorrect");
        }
    };

    if (isCompleted) {
        return (
            <div className="w-full h-full bg-gradient-to-br from-green-400 to-teal-500 rounded-3xl flex flex-col items-center justify-center p-6">
                <div className="bg-white/90 backdrop-blur-md rounded-3xl p-12 text-center shadow-2xl">
                    <Trophy size={80} className="mx-auto text-yellow-500 mb-4" />
                    <h2 className="text-3xl font-bold text-green-600 mb-2">Hoàn thành!</h2>
                    <p className="text-5xl font-bold text-teal-600 mb-4">{score} ĐIỂM</p>
                    <Button 
                        onClick={() => {
                            setCurrentQuestionIdx(0);
                            setScore(0);
                            setIsCompleted(false);
                        }}
                        className="bg-teal-500 hover:bg-teal-600 rounded-full px-8 py-4 text-lg"
                    >
                        Chơi lại
                    </Button>
                </div>
            </div>
        );
    }

    if (!currentQuestion) return null;

    return (
        <div className="w-full h-full bg-[#E0F7FA] rounded-3xl relative overflow-hidden flex flex-col items-center justify-center p-6">
            <div className="absolute inset-0 z-0">
                <div className="absolute bottom-0 left-0 w-full h-1/3 bg-green-200 rounded-t-[50%]" />
                <div className="absolute top-10 right-10 w-20 h-20 bg-yellow-300 rounded-full opacity-80" />
            </div>

            <div className="z-10 w-full max-w-4xl flex flex-col items-center gap-8">
                <div className="w-full flex justify-between items-center px-4">
                    <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                        <span className="font-bold text-slate-700">Câu {currentQuestionIdx + 1}/{data.length}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm text-yellow-500 font-bold text-xl">
                        <Trophy size={24} />
                        <span>{score} ĐIỂM</span>
                    </div>
                </div>

                <div className="bg-white/40 backdrop-blur-md border border-white/50 rounded-[40px] p-10 shadow-xl w-full flex flex-col items-center relative">
                    <h2 className="text-2xl font-bold text-[#00897B] mb-8 bg-white/80 px-8 py-3 rounded-full shadow-sm">
                        ⌨️ Gõ lại từ vựng được nghe
                    </h2>

                    <div className="flex flex-col md:flex-row items-center gap-12 w-full justify-center">
                        <div className="relative group cursor-pointer" onClick={handlePlayAudio}>
                            <div className="w-48 h-48 bg-white rounded-3xl shadow-inner flex items-center justify-center border-4 border-[#4DD0E1] overflow-hidden relative">
                                <Image
                                    src={currentQuestion.image}
                                    alt={currentQuestion.word}
                                    width={160}
                                    height={160}
                                    className="object-contain"
                                    onError={(e) => {
                                        e.currentTarget.src = "https://via.placeholder.com/160?text=" + currentQuestion.word;
                                    }}
                                />
                            </div>
                            <div className="absolute -bottom-4 -right-4 bg-[#FF7043] text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform">
                                <Volume2 size={32} />
                            </div>
                        </div>

                        <div className="flex flex-col gap-6 items-center">
                            <div className="flex gap-2 flex-wrap justify-center">
                                {Array.from({ length: currentQuestion.word.length }).map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`w-12 h-14 rounded-xl border-b-4 flex items-center justify-center text-2xl font-bold transition-all
                                            ${userInput[idx]
                                                ? 'bg-white border-[#00ACC1] text-[#00838F] shadow-md -translate-y-1'
                                                : 'bg-black/10 border-black/5 text-transparent'
                                            }
                                            ${feedback === 'correct' ? '!bg-[#66BB6A] !border-[#2E7D32] !text-white' : ''}
                                            ${feedback === 'incorrect' ? '!bg-[#EF5350] !border-[#C62828] !text-white' : ''}
                                        `}
                                    >
                                        {userInput[idx] || ""}
                                    </div>
                                ))}
                            </div>

                            <input
                                ref={inputRef}
                                type="text"
                                value={userInput}
                                onChange={(e) => {
                                    if (e.target.value.length <= currentQuestion.word.length) {
                                        setUserInput(e.target.value);
                                    }
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSubmit();
                                }}
                                className="opacity-0 absolute w-0 h-0"
                                autoFocus
                            />

                            <p className="text-slate-500 font-medium">Nhập {currentQuestion.word.length} chữ cái</p>
                        </div>
                    </div>

                    <div className="mt-10">
                        <Button
                            onClick={handleSubmit}
                            disabled={userInput.length !== currentQuestion.word.length}
                            className={`
                                rounded-full px-12 py-6 text-xl font-bold shadow-lg transition-all
                                ${feedback === 'correct'
                                    ? 'bg-green-500 hover:bg-green-600'
                                    : feedback === 'incorrect'
                                        ? 'bg-red-500 hover:bg-red-600'
                                        : 'bg-[#00ACC1] hover:bg-[#0097A7]'
                                }
                            `}
                        >
                            {feedback === 'correct' ? <Check className="mr-2" /> : feedback === 'incorrect' ? <X className="mr-2" /> : null}
                            {feedback === 'correct' ? 'CHÍNH XÁC' : feedback === 'incorrect' ? 'THỬ LẠI' : 'SUBMIT'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================
// CHOICE GAME - Lựa chọn từ vựng
// ============================================
function ChoiceGame({ data }: { data: VocabularyQuestion[] }) {
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
    const [score, setScore] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);
    const [options, setOptions] = useState<VocabularyQuestion[]>([]);

    const currentQuestion = data[currentQuestionIdx];

    useEffect(() => {
        if (!currentQuestion) return;
        
        // Generate 4 random options including the correct answer
        const shuffled = [...data].filter(item => item.id !== currentQuestion.id)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);
        
        const allOptions = [...shuffled, currentQuestion].sort(() => Math.random() - 0.5);
        setOptions(allOptions);
        setSelectedAnswer(null);
        setFeedback(null);
    }, [currentQuestionIdx, currentQuestion, data]);

    const handlePlayAudio = () => {
        if (currentQuestion?.audio) {
            const audio = new Audio(currentQuestion.audio);
            audio.play().catch(console.error);
        }
    };

    const handleSelectAnswer = (index: number) => {
        if (feedback) return;
        
        setSelectedAnswer(index);
        const selected = options[index];
        
        if (selected.id === currentQuestion.id) {
            setFeedback("correct");
            setScore((prev) => prev + 10);
            setTimeout(() => {
                if (currentQuestionIdx < data.length - 1) {
                    setCurrentQuestionIdx((prev) => prev + 1);
                } else {
                    setIsCompleted(true);
                }
            }, 1500);
        } else {
            setFeedback("incorrect");
            setTimeout(() => {
                setFeedback(null);
                setSelectedAnswer(null);
            }, 1000);
        }
    };

    if (isCompleted) {
        return (
            <div className="w-full h-full bg-gradient-to-br from-purple-400 to-indigo-500 rounded-3xl flex flex-col items-center justify-center p-6">
                <div className="bg-white/90 backdrop-blur-md rounded-3xl p-12 text-center shadow-2xl">
                    <Trophy size={80} className="mx-auto text-yellow-500 mb-4" />
                    <h2 className="text-3xl font-bold text-purple-600 mb-2">Hoàn thành!</h2>
                    <p className="text-5xl font-bold text-indigo-600 mb-4">{score} ĐIỂM</p>
                    <Button 
                        onClick={() => {
                            setCurrentQuestionIdx(0);
                            setScore(0);
                            setIsCompleted(false);
                        }}
                        className="bg-indigo-500 hover:bg-indigo-600 rounded-full px-8 py-4 text-lg"
                    >
                        Chơi lại
                    </Button>
                </div>
            </div>
        );
    }

    if (!currentQuestion) return null;

    return (
        <div className="w-full h-full bg-gradient-to-br from-purple-100 to-indigo-100 rounded-3xl relative overflow-hidden flex flex-col items-center justify-center p-6">
            <div className="absolute inset-0 z-0">
                <div className="absolute bottom-0 left-0 w-full h-1/4 bg-purple-200 rounded-t-[50%]" />
                <div className="absolute top-5 left-10 w-16 h-16 bg-pink-300 rounded-full opacity-60" />
                <div className="absolute top-20 right-20 w-12 h-12 bg-indigo-300 rounded-full opacity-60" />
            </div>

            <div className="z-10 w-full max-w-4xl flex flex-col items-center gap-6">
                <div className="w-full flex justify-between items-center px-4">
                    <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                        <span className="font-bold text-slate-700">Câu {currentQuestionIdx + 1}/{data.length}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm text-yellow-500 font-bold text-xl">
                        <Trophy size={24} />
                        <span>{score} ĐIỂM</span>
                    </div>
                </div>

                <div className="bg-white/40 backdrop-blur-md border border-white/50 rounded-[40px] p-8 shadow-xl w-full flex flex-col items-center">
                    <h2 className="text-2xl font-bold text-[#7B1FA2] mb-6 bg-white/80 px-8 py-3 rounded-full shadow-sm">
                        🎯 Chọn từ vựng đúng
                    </h2>

                    <div className="relative group cursor-pointer mb-8" onClick={handlePlayAudio}>
                        <div className="w-40 h-40 bg-white rounded-3xl shadow-inner flex items-center justify-center border-4 border-[#CE93D8] overflow-hidden">
                            <Image
                                src={currentQuestion.image}
                                alt={currentQuestion.word}
                                width={120}
                                height={120}
                                className="object-contain"
                                onError={(e) => {
                                    e.currentTarget.src = "https://via.placeholder.com/120?text=" + currentQuestion.word;
                                }}
                            />
                        </div>
                        <div className="absolute -bottom-3 -right-3 bg-[#AB47BC] text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform">
                            <Volume2 size={24} />
                        </div>
                    </div>

                    {currentQuestion.meaning && (
                        <p className="text-lg text-purple-700 font-medium mb-4">
                            Nghĩa: <span className="font-bold">{currentQuestion.meaning}</span>
                        </p>
                    )}

                    <div className="grid grid-cols-2 gap-4 w-full max-w-2xl">
                        {options.map((option, idx) => {
                            const isCorrect = option.id === currentQuestion.id;
                            const isSelected = selectedAnswer === idx;
                            
                            return (
                                <button
                                    key={option.id}
                                    onClick={() => handleSelectAnswer(idx)}
                                    disabled={feedback === 'correct'}
                                    className={`
                                        p-4 rounded-2xl text-xl font-bold transition-all transform hover:scale-105
                                        ${isSelected && feedback === 'correct' ? 'bg-green-500 text-white scale-105' : ''}
                                        ${isSelected && feedback === 'incorrect' ? 'bg-red-500 text-white animate-shake' : ''}
                                        ${!isSelected && feedback === 'correct' && isCorrect ? 'bg-green-300 text-green-800' : ''}
                                        ${!feedback && !isSelected ? 'bg-white hover:bg-purple-50 text-purple-800 shadow-md' : ''}
                                        ${!feedback && isSelected ? 'bg-purple-500 text-white' : ''}
                                    `}
                                >
                                    {option.word}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================
// RECORDING GAME - Ghi âm phát âm
// ============================================
function RecordingGame({ data }: { data: VocabularyQuestion[] }) {
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [isRecording, setIsRecording] = useState(false);
    const [hasRecorded, setHasRecorded] = useState(false);
    const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
    const [score, setScore] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);
    const [recognizedText, setRecognizedText] = useState<string>("");
    const [recognition, setRecognition] = useState<any>(null);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [micPermission, setMicPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');

    const currentQuestion = data[currentQuestionIdx];

    useEffect(() => {
        setIsRecording(false);
        setHasRecorded(false);
        setFeedback(null);
        setRecognizedText("");
    }, [currentQuestionIdx]);

    // Initialize Speech Recognition
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (SpeechRecognition) {
                const recognitionInstance = new SpeechRecognition();
                recognitionInstance.lang = 'en-US';
                recognitionInstance.continuous = false;
                recognitionInstance.interimResults = false;
                recognitionInstance.maxAlternatives = 1;

                recognitionInstance.onresult = (event: any) => {
                    const transcript = event.results[0][0].transcript.toLowerCase().trim();
                    setRecognizedText(transcript);
                    console.log('Recognized:', transcript, 'Expected:', currentQuestion.word);
                };

                recognitionInstance.onerror = (event: any) => {
                    console.error('Speech recognition error:', event.error);
                    setIsRecording(false);
                    
                    if (event.error === 'not-allowed') {
                        setErrorMessage('Vui lòng cho phép truy cập microphone trong cài đặt trình duyệt!');
                        setMicPermission('denied');
                    } else if (event.error === 'no-speech') {
                        setErrorMessage('Không nhận được giọng nói. Vui lòng thử lại!');
                    } else {
                        setErrorMessage(`Lỗi: ${event.error}`);
                    }
                };

                recognitionInstance.onend = () => {
                    setIsRecording(false);
                    setHasRecorded(true);
                };

                setRecognition(recognitionInstance);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handlePlayAudio = () => {
        if (currentQuestion?.audio) {
            const audio = new Audio(currentQuestion.audio);
            audio.play().catch(console.error);
        }
    };

    const handleStartRecording = async () => {
        if (!recognition) {
            setErrorMessage('Trình duyệt của bạn không hỗ trợ ghi âm. Vui lòng sử dụng Chrome hoặc Edge.');
            return;
        }
        
        // Check if mediaDevices is available
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            setErrorMessage('⚠️ Trình duyệt không hỗ trợ ghi âm. Vui lòng sử dụng HTTPS hoặc Chrome/Edge.');
            return;
        }
        
        // Check microphone permission first
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            stream.getTracks().forEach(track => track.stop()); // Stop immediately after checking
            setMicPermission('granted');
            setErrorMessage("");
        } catch (error: any) {
            console.error('Microphone permission error:', error);
            
            if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
                setErrorMessage('⚠️ Vui lòng cho phép truy cập microphone để sử dụng tính năng này!');
                setMicPermission('denied');
            } else if (error.name === 'NotFoundError') {
                setErrorMessage('⚠️ Không tìm thấy microphone. Vui lòng kết nối microphone hoặc kiểm tra cài đặt hệ thống.');
            } else if (error.name === 'NotReadableError') {
                setErrorMessage('⚠️ Microphone đang được sử dụng bởi ứng dụng khác. Vui lòng đóng các ứng dụng khác và thử lại.');
            } else {
                setErrorMessage(`⚠️ Lỗi: ${error.message || 'Không thể truy cập microphone'}`);
            }
            return;
        }
        
        setIsRecording(true);
        setRecognizedText("");
        setErrorMessage("");
        try {
            recognition.start();
        } catch (error: any) {
            console.error('Error starting recognition:', error);
            setIsRecording(false);
            setErrorMessage('Không thể bắt đầu ghi âm. Vui lòng thử lại!');
        }
    };

    const handleStopRecording = () => {
        if (recognition) {
            recognition.stop();
        }
    };

    const handleSubmit = () => {
        if (!recognizedText) {
            alert('Không nhận được âm thanh. Vui lòng thử lại!');
            return;
        }

        // Check if recognized text matches the expected word
        const expectedWord = currentQuestion.word.toLowerCase().trim();
        const spokenWord = recognizedText.toLowerCase().trim();
        
        // Allow some flexibility in matching (remove spaces, hyphens)
        const normalizedExpected = expectedWord.replace(/[\s-]/g, '');
        const normalizedSpoken = spokenWord.replace(/[\s-]/g, '');
        
        const isCorrect = normalizedSpoken === normalizedExpected || 
                         spokenWord === expectedWord ||
                         spokenWord.includes(expectedWord) ||
                         expectedWord.includes(spokenWord);
        
        if (isCorrect) {
            setFeedback("correct");
            setScore((prev) => prev + 10);
            setTimeout(() => {
                if (currentQuestionIdx < data.length - 1) {
                    setCurrentQuestionIdx((prev) => prev + 1);
                } else {
                    setIsCompleted(true);
                }
            }, 1500);
        } else {
            setFeedback("incorrect");
            setTimeout(() => {
                setFeedback(null);
                setHasRecorded(false);
                setRecognizedText("");
            }, 1500);
        }
    };

    if (isCompleted) {
        return (
            <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-500 rounded-3xl flex flex-col items-center justify-center p-6">
                <div className="bg-white/90 backdrop-blur-md rounded-3xl p-12 text-center shadow-2xl">
                    <Trophy size={80} className="mx-auto text-yellow-500 mb-4" />
                    <h2 className="text-3xl font-bold text-orange-600 mb-2">Hoàn thành!</h2>
                    <p className="text-5xl font-bold text-red-600 mb-4">{score} ĐIỂM</p>
                    <Button 
                        onClick={() => {
                            setCurrentQuestionIdx(0);
                            setScore(0);
                            setIsCompleted(false);
                        }}
                        className="bg-orange-500 hover:bg-orange-600 rounded-full px-8 py-4 text-lg"
                    >
                        Chơi lại
                    </Button>
                </div>
            </div>
        );
    }

    if (!currentQuestion) return null;

    return (
        <div className="w-full h-full bg-gradient-to-br from-orange-100 to-red-100 rounded-3xl relative overflow-hidden flex flex-col items-center justify-center p-6">
            <div className="absolute inset-0 z-0">
                <div className="absolute bottom-0 left-0 w-full h-1/4 bg-orange-200 rounded-t-[50%]" />
                <div className="absolute top-10 left-20 w-14 h-14 bg-yellow-300 rounded-full opacity-70" />
                <div className="absolute top-32 right-16 w-10 h-10 bg-red-300 rounded-full opacity-60" />
            </div>

            <div className="z-10 w-full max-w-4xl flex flex-col items-center gap-6">
                <div className="w-full flex justify-between items-center px-4">
                    <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                        <span className="font-bold text-slate-700">Câu {currentQuestionIdx + 1}/{data.length}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm text-yellow-500 font-bold text-xl">
                        <Trophy size={24} />
                        <span>{score} ĐIỂM</span>
                    </div>
                </div>

                <div className="bg-white/40 backdrop-blur-md border border-white/50 rounded-[40px] p-8 shadow-xl w-full flex flex-col items-center">
                    <h2 className="text-2xl font-bold text-[#E65100] mb-6 bg-white/80 px-8 py-3 rounded-full shadow-sm">
                        🎤 Ghi âm phát âm từ vựng
                    </h2>

                    <div className="flex flex-col md:flex-row items-center gap-12 w-full justify-center">
                        <div className="relative group cursor-pointer" onClick={handlePlayAudio}>
                            <div className="w-48 h-48 bg-white rounded-3xl shadow-inner flex items-center justify-center border-4 border-[#FFAB91] overflow-hidden">
                                {/* <Image
                                    src={currentQuestion.image}
                                    alt={currentQuestion.word}
                                    width={160}
                                    height={160}
                                    className="object-contain"
                                    onError={(e) => {
                                        e.currentTarget.src = "https://via.placeholder.com/160?text=" + currentQuestion.word;
                                    }}
                                /> */}
                            </div>
                            <div className="absolute -bottom-4 -right-4 bg-[#FF7043] text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform">
                                <Volume2 size={32} />
                            </div>
                        </div>

                        <div className="flex flex-col gap-6 items-center">
                            <div className="text-center">
                                <p className="text-4xl font-bold text-orange-800 mb-2">{currentQuestion.word}</p>
                                {currentQuestion.meaning && (
                                    <p className="text-lg text-orange-600">({currentQuestion.meaning})</p>
                                )}
                            </div>

                            {/* Error Message */}
                            {errorMessage && (
                                <div className="bg-red-100 border-2 border-red-400 rounded-2xl p-4 max-w-md">
                                    <p className="text-red-700 font-medium text-center">{errorMessage}</p>
                                    {micPermission === 'denied' && (
                                        <div className="mt-2 text-sm text-red-600 text-center">
                                            <p>Hướng dẫn:</p>
                                            <p>1. Click vào icon 🔒 hoặc ⓘ bên trái thanh địa chỉ</p>
                                            <p>2. Cho phép quyền Microphone</p>
                                            <p>3. Tải lại trang</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="flex gap-4">
                                {!isRecording ? (
                                    <Button
                                        onClick={handleStartRecording}
                                        className={`
                                            rounded-full p-6 text-xl font-bold shadow-lg transition-all
                                            ${hasRecorded ? 'bg-orange-400' : 'bg-red-500 hover:bg-red-600'}
                                            ${feedback === 'correct' ? '!bg-green-500' : ''}
                                            ${feedback === 'incorrect' ? '!bg-red-600' : ''}
                                        `}
                                    >
                                        <Mic size={32} className="mr-2" />
                                        {hasRecorded ? 'Ghi lại' : 'Bắt đầu ghi âm'}
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={handleStopRecording}
                                        className="rounded-full p-6 text-xl font-bold shadow-lg bg-red-600 hover:bg-red-700 animate-pulse"
                                    >
                                        <Square size={32} className="mr-2" />
                                        Dừng ghi âm
                                    </Button>
                                )}
                            </div>

                            {isRecording && (
                                <div className="flex flex-col items-center gap-2">
                                    <div className="flex items-center gap-2 text-red-600">
                                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                                        <span className="font-medium">Đang ghi âm... Hãy nói từ tiếng Anh</span>
                                    </div>
                                    <p className="text-sm text-gray-600">Nói rõ ràng: <span className="font-bold text-orange-700">{currentQuestion.word}</span></p>
                                </div>
                            )}

                            {recognizedText && hasRecorded && !isRecording && (
                                <div className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-md">
                                    <p className="text-sm text-gray-600 mb-1">Bạn đã nói:</p>
                                    <p className="text-2xl font-bold text-orange-700">{recognizedText}</p>
                                </div>
                            )}

                            {hasRecorded && !isRecording && (
                                <div className="flex gap-4">
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={!recognizedText}
                                        className={`
                                            rounded-full px-12 py-6 text-xl font-bold shadow-lg transition-all
                                            ${feedback === 'correct' ? 'bg-green-500' : feedback === 'incorrect' ? 'bg-red-500' : 'bg-[#FF7043] hover:bg-[#FF5722]'}
                                            ${!recognizedText ? 'opacity-50 cursor-not-allowed' : ''}
                                        `}
                                    >
                                        {feedback === 'correct' ? <Check className="mr-2" /> : feedback === 'incorrect' ? <X className="mr-2" /> : null}
                                        {feedback === 'correct' ? 'XUẤT SẮC!' : feedback === 'incorrect' ? 'THỬ LẠI' : 'KIỂM TRA'}
                                    </Button>
                                </div>
                            )}

                            {/* Skip button if there's an error */}
                            {errorMessage && !isRecording && (
                                <Button
                                    onClick={() => {
                                        setFeedback("correct");
                                        setScore((prev) => prev + 5); // Half points for skipping
                                        setTimeout(() => {
                                            if (currentQuestionIdx < data.length - 1) {
                                                setCurrentQuestionIdx((prev) => prev + 1);
                                                setErrorMessage("");
                                            } else {
                                                setIsCompleted(true);
                                            }
                                        }, 500);
                                    }}
                                    className="rounded-full px-8 py-4 text-lg font-bold shadow-lg bg-gray-500 hover:bg-gray-600"
                                >
                                    Bỏ qua (5 điểm)
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================
// MAIN VOCABULARY GAME COMPONENT
// ============================================
export default function VocabularyGame({ data = [], gameType = 'typing' }: VocabularyGameProps) {
    if (data.length === 0) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-3xl">
                <p className="text-gray-500 text-xl">Không có dữ liệu bài học</p>
            </div>
        );
    }

    switch (gameType) {
        case 'typing':
            return <TypingGame data={data} />;
        case 'choice':
            return <ChoiceGame data={data} />;
        case 'recording':
            return <RecordingGame data={data} />;
        default:
            return <TypingGame data={data} />;
    }
}
