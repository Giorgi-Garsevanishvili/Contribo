"use client";

import UserInfo from "@/(components)/adminComp/users/UserInfo";
import UserInfoButtons from "@/(components)/adminComp/users/UserInfoButtons";
import { FaBoxArchive } from "react-icons/fa6";
import { IoFileTrayStacked } from "react-icons/io5";
import { MdWorkHistory } from "react-icons/md";
import { MdOutlineQueryStats } from "react-icons/md";

function User() {
  return (
    <>
      <UserInfo />
      <div className="flex md:flex-row flex-col items-center justify-between">
        <UserInfoButtons URLPath="hrCases" Icon={IoFileTrayStacked} title="HR Cases" APIPath="hrWarning"/>
        <UserInfoButtons URLPath="ratingRecords" Icon={MdOutlineQueryStats} title="Rating Records" APIPath="ratingHistory"/>
        <UserInfoButtons URLPath="positionRecords" Icon={MdWorkHistory} title="Position History" APIPath="positionHistory"/>
        <UserInfoButtons URLPath="memberStatusRecords" Icon={FaBoxArchive} title="Member Status Logs" APIPath="memberStatusLog"/>
      </div>
    </>
  );
}
export default User;
