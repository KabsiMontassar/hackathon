import { useState } from "react";
import Items from "./Components/Items";
import Navbar from "./Components/Navbar";

function App() {
  const [membre, setMembre] = useState(true);
  const [carte, setCarte] = useState(false);
  const [demende, setDemende] = useState(false);

  return (
    <div className="App">
      <Navbar
        Setmembre={setMembre}
        setCarte={setCarte}
      
        SetDemende={setDemende}
      />
      <div className="items-wrapper">
        <Items
          membre={membre}
          carte={carte}
          demende={demende}
        />
      </div>
    </div>
  );
}

export default App;
