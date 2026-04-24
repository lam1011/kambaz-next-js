"use client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { Button, Form, Alert } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";
import Link from "next/link";
import * as client from "../../../../client";

interface Choice { _id: string; text: string; isCorrect: boolean; }
interface Question {
  _id: string; title: string; questionType: string; points: number;
  question: string; choices: Choice[]; correctAnswer: boolean; possibleAnswers: string[];
}

export default function QuizPreview() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const isFaculty = currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN";

  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [attemptsLeft, setAttemptsLeft] = useState<number | null>(null);
  const [accessCodeInput, setAccessCodeInput] = useState("");
  const [accessGranted, setAccessGranted] = useState(false);
  const [accessError, setAccessError] = useState("");
  const [prevAttempt, setPrevAttempt] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const quizzes = await client.findQuizzesForCourse(cid as string);
      const found = quizzes.find((q: any) => q._id === qid);
      setQuiz(found || null);
      if (found && !found.accessCode) setAccessGranted(true);

      const qs = await client.findQuestionsForQuiz(qid as string);
      setQuestions(qs);

      if (!isFaculty && found) {
        try {
          const myAttempts = await client.findMyAttemptsForQuiz(qid as string);
          if (myAttempts.length > 0) {
            setPrevAttempt(myAttempts[0]);
            const maxAttempts = found.multipleAttempts ? found.howManyAttempts : 1;
            setAttemptsLeft(Math.max(0, maxAttempts - myAttempts.length));
          } else {
            setAttemptsLeft(found.multipleAttempts ? found.howManyAttempts : 1);
          }
        } catch {
          setAttemptsLeft(found.multipleAttempts ? found.howManyAttempts : 1);
        }
      } else {
        setAccessGranted(true);
      }
    };
    load();
  }, [qid, cid]);

  const handleAccessCode = () => {
    if (accessCodeInput === quiz?.accessCode) {
      setAccessGranted(true);
      setAccessError("");
    } else {
      setAccessError("Incorrect access code. Try again.");
    }
  };

  const setAnswer = (questionId: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const computeScore = () => {
    let total = 0;
    questions.forEach((q) => {
      const ans = answers[q._id];
      if (q.questionType === "MULTIPLE_CHOICE") {
        const correct = (q.choices || []).find((c) => c.isCorrect);
        if (correct && correct._id === ans) total += q.points;
      } else if (q.questionType === "TRUE_FALSE") {
        if (String(ans) === String(q.correctAnswer)) total += q.points;
      } else if (q.questionType === "FILL_IN_BLANK") {
        const normalized = String(ans || "").trim().toLowerCase();
        const match = (q.possibleAnswers || []).some((a) => a.trim().toLowerCase() === normalized);
        if (match) total += q.points;
      }
    });
    return total;
  };

  const isCorrect = (q: Question) => {
    const ans = answers[q._id];
    if (q.questionType === "MULTIPLE_CHOICE") {
      const correct = (q.choices || []).find((c) => c.isCorrect);
      return correct && correct._id === ans;
    } else if (q.questionType === "TRUE_FALSE") {
      return String(ans) === String(q.correctAnswer);
    } else if (q.questionType === "FILL_IN_BLANK") {
      const normalized = String(ans || "").trim().toLowerCase();
      return (q.possibleAnswers || []).some((a) => a.trim().toLowerCase() === normalized);
    }
    return false;
  };

  const onSubmit = async () => {
    const finalScore = computeScore();
    setScore(finalScore);
    setSubmitted(true);
    if (!isFaculty && currentUser) {
      const attemptData = {
        answers: Object.entries(answers).map(([questionId, answer]) => ({ questionId, answer })),
        score: finalScore,
      };
      try {
        const saved = await client.submitAttempt(qid as string, attemptData);
        setPrevAttempt(saved);
        if (attemptsLeft !== null) setAttemptsLeft(Math.max(0, attemptsLeft - 1));
      } catch (e) {
        console.error("Failed to save attempt", e);
      }
    }
  };

  const onRetake = () => {
    setAnswers({});
    setSubmitted(false);
    setScore(0);
    setCurrentIdx(0);
  };

  if (!quiz) return <div className="p-4">Loading quiz...</div>;

  if (quiz.accessCode && !accessGranted) {
    return (
      <div className="p-4" style={{ maxWidth: 400 }}>
        <h4>Access Code Required</h4>
        <Form.Control
          className="mb-2"
          type="text"
          placeholder="Enter access code"
          value={accessCodeInput}
          onChange={(e) => setAccessCodeInput(e.target.value)}
        />
        {accessError && <Alert variant="danger" className="py-2">{accessError}</Alert>}
        <Button onClick={handleAccessCode}>Submit</Button>
        <Button variant="link" onClick={() => router.back()}>Cancel</Button>
      </div>
    );
  }

  if (!isFaculty && attemptsLeft === 0 && !submitted) {
    return (
      <div className="p-4">
        <h4>{quiz.title}</h4>
        <Alert variant="warning">You have used all your attempts for this quiz.</Alert>
        {prevAttempt && (
          <p>Your last score: <strong>{prevAttempt.score} / {quiz.points}</strong></p>
        )}
        <Button variant="secondary" onClick={() => router.push(`/courses/${cid}/quizzes/${qid}`)}>Back to Quiz</Button>
      </div>
    );
  }

  if (submitted) {
    const totalPoints = questions.reduce((s, q) => s + q.points, 0);
    return (
      <div className="p-4">
        <div className="d-flex align-items-center mb-3 gap-2">
          <h4 className="mb-0 me-auto">{quiz.title} — Results</h4>
          {isFaculty && (
            <Link href={`/courses/${cid}/quizzes/${qid}/editor`}>
              <Button variant="outline-secondary" size="sm"><FaEdit className="me-1" /> Edit Quiz</Button>
            </Link>
          )}
        </div>
        <p className="fw-bold">Score: {score} / {totalPoints}</p>

        {questions.map((q, idx) => {
          const correct = isCorrect(q);
          return (
            <div key={q._id} className={`border rounded p-3 mb-3 border-${correct ? "success" : "danger"}`}>
              <div className="d-flex align-items-start gap-2 mb-2">
                <span className={`badge bg-${correct ? "success" : "danger"}`}>{correct ? "✓" : "✗"}</span>
                <span className="fw-bold">Q{idx + 1}: {q.title}</span>
                <span className="text-muted ms-auto">{correct ? q.points : 0} / {q.points} pts</span>
              </div>
              <p>{q.question}</p>
              <div className="text-muted small">Your answer: <strong>{
                q.questionType === "MULTIPLE_CHOICE"
                  ? (q.choices.find((c) => c._id === answers[q._id])?.text || "No answer")
                  : q.questionType === "TRUE_FALSE"
                  ? (answers[q._id] === undefined ? "No answer" : answers[q._id] ? "True" : "False")
                  : (answers[q._id] || "No answer")
              }</strong></div>
              {!correct && (
                <div className="text-success small">Correct answer: <strong>{
                  q.questionType === "MULTIPLE_CHOICE"
                    ? (q.choices.find((c) => c.isCorrect)?.text || "—")
                    : q.questionType === "TRUE_FALSE"
                    ? (q.correctAnswer ? "True" : "False")
                    : (q.possibleAnswers.join(", ") || "—")
                }</strong></div>
              )}
            </div>
          );
        })}

        <div className="d-flex gap-2">
          {isFaculty && <Button variant="secondary" onClick={onRetake}>Retake Preview</Button>}
          {!isFaculty && attemptsLeft !== null && attemptsLeft > 0 && (
            <Button variant="primary" onClick={onRetake}>Take Again ({attemptsLeft} attempts left)</Button>
          )}
          <Button variant="outline-secondary" onClick={() => router.push(`/courses/${cid}/quizzes/${qid}`)}>
            Back to Quiz Details
          </Button>
        </div>
      </div>
    );
  }

  const oneAtATime = quiz.oneQuestionAtATime !== false;
  const displayQuestions = oneAtATime ? [questions[currentIdx]].filter(Boolean) : questions;

  return (
    <div className="p-4">
      <div className="d-flex align-items-center mb-3 gap-2">
        <h4 className="mb-0 me-auto">{quiz.title}</h4>
        {isFaculty && (
          <Link href={`/courses/${cid}/quizzes/${qid}/editor`}>
            <Button variant="outline-secondary" size="sm"><FaEdit className="me-1" /> Edit Quiz</Button>
          </Link>
        )}
      </div>

      {quiz.description && <p className="text-muted">{quiz.description}</p>}

      {oneAtATime && questions.length > 0 && (
        <div className="d-flex flex-wrap gap-1 mb-3">
          {questions.map((_, idx) => (
            <Button
              key={idx}
              size="sm"
              variant={idx === currentIdx ? "primary" : answers[questions[idx]._id] !== undefined ? "success" : "outline-secondary"}
              onClick={() => setCurrentIdx(idx)}
            >
              {idx + 1}
            </Button>
          ))}
        </div>
      )}

      {displayQuestions.map((q) => (
        <div key={q._id} className="border rounded p-3 mb-3">
          <div className="d-flex mb-2">
            <span className="fw-bold me-auto">{oneAtATime ? `Question ${currentIdx + 1}` : q.title}</span>
            <span className="text-muted">{q.points} pts</span>
          </div>
          <p>{q.question}</p>

          {q.questionType === "MULTIPLE_CHOICE" && (
            <div>
              {q.choices.map((c) => (
                <Form.Check
                  key={c._id}
                  type="radio"
                  name={`q-${q._id}`}
                  label={c.text}
                  checked={answers[q._id] === c._id}
                  onChange={() => setAnswer(q._id, c._id)}
                />
              ))}
            </div>
          )}

          {q.questionType === "TRUE_FALSE" && (
            <div>
              <Form.Check type="radio" name={`q-${q._id}`} label="True" checked={answers[q._id] === true} onChange={() => setAnswer(q._id, true)} />
              <Form.Check type="radio" name={`q-${q._id}`} label="False" checked={answers[q._id] === false} onChange={() => setAnswer(q._id, false)} />
            </div>
          )}

          {q.questionType === "FILL_IN_BLANK" && (
            <Form.Control
              type="text"
              placeholder="Type your answer"
              value={answers[q._id] || ""}
              onChange={(e) => setAnswer(q._id, e.target.value)}
            />
          )}
        </div>
      ))}

      {oneAtATime && (
        <div className="d-flex gap-2 mb-3">
          <Button variant="outline-secondary" disabled={currentIdx === 0} onClick={() => setCurrentIdx((i) => i - 1)}>
            Previous
          </Button>
          {currentIdx < questions.length - 1 ? (
            <Button variant="outline-primary" onClick={() => setCurrentIdx((i) => i + 1)}>
              Next
            </Button>
          ) : (
            <Button variant="success" onClick={onSubmit}>Submit Quiz</Button>
          )}
        </div>
      )}

      {!oneAtATime && (
        <Button variant="success" onClick={onSubmit}>Submit Quiz</Button>
      )}
    </div>
  );
}
