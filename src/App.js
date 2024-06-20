import { useState } from "react";
import Items from "./Components/Items";
import Navbar from "./Components/Navbar";

function App() {
  const [accueil, setAccueil] = useState(true);
  const [utilisateur, setUtilisateur] = useState(false);
  const [medecin, setMedecin] = useState(false);
  const [demende, setDemende] = useState(false);

  return (
    <div className="App">
      <Navbar
        SetAccueil={setAccueil}
        SetUtilisateur={setUtilisateur}
        SetMedecin={setMedecin}
        SetDemende={setDemende}
      />
      <div className="items-wrapper">
        <Items
          accueil={accueil}
          utilisateur={utilisateur}
          medecin={medecin}
          demende={demende}
        />
      </div>
    </div>
  );
}

export default App;
