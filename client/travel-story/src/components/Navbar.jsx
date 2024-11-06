/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import LOGO from "../assets/logo.png";
import ProfileInfo from "./cards/ProfileInfo.jsx";
import SearchBar from "./input/SearchBar.jsx";
import { useSearch } from "../contexts/SearchContext.jsx";

const Navbar = ({ userInfo }) => {
  const { searchQuery, clearSearch } = useSearch();
  const navigate = useNavigate();

  const isToken = localStorage.getItem("token");

  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow sticky top-0 z-10">
      <img src={LOGO} alt="Travel Story" className="h-20" />
      {isToken && (
        <>
          <SearchBar value={searchQuery} onClear={clearSearch} />
          <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
        </>
      )}
    </div>
  );
};

export default Navbar;
