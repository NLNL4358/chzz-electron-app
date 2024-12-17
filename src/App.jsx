/* CSS */
import "./css/App.css"
import "./css/reset.css"

/* page */
import DevelopNote from "./page/DevelopNote";

/* Component */
import PipModeButton from "./component/PipModeButton"

function App() {
  return (
    <div className="App">
      <h1>TEST</h1>

      <PipModeButton />

      <DevelopNote />
    </div>
  );
}

export default App;
