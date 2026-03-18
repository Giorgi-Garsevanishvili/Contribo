type Data = {
  id: string;
  createdBy: {
    name: string | null;
  } | null;
  createdAt: string;
  updatedBy: {
    name: string | null;
  } | null;
  updatedAt: string | null;
};

function DetailsInfo({ details }: { details: Data }) {
  return (
    <div className="md:absolute right-2 content-end gap-1 p-1 m-1 md:m-0 text-xs text-gray-600/50 italic bottom-0.5 grid grid-cols-[1fr_1fr_1fr_1Fr] grid-rows-1 ">
      <h2 className="text-xm md:truncate wrap-anywhere italic ">
        <strong>Created By: </strong>{" "}
        {details.createdBy?.name ? details.createdBy?.name : "No Creator Data"}
      </h2>
      <h2 className="text-xm italic ">
        <strong>Created At: </strong>{" "}
        {details.createdAt
          ? new Date(details.createdAt).toLocaleString()
          : "No Data"}
      </h2>
      <h2 className="text-xm md:truncate wrap-anywhere italic ">
        <strong>Updated By: </strong>{" "}
        {details.updatedBy?.name ? details.updatedBy?.name : "No Creator Data"}
      </h2>
      <h2 className="text-xm italic ">
        <strong>Updated At: </strong>{" "}
        {details.updatedAt
          ? new Date(details.updatedAt).toLocaleString()
          : "No Data"}
      </h2>
    </div>
  );
}

export default DetailsInfo;
