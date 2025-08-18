import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import supabase from "./utils/supabase";

import "./App.css";

type User = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
};

function App() {
  const [count, setCount] = useState(0);
  const [users, setUsers] = useState<Array<User>>([]);

  useEffect(() => {
    console.log("effect");
    if (users.length > 0) {
      return;
    }
    (async () => {
      const { data: users } = await supabase.from("users").select();
      console.log(users);
      if (users === null) {
        return;
      }
      setUsers(users);
    })();
  }, [users.length]);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <div className="card">
        <table>
          <thead>
            <tr key={0}>
              <th>Email</th>
              <th>First Name</th>
              <th>Last Name</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              return (
                <tr key={user.id}>
                  <td>{user.email}</td>
                  <td>{user.first_name}</td>
                  <td>{user.last_name}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
