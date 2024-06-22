/**@jsxRuntime classic*/
/**@jsx jsx */
import { css, jsx } from "@emotion/react";

const Buttons = ({ Setmembre, setCarte, SetDemende }) => {
 

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
            font-size: 1.2rem;
            margin: auto;
           
          }
        }
      `}
    >

      <button
        onClick={() => {
          Setmembre(true);
          setCarte(false);
          SetDemende(false);
        }}
      >
        <span>Nos membres</span>
      </button>

      <button
        onClick={() => {
          Setmembre(false);
          setCarte(true);
          SetDemende(false);
        }}
      >
        <span>Carte des Emplacements</span>
      </button>

      <button
        onClick={() => {
          Setmembre(false);
          setCarte(false);
          SetDemende(true);
        }}
      >
        <span>Les attentes</span>
      </button>

    
     
    </div>
  );
};

export default Buttons;
