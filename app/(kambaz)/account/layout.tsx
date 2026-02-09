import { ReactNode } from "react";
import AccountNavigation from "./Navigation";

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <div className="d-flex">
      <div className="d-none d-md-block me-4">
        <AccountNavigation />
      </div>
      <div className="flex-fill">
        {children}
      </div>
    </div>
  );
}