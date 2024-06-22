 import React from "react";

import Carte from "./Carte";
import Utilisateurs from "./Utilisateur";
import Demende from "./Demende";

const Items = ({membre, carte,  demende }) => {



  return (
   <>
      <Utilisateurs utilisateurs={membre}  />
      <Carte carte={carte}  />
      <Demende demende={demende}  />
      </>
  );
};

export default Items;
