import React, { useRef, useEffect, useState } from "react";
import io from "socket.io-client";
import { useParams } from "react-router-dom";

const socket = io("http://localhost:5005", { transports: ["websocket"] });

const Board = ({ color, stroke, erase }) => {
  const { roomId } = useParams();
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Set canvas dimensions to fit within viewport without scrolling
    const maxWidth = window.innerWidth * 0.9;
    const maxHeight = window.innerHeight * 0.7; // Leaves space for controls
    canvas.width = maxWidth;
    canvas.height = maxHeight;
    canvas.style.backgroundColor = "white";

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctxRef.current = ctx;

    if (roomId) socket.emit("join-room", { roomId });

    socket.on("canvas-data", (data) => {
      const img = new Image();
      img.src = data;
      img.onload = () => ctx.drawImage(img, 0, 0);
    });

    socket.on("clear-canvas", () => clearCanvas(true));

    return () => {
      socket.off("canvas-data");
      socket.off("clear-canvas");
    };
  }, [roomId]);

  const getMousePos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e) => {
    // Don't start drawing if clicking on the clear button
    if (e.target.tagName === 'BUTTON') return;
    
    const { x, y } = getMousePos(e);
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const { x, y } = getMousePos(e);

    ctxRef.current.strokeStyle = erase ? "white" : color;
    ctxRef.current.lineWidth = erase ? stroke * 2 : stroke;
    ctxRef.current.globalCompositeOperation = erase ? "destination-out" : "source-over";

    ctxRef.current.lineTo(x, y);
    ctxRef.current.stroke();

    socket.emit("draw", { x, y, color, stroke, erase, roomId });
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    ctxRef.current.closePath();
    setIsDrawing(false);
    socket.emit("canvas-data", { roomId, data: canvasRef.current.toDataURL("image/png") });
  };

  const clearCanvas = (fromSocket = false) => {
    const canvas = canvasRef.current;
    ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);
    if (!fromSocket) socket.emit("clear-canvas", { roomId });
  };

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        className="border border-gray-300 rounded-lg shadow-lg bg-white cursor-crosshair"
      />
      <button 
        onClick={(e) => {
          e.stopPropagation(); // Prevent drawing when clicking the button
          clearCanvas(false);
        }}
        className="absolute right-1/2 bottom-4 px-4 py-2 bg-black text-white rounded-lg shadow transition-all duration-200 hover:bg-white hover:text-black hover:text-xl hover:border-2 hover:border-black"
      >
        Clear Canvas
      </button>
    </div>
  );
};

export default Board;