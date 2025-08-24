import "./App.css";

const Loading = ({
  waitingFor,
  colSpan
}: {
  waitingFor?: Array<unknown>;
  colSpan: number;
}) => {
  if (waitingFor?.length === 0)
    return (
      <tr>
        <td colSpan={colSpan} className="border py-4">
          Loading...
        </td>
      </tr>
    );
  return null;
};

export default Loading;
