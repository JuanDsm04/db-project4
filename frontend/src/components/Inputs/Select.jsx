
import { useState, useRef, useEffect} from "react";


export const Select = ({ 
  text, 
  value,
  options, 
  valueKey = 'id',
  displayKey = "name",
  onChange

}) => {
  const [filteredOptions, setFilteredOptions] = useState(options || []);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFiltering, setIsFiltering] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (typeof value === "string") {
      // Si el value es solo un string (location), buscamos la opción correspondiente en options
      const selected = options.find(option => option[displayKey] === value);
      if (selected) {
        setSearchQuery(selected[displayKey]);
        setSelectedOption(selected);
      }
    } else if (value) {
      // Si el value es un objeto, lo asignamos directamente
      setSearchQuery(value[displayKey]);
      setSelectedOption(value);
    }
  }, [value, options]);

  
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    
    if (query) {
      setIsFiltering(true); // Activamos el estado de filtro
      const newFilteredOptions = (options || []).filter(option =>
        option[displayKey]?.toLowerCase().includes(query.toLowerCase())
      );

      setFilteredOptions(newFilteredOptions);
    } else {
      setIsFiltering(false); // Si la búsqueda está vacía, no estamos filtrando
      setFilteredOptions(options); // Mostramos todas las opciones
    }
  };


  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setSearchQuery(option[displayKey]); 
    setFilteredOptions(options); 
    setIsDropdownOpen(false);
    if (onChange) {
      onChange(option); // Emitir el cambio hacia el componente padre
    }

  };

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
    if (!isDropdownOpen) {
      setFilteredOptions(options);
    }
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
    <div className="contentInputSelect">
    
      <p className='titleInput'> {text} </p>
      <input
        type="text"
        //value={(value?.[displayKey] ?? value ?? searchQuery) || ""}
        value= {searchQuery}
        onChange={handleSearchChange}
        onClick={toggleDropdown}
        placeholder="Buscar opción..."
        className="inputStyle"
        ref={inputRef}
      />
    {isDropdownOpen && filteredOptions.length > 0 && (

        <div className="dropdown" ref={dropdownRef}>
          {filteredOptions.map((option) => (
            <div
              key={option[valueKey]}
              className="dropdown-item"
              onClick={() => handleOptionSelect(option)}
            >
              {option[displayKey]}
            </div>
          ))}
        </div>
      )}
      
    </div>
  );
};


