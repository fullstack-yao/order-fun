import React from "react";
import Logo from "../logo1.png";

const Header = () => {
  return (
      // <nav className="grey lighten-2">
        <div className="">
          {/* <a href="#" className="brand-logo center">
            Order Fun
          </a> */}
          <img src={Logo} alt="" className="logo-img" />
        </div>
  );
};

export default Header;
