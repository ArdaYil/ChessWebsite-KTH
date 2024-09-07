const App = () => {
  const generateChessBoard = () => {
    const board = [];

    for (let file = 0; file < 8; file++) {
      for (let rank = 0; rank < 8; rank++) {
        const color = (file + rank) % 2 === 0 ? "light" : "dark";
        board.push(
          <div className={`square ${color}`}>
            <img src="src/assets/pieces/white/king.png" />
          </div>
        );
      }
    }

    return <div className="board">{board}</div>;
  };

  return generateChessBoard();
};

export default App;
