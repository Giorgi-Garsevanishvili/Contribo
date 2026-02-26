"use client";

import CreateDataWrapper from "@/(components)/adminComp/users/CreateDataWrapper";
import HRCaseCreate from "@/(components)/adminComp/users/HRCaseCreate";
import UserInfo from "@/(components)/adminComp/users/UserInfo";
import UserInfoButtons from "@/(components)/adminComp/users/UserInfoButtons";
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
import MemberStatusLogCreate from "@/(components)/adminComp/users/MemberStatusLogCreate";
import PositionHistoryCreate from "@/(components)/adminComp/users/PositionHistoryCreate.";
import RatingHistoryCreate from "@/(components)/adminComp/users/RatingHistoryCreate";

function User() {
  const [refetchKey, setRefetch] = useState(0);
  const [openExtras, setOpenExtras] = useState(false);
  const [openAccess, setOpenAccess] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [openStats, setOpenStats] = useState(false);

  const triggerRefetch = () => {
    setRefetch((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col">
      <UserInfo
        refetchKey={refetchKey}
        openData={openAccess}
      />
      <div
        className={`${openStats ? "flex" : "hidden"} md:flex-row md:flex flex-col items-center justify-between`}
      >
        <UserInfoButtons
          refetchKey={refetchKey}
          URLPath="hr-cases"
          Icon={IoFileTrayStacked}
          title="HR Cases"
          APIPath="hrWarning"
        />
        <UserInfoButtons
          refetchKey={refetchKey}
          URLPath="rating-records"
          Icon={MdOutlineQueryStats}
          title="Rating Records"
          APIPath="ratingHistory"
        />
        <UserInfoButtons
          refetchKey={refetchKey}
          URLPath="positionRecords"
          Icon={MdWorkHistory}
          title="Position History"
          APIPath="positionHistory"
        />
        <UserInfoButtons
          refetchKey={refetchKey}
          URLPath="memberStatusRecords"
          Icon={FaBoxArchive}
          title="Member Status Logs"
          APIPath="memberStatusLog"
        />
      </div>
      <div
        className={`${openCreate ? "flex" : "hidden"} md:flex mt-8 flex-col items-center justify-center`}
      >
        <CreateDataWrapper
          componentProps={{ onCreated: triggerRefetch }}
          title="Create HR Case"
          Component={HRCaseCreate}
        />
        <CreateDataWrapper
          componentProps={{ onCreated: triggerRefetch }}
          title="Create Member Status Log"
          Component={MemberStatusLogCreate}
        />
        <CreateDataWrapper
          componentProps={{ onCreated: triggerRefetch }}
          title="Create Position History"
          Component={PositionHistoryCreate}
        />
        <CreateDataWrapper
          componentProps={{ onCreated: triggerRefetch }}
          title="Create Rating History"
          Component={RatingHistoryCreate}
        />
      </div>

      <button
        onClick={() => setOpenExtras(!openExtras)}
        className={` fixed md:hidden bottom-25 left-3 ring ring-gray-900/30 ${openExtras ? "bg-gray-300/80" : ""} bg-gray-200 rounded-4xl p-2 text-3xl shadow-gray-300 shadow-sm focus:opacity-100 hover:shadow-md cursor-pointer hover:opacity-75 transition-all duration-200`}
      >
        {openExtras ? <FaAngleLeft /> : <FaAngleRight />}
      </button>
      <div className={`${openExtras ? "flex" : "hidden"} z-1000`}>
        <button
          onClick={() => setOpenAccess(!openAccess)}
          className={`fixed ${openAccess ? "border-black bg-gray-200" : "bg-gray-400"} md:hidden bottom-25 left-18 rounded-4xl p-2 text-3xl shadow-gray-300 shadow-sm focus:opacity-100 hover:shadow-md cursor-pointer ring-1 ring-gray-800/85 transition-all hover:opacity-75 duration-300`}
        >
          <BsFillShieldLockFill />
        </button>
        <button
          onClick={() => setOpenCreate(!openCreate)}
          className={`fixed ${openCreate ? "border-black bg-gray-200" : "bg-gray-400"} md:hidden bottom-25 left-32 rounded-4xl p-2 text-3xl shadow-gray-300 shadow-sm focus:opacity-100 hover:shadow-md cursor-pointer ring-1 ring-gray-800/85 transition-all hover:opacity-75 duration-300`}
        >
          <IoMdAddCircle />
        </button>
        <button
          onClick={() => setOpenStats(!openStats)}
          className={`fixed ${openStats ? "border-black bg-gray-200" : "bg-gray-400"} md:hidden bottom-25 left-46 rounded-4xl p-2 text-3xl shadow-gray-300 shadow-sm focus:opacity-100 hover:shadow-md cursor-pointer ring-1 ring-gray-800/85 transition-all hover:opacity-75 duration-300`}
        >
          <IoStatsChart />
        </button>
      </div>
    </div>
  );
}
export default User;
