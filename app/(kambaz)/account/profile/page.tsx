import Link from "next/link";
import { FormControl, FormLabel } from "react-bootstrap";

export default function Profile() {
  return (
    <div id="wd-profile-screen" style={{ maxWidth: "500px" }}>
      <h1>Profile</h1>
      <FormLabel htmlFor="wd-username">Username</FormLabel>
      <FormControl 
        id="wd-username"
        defaultValue="alice"
        className="mb-2"
      />
      <FormLabel htmlFor="wd-password">Password</FormLabel>
      <FormControl 
        id="wd-password"
        defaultValue="123"
        type="password"
        className="mb-2"
      />
      <FormLabel htmlFor="wd-firstname">First Name</FormLabel>
      <FormControl 
        id="wd-firstname"
        defaultValue="Alice"
        className="mb-2"
      />
      <FormLabel htmlFor="wd-lastname">Last Name</FormLabel>
      <FormControl 
        id="wd-lastname"
        defaultValue="Wonderland"
        className="mb-2"
      />
      <FormLabel htmlFor="wd-dob">Date of Birth</FormLabel>
      <FormControl 
        id="wd-dob"
        type="date"
        defaultValue="2000-01-01"
        className="mb-2"
      />
      <FormLabel htmlFor="wd-email">Email</FormLabel>
      <FormControl 
        id="wd-email"
        defaultValue="alice@wonderland.com"
        className="mb-3"
      />
      <FormLabel htmlFor="wd-role">Role</FormLabel>
      <select id="wd-role" className="form-select mb-3">
        <option value="USER">User</option>
        <option value="ADMIN">Admin</option>
        <option value="FACULTY">Faculty</option>
        <option value="STUDENT">Student</option>
      </select>
      <Link 
        href="/account/signin"
        className="btn btn-danger w-100"
      >
        Sign out
      </Link>
    </div>
  );
}