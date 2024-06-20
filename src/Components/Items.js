 import React from "react";

import Accueil from "./Accueil";
import Utilisateur from "./Utilisateur";
import Medecins from "./Medecins";
import Demende from "./Demende";

const Items = ({accueil, utilisateur, medecin, demende }) => {



  return (
   <>
      <Accueil accueil={accueil}  />
      <Utilisateur Utilisateur={utilisateur}  />
      <Medecins Medecin={medecin}  />
      <Demende Demende={demende}  />
      </>
  );
};

export default Items;
