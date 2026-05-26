"use client";

import { useState } from "react";
import { FaBoxArchive } from "react-icons/fa6";
import { IoFileTrayStacked } from "react-icons/io5";
import { MdWorkHistory } from "react-icons/md";
import { MdOutlineQueryStats } from "react-icons/md";
import { IoStatsChart } from "react-icons/io5";
import { FaAngleLeft } from "react-icons/fa";
import { FaAngleRight } from "react-icons/fa";
import { BsFillShieldLockFill } from "react-icons/bs";
import { IoMdAddCircle } from "react-icons/io";
import UserInfoButtons from "@/(components)/adminComp/users/usersComps/UserInfoButtons";
import UserInfo from "@/(components)/adminComp/users/usersComps/UserInfo";
import UserInfoVolunteer from "@/(components)/userComp/myProfileComps/UserInfoVolunteer";
import UserInfoButtonsVolunteer from "@/(components)/userComp/myProfileComps/UserInfoButtonsVolunteer";

function User() {
  const [refetchKey, setRefetch] = useState(0);
  const [openExtras, setOpenExtras] = useState(false);
  const [openStats, setOpenStats] = useState(false);

  return (
    <div className="flex flex-col">
      <UserInfoVolunteer />
      <div
        className={`${openStats ? "flex" : "hidden"} md:flex-row md:flex flex-col items-center justify-between`}
      >
        <UserInfoButtonsVolunteer
          refetchKey={refetchKey}
          URLPath="hrCases"
          Icon={IoFileTrayStacked}
          title="HR Cases"
          APIPath="myHrCases"
        />
        <UserInfoButtonsVolunteer
          refetchKey={refetchKey}
          URLPath="myRatingHistory"
          Icon={MdOutlineQueryStats}
          title="Rating Records"
          APIPath="myRatingHistory"
        />
        <UserInfoButtonsVolunteer
          refetchKey={refetchKey}
          URLPath="myPositionHistory"
          Icon={MdWorkHistory}
          title="Position History"
          APIPath="myPositionHistory"
        />
        <UserInfoButtonsVolunteer
          refetchKey={refetchKey}
          URLPath="myMembershipHistory"
          Icon={FaBoxArchive}
          title="Member Status Logs"
          APIPath="myMembershipHistory"
        />
      </div>

      <button
        onClick={() => setOpenExtras(!openExtras)}
        className={` fixed md:hidden bottom-20 left-4 ring ring-gray-900/30 ${openExtras ? "bg-gray-300/80" : ""} bg-gray-200 rounded-4xl p-2 text-3xl shadow-gray-300 shadow-sm focus:opacity-100 hover:shadow-md cursor-pointer hover:opacity-75 transition-all duration-200`}
      >
        {openExtras ? <FaAngleLeft /> : <FaAngleRight />}
      </button>
      <div className={`${openExtras ? "flex" : "hidden"} z-150`}>
        <button
          onClick={() => setOpenStats(!openStats)}
          className={`fixed ${openStats ? "border-black bg-gray-200" : "bg-gray-400"} md:hidden bottom-20  left-18 rounded-4xl p-2 text-3xl shadow-gray-300 shadow-sm focus:opacity-100 hover:shadow-md cursor-pointer ring-1 ring-gray-800/85 transition-all hover:opacity-75 duration-300`}
        >
          <IoStatsChart />
        </button>
      </div>
    </div>
  );
}
export default User;
