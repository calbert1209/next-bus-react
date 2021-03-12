import "./App.css";
import { StopTimeReport } from "./components/StopTimeReport";

function App() {
  return (
    <div className="App">
      <StopTimeReport />
      <div className="relative">
        <div className="countDown"></div>
      </div>
    </div>
  );
}

export default App;
