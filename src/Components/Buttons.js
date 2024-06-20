/**@jsxRuntime classic*/
/**@jsx jsx */
import { css, jsx } from "@emotion/react";

const Buttons = ({ SetAccueil, SetUtilisateur, SetMedecin, SetDemende }) => {
 

  return (
    <div
      className="Buttons"
      css={css`
        display: flex;

        button {
          margin: 0 2rem;
          border: none;
          padding: 10px;
          cursor: pointer;
          transition: 0.3s linear;
          outline: none;

         

          &::after {
            content: "";
            display: block;
            height: 2px;
            width: 0;
            background: #24242a;
            transition: width 0.3s ease-in;
          }

          &:hover::after {
            width: 100%;
          }

          span {
            padding: 0 5px;
            font-family: "Poppins", sans-serif;
            font-weight: 600;
            font-size: 1rem;
            margin: auto;
           
          }
        }
      `}
    >


      <button
        onClick={() => {
          SetAccueil(true);
          SetUtilisateur(false);
          SetMedecin(false);
          SetDemende(false);
        }}
      >
        <span>Accueil</span>
      </button>

      <button
        onClick={() => {
          SetAccueil(false);
          SetUtilisateur(true);
          SetMedecin(false);
          SetDemende(false);
        }}
      >
        <span>Nos utilisateurs</span>
      </button>

      <button
        onClick={() => {
          SetAccueil(false);
          SetUtilisateur(false);
          SetMedecin(true);
          SetDemende(false);
        }}
      >
        <span>Nos Médecin</span>
      </button>

      <button
        onClick={() => {
          SetAccueil(false);
          SetUtilisateur(false);
          SetMedecin(false);
          SetDemende(true);
        }}
      >
        <span>Demande d'adhésion</span>
      </button>
     
    </div>
  );
};

export default Buttons;
