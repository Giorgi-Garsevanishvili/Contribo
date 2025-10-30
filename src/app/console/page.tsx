"use client";
import { FormEvent, useEffect, useState } from "react";
import axios from "axios";
import Loading from "./loading";
import { AllowedUser } from "@prisma/client";
import UsersComponent from "@/(components)/consoleCompnents/UsersComponent";

export default function ConsolePage() {
  
  return (
    <main>
      <UsersComponent />
    </main>
  )
}
