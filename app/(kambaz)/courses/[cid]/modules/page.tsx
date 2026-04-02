"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "next/navigation";
import { FormControl, ListGroup, ListGroupItem, Button } from "react-bootstrap";
import { FaTrash, FaPencilAlt, FaPlus, FaCheckCircle } from "react-icons/fa";
import { setModules, addModule, editModule, updateModule, deleteModule } from "./reducer";
import * as client from "../../client";

export default function Modules() {
  const { cid } = useParams();
  const [moduleName, setModuleName] = useState("");
  const { modules } = useSelector((state: any) => state.modulesReducer);
  const dispatch = useDispatch();

  const fetchModules = async () => {
    const modules = await client.findModulesForCourse(cid as string);
    dispatch(setModules(modules));
  };

  useEffect(() => {
    fetchModules();
  }, []);

  const onCreateModuleForCourse = async () => {
    if (!cid) return;
    const newModule = { name: moduleName, course: cid };
    const module = await client.createModuleForCourse(cid as string, newModule);
    dispatch(setModules([...modules, module]));
    setModuleName("");
  };

  const onRemoveModule = async (moduleId: string) => {
    await client.deleteModule(moduleId);
    dispatch(setModules(modules.filter((m: any) => m._id !== moduleId)));
  };

  const onUpdateModule = async (module: any) => {
    await client.updateModule(module);
    const newModules = modules.map((m: any) => (m._id === module._id ? module : m));
    dispatch(setModules(newModules));
  };

  return (
    <div>
      <div className="d-flex mb-3">
        <FormControl
          value={moduleName}
          placeholder="New Module"
          className="me-2"
          onChange={(e) => setModuleName(e.target.value)}
        />
        <Button onClick={onCreateModuleForCourse} variant="success">
          <FaPlus />
        </Button>
      </div>
      <ListGroup id="wd-modules" className="rounded-0">
        {modules.map((module: any) => (
          <ListGroupItem key={module._id} className="d-flex align-items-center">
            <FaTrash
              className="text-danger me-2 cursor-pointer"
              onClick={() => onRemoveModule(module._id)}
            />
            <FaPencilAlt
              className="text-primary me-2 cursor-pointer"
              onClick={() => dispatch(editModule(module._id))}
            />
            {!module.editing ? (
              <span>{module.name}</span>
            ) : (
              <FormControl
                className="w-50"
                defaultValue={module.name}
                onChange={(e) =>
                  dispatch(updateModule({ ...module, name: e.target.value }))
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    onUpdateModule({ ...module, editing: false });
                  }
                }}
              />
            )}
            <FaCheckCircle className="text-success ms-auto" />
          </ListGroupItem>
        ))}
      </ListGroup>
    </div>
  );
}