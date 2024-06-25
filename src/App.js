import { useState } from "react";
import Items from "./Components/Items";
import Navbar from "./Components/Navbar";

function App() {
  const [membre, setMembre] = useState(true);
  const [carte, setCarte] = useState(false);
  const [demende, setDemende] = useState(false);
  const [products, setProducts] = useState(false);
  const [achievement, setAchievement] = useState(false);

  return (
    <div className="App">
      <Navbar
        Setmembre={setMembre}
        setCarte={setCarte}
      
        SetDemende={setDemende}
        SetProducts={setProducts}
        SetAchievement={setAchievement}
      />
      <div className="items-wrapper">
        <Items
          membre={membre}
          carte={carte}
          products={products}
          achievement={achievement}
          demende={demende}
        />
      </div>
    </div>
  );
}

export default App;
