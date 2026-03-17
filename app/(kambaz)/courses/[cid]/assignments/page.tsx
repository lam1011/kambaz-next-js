"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store";
import { deleteAssignment } from "./reducer";
import { BsGripVertical } from "react-icons/bs";
import { FaPlus, FaTrash } from "react-icons/fa";
import { IoEllipsisVertical } from "react-icons/io5";
import { ListGroup, ListGroupItem, Button, Modal } from "react-bootstrap";
import { useState } from "react";

export default function Assignments() {
  const { cid } = useParams();
  const { assignments } = useSelector(
    (state: RootState) => state.assignmentsReducer
  );
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer
  );
  const dispatch = useDispatch();
  const [showDialog, setShowDialog] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState<string | null>(null);

  const handleDeleteClick = (assignmentId: string) => {
    setAssignmentToDelete(assignmentId);
    setShowDialog(true);
  };

  const confirmDelete = () => {
    if (assignmentToDelete) {
      dispatch(deleteAssignment(assignmentToDelete));
    }
    setShowDialog(false);
    setAssignmentToDelete(null);
  };

  return (
    <div id="wd-assignments">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Assignments for course {cid}</h3>
        {currentUser?.role === "FACULTY" && (
          <Link
            href={`/courses/${cid}/assignments/new`}
            className="btn btn-danger"
          >
            <FaPlus className="me-2" />
            Assignment
          </Link>
        )}
      </div>

      <ListGroup className="rounded-0">
        {assignments
          .filter((a: any) => a.course === cid)
          .map((assignment: any) => (
            <ListGroupItem
              key={assignment._id}
              className="wd-assignment-list-item d-flex align-items-center p-3"
            >
              <BsGripVertical className="me-2 fs-3" />
              <div className="flex-fill">
                <Link
                  href={`/courses/${cid}/assignments/${assignment._id}`}
                  className="text-decoration-none text-dark fw-bold"
                >
                  {assignment.title}
                </Link>
                <br />
                <span className="text-muted">
                  Due: {assignment.dueDate} | Points: {assignment.points}
                </span>
              </div>
              {currentUser?.role === "FACULTY" && (
                <FaTrash
                  className="text-danger me-2"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleDeleteClick(assignment._id)}
                />
              )}
              <IoEllipsisVertical className="fs-4" />
            </ListGroupItem>
          ))}
      </ListGroup>

      <Modal show={showDialog} onHide={() => setShowDialog(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Assignment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to remove this assignment?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDialog(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Yes, Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}