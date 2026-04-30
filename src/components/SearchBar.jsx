import { useState } from 'react';

const SearchBar = ({ onSearch, onLocationSearch, loading }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSearch(inputValue);
    }
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search city, state, country (e.g., Mumbai, IN or New York, NY, US)"
          className="input search-input"
          disabled={loading}
        />
        <button 
          type="submit" 
          className="btn btn-primary search-button"
          disabled={loading || !inputValue.trim()}
        >
          {loading ? (
            <>
              <span className="spinner-small"></span>
              Searching...
            </>
          ) : (
            'Search'
          )}
        </button>
        <button
          type="button"
          onClick={onLocationSearch}
          className="btn btn-secondary location-button"
          disabled={loading}
          title="Use my current location"
          style={{ marginLeft: '10px' }}
        >
          📍
        </button>
      </form>
      <div className="search-examples">
        <p>Try: <span className="example" onClick={() => onSearch('London')}>London</span>, 
          <span className="example" onClick={() => onSearch('Mumbai, IN')}> Mumbai, IN</span>, 
          <span className="example" onClick={() => onSearch('New York, NY, US')}> New York, NY, US</span>, 
          <span className="example" onClick={() => onSearch('Tokyo, JP')}> Tokyo, JP</span>, 
          <span className="example" onClick={() => onSearch('Sydney, AU')}> Sydney, AU</span>
        </p>
      </div>
    </div>
  );
};

export default SearchBar;