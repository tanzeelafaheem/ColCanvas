import React, { useState } from "react";
import Board from "../components/Board";
import { useParams } from "react-router-dom";
import { FaEraser } from "react-icons/fa";
import { IoMdExit } from "react-icons/io";

const Container = () => {
  const { roomId } = useParams();
  const [color, setColor] = useState("#000000");
  const [stroke, setStroke] = useState(3);
  const [erase, setErase] = useState(false);

  const handleColor = (value) => {
    setColor(value)
    setErase(false);
  };
  const handleStroke = (value) => setStroke(value);
  const Erase = () => {
    setErase(true);
  }

  return (
    <div className="flex flex-col items-center justify-start h-screen bg-gray-100 pt-4">
      <h2 className="text-gray-700 absolute top-2 right-5 m-0 text-lg font-semibold">
        Room ID: {roomId}
      </h2>
      
      <div className="flex items-center gap-3 mb-4 p-3 bg-white rounded-lg shadow-md">
        <input 
          type="color" 
          onChange={(e) => handleColor(e.target.value)}
          className="w-10 h-10 cursor-pointer border border-gray-300 rounded"
        />
        <input 
          type="range" 
          min="1" 
          max="20" 
          value={stroke}
          onChange={(e) => handleStroke(e.target.value)}
          className="w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <span className="text-sm text-gray-600 w-8">{stroke}</span>
        <button 
          onClick={Erase}
          className={`p-2 rounded-full transition-colors ${erase ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200'}`}
        >
          <FaEraser size={24} />
        </button>
        <button className="p-1 text-black cursor-pointer" onClick={() => window.location.href = '/'}>
        <IoMdExit size={28}/>
        </button>
      </div>

      <Board color={color} stroke={stroke} erase={erase}/>
    </div>
  );
};

export default Container;