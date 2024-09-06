const App = () => {
  const generateChessBoard = () => {
    const board = [];

    for (let file = 0; file < 8; file++) {
      for (let rank = 0; rank < 8; rank++) {
        board.push(
          <div className={(file + rank) % 2 === 0 ? "light" : "dark"} />
        );
      }
    }

    return <div className="board">{board}</div>;
  };

  return generateChessBoard();
};

export default App;
