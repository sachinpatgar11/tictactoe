// src/App.jsx
import React from "react";
import TicTacToe from "./TicTacToe";

const App = () => {
  return (
    <div className="h-screen bg-gradient-to-r from-blue-200 to-blue-400">
      <TicTacToe />
    </div>
  );
};

export default App;
