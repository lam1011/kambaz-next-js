"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FormControl, Button, Row, Col, Card } from "react-bootstrap";
import Link from "next/link";
import { setCourses } from "../courses/reducer";
import * as client from "../courses/client";

export default function Dashboard() {
  const { courses } = useSelector((state: any) => state.coursesReducer);
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const dispatch = useDispatch();

  const [course, setCourse] = useState<any>({
    name: "New Course",
    number: "New Number",
    startDate: "2023-09-10",
    endDate: "2023-12-15",
    description: "New Description",
  });

  const fetchCourses = async () => {
    try {
      const courses = await client.findMyCourses();
      dispatch(setCourses(courses));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [currentUser]);

  const onAddNewCourse = async () => {
    const newCourse = await client.createCourse(course);
    dispatch(setCourses([...courses, newCourse]));
  };

  const onDeleteCourse = async (courseId: string) => {
    await client.deleteCourse(courseId);
    dispatch(setCourses(courses.filter((c: any) => c._id !== courseId)));
  };

  const onUpdateCourse = async () => {
    await client.updateCourse(course);
    dispatch(
      setCourses(
        courses.map((c: any) => {
          if (c._id === course._id) {
            return course;
          } else {
            return c;
          }
        })
      )
    );
  };

  return (
    <div id="wd-dashboard">
      <h1>Dashboard</h1>
      <hr />
      <h5>
        New Course
        <Button className="float-end" id="wd-add-new-course-click" onClick={onAddNewCourse}>
          Add
        </Button>
        <Button className="float-end me-2" variant="secondary" id="wd-update-course-click" onClick={onUpdateCourse}>
          Update
        </Button>
      </h5>
      <br />
      <FormControl
        value={course.name}
        className="mb-2"
        onChange={(e) => setCourse({ ...course, name: e.target.value })}
      />
      <FormControl
        as="textarea"
        value={course.description}
        className="mb-2"
        onChange={(e) => setCourse({ ...course, description: e.target.value })}
      />
      <hr />
      <h2>Published Courses ({courses.length})</h2>
      <hr />
      <Row xs={1} md={2} lg={3} xl={4} className="g-4">
        {courses.map((c: any) => (
          <Col key={c._id} className="wd-dashboard-course" style={{ width: "300px" }}>
            <Card>
              <Link href={`/courses/${c._id}/home`} className="text-decoration-none text-dark">
                <Card.Img variant="top" src="/images/reactjs.jpg" width="100%" height={160} />
                <Card.Body>
                  <Card.Title className="wd-dashboard-course-title">{c.name}</Card.Title>
                  <Card.Text className="wd-dashboard-course-description overflow-hidden" style={{ maxHeight: 100 }}>
                    {c.description}
                  </Card.Text>
                  <Button variant="primary">Go</Button>
                  <Button
                    variant="danger"
                    className="float-end"
                    onClick={(event) => {
                      event.preventDefault();
                      onDeleteCourse(c._id);
                    }}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="warning"
                    className="float-end me-2"
                    onClick={(event) => {
                      event.preventDefault();
                      setCourse(c);
                    }}
                  >
                    Edit
                  </Button>
                </Card.Body>
              </Link>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}