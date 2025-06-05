
import { useState, useRef, useEffect} from "react";

export const Select = ({ text, options }) => {
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    
    const newFilteredOptions = options.filter(option =>
      option.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredOptions(newFilteredOptions);
  };


  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setSearchQuery(option); 
    setFilteredOptions(options); 
    etIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target) && !inputRef.current.contains(e.target)) {
      setIsDropdownOpen(false);
    }
  };

    useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);


  return (
    <div className="contentInput">
    
      <p className='titleInput'> {text} </p>
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
        onClick={toggleDropdown}
        placeholder="Buscar opción..."
        className="inputStyle"
      />
    {isDropdownOpen && filteredOptions.length > 0 && (

        <div className="dropdown">
          {filteredOptions.map((option, index) => (
            <div
              key={index}
              className="dropdown-item"
              onClick={() => handleOptionSelect(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
      
    </div>
  );
};


