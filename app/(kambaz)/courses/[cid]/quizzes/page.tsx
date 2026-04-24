"use client";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { ListGroup, Button, Dropdown } from "react-bootstrap";
import { FaPlus, FaEllipsisV, FaCheckCircle, FaBan, FaTrash, FaEdit } from "react-icons/fa";
import Link from "next/link";
import { setQuizzes, deleteQuiz, updateQuiz } from "./reducer";
import * as client from "../../client";

function getAvailabilityStatus(quiz: any) {
  const now = new Date();
  const available = quiz.availableDate ? new Date(quiz.availableDate) : null;
  const until = quiz.availableUntilDate ? new Date(quiz.availableUntilDate) : null;
  if (until && now > until) return "Closed";
  if (available && now < available) {
    const dateStr = available.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return `Not available until ${dateStr}`;
  }
  return "Available";
}

export default function Quizzes() {
  const { cid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { quizzes } = useSelector((state: any) => state.quizzesReducer);
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const isFaculty = currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN";

  const [questionCounts, setQuestionCounts] = useState<Record<string, number>>({});
  const [myScores, setMyScores] = useState<Record<string, number | null>>({});

  useEffect(() => {
    client.findQuizzesForCourse(cid as string).then((data) => dispatch(setQuizzes(data)));
  }, [cid]);

  useEffect(() => {
    const visibleQuizzes = isFaculty ? quizzes : quizzes.filter((q: any) => q.published);
    visibleQuizzes.forEach(async (quiz: any) => {
      if (questionCounts[quiz._id] === undefined) {
        const qs = await client.findQuestionsForQuiz(quiz._id);
        setQuestionCounts((prev) => ({ ...prev, [quiz._id]: qs.length }));
      }
      if (!isFaculty && myScores[quiz._id] === undefined) {
        try {
          const attempts = await client.findMyAttemptsForQuiz(quiz._id);
          setMyScores((prev) => ({
            ...prev,
            [quiz._id]: attempts.length > 0 ? attempts[0].score : null,
          }));
        } catch {
          setMyScores((prev) => ({ ...prev, [quiz._id]: null }));
        }
      }
    });
  }, [quizzes]);

  const onCreateQuiz = async () => {
    const newQuiz = {
      title: "New Quiz",
      course: cid,
      description: "",
      quizType: "GRADED_QUIZ",
      points: 0,
      assignmentGroup: "QUIZZES",
      shuffleAnswers: true,
      timeLimitEnabled: true,
      timeLimit: 20,
      multipleAttempts: false,
      howManyAttempts: 1,
      showCorrectAnswers: "",
      accessCode: "",
      oneQuestionAtATime: true,
      webcamRequired: false,
      lockQuestionsAfterAnswering: false,
      published: false,
    };
    const quiz = await client.createQuizForCourse(cid as string, newQuiz);
    dispatch(setQuizzes([...quizzes, quiz]));
    router.push(`/courses/${cid}/quizzes/${quiz._id}/editor`);
  };

  const onDeleteQuiz = async (quizId: string) => {
    if (!confirm("Delete this quiz?")) return;
    await client.deleteQuiz(quizId);
    dispatch(deleteQuiz(quizId));
  };

  const onTogglePublish = async (quiz: any) => {
    const updated = { ...quiz, published: !quiz.published };
    await client.updateQuiz(updated);
    dispatch(updateQuiz(updated));
  };

  const sorted = [...quizzes]
    .filter((q: any) => isFaculty || q.published)
    .sort((a: any, b: any) => {
      if (!a.availableDate) return 1;
      if (!b.availableDate) return -1;
      return new Date(a.availableDate).getTime() - new Date(b.availableDate).getTime();
    });

  return (
    <div id="wd-quizzes">
      <div className="d-flex align-items-center mb-3">
        <h3 className="me-auto mb-0">Quizzes</h3>
        {isFaculty && (
          <Button variant="danger" onClick={onCreateQuiz}>
            <FaPlus className="me-1" /> Quiz
          </Button>
        )}
      </div>

      {sorted.length === 0 && (
        <div className="text-center text-muted py-5">
          <p>No quizzes yet. {isFaculty && "Click + Quiz to add one."}</p>
        </div>
      )}

      <ListGroup className="rounded-0">
        {sorted.map((quiz: any) => {
          const availability = getAvailabilityStatus(quiz);
          const dueStr = quiz.dueDate
            ? new Date(quiz.dueDate).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })
            : "No due date";
          const count = questionCounts[quiz._id] ?? "—";
          const score = myScores[quiz._id];

          return (
            <ListGroup.Item key={quiz._id} className="d-flex align-items-start p-3 border-start border-4 border-success">
              <div className="me-auto">
                <Link
                  href={`/courses/${cid}/quizzes/${quiz._id}`}
                  className="fw-bold text-decoration-none text-dark"
                >
                  {quiz.title}
                </Link>
                <div className="text-muted small mt-1">
                  <span
                    className={
                      availability === "Closed"
                        ? "text-danger"
                        : availability === "Available"
                        ? "text-success"
                        : "text-secondary"
                    }
                  >
                    {availability}
                  </span>
                  {" | "}Due {dueStr}
                  {" | "}{quiz.points ?? 0} pts
                  {" | "}{count} Questions
                  {!isFaculty && score !== undefined && score !== null && (
                    <span className="text-primary"> | Score: {score}</span>
                  )}
                </div>
              </div>

              <div className="d-flex align-items-center gap-2">
                {isFaculty ? (
                  <>
                    <span
                      role="button"
                      title={quiz.published ? "Published (click to unpublish)" : "Unpublished (click to publish)"}
                      onClick={() => onTogglePublish(quiz)}
                    >
                      {quiz.published ? (
                        <FaCheckCircle className="text-success fs-5" />
                      ) : (
                        <FaBan className="text-secondary fs-5" />
                      )}
                    </span>
                    <Dropdown align="end">
                      <Dropdown.Toggle as="span" bsPrefix="no-caret" className="cursor-pointer">
                        <FaEllipsisV className="text-secondary" />
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item href={`/courses/${cid}/quizzes/${quiz._id}/editor`}>
                          <FaEdit className="me-2" />Edit
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => onTogglePublish(quiz)}>
                          {quiz.published ? (
                            <><FaBan className="me-2" />Unpublish</>
                          ) : (
                            <><FaCheckCircle className="me-2" />Publish</>
                          )}
                        </Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item className="text-danger" onClick={() => onDeleteQuiz(quiz._id)}>
                          <FaTrash className="me-2" />Delete
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </>
                ) : (
                  quiz.published ? (
                    <FaCheckCircle className="text-success fs-5" />
                  ) : (
                    <FaBan className="text-secondary fs-5" />
                  )
                )}
              </div>
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    </div>
  );
}
