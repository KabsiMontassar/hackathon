/**@jsxRuntime classic*/
/**@jsx jsx */
import { css, jsx } from "@emotion/react";

const Buttons = ({ Setmembre, setCarte, SetDemende , SetAchievement , SetProducts }) => {
 

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
          background: none;

         

          &::after {
            content: "";
            display: block;
            height: 2px;
            width: 0;
            background: #476930;
            transition: width 0.3s ease-in;
           
          }

          &:hover::after {
            width: 100%;
         
          }

          span {
            padding: 0 5px;
            font-family: "Poppins", sans-serif;
            font-weight: 600;
            font-size: 1.2rem;
            margin: auto;

             &:hover {
             color : #476930;
         
          }
           
          }
        }
      `}
    >

      <button
        onClick={() => {
          Setmembre(true);
          setCarte(false);
          SetDemende(false);
          SetProducts(false);
          SetAchievement(false);
        }}
      >
        <span>Nos membres</span>
      </button>

      <button  
        onClick={() => {
          Setmembre(false);
          setCarte(true);
          SetDemende(false);
          SetProducts(false);
          SetAchievement(false);
        }}
      >
        <span>Carte des Emplacements</span>
      </button>

      <button
        onClick={() => {
          Setmembre(false);
          setCarte(false);
          SetDemende(true);
          SetProducts(false);
          SetAchievement(false);
        }}
      >
        <span>Les attentes</span>
      </button>
      <button
        onClick={() => {
          Setmembre(false);
          setCarte(false);
          SetDemende(false);
          SetProducts(true);
          SetAchievement(false);
        }}
      >
        <span>Products</span>
      </button>
      <button
        onClick={() => {
          Setmembre(false);
          setCarte(false);
          SetDemende(false);
          SetProducts(false);
          SetAchievement(true);
        }}
      >
        <span>Achievements</span>
      </button>

    
     
    </div>
  );
};

export default Buttons;
