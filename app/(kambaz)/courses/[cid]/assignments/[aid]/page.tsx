"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { FormControl, Button } from "react-bootstrap";
import { setAssignments } from "../reducer";
import * as client from "../../../client";

export default function AssignmentEditor() {
  const { cid, aid } = useParams();
  const router = useRouter();
  const { assignments } = useSelector((state: any) => state.assignmentsReducer);
  const dispatch = useDispatch();

  const [assignment, setAssignment] = useState<any>({});

  useEffect(() => {
    const found = assignments.find((a: any) => a._id === aid);
    if (found) {
      setAssignment(found);
    }
  }, [assignments, aid]);

  const onSave = async () => {
    await client.updateAssignment(assignment);
    const newAssignments = assignments.map((a: any) =>
      a._id === assignment._id ? assignment : a
    );
    dispatch(setAssignments(newAssignments));
    router.back();
  };

  const onCancel = () => {
    router.back();
  };

  return (
    <div id="wd-assignment-editor">
      <h3>Assignment Editor</h3>
      <FormControl
        className="mb-2"
        defaultValue={assignment.title}
        onChange={(e) => setAssignment({ ...assignment, title: e.target.value })}
      />
      <FormControl
        as="textarea"
        rows={3}
        className="mb-2"
        defaultValue={assignment.description}
        onChange={(e) => setAssignment({ ...assignment, description: e.target.value })}
      />
      <FormControl
        type="number"
        className="mb-2"
        defaultValue={assignment.points}
        onChange={(e) => setAssignment({ ...assignment, points: parseInt(e.target.value) })}
      />
      <FormControl
        type="date"
        className="mb-2"
        defaultValue={assignment.dueDate}
        onChange={(e) => setAssignment({ ...assignment, dueDate: e.target.value })}
      />
      <FormControl
        type="date"
        className="mb-2"
        defaultValue={assignment.availableFrom}
        onChange={(e) => setAssignment({ ...assignment, availableFrom: e.target.value })}
      />
      <FormControl
        type="date"
        className="mb-2"
        defaultValue={assignment.availableUntil}
        onChange={(e) => setAssignment({ ...assignment, availableUntil: e.target.value })}
      />
      <Button onClick={onSave} className="me-2">
        Save
      </Button>
      <Button onClick={onCancel} variant="secondary">
        Cancel
      </Button>
    </div>
  );
}