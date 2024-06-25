 import React from "react";

import Carte from "./Carte";
import Utilisateurs from "./Utilisateur";
import Demende from "./Demende";
import Products from "./products";
import Achievements from "./Achievements";


const Items = ({membre, carte,  demende  , products , achievement}) => {



  return (
   <>
      <Utilisateurs utilisateurs={membre}  />
      <Carte carte={carte}  />
      <Demende demende={demende}  />
      <Products products={products}  />
      <Achievements achievements={achievement}  />

      </>
  );
};

export default Items;
