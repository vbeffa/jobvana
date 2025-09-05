import RolesTable from './RolesTable';

const Roles = () => {
  return (
    <>
      <h1>Roles</h1>
      <div className="flex justify-center">
        <div className="my-4 w-[50%] min-w-[1000px]">
          <RolesTable />
        </div>
      </div>
    </>
  );
};

export default Roles;
