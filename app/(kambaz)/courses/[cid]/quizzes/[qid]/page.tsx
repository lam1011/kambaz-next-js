"use client";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { Button, Table } from "react-bootstrap";
import { FaCheckCircle, FaBan, FaEdit, FaEye } from "react-icons/fa";
import Link from "next/link";
import { setQuizzes, updateQuiz } from "../reducer";
import * as client from "../../../client";

export default function QuizDetails() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { quizzes } = useSelector((state: any) => state.quizzesReducer);
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const isFaculty = currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN";

  const [quiz, setQuiz] = useState<any>(null);
  const [questionCount, setQuestionCount] = useState(0);

  useEffect(() => {
    const found = quizzes.find((q: any) => q._id === qid);
    if (found) {
      setQuiz(found);
    } else {
      client.findQuizzesForCourse(cid as string).then((data) => {
        dispatch(setQuizzes(data));
        setQuiz(data.find((q: any) => q._id === qid) || null);
      });
    }
  }, [quizzes, qid]);

  useEffect(() => {
    if (qid) {
      client.findQuestionsForQuiz(qid as string).then((qs) => setQuestionCount(qs.length));
    }
  }, [qid]);

  const onTogglePublish = async () => {
    if (!quiz) return;
    const updated = { ...quiz, published: !quiz.published };
    await client.updateQuiz(updated);
    dispatch(updateQuiz(updated));
    setQuiz(updated);
  };

  if (!quiz) return <div className="p-4">Loading...</div>;

  const fmt = (d: string | null) =>
    d ? new Date(d).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }) : "—";

  return (
    <div id="wd-quiz-details" className="p-4">
      <div className="d-flex align-items-center mb-4 gap-2">
        <h3 className="mb-0 me-auto">{quiz.title}</h3>
        {isFaculty && (
          <>
            <Link href={`/courses/${cid}/quizzes/${qid}/editor`}>
              <Button variant="secondary">
                <FaEdit className="me-1" /> Edit
              </Button>
            </Link>
            <Link href={`/courses/${cid}/quizzes/${qid}/preview`}>
              <Button variant="secondary">
                <FaEye className="me-1" /> Preview
              </Button>
            </Link>
            <Button
              variant={quiz.published ? "success" : "outline-secondary"}
              onClick={onTogglePublish}
            >
              {quiz.published ? (
                <><FaCheckCircle className="me-1" /> Published</>
              ) : (
                <><FaBan className="me-1" /> Publish</>
              )}
            </Button>
          </>
        )}
        {!isFaculty && quiz.published && (
          <Link href={`/courses/${cid}/quizzes/${qid}/preview`}>
            <Button variant="danger">Take Quiz</Button>
          </Link>
        )}
      </div>

      <Table bordered className="mb-4">
        <tbody>
          <tr><td className="fw-bold text-end w-25">Quiz Type</td><td>{quiz.quizType?.replace(/_/g, " ")}</td></tr>
          <tr><td className="fw-bold text-end">Points</td><td>{quiz.points ?? 0}</td></tr>
          <tr><td className="fw-bold text-end">Questions</td><td>{questionCount}</td></tr>
          <tr><td className="fw-bold text-end">Assignment Group</td><td>{quiz.assignmentGroup?.replace(/_/g, " ")}</td></tr>
          <tr><td className="fw-bold text-end">Shuffle Answers</td><td>{quiz.shuffleAnswers ? "Yes" : "No"}</td></tr>
          <tr>
            <td className="fw-bold text-end">Time Limit</td>
            <td>{quiz.timeLimitEnabled ? `${quiz.timeLimit} Minutes` : "No Limit"}</td>
          </tr>
          <tr>
            <td className="fw-bold text-end">Multiple Attempts</td>
            <td>
              {quiz.multipleAttempts ? `Yes (${quiz.howManyAttempts} attempts)` : "No"}
            </td>
          </tr>
          <tr><td className="fw-bold text-end">Show Correct Answers</td><td>{quiz.showCorrectAnswers || "Never"}</td></tr>
          <tr><td className="fw-bold text-end">Access Code</td><td>{quiz.accessCode || "None"}</td></tr>
          <tr><td className="fw-bold text-end">One Question at a Time</td><td>{quiz.oneQuestionAtATime ? "Yes" : "No"}</td></tr>
          <tr><td className="fw-bold text-end">Webcam Required</td><td>{quiz.webcamRequired ? "Yes" : "No"}</td></tr>
          <tr><td className="fw-bold text-end">Lock Questions After Answering</td><td>{quiz.lockQuestionsAfterAnswering ? "Yes" : "No"}</td></tr>
          <tr><td className="fw-bold text-end">Due</td><td>{fmt(quiz.dueDate)}</td></tr>
          <tr><td className="fw-bold text-end">Available</td><td>{fmt(quiz.availableDate)}</td></tr>
          <tr><td className="fw-bold text-end">Until</td><td>{fmt(quiz.availableUntilDate)}</td></tr>
        </tbody>
      </Table>

      <Button variant="secondary" onClick={() => router.push(`/courses/${cid}/quizzes`)}>
        Back to Quizzes
      </Button>
    </div>
  );
}
