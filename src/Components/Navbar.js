
import Buttons from "./Buttons";
import logo from"../img/medwise.png";

const Navbar = ({ SetAccueil, SetUtilisateur, SetMedecin, SetDemende }) => {


  return (
    <div
      className="Navbar"
      
    >

<img className="logoimg"  src={logo} alt="logo"   /> 
    
    
      <Buttons
        className="Buttons"
        SetAccueil={SetAccueil}
        SetUtilisateur={SetUtilisateur}
        SetMedecin={SetMedecin}
        SetDemende={SetDemende}
      />
      <div className="logo-container">
      <h3 className="logo" >MedWise</h3>
      </div>
      </div>
  );
};

export default Navbar;
