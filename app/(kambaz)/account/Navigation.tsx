'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "../store";

export default function AccountNavigation() {
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const links = currentUser ? ["profile"] : ["signin", "signup"];
  const pathname = usePathname();
  const active = (path: string) => (pathname.includes(path) ? "active" : "");

  return (
    <div id="wd-account-navigation" className="wd list-group fs-5 rounded-0">
      <Link href="/account/signin" id="wd-account-signin-link"
        className={`list-group-item ${active("signin")} border-0`}>
        Signin
      </Link>
      <Link href="/account/signup" id="wd-account-signup-link"
        className={`list-group-item ${active("signup")} text-danger border-0`}>
        Signup
      </Link>
      <Link href="/account/profile" id="wd-account-profile-link"
        className={`list-group-item ${active("profile")} text-danger border-0`}>
        Profile
      </Link>
      {currentUser && (currentUser as any).role === "ADMIN" && (
        <Link href="/account/users" id="wd-account-users-link"
          className={`list-group-item ${active("users")} text-danger border-0`}>
          Users
        </Link>
      )}
    </div>
  );
}