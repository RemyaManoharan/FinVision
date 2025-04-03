import React from "react";
import finlogo from "../../assets/finlogo.svg";

const Header = () => {
  const isAuthenticatedUser = false;
  return (
    <div className="w-full p-8 flex items-center justify-between">
      <div className="flex text-lg font-bold">
        <img src={finlogo} alt="logo" className="w-10 h-10 mr-2" />
        <h2>Fin Vision</h2>
      </div>
      {!isAuthenticatedUser ? (
        <div className="flex gap-4">
          <button className="btn btn-outline">Login</button>
          <button className="btn btn-primary">Sign up</button>
        </div>
      ) : (
        <div className="flex items-center">
          <div className="relative">
            <button className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-lg font-medium text-gray-700">U</span>
            </button>
            // add a dropdown menu here when clicked
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
