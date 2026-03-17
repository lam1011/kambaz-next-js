"use client"
import Link from "next/link";
import { FormControl } from "react-bootstrap";
import { redirect } from "next/navigation";
import { setCurrentUser } from "../reducer";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { Button } from "react-bootstrap";
import * as db from "../../database";



export default function Signin() {
  const [credentials, setCredentials] = useState<any>({});
  const dispatch = useDispatch();
  const signin = () => {
    const user = db.users.find(
      (u: any) =>
        u.username === credentials.username &&
        u.password === credentials.password
    );
    if (!user) return;
    dispatch(setCurrentUser(user));
    redirect("/dashboard");
  };

  return (
    <div id="wd-signin-screen" style={{ maxWidth: "500px" }}>
      <h1>Sign in</h1>
      <FormControl
        defaultValue={credentials.username}
        onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}

        id="wd-username"
        placeholder="username"
        className="mb-2"
      />
      <FormControl
        defaultValue={credentials.password}
        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}

        id="wd-password"
        placeholder="password"
        type="password"
        className="mb-2"
      />
      <Button onClick={signin} id="wd-signin-btn" className="w-100" > Sign in </Button>
      <Link id="wd-signup-link" href="/account/signup"> Sign up </Link>
    </div>

  );
}