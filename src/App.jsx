import { Outlet } from "react-router-dom";
import "./App.css";
import { UserStore } from "./stores/UserStore";
import { Nav } from "./components/Nav";

function App() {
  return (
    <UserStore>
      <Nav />
      <div>
        <Outlet />
      </div>
    </UserStore>
  );
}

export default App;
