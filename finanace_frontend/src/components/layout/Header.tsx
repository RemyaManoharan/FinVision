import { Link } from "react-router-dom";
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
          <Link to="/login" className="btn btn-outline">
            Login
          </Link>
          <Link to="/signup" className="btn btn-primary">
            Sign up
          </Link>
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
