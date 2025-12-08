import Link from "next/link";
import React from "react";
import Account from "./Account";

const Header = ({ accountRole }: { accountRole: "guest" | "user" }) => {
  return (
    <nav className="flex flex-row justify-between items-center bg-gray-800 border-b-gray-500 pt-5 pb-4 px-10">
      <Link href="/" className="font-bold text-2xl text-white">
        <span className="text-cyan-500">Smart</span>Bin
      </Link>
      <div className="flex flex-row gap-5 font-medium text-md text-white items-center">
        {accountRole == "user" && (
          <>
            <Link
              href="/"
              className="hover:text-blue-500 transition-colors duration-200"
            >
              Dashboard
            </Link>

            <Link
              href="/alerts"
              className="hover:text-blue-500 transition-colors duration-200"
            >
              System Alerts
            </Link>
          </>
        )}
        <Account accountRole={accountRole} />
      </div>
    </nav>
  );
};

export default Header;
