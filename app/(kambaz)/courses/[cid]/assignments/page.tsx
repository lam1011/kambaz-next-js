"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "next/navigation";
import { FormControl, ListGroup, ListGroupItem, Button } from "react-bootstrap";
import { FaTrash, FaPlus } from "react-icons/fa";
import Link from "next/link";
import { setAssignments } from "./reducer";
import * as client from "../../client";

export default function Assignments() {
  const { cid } = useParams();
  const { assignments } = useSelector((state: any) => state.assignmentsReducer);
  const dispatch = useDispatch();

  const fetchAssignments = async () => {
    const assignments = await client.findAssignmentsForCourse(cid as string);
    dispatch(setAssignments(assignments));
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const onCreateAssignment = async () => {
    if (!cid) return;
    const newAssignment = {
      title: "New Assignment",
      course: cid,
      description: "New Assignment Description",
      points: 100,
    };
    const assignment = await client.createAssignmentForCourse(cid as string, newAssignment);
    dispatch(setAssignments([...assignments, assignment]));
  };

  const onDeleteAssignment = async (assignmentId: string) => {
    await client.deleteAssignment(assignmentId);
    dispatch(setAssignments(assignments.filter((a: any) => a._id !== assignmentId)));
  };

  return (
    <div id="wd-assignments">
      <div className="d-flex mb-3">
        <h3 className="me-auto">Assignments</h3>
        <Button onClick={onCreateAssignment} variant="success">
          <FaPlus className="me-1" /> Assignment
        </Button>
      </div>
      <ListGroup className="rounded-0">
        {assignments.map((assignment: any) => (
          <ListGroupItem key={assignment._id} className="d-flex align-items-center">
            <Link
              href={`/courses/${cid}/assignments/${assignment._id}`}
              className="text-decoration-none text-dark me-auto"
            >
              {assignment.title}
            </Link>
            <FaTrash
              className="text-danger cursor-pointer"
              onClick={() => onDeleteAssignment(assignment._id)}
            />
          </ListGroupItem>
        ))}
      </ListGroup>
    </div>
  );
}