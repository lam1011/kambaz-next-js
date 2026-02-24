"use client";
import { Button, FormControl, ListGroup, ListGroupItem } from "react-bootstrap";
import { BsGripVertical, BsPlus } from "react-icons/bs";
import { IoEllipsisVertical, IoSearchSharp } from "react-icons/io5";
import { FaCaretDown } from "react-icons/fa";
import { MdAssignment } from "react-icons/md";
import Link from "next/link";
import InputGroup from "react-bootstrap/InputGroup";
import InputGroupText from "react-bootstrap/InputGroupText";
import { useParams } from "next/navigation";
import * as db from "@/app/(kambaz)/database";

export default function Assignments() {
  const { cid } = useParams();
  const assignments = (db.assignments as any[]).filter((a) => a.course === cid);

  return (
    <div id="wd-assignments">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <InputGroup style={{ width: "300px" }}>
          <InputGroupText><IoSearchSharp /></InputGroupText>
          <FormControl placeholder="Search for Assignment" />
        </InputGroup>
        <div>
          <Button variant="secondary" className="me-2"><BsPlus className="fs-4" /> Group</Button>
          <Button variant="danger"><BsPlus className="fs-4" /> Assignment</Button>
        </div>
      </div>

      <ListGroup className="rounded-0">
        <ListGroupItem className="p-3 ps-1 bg-secondary">
          <BsGripVertical className="me-2 fs-3" />
          <FaCaretDown className="me-2" />
          ASSIGNMENTS
          <span className="float-end">
            <span className="border border-dark rounded p-2 me-2">40% of Total</span>
            <BsPlus className="fs-4" />
            <IoEllipsisVertical className="fs-4" />
          </span>
        </ListGroupItem>

        {assignments.map((assignment) => (
          <ListGroupItem key={assignment._id} className="wd-assignment-list-item p-3 ps-1">
            <BsGripVertical className="me-2 fs-3" />
            <MdAssignment className="me-2 fs-4 text-success" />
            <Link href={`/courses/${cid}/assignments/${assignment._id}`} className="text-decoration-none text-dark">
              <strong>{assignment.title}</strong><br />
              <span className="text-danger">Multiple Modules</span>
              {assignment.availableFrom && <> | <strong>Not available until</strong> {assignment.availableFrom}</>}
              {assignment.dueDate && <><br /><strong>Due</strong> {assignment.dueDate}</>}
              {assignment.points && <> | {assignment.points} pts</>}
            </Link>
            <span className="float-end"><IoEllipsisVertical className="fs-4" /></span>
          </ListGroupItem>
        ))}
      </ListGroup>
    </div>
  );
}