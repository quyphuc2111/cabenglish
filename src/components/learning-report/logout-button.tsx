"use client";
import React from "react";
import LogoutIcon from "../icon/logout-icon";

function LogoutButton() {
  const handleLogout = () => {};

  return (
    <div
      className="flex items-center my-5 p-2 w-fit border border-white hover:border-red-300 rounded-3xl cursor-pointer"
      onClick={handleLogout}
    >
      <LogoutIcon width={18} height={20} />
      <span className="ml-2 text-md font-medium text-red-500">Đăng xuất</span>
    </div>
  );
}

export default LogoutButton;
