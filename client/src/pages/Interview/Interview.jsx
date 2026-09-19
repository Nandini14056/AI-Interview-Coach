import { useEffect, useRef, useState } from "react";
import {
  Camera,
  CameraOff,
  Clock3,
  Mic,
  MicOff,
  Pause,
  Play,
  Send,
  Sparkles,
  Square,
  Video,
  VideoOff,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getInterview,
  submitAnswer,
  submitVoiceAnswer,
  submitVideoAnswer,
} from "@/services/interview.service";
import { getApiError } from "@/components/ui/Toast";
import Spinner from "@/components/ui/Spinner";

const formatTime = (s) =>
  `${Math.floor(s / 60)
    .toString()
    .padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

export default function Interview() {
  const { id } = useParams();
  const nav = useNavigate();

  const [data, setData] = useState(null);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");

  const [seconds, setSeconds] = useState(45 * 60);
  const [paused, setPaused] = useState(false);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");

  const [isListening, setIsListening] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const [cameraEnabled, setCameraEnabled] = useState(false);

  const [speechSupported] = useState(() => {
    if (typeof window === "undefined") return false;

    return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
  });

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const recognitionRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);

  useEffect(() => {
    getInterview(id)
      .then((res) => {
        const interviewData = res.data;

        setData(interviewData);

        const firstQuestion = interviewData.questions?.[0];

        setAnswer(firstQuestion?.userAnswer || "");
      })
      .catch((e) => {
        setError(getApiError(e));
      });
  }, [id]);

  useEffect(() => {
    if (paused) return;

    const timer = setInterval(() => {
      setSeconds((current) => {
        if (current <= 0) {
          clearInterval(timer);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [paused]);

  const q = data?.questions?.[index];

  const progress = data?.questions?.length
    ? Math.round(((index + 1) / data.questions.length) * 100)
    : 0;

  const interviewMode = data?.interview?.mode || data?.mode || "Text";

  const isVoiceMode = interviewMode === "Voice";
  const isVideoMode = interviewMode === "Video";

  const selectQuestion = (questionIndex) => {
    if (!data?.questions?.[questionIndex]) return;

    stopSpeechRecognition();

    setError("");
    setFeedback("");

    setIndex(questionIndex);

    const selectedQuestion = data.questions[questionIndex];

    setAnswer(selectedQuestion.userAnswer || "");
  };

  const startSpeechRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError(
        "Speech recognition is not supported in this browser. Please use Google Chrome.",
      );

      return;
    }

    setError("");

    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      let finalTranscript = "";
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      setAnswer((currentAnswer) => {
        const existing = currentAnswer.trim();

        if (finalTranscript) {
          return `${existing} ${finalTranscript}`.trim();
        }

        if (interimTranscript) {
          return `${existing} ${interimTranscript}`.trim();
        }

        return existing;
      });
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);

      if (event.error === "not-allowed") {
        setError(
          "Microphone permission was denied. Please allow microphone access.",
        );
      } else if (event.error !== "aborted") {
        setError(`Speech recognition error: ${event.error}`);
      }

      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch (error) {
      console.error(error);
    }
  };

  const stopSpeechRecognition = () => {
    if (!recognitionRef.current) {
      setIsListening(false);
      return;
    }

    try {
      recognitionRef.current.stop();
    } catch {
      // Already stopped
    }

    recognitionRef.current = null;
    setIsListening(false);
  };

  const toggleSpeech = () => {
    if (isListening) {
      stopSpeechRecognition();
    } else {
      startSpeechRecognition();
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setCameraEnabled(true);
    } catch (error) {
      console.error(error);

      setError(
        "Camera or microphone permission was denied. Please allow access and try again.",
      );
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());

      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraEnabled(false);
  };

  useEffect(() => {
    return () => {
      stopSpeechRecognition();
      stopCamera();

      if (mediaRecorderRef.current) {
        try {
          mediaRecorderRef.current.stop();
        } catch {
          // recorder may already be stopped
        }
      }
    };
  }, []);

  const startVideoRecording = async () => {
    try {
      let stream = streamRef.current;

      if (!stream) {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        setCameraEnabled(true);
      }

      const recorder = new MediaRecorder(stream, {
        mimeType: "video/webm",
      });

      recordedChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const videoBlob = new Blob(recordedChunksRef.current, {
          type: "video/webm",
        });

        console.log("Video recording created:", videoBlob);

        recordedChunksRef.current = [];
      };

      recorder.start();

      mediaRecorderRef.current = recorder;

      setIsRecording(true);

      if (!isListening) {
        startSpeechRecognition();
      }
    } catch (error) {
      console.error(error);

      setError("Unable to start camera recording.");
    }
  };

  const stopVideoRecording = () => {
    if (mediaRecorderRef.current) {
      try {
        mediaRecorderRef.current.stop();
      } catch {
        // Already stopped
      }

      mediaRecorderRef.current = null;
    }

    setIsRecording(false);

    stopSpeechRecognition();
  };

  const submit = async () => {
    if (!answer.trim()) {
      setError(
        isVoiceMode || isVideoMode
          ? "Please record your answer before submitting."
          : "Please enter an answer before submitting.",
      );
      return;
    }

    if (!q?._id) {
      setError("Question information is missing.");
      return;
    }

    stopSpeechRecognition();

    if (isRecording) {
      stopVideoRecording();
    }

    setError("");
    setFeedback("");
    setBusy(true);

    try {
      const payload = { questionId: q._id, answer: answer.trim() };

      let res;

      if (!isVoiceMode && !isVideoMode) {
        res = await submitAnswer(id, payload);
      } else if (isVoiceMode) {
        res = await submitVoiceAnswer(id, payload);
      } else if (isVideoMode) {
        res = await submitVideoAnswer(id, payload);
      }

      if (res?.data?.overallScore !== undefined) {
        stopCamera();

        nav(`/results/${id}`, {
          replace: true,
        });

        return;
      }

      setData((currentData) => {
        if (!currentData) {
          return currentData;
        }

        const updatedQuestions = currentData.questions.map(
          (question, questionIndex) => {
            if (questionIndex !== index) {
              return question;
            }

            return {
              ...question,
              userAnswer: answer.trim(),
              score: res?.data?.score,
              feedback: res?.data?.feedback,
            };
          },
        );

        return {
          ...currentData,

          questions: updatedQuestions,
        };
      });

      setFeedback(res?.data?.feedback || "");

      const nextIndex = index + 1;

      if (nextIndex < data.questions.length) {
        const nextQuestion = data.questions[nextIndex];
        setIndex(nextIndex);
        setAnswer(nextQuestion.userAnswer || "");
        setFeedback("");
      }
    } catch (e) {
      setError(getApiError(e));
    } finally {
      setBusy(false);
    }
  };

  const goPrevious = () => {
    if (index === 0) return;
    stopSpeechRecognition();

    const previousIndex = index - 1;
    const previousQuestion = data.questions[previousIndex];

    setError("");
    setFeedback("");

    setIndex(previousIndex);

    setAnswer(previousQuestion.userAnswer || "");
  };

  const speakQuestion = () => {
    if (!q?.question) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(q.question);

    utterance.lang = "en-US";
    utterance.rate = 0.95;
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);
  };

  if (error && !data) {
    return (
      <div className="center-page">
        <div className="error-box">{error}</div>
      </div>
    );
  }

  if (!data || !q) {
    return (
      <div className="center-page">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="interview-page">
      <header className="interview-top">
        <div className="brand">
          <div className="brand-mark">
            <Sparkles size={17} />
          </div>

          <strong>AI Coach</strong>
        </div>

        <div className="session-meta">
          <span>
            <Clock3 size={14} />
            {formatTime(seconds)}
          </span>

          <button
            className="pause-btn"
            onClick={() => setPaused((current) => !current)}
          >
            {paused ? <Play size={13} /> : <Pause size={13} />}

            {paused ? "Resume" : "Pause"}
          </button>

          <button
            className="end-btn"
            onClick={() => {
              stopSpeechRecognition();
              stopCamera();

              nav("/dashboard");
            }}
          >
            <Square size={12} />
            End Session
          </button>
        </div>
      </header>

      <div className="interview-layout">
        <aside className="question-nav">
          <div className="timer-label">
            TIME REMAINING
            <strong>
              {formatTime(seconds)}

              <small> / 45:00</small>
            </strong>
          </div>

          <p>INTERVIEW PROGRESS</p>

          {data.questions.map((question, questionIndex) => {
            const isCurrent = questionIndex === index;

            const isAnswered =
              typeof question.userAnswer === "string" &&
              question.userAnswer.trim().length > 0;

            return (
              <button
                key={question._id}
                type="button"
                className={`q-btn ${isCurrent ? "active" : ""}`}
                onClick={() => selectQuestion(questionIndex)}
              >
                <span className="q-nav">{questionIndex + 1}</span>

                <span className="nav-question">
                  {isCurrent
                    ? "Current Question"
                    : question.question.length > 27
                      ? question.question.slice(0, 27) + "…"
                      : question.question}
                </span>

                {isAnswered && !isCurrent && <small>✓ Answered</small>}
              </button>
            );
          })}
        </aside>

        <main className="question-main">
          <div className="progress-bar">
            <span
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          <div className="question-header">
            <span className="eyebrow">
              QUESTION {index + 1} OF {data.questions.length}
            </span>

            <h1>{q.question}</h1>

            <div className="hint">
              <Sparkles size={14} />

              <span>
                <strong>Hint:</strong> Focus on the concepts, trade-offs, and a
                concrete example where possible.
              </span>
            </div>

            {(isVoiceMode || isVideoMode) && (
              <button
                type="button"
                className="outline-btn"
                onClick={speakQuestion}
                style={{
                  marginTop: "12px",
                }}
              >
                🔊 Read Question Aloud
              </button>
            )}
          </div>

          {isVideoMode && (
            <div
              className="video-interview-box"
              style={{
                marginBottom: "20px",
              }}
            >
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                style={{
                  width: "100%",
                  maxWidth: "700px",
                  minHeight: "320px",
                  background: "#111",
                  borderRadius: "16px",
                  objectFit: "cover",
                }}
              />

              {!cameraEnabled && (
                <div
                  style={{
                    padding: "20px",
                    textAlign: "center",
                  }}
                >
                  <Camera size={32} />

                  <p>Camera is currently disabled.</p>
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "12px",
                  flexWrap: "wrap",
                }}
              >
                {!cameraEnabled ? (
                  <button
                    className="outline-btn"
                    type="button"
                    onClick={startCamera}
                  >
                    <Camera size={15} />
                    Enable Camera
                  </button>
                ) : (
                  <button
                    className="outline-btn"
                    type="button"
                    onClick={stopCamera}
                  >
                    <CameraOff size={15} />
                    Turn Off Camera
                  </button>
                )}

                {!isRecording ? (
                  <button
                    className="primary-btn"
                    type="button"
                    onClick={startVideoRecording}
                  >
                    <Video size={15} />
                    Start Recording
                  </button>
                ) : (
                  <button
                    className="primary-btn"
                    type="button"
                    onClick={stopVideoRecording}
                  >
                    <VideoOff size={15} />
                    Stop Recording
                  </button>
                )}
              </div>

              {isRecording && (
                <div
                  style={{
                    marginTop: "10px",
                    fontWeight: 600,
                  }}
                >
                  Recording in progress
                </div>
              )}
            </div>
          )}

          {isVoiceMode && (
            <div
              className="voice-interview-box"
              style={{
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                {!speechSupported ? (
                  <div className="error-box">
                    Speech recognition is not supported in this browser. Please
                    use Google Chrome.
                  </div>
                ) : (
                  <button
                    type="button"
                    className="primary-btn"
                    onClick={toggleSpeech}
                  >
                    {isListening ? (
                      <>
                        <MicOff size={16} />
                        Stop Speaking
                      </>
                    ) : (
                      <>
                        <Mic size={16} />
                        Start Speaking
                      </>
                    )}
                  </button>
                )}

                {isListening && <span> Listening...</span>}
              </div>
            </div>
          )}

          <label className="answer-label">
            Your answer
            <textarea
              value={answer}
              onChange={(e) => {
                setAnswer(e.target.value);
                setError("");
              }}
              placeholder={
                isVoiceMode
                  ? "Your spoken answer will appear here. You can edit it before submitting..."
                  : isVideoMode
                    ? "Your spoken answer will appear here while the camera records..."
                    : "Type your answer here. Explain your reasoning clearly…"
              }
              disabled={busy}
            />
            <small>
              {isVoiceMode
                ? "Speak naturally. Your speech will be converted into text."
                : isVideoMode
                  ? "Your camera and microphone are active during the recording. Your transcript can be edited before submission."
                  : "You can edit your answer even after submitting it."}
            </small>
          </label>

          {feedback && (
            <div className="feedback-inline">
              <strong>AI feedback</strong>

              <p>{feedback}</p>
            </div>
          )}

          {error && <div className="error-box">{error}</div>}

          <div className="question-actions">
            <button
              className="outline-btn"
              disabled={index === 0 || busy}
              onClick={goPrevious}
            >
              Previous
            </button>

            <button
              type="button"
              className="primary-btn large"
              disabled={busy}
              onClick={submit}
            >
              {busy ? <Spinner /> : <Send size={15} />}

              <span>
                {busy
                  ? "Evaluating…"
                  : index === data.questions.length - 1
                    ? q.userAnswer
                      ? "Update & Finish"
                      : "Submit & Finish"
                    : q.userAnswer
                      ? "Update & Next"
                      : "Submit & Next"}
              </span>
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
