import React from "react";

interface ChildProps {
  addMessage: (pesan: string) => void;
}

const PaginationComponent = ({ addMessage }: ChildProps) => {
  const handleMessage = () => {
    addMessage("sent it");
  };
  return (
    <div>
      <button
        className="p-2 border rounded bg-blue-500 text-white"
        onClick={() => handleMessage()}
      >
        click me
      </button>
    </div>
  );
};

export default PaginationComponent;
