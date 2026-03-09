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
};

function DetailsInfo({details}: {details: Data }) {
  return (
    <div className="md:absolute right-2 items-start m-2 md:m-0 text-xs gap-3 text-gray-600/50 italic bottom-0.5 flex">
                    <h2 className="text-xm italic ">
                      <strong>Created By: </strong>{" "}
                      {details.createdBy?.name
                        ? details.createdBy?.name
                        : "No Creator Data"}
                    </h2>
                    <h2 className="text-xm italic ">
                      <strong>Created At: </strong>{" "}
                      {details.createdAt
                        ? new Date(details.createdAt).toLocaleString()
                        : "No Data"}
                    </h2>
                    <h2 className="text-xm italic ">
                      <strong>Updated By: </strong>{" "}
                      {details.updatedBy?.name
                        ? details.updatedBy?.name
                        : "No Creator Data"}
                    </h2>
                    <h2 className="text-xm italic ">
                      <strong>Updated At: </strong>{" "}
                      {details.updatedAt
                        ? new Date(details.updatedAt).toLocaleString()
                        : "No Data"}
                    </h2>
                  </div>
  )
}

export default DetailsInfo