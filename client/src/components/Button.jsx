// src/components/tailwind/ui/button.jsx
export const Button = ({ children, className = "", ...props }) => {
  return (
    <button
      className={`px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
