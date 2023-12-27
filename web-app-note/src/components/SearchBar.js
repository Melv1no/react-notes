import React from "react";

const SearchBar = ({ searchTerm, handleSearch, handleKeyDown }) => {
  return (
    <div className="SearchBar">
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default SearchBar;
