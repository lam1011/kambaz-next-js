"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "../../../../store";
import { addAssignment, updateAssignment } from "../reducer";
import { FormControl, Button } from "react-bootstrap";

export default function AssignmentEditor() {
  const { cid, aid } = useParams();
  const dispatch = useDispatch();
  const router = useRouter();
  const { assignments } = useSelector(
    (state: RootState) => state.assignmentsReducer
  );

  const isNew = aid === "new";
  const existingAssignment = assignments.find((a: any) => a._id === aid);

  const [assignment, setAssignment] = useState<any>({
    title: "",
    description: "",
    points: 100,
    dueDate: "",
    availableFrom: "",
    availableUntil: "",
    course: cid,
  });

  useEffect(() => {
    if (!isNew && existingAssignment) {
      setAssignment(existingAssignment);
    }
  }, []);

  const handleSave = () => {
    if (isNew) {
      dispatch(addAssignment(assignment));
    } else {
      dispatch(updateAssignment(assignment));
    }
    router.push(`/courses/${cid}/assignments`);
  };

  const handleCancel = () => {
    router.push(`/courses/${cid}/assignments`);
  };

  return (
    <div id="wd-assignment-editor" className="p-3">
      <h3>{isNew ? "New Assignment" : "Edit Assignment"}</h3>

      <label className="form-label fw-bold">Assignment Name</label>
      <FormControl
        value={assignment.title}
        onChange={(e) =>
          setAssignment({ ...assignment, title: e.target.value })
        }
        className="mb-3"
      />

      <label className="form-label fw-bold">Description</label>
      <FormControl
        as="textarea"
        rows={5}
        value={assignment.description}
        onChange={(e) =>
          setAssignment({ ...assignment, description: e.target.value })
        }
        className="mb-3"
      />

      <label className="form-label fw-bold">Points</label>
      <FormControl
        type="number"
        value={assignment.points}
        onChange={(e) =>
          setAssignment({ ...assignment, points: parseInt(e.target.value) })
        }
        className="mb-3"
      />

      <label className="form-label fw-bold">Due Date</label>
      <FormControl
        type="date"
        value={assignment.dueDate}
        onChange={(e) =>
          setAssignment({ ...assignment, dueDate: e.target.value })
        }
        className="mb-3"
      />

      <label className="form-label fw-bold">Available From</label>
      <FormControl
        type="date"
        value={assignment.availableFrom}
        onChange={(e) =>
          setAssignment({ ...assignment, availableFrom: e.target.value })
        }
        className="mb-3"
      />

      <label className="form-label fw-bold">Available Until</label>
      <FormControl
        type="date"
        value={assignment.availableUntil}
        onChange={(e) =>
          setAssignment({ ...assignment, availableUntil: e.target.value })
        }
        className="mb-3"
      />

      <div className="d-flex justify-content-end">
        <Button variant="secondary" className="me-2" onClick={handleCancel}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  );
}