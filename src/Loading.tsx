import './App.css';

const Loading = ({
  waitingFor,
  colSpan
}: {
  waitingFor?: Array<unknown>;
  colSpan: number;
}) => {
  if (!waitingFor || waitingFor.length === 0)
    return (
      <tr>
        <td colSpan={colSpan} className="loading">
          Loading...
        </td>
      </tr>
    );
  return null;
};

export default Loading;
