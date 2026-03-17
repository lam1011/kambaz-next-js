"use client";
import { useTodos } from "./todosContext";
import { ListGroup, ListGroupItem, Button, FormControl } from "react-bootstrap";

export default function ReactContextTodoList() {
  const { todos, todo, setTodo, addTodo, deleteTodo, updateTodo } = useTodos();

  return (
    <div>
      <h2>Todo List</h2>
      <ListGroup>
        <ListGroupItem>
          <FormControl
            value={todo.title}
            onChange={(e) => setTodo({ ...todo, title: e.target.value })}
            className="mb-2"
          />
          <Button onClick={updateTodo} variant="warning" className="me-2">
            Update
          </Button>
          <Button onClick={addTodo} variant="success">
            Add
          </Button>
        </ListGroupItem>
        {todos.map((t) => (
          <ListGroupItem key={t.id}>
            {t.title}
            <Button
              onClick={() => setTodo(t)}
              variant="primary"
              className="float-end ms-2"
            >
              Edit
            </Button>
            <Button
              onClick={() => deleteTodo(t.id)}
              variant="danger"
              className="float-end"
            >
              Delete
            </Button>
          </ListGroupItem>
        ))}
      </ListGroup>
      <hr />
    </div>
  );
}