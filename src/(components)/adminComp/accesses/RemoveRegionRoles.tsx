import { useCompAlert } from "@/hooks/useCompAlert";
import { useConfirmTab } from "@/hooks/useConfirmTab";
import axios from "axios";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useRef, useState } from "react";
import { FaPersonWalkingLuggage } from "react-icons/fa6";
import { ImSpinner9 } from "react-icons/im";

type Data = {
    user: {
        image: string | null;
        name: string | null;
        memberStatusLogs: {
            status: {
                name: string;
            } | null;
        }[];
    } | null;
    id: string;
    createdBy: {
        name: string | null;
    } | null;
    createdAt: Date;
    updatedBy: {
        name: string | null;
    } | null;
    updatedAt: Date | null;
    email: string;
    roles: {
        role: {
            name: string;
        };
        roleId: string;
    }[];
    regionId: string | null;
    region: {
        name: string;
    } | null;
}


function RemoveRegionRoles({
  allowedUserId,
  refetch,
  user,
}: {
  allowedUserId: string;
  refetch: () => void;
  user: Data;
}) {
  const [isLoadingRemoval, setIsLoadingRemoval] = useState(false);
  const { triggerCompAlert } = useCompAlert();
  const triggerCompAlertRef = useRef(triggerCompAlert);
  const { update } = useSession();
  const { ask } = useConfirmTab();

  const handleRemoval = async () => {
    try {
      const confirm = await ask({
        title: `Would You Like To Remove`,
        message:
          "This Action will remove user from your region and update user role to default regular status.",
        value: ` ${user.user?.name} From Region? (${user.region?.name})`,
      });

      if (!confirm) return;

      setIsLoadingRemoval(true);
      const response = await axios.put(
        `/api/admin/allowedUsers/${allowedUserId}/removeRegionRoles`,
      );

      triggerCompAlertRef.current({
        message: response.data.message,
        type: "success",
        isOpened: true,
      });

      const updatedSession = await update();
      if (updatedSession?.user.roles?.includes("RESTRICT")) {
        triggerCompAlertRef.current({
          message: "Your Access Restricted",
          type: "warning",
          isOpened: true,
        });
        return setTimeout(() => {
          redirect("/restricted");
        }, 6000);
      }

      const admin = updatedSession?.user.roles?.includes("ADMIN");

      if (!admin) {
        triggerCompAlertRef.current({
          message: "Your Admin Access Revoked",
          type: "warning",
          isOpened: true,
        });
        return setTimeout(() => {
          redirect("/unauthorized");
        }, 6000);
      }
      refetch();
    } catch (error) {
      return triggerCompAlertRef.current({
        message: `${error}`,
        type: "error",
        isOpened: true,
      });
    } finally {
      setIsLoadingRemoval(false);
    }
  };

  return (
    <>
      <div className="w-full items-center justify-center flex">
        {isLoadingRemoval ? (
          <div
            className={`text-sm m-2 text-black   transition-all duration-300
          font-bold`}
          >
            <ImSpinner9 className="animate-spin" size={25} />
          </div>
        ) : (
          <button
            onClick={handleRemoval}
            className="btn w-full items-center justify-center p-2 md:w-fit h-fit bg-gray-400/40 text-gray-950 border border-gray-700/20 hover:border-red-800 hover:text-red-800 "
          >
            <FaPersonWalkingLuggage size={22} />
          </button>
        )}
      </div>
    </>
  );
}
export default RemoveRegionRoles;
