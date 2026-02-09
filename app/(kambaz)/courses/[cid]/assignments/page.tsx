import { Button, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, FormControl, ListGroup, ListGroupItem } from "react-bootstrap";
import { BsGripVertical, BsPlus } from "react-icons/bs";
import { IoEllipsisVertical, IoSearchSharp } from "react-icons/io5";
import { FaCaretDown } from "react-icons/fa";
import { MdAssignment } from "react-icons/md";
import Link from "next/link";
import InputGroup from "react-bootstrap/InputGroup";
import InputGroupText from 'react-bootstrap/InputGroupText';

export default function Assignments() {
  return (
    <div id="wd-assignments">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <InputGroup style={{ width: "300px" }}>
          <InputGroupText>
            <IoSearchSharp />
          </InputGroupText>
          <FormControl placeholder="Search for Assignment" />
        </InputGroup>
        <div>
          <Button variant="secondary" className="me-2">
            <BsPlus className="fs-4" /> Group
          </Button>
          <Button variant="danger">
            <BsPlus className="fs-4" /> Assignment
          </Button>
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

        <ListGroupItem className="wd-assignment-list-item p-3 ps-1">
          <BsGripVertical className="me-2 fs-3" />
          <MdAssignment className="me-2 fs-4 text-success" /> 
          <Link href="/courses/1234/assignments/123" className="text-decoration-none text-dark">
            <strong>A1</strong>
            <br />
            <span className="text-danger">Multiple Modules</span> | <strong>Not available until</strong> May 6 at 12:00am |
            <br />
            <strong>Due</strong> May 13 at 11:59pm | 100 pts
          </Link>
          <span className="float-end">
            <IoEllipsisVertical className="fs-4" />
          </span>
        </ListGroupItem>

        <ListGroupItem className="wd-assignment-list-item p-3 ps-1">
          <BsGripVertical className="me-2 fs-3" />
          <MdAssignment className="me-2 fs-4 text-success" /> 
          <Link href="/courses/1234/assignments/124" className="text-decoration-none text-dark">
            <strong>A2</strong>
            <br />
            <span className="text-danger">Multiple Modules</span> | <strong>Not available until</strong> May 13 at 12:00am |
            <br />
            <strong>Due</strong> May 20 at 11:59pm | 100 pts
          </Link>
          <span className="float-end">
            <IoEllipsisVertical className="fs-4" />
          </span>
        </ListGroupItem>

        <ListGroupItem className="wd-assignment-list-item p-3 ps-1">
          <BsGripVertical className="me-2 fs-3" />
          <MdAssignment className="me-2 fs-4 text-success" /> 
          <Link href="/courses/1234/assignments/125" className="text-decoration-none text-dark">
            <strong>A3</strong>
            <br />
            <span className="text-danger">Multiple Modules</span> | <strong>Not available until</strong> May 20 at 12:00am |
            <br />
            <strong>Due</strong> May 27 at 11:59pm | 100 pts
          </Link>
          <span className="float-end">
            <IoEllipsisVertical className="fs-4" />
          </span>
        </ListGroupItem>
      </ListGroup>
    </div>
  );
}