import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

const PrimaryButton = ({ onClick = () => {}, children, disabled = false }) => {
  return (
    <button
      className="flex items-center justify-between bg-gray-100 py-2 px-4  rounded-full shadow-md hover:shadow-lg 
      transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200"
      onClick={onClick}
      disabled={disabled}
    >
      <div className="flex-grow text-center text-gray-700 font-medium">
        {children}
      </div>
      <div className="bg-red-600 text-white rounded-full w-1 h-2 flex items-center justify-center ml-2 shadow-md p-3 hover:bg-red-800 transition duration-300">
        <FontAwesomeIcon icon={faChevronRight} />
      </div>
    </button>
  );
};

export default PrimaryButton;
