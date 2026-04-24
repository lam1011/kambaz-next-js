"use client";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import {
  Button, Form, Nav, Row, Col, InputGroup,
} from "react-bootstrap";
import { FaPlus, FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import { setQuizzes, updateQuiz as updateQuizAction } from "../../reducer";
import * as client from "../../../../client";

type QuestionType = "MULTIPLE_CHOICE" | "TRUE_FALSE" | "FILL_IN_BLANK";

interface Choice { _id: string; text: string; isCorrect: boolean; }
interface Question {
  _id: string; quiz: string; title: string; questionType: QuestionType;
  points: number; question: string;
  choices: Choice[]; correctAnswer: boolean; possibleAnswers: string[];
}

const defaultQuestion = (quizId: string): Omit<Question, "_id"> => ({
  quiz: quizId, title: "New Question", questionType: "MULTIPLE_CHOICE",
  points: 1, question: "",
  choices: [
    { _id: "c1", text: "Option A", isCorrect: true },
    { _id: "c2", text: "Option B", isCorrect: false },
  ],
  correctAnswer: true, possibleAnswers: [""],
});

export default function QuizEditor() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { quizzes } = useSelector((state: any) => state.quizzesReducer);

  const [activeTab, setActiveTab] = useState("details");
  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editingQIdx, setEditingQIdx] = useState<number | null>(null);
  const [editingQ, setEditingQ] = useState<Question | null>(null);

  useEffect(() => {
    const found = quizzes.find((q: any) => q._id === qid);
    if (found) { setQuiz({ ...found }); }
    else {
      client.findQuizzesForCourse(cid as string).then((data) => {
        dispatch(setQuizzes(data));
        const q = data.find((q: any) => q._id === qid);
        if (q) setQuiz({ ...q });
      });
    }
  }, []);

  useEffect(() => {
    if (qid) {
      client.findQuestionsForQuiz(qid as string).then((qs) => setQuestions(qs));
    }
  }, [qid]);

  const totalPoints = questions.reduce((sum, q) => sum + (q.points || 0), 0);

  const saveAndNavigate = async (publish: boolean, navigate: () => void) => {
    if (!quiz) return;
    const updated = { ...quiz, points: totalPoints, ...(publish ? { published: true } : {}) };
    await client.updateQuiz(updated);
    dispatch(updateQuizAction(updated));
    navigate();
  };

  const onSave = () => saveAndNavigate(false, () => router.push(`/courses/${cid}/quizzes/${qid}`));
  const onSavePublish = () => saveAndNavigate(true, () => router.push(`/courses/${cid}/quizzes`));
  const onCancel = () => router.push(`/courses/${cid}/quizzes`);

  // Questions tab helpers
  const onAddQuestion = () => {
    const newQ = { ...defaultQuestion(qid as string), _id: "" } as any;
    const idx = questions.length;
    setQuestions([...questions, newQ]);
    setEditingQIdx(idx);
    setEditingQ({ ...newQ });
  };

  const onEditQuestion = (idx: number) => {
    setEditingQIdx(idx);
    setEditingQ({ ...questions[idx] });
  };

  const onCancelEdit = () => {
    if (editingQ && !editingQ._id) {
      setQuestions(questions.filter((_, i) => i !== editingQIdx));
    }
    setEditingQIdx(null);
    setEditingQ(null);
  };

  const onSaveQuestion = async () => {
    if (!editingQ) return;
    if (!editingQ._id) {
      const created = await client.createQuestionForQuiz(qid as string, editingQ);
      const updated = [...questions];
      updated[editingQIdx!] = created;
      setQuestions(updated);
    } else {
      await client.updateQuestion(editingQ);
      const updated = [...questions];
      updated[editingQIdx!] = editingQ;
      setQuestions(updated);
    }
    setEditingQIdx(null);
    setEditingQ(null);
  };

  const onDeleteQuestion = async (idx: number) => {
    const q = questions[idx];
    if (q._id) await client.deleteQuestion(q._id);
    setQuestions(questions.filter((_, i) => i !== idx));
    if (editingQIdx === idx) { setEditingQIdx(null); setEditingQ(null); }
  };

  const addChoice = () => {
    if (!editingQ) return;
    const newId = `c${Date.now()}`;
    setEditingQ({ ...editingQ, choices: [...editingQ.choices, { _id: newId, text: "", isCorrect: false }] });
  };

  const removeChoice = (cid: string) => {
    if (!editingQ) return;
    setEditingQ({ ...editingQ, choices: editingQ.choices.filter((c) => c._id !== cid) });
  };

  const setCorrectChoice = (choiceId: string) => {
    if (!editingQ) return;
    setEditingQ({ ...editingQ, choices: editingQ.choices.map((c) => ({ ...c, isCorrect: c._id === choiceId })) });
  };

  const updateChoiceText = (choiceId: string, text: string) => {
    if (!editingQ) return;
    setEditingQ({ ...editingQ, choices: editingQ.choices.map((c) => c._id === choiceId ? { ...c, text } : c) });
  };

  const addPossibleAnswer = () => {
    if (!editingQ) return;
    setEditingQ({ ...editingQ, possibleAnswers: [...editingQ.possibleAnswers, ""] });
  };

  const removePossibleAnswer = (idx: number) => {
    if (!editingQ) return;
    setEditingQ({ ...editingQ, possibleAnswers: editingQ.possibleAnswers.filter((_, i) => i !== idx) });
  };

  const updatePossibleAnswer = (idx: number, val: string) => {
    if (!editingQ) return;
    const updated = [...editingQ.possibleAnswers];
    updated[idx] = val;
    setEditingQ({ ...editingQ, possibleAnswers: updated });
  };

  if (!quiz) return <div className="p-4">Loading...</div>;

  return (
    <div id="wd-quiz-editor" className="p-3">
      <Nav variant="tabs" className="mb-3" activeKey={activeTab} onSelect={(k) => setActiveTab(k || "details")}>
        <Nav.Item><Nav.Link eventKey="details">Details</Nav.Link></Nav.Item>
        <Nav.Item><Nav.Link eventKey="questions">Questions</Nav.Link></Nav.Item>
      </Nav>

      {activeTab === "details" && (
        <Form>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Title</Form.Label>
            <Form.Control value={quiz.title || ""} onChange={(e) => setQuiz({ ...quiz, title: e.target.value })} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Description</Form.Label>
            <Form.Control as="textarea" rows={4} value={quiz.description || ""} onChange={(e) => setQuiz({ ...quiz, description: e.target.value })} />
          </Form.Group>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-bold">Quiz Type</Form.Label>
                <Form.Select value={quiz.quizType || "GRADED_QUIZ"} onChange={(e) => setQuiz({ ...quiz, quizType: e.target.value })}>
                  <option value="GRADED_QUIZ">Graded Quiz</option>
                  <option value="PRACTICE_QUIZ">Practice Quiz</option>
                  <option value="GRADED_SURVEY">Graded Survey</option>
                  <option value="UNGRADED_SURVEY">Ungraded Survey</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-bold">Assignment Group</Form.Label>
                <Form.Select value={quiz.assignmentGroup || "QUIZZES"} onChange={(e) => setQuiz({ ...quiz, assignmentGroup: e.target.value })}>
                  <option value="QUIZZES">Quizzes</option>
                  <option value="EXAMS">Exams</option>
                  <option value="ASSIGNMENTS">Assignments</option>
                  <option value="PROJECT">Project</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label className="fw-bold">Points</Form.Label>
                <Form.Control type="number" value={totalPoints} readOnly className="bg-light" />
                <Form.Text className="text-muted">Auto-calculated from questions</Form.Text>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label className="fw-bold">Shuffle Answers</Form.Label>
                <Form.Check type="checkbox" label="Shuffle Answers" checked={!!quiz.shuffleAnswers} onChange={(e) => setQuiz({ ...quiz, shuffleAnswers: e.target.checked })} />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label className="fw-bold">Time Limit</Form.Label>
                <div className="d-flex align-items-center gap-2">
                  <Form.Check type="checkbox" checked={!!quiz.timeLimitEnabled} onChange={(e) => setQuiz({ ...quiz, timeLimitEnabled: e.target.checked })} />
                  <Form.Control type="number" value={quiz.timeLimit ?? 20} disabled={!quiz.timeLimitEnabled} onChange={(e) => setQuiz({ ...quiz, timeLimit: parseInt(e.target.value) || 20 })} style={{ width: 80 }} />
                  <span>Minutes</span>
                </div>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label className="fw-bold">Multiple Attempts</Form.Label>
                <Form.Check type="checkbox" label="Allow Multiple Attempts" checked={!!quiz.multipleAttempts} onChange={(e) => setQuiz({ ...quiz, multipleAttempts: e.target.checked })} />
              </Form.Group>
            </Col>
            {quiz.multipleAttempts && (
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="fw-bold">How Many Attempts</Form.Label>
                  <Form.Control type="number" min={1} value={quiz.howManyAttempts ?? 1} onChange={(e) => setQuiz({ ...quiz, howManyAttempts: parseInt(e.target.value) || 1 })} />
                </Form.Group>
              </Col>
            )}
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-bold">Show Correct Answers</Form.Label>
                <Form.Select value={quiz.showCorrectAnswers || ""} onChange={(e) => setQuiz({ ...quiz, showCorrectAnswers: e.target.value })}>
                  <option value="">Never</option>
                  <option value="Always">Always</option>
                  <option value="After Due Date">After Due Date</option>
                  <option value="After Last Attempt">After Last Attempt</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-bold">Access Code</Form.Label>
                <Form.Control value={quiz.accessCode || ""} onChange={(e) => setQuiz({ ...quiz, accessCode: e.target.value })} placeholder="Leave blank for no code" />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={4}>
              <Form.Check type="checkbox" label="One Question at a Time" checked={!!quiz.oneQuestionAtATime} onChange={(e) => setQuiz({ ...quiz, oneQuestionAtATime: e.target.checked })} />
            </Col>
            <Col md={4}>
              <Form.Check type="checkbox" label="Webcam Required" checked={!!quiz.webcamRequired} onChange={(e) => setQuiz({ ...quiz, webcamRequired: e.target.checked })} />
            </Col>
            <Col md={4}>
              <Form.Check type="checkbox" label="Lock Questions After Answering" checked={!!quiz.lockQuestionsAfterAnswering} onChange={(e) => setQuiz({ ...quiz, lockQuestionsAfterAnswering: e.target.checked })} />
            </Col>
          </Row>

          <hr />
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label className="fw-bold">Due Date</Form.Label>
                <Form.Control type="datetime-local" value={quiz.dueDate ? quiz.dueDate.slice(0, 16) : ""} onChange={(e) => setQuiz({ ...quiz, dueDate: e.target.value })} />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label className="fw-bold">Available From</Form.Label>
                <Form.Control type="datetime-local" value={quiz.availableDate ? quiz.availableDate.slice(0, 16) : ""} onChange={(e) => setQuiz({ ...quiz, availableDate: e.target.value })} />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label className="fw-bold">Until</Form.Label>
                <Form.Control type="datetime-local" value={quiz.availableUntilDate ? quiz.availableUntilDate.slice(0, 16) : ""} onChange={(e) => setQuiz({ ...quiz, availableUntilDate: e.target.value })} />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      )}

      {activeTab === "questions" && (
        <div>
          <div className="d-flex align-items-center mb-3">
            <span className="me-auto fw-bold">Total Points: {totalPoints}</span>
            <Button variant="outline-secondary" onClick={onAddQuestion}>
              <FaPlus className="me-1" /> New Question
            </Button>
          </div>

          {questions.length === 0 && (
            <div className="text-muted text-center py-4">
              No questions yet. Click "New Question" to add one.
            </div>
          )}

          {questions.map((q, idx) => (
            <div key={q._id || `new-${idx}`} className="border rounded mb-3 p-3">
              {editingQIdx === idx && editingQ ? (
                <div>
                  <Row className="mb-2">
                    <Col md={6}>
                      <Form.Label className="fw-bold">Title</Form.Label>
                      <Form.Control value={editingQ.title} onChange={(e) => setEditingQ({ ...editingQ, title: e.target.value })} />
                    </Col>
                    <Col md={3}>
                      <Form.Label className="fw-bold">Points</Form.Label>
                      <Form.Control type="number" min={0} value={editingQ.points} onChange={(e) => setEditingQ({ ...editingQ, points: parseInt(e.target.value) || 0 })} />
                    </Col>
                    <Col md={3}>
                      <Form.Label className="fw-bold">Type</Form.Label>
                      <Form.Select value={editingQ.questionType} onChange={(e) => setEditingQ({ ...editingQ, questionType: e.target.value as QuestionType })}>
                        <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                        <option value="TRUE_FALSE">True / False</option>
                        <option value="FILL_IN_BLANK">Fill in the Blank</option>
                      </Form.Select>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Question</Form.Label>
                    <Form.Control as="textarea" rows={3} value={editingQ.question} onChange={(e) => setEditingQ({ ...editingQ, question: e.target.value })} />
                  </Form.Group>

                  {editingQ.questionType === "MULTIPLE_CHOICE" && (
                    <div className="mb-3">
                      <Form.Label className="fw-bold">Choices</Form.Label>
                      {editingQ.choices.map((c) => (
                        <InputGroup key={c._id} className="mb-2">
                          <InputGroup.Radio
                            name={`correct-${idx}`}
                            checked={c.isCorrect}
                            onChange={() => setCorrectChoice(c._id)}
                            title="Mark as correct"
                          />
                          <Form.Control value={c.text} onChange={(e) => updateChoiceText(c._id, e.target.value)} placeholder="Choice text" />
                          <Button variant="outline-danger" onClick={() => removeChoice(c._id)}>
                            <FaTrash />
                          </Button>
                        </InputGroup>
                      ))}
                      <Button variant="outline-secondary" size="sm" onClick={addChoice}>
                        <FaPlus className="me-1" /> Add Choice
                      </Button>
                    </div>
                  )}

                  {editingQ.questionType === "TRUE_FALSE" && (
                    <div className="mb-3">
                      <Form.Label className="fw-bold">Correct Answer</Form.Label>
                      <div>
                        <Form.Check type="radio" name={`tf-${idx}`} label="True" checked={editingQ.correctAnswer === true} onChange={() => setEditingQ({ ...editingQ, correctAnswer: true })} />
                        <Form.Check type="radio" name={`tf-${idx}`} label="False" checked={editingQ.correctAnswer === false} onChange={() => setEditingQ({ ...editingQ, correctAnswer: false })} />
                      </div>
                    </div>
                  )}

                  {editingQ.questionType === "FILL_IN_BLANK" && (
                    <div className="mb-3">
                      <Form.Label className="fw-bold">Possible Correct Answers (case-insensitive)</Form.Label>
                      {editingQ.possibleAnswers.map((ans, aIdx) => (
                        <InputGroup key={aIdx} className="mb-2">
                          <Form.Control value={ans} onChange={(e) => updatePossibleAnswer(aIdx, e.target.value)} placeholder="Correct answer" />
                          <Button variant="outline-danger" onClick={() => removePossibleAnswer(aIdx)}>
                            <FaTrash />
                          </Button>
                        </InputGroup>
                      ))}
                      <Button variant="outline-secondary" size="sm" onClick={addPossibleAnswer}>
                        <FaPlus className="me-1" /> Add Answer
                      </Button>
                    </div>
                  )}

                  <div className="d-flex gap-2">
                    <Button variant="success" size="sm" onClick={onSaveQuestion}>
                      <FaCheck className="me-1" /> Save Question
                    </Button>
                    <Button variant="outline-secondary" size="sm" onClick={onCancelEdit}>
                      <FaTimes className="me-1" /> Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="d-flex align-items-center">
                  <div className="me-auto">
                    <span className="fw-bold">{q.title}</span>
                    <span className="text-muted ms-2">({q.questionType?.replace(/_/g, " ")})</span>
                    <span className="text-muted ms-2">— {q.points} pts</span>
                    {q.question && <div className="text-muted small mt-1">{q.question.substring(0, 80)}{q.question.length > 80 ? "…" : ""}</div>}
                  </div>
                  <div className="d-flex gap-2">
                    <Button variant="outline-secondary" size="sm" onClick={() => onEditQuestion(idx)}>
                      <FaEdit />
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => onDeleteQuestion(idx)}>
                      <FaTrash />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <hr />
      <div className="d-flex gap-2">
        <Button variant="danger" onClick={onSavePublish}>Save & Publish</Button>
        <Button variant="secondary" onClick={onSave}>Save</Button>
        <Button variant="outline-secondary" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
}
