
import Buttons from "./Buttons";
import logo from"../img/greener.png";

const Navbar = ({ Setmembre, setCarte, SetDemende  , 

  SetProducts,
  SetAchievement
 }) => {


  return (
    <div
      className="Navbar"
      
    >

<img className="logoimg"  src={logo} alt="logo"   /> 
    
    
      <Buttons
        className="Buttons"
        Setmembre={Setmembre}
        setCarte={setCarte}
        SetDemende={SetDemende}
        SetProducts={SetProducts}
        SetAchievement={SetAchievement}

      />
      <div className="logo-container">
      <h3 className="logo" >Greener</h3>
      </div>
      </div>
  );
};

export default Navbar;
