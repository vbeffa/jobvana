import { Link } from '@tanstack/react-router';
import useTools from '../hooks/useTools';
import Loading from '../Loading';

const Tools = () => {
  const { tools } = useTools();

  return (
    <>
      <h1>Tools</h1>
      <div className="flex justify-center">
        <div className="my-4 w-[75%] min-w-[1000px]">
          <table className="w-full">
            <thead>
              <tr>
                <th className="cursor-pointer w-[25%]">Tool</th>
                <th className="cursor-pointer w-[50%]">Description</th>
                <th className="cursor-pointer w-[25%]">Reference</th>
              </tr>
            </thead>
            <tbody>
              <Loading waitingFor={tools} colSpan={2} />
              {tools?.map((tool) => {
                return (
                  <tr key={tool.id}>
                    <td>
                      {tool.name}{' '}
                      {tool.abbreviation && `(${tool.abbreviation})`}
                    </td>
                    <td className="whitespace-pre-wrap">{tool.description}</td>
                    <td>
                      {tool.reference && (
                        <Link to={tool.reference}>{tool.reference}</Link>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Tools;
