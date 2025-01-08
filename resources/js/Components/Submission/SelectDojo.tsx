import { Dojo } from '@/types';
import { FC, useState } from 'react';

interface SelectDojoProps {
  dojos: Dojo[];
  setSelectedDojo: React.Dispatch<React.SetStateAction<string>>;
}
const SelectDojo: FC<SelectDojoProps> = ({ dojos, setSelectedDojo }) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.length > 0) {
      // Filter dojos based on user input
      const filteredDojos = dojos.filter((dojo) =>
        dojo.name.toLowerCase().includes(value.toLowerCase()),
      );
      setSuggestions(filteredDojos);
    } else {
      setSuggestions([]);
      setSelectedDojo('');
    }
  };
  return (
    <>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        className="mt-4 w-full rounded border border-gray-300 bg-gray-800 px-4 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring"
        placeholder="Select Dojo"
      />
      {suggestions.length > 0 && (
        <div>
          {suggestions.map((dojo) => (
            <div
              key={dojo.id}
              className="cursor-pointer border-b border-gray-700 bg-gray-800 p-2 text-white hover:bg-gray-700"
              onClick={() => {
                setInputValue(dojo.name);
                setSelectedDojo(dojo.id);
                setSuggestions([]);
              }}
            >
              {dojo.name}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default SelectDojo;
