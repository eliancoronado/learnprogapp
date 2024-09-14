import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./sections/home/Home";
import NCourses from "./sections/NewCourses/NCourses";

function App() {
  return (
    <>
      <Navbar />
      <div className="wr">
        <Home />
        <NCourses />
      </div>
    </>
  );
}

export default App;
