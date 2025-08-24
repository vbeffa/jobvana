import "./App.css";

const Loading = ({
  waitFor,
  colSpan
}: {
  waitFor?: Array<unknown>;
  colSpan: number;
}) => {
  if (waitFor?.length === 0)
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
