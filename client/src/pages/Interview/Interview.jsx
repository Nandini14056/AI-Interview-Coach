import { useEffect, useState } from "react";
import { Clock3, Pause, Play, Send, Sparkles, Square } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { getInterview, submitAnswer } from "@/services/interview.service";
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

  useEffect(() => {
    getInterview(id)
      .then((res) => {
        const interviewData = res.data;

        setData(interviewData);

        const firstQuestion = interviewData.questions?.[0];

        if (firstQuestion?.userAnswer) {
          setAnswer(firstQuestion.userAnswer);
        } else {
          setAnswer("");
        }
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

  const selectQuestion = (questionIndex) => {
    if (!data?.questions?.[questionIndex]) return;

    setError("");
    setFeedback("");

    setIndex(questionIndex);

    const selectedQuestion = data.questions[questionIndex];

    setAnswer(selectedQuestion.userAnswer || "");
  };

  const submit = async () => {
    if (!answer.trim()) {
      setError("Please enter an answer before submitting.");
      return;
    }

    if (!q?._id) {
      setError("Question information is missing.");
      return;
    }

    setError("");
    setFeedback("");
    setBusy(true);

    try {
      const res = await submitAnswer(id, {
        questionId: q._id,
        answer: answer.trim(),
      });

      if (res.data.overallScore !== undefined) {
        nav(`/results/${id}`, {
          replace: true,
        });

        return;
      }

      setData((currentData) => {
        if (!currentData) return currentData;

        const updatedQuestions = currentData.questions.map(
          (question, questionIndex) => {
            if (questionIndex !== index) {
              return question;
            }

            return {
              ...question,
              userAnswer: answer.trim(),
              score: res.data.score,
              feedback: res.data.feedback,
            };
          },
        );

        return {
          ...currentData,
          questions: updatedQuestions,
        };
      });

      setFeedback(res.data.feedback || "");

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

    const previousIndex = index - 1;
    const previousQuestion = data.questions[previousIndex];

    setError("");
    setFeedback("");

    setIndex(previousIndex);
    setAnswer(previousQuestion.userAnswer || "");
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

          <button className="end-btn" onClick={() => nav("/dashboard")}>
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
              {formatTime(seconds)} <small>/ 45:00</small>
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
                className={`q-nav ${isCurrent ? "active" : ""}`}
                onClick={() => selectQuestion(questionIndex)}
              >
                <span>{questionIndex + 1}</span>

                <span>
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
          </div>

          <label className="answer-label">
            Your answer
            <textarea
              value={answer}
              onChange={(e) => {
                setAnswer(e.target.value);
                setError("");
              }}
              placeholder="Type your answer here. Explain your reasoning clearly…"
              disabled={busy}
            />
            <small>
              You can edit your answer even if you have already submitted this
              question.
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
