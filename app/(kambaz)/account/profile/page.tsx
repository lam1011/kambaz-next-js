"use client";
import { redirect } from "next/navigation";
import { setCurrentUser } from "../reducer";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { FormControl, Button } from "react-bootstrap";
import * as client from "../client";

export default function Profile() {
  const [profile, setProfile] = useState<any>({});
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  useEffect(() => {
    if (currentUser) {
      setProfile(currentUser);
    }
  }, [currentUser]);

  const updateProfile = async () => {
    const updatedProfile = await client.updateUser(profile);
    dispatch(setCurrentUser(updatedProfile));
  };

  const signout = async () => {
    await client.signout();
    dispatch(setCurrentUser(null));
    redirect("/account/signin");
  };

  return (
    <div id="wd-profile-screen">
      <h3>Profile</h3>
      {profile && (
        <div>
          <FormControl defaultValue={profile.username} className="mb-2" placeholder="username"
            onChange={(e) => setProfile({ ...profile, username: e.target.value })} />
          <FormControl defaultValue={profile.password} className="mb-2" placeholder="password" type="password"
            onChange={(e) => setProfile({ ...profile, password: e.target.value })} />
          <FormControl defaultValue={profile.firstName} className="mb-2" placeholder="First Name"
            onChange={(e) => setProfile({ ...profile, firstName: e.target.value })} />
          <FormControl defaultValue={profile.lastName} className="mb-2" placeholder="Last Name"
            onChange={(e) => setProfile({ ...profile, lastName: e.target.value })} />
          <FormControl defaultValue={profile.dob} className="mb-2" type="date"
            onChange={(e) => setProfile({ ...profile, dob: e.target.value })} />
          <FormControl defaultValue={profile.email} className="mb-2" placeholder="Email"
            onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
          <FormControl defaultValue={profile.role} className="mb-2" placeholder="Role"
            onChange={(e) => setProfile({ ...profile, role: e.target.value })} />
          <Button onClick={updateProfile} className="w-100 mb-2">Update</Button>
          <Button onClick={signout} variant="danger" className="w-100">Sign out</Button>
        </div>
      )}
    </div>
  );
}