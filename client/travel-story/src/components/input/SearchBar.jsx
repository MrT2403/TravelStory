import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { useSearch } from "../../contexts/SearchContext";
import { useEffect } from "react";

const SearchBar = ({ onClear }) => {
  const { searchQuery, setSearchQuery, onSearchClick } = useSearch();

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchQuery) {
        onSearchClick();
      }
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="w-80 flex items-center justify-between px-4 bg-slate-100 rounded-md">
      <input
        type="text"
        value={searchQuery}
        onChange={handleInputChange}
        placeholder="Enter search query"
        className="w-full text-xs bg-transparent py-[11px] outline-none"
      />

      {searchQuery && <IoMdClose onClick={onClear} />}

      <FaMagnifyingGlass
        className="text-slate-400 text-xl cursor-pointer hover:text-black ml-3"
        onClick={onSearchClick}
      />
    </div>
  );
};

export default SearchBar;
