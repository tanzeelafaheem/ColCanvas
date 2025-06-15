import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  const createRoom = () => {
    const newRoomId = Math.random().toString(36).substr(2, 9);
    navigate(`/room/${newRoomId}`);
  };

  const joinRoom = () => {
    if (roomId) navigate(`/room/${roomId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-green-200 to-yellow-200 flex flex-col items-center justify-center p-6">
      <div className="flex items-center mb-8">
        <h1 className="text-5xl font-extrabold text-gray-800 tracking-wide">Collaborative WhiteBoard</h1>
      </div>
      <div className="bg-white bg-opacity-90 rounded-2xl shadow-2xl p-10 w-full max-w-lg">
        <h2 className="text-3xl font-semibold text-gray-600 mb-6 text-center tracking-wide">Join or Create a Room</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="w-full p-4 mb-6 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300"
            aria-label="Enter Room ID to join"
          />
        </div>
        <div className="flex justify-between gap-4">
          <button
            onClick={joinRoom}
            disabled={!roomId}
            className="flex-1 bg-gradient-to-r from-blue-400 to-blue-600 text-white p-4 rounded-xl hover:from-blue-500 hover:to-blue-700 transition-all duration-300 disabled:from-blue-200 disabled:to-blue-300 disabled:cursor-not-allowed"
            aria-label="Join Room"
          >
            Join Room
          </button>
          <button
            onClick={createRoom}
            className="flex-1 bg-gradient-to-r from-green-400 to-green-600 text-white p-4 rounded-xl hover:from-green-500 hover:to-green-700 transition-all duration-300"
            aria-label="Create New Room"
          >
            Create Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;