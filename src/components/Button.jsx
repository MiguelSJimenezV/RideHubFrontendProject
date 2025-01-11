const Button = ({ label, onClick, type = "button", color = "blue" }) => {
    const baseStyles = "py-2 px-4 rounded-md font-bold text-white focus:outline-none focus:ring-2 focus:ring-offset-2";
    const colorStyles = color === "blue" ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-500 hover:bg-gray-600";
  
    return (
      <button
        type={type}
        onClick={onClick}
        className={`${baseStyles} ${colorStyles}`}
      >
        {label}
      </button>
    );
  };
  
  export default Button;
  