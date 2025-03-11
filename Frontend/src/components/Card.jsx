const Card = ({ children, className = "" }) => {
    return (
      <div className={`bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 ${className}`}>
        {children}
      </div>
    );
  };
  
  export default Card;
  