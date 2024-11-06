import { createContext, useContext, useState, useCallback } from "react";
import storyApi from "../api/modules/story.api";

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const searchStories = useCallback(async (query) => {
    setLoading(true);
    setError(null);
    setIsSearching(true);

    try {
      const response = await storyApi.searchStory(query);
      console.log("API Response: ", response);
      if (response.error) throw new Error(response.error);

      setSearchResults(response.stories || []);
    } catch (err) {
      setError(err.message || "Error occurred during search.");
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  }, []);

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleSearch = (query) => {
    if (query) {
      searchStories(query);
    }
  };

  const onSearchClick = () => {
    if (searchQuery) {
      handleSearch(searchQuery);
    }
  };

  return (
    <SearchContext.Provider
      value={{
        searchResults,
        searchQuery,
        setSearchQuery,
        loading,
        error,
        clearSearch,
        handleSearch,
        onSearchClick,
        isSearching,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  return useContext(SearchContext);
};
