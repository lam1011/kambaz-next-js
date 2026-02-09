import { Form, FormControl, FormLabel, FormSelect, Row, Col, Button } from "react-bootstrap";

export default function AssignmentEditor() {
  return (
    <div id="wd-assignments-editor" className="p-3">
      <FormLabel htmlFor="wd-name">Assignment Name</FormLabel>
      <FormControl id="wd-name" defaultValue="A1" className="mb-3" />

      <FormLabel htmlFor="wd-description">Description</FormLabel>
      <FormControl 
        as="textarea" 
        id="wd-description" 
        rows={10}
        defaultValue="The assignment is available online. Submit a link to the landing page of your Web application running on Netlify. The landing page should include the following: Your full name and section, Links to each of the lab assignments, Link to the Kambaz application, Links to all relevant source code repositories. The Kambaz application should include a link to navigate back to the landing page."
        className="mb-3"
      />

      <Row className="mb-3">
        <FormLabel column sm={3} className="text-end">Points</FormLabel>
        <Col sm={9}>
          <FormControl id="wd-points" defaultValue={100} />
        </Col>
      </Row>

      <Row className="mb-3">
        <FormLabel column sm={3} className="text-end">Assignment Group</FormLabel>
        <Col sm={9}>
          <FormSelect id="wd-group">
            <option>ASSIGNMENTS</option>
          </FormSelect>
        </Col>
      </Row>

      <Row className="mb-3">
        <FormLabel column sm={3} className="text-end">Display Grade as</FormLabel>
        <Col sm={9}>
          <FormSelect id="wd-display-grade-as">
            <option>Percentage</option>
          </FormSelect>
        </Col>
      </Row>

      <Row className="mb-3">
        <FormLabel column sm={3} className="text-end">Submission Type</FormLabel>
        <Col sm={9}>
          <div className="border p-3">
            <FormSelect id="wd-submission-type" className="mb-3">
              <option>Online</option>
            </FormSelect>
            <FormLabel>Online Entry Options</FormLabel>
            <Form.Check type="checkbox" label="Text Entry" id="wd-text-entry" className="mb-2" />
            <Form.Check type="checkbox" label="Website URL" id="wd-website-url" className="mb-2" />
            <Form.Check type="checkbox" label="Media Recordings" id="wd-media-recordings" className="mb-2" />
            <Form.Check type="checkbox" label="Student Annotation" id="wd-student-annotation" className="mb-2" />
            <Form.Check type="checkbox" label="File Uploads" id="wd-file-uploads" />
          </div>
        </Col>
      </Row>

      <Row className="mb-3">
        <FormLabel column sm={3} className="text-end">Assign</FormLabel>
        <Col sm={9}>
          <div className="border p-3">
            <FormLabel htmlFor="wd-assign-to">Assign to</FormLabel>
            <FormControl id="wd-assign-to" defaultValue="Everyone" className="mb-3" />

            <FormLabel htmlFor="wd-due-date">Due</FormLabel>
            <FormControl type="datetime-local" id="wd-due-date" defaultValue="2024-05-13T23:59" className="mb-3" />

            <Row>
              <Col>
                <FormLabel htmlFor="wd-available-from">Available from</FormLabel>
                <FormControl type="datetime-local" id="wd-available-from" defaultValue="2024-05-06T00:00" />
              </Col>
              <Col>
                <FormLabel htmlFor="wd-available-until">Until</FormLabel>
                <FormControl type="datetime-local" id="wd-available-until" defaultValue="2024-05-13T23:59" />
              </Col>
            </Row>
          </div>
        </Col>
      </Row>

      <hr />
      <div className="text-end">
        <Button variant="secondary" className="me-2">Cancel</Button>
        <Button variant="danger">Save</Button>
      </div>
    </div>
  );
}