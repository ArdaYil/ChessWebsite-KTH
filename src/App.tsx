const App = () => {
  const generateChessBoard = () => {
    const board = [];
    const startingFEN =
      "r4k1r/2pbnppp/4p3/p1Ppb3/1p6/1PNPP1P1/P1n2PBP/1R2R1K1 w - - 0 17";

    const getIcon = (char: string) => {
      switch (char) {
        case "r":
          return "src/assets/pieces/black/rook.png";
        case "n":
          return "src/assets/pieces/black/knight.png";
        case "b":
          return "src/assets/pieces/black/bishop.png";
        case "q":
          return "src/assets/pieces/black/queen.png";
        case "k":
          return "src/assets/pieces/black/king.png";
        case "p":
          return "src/assets/pieces/black/pawn.png";
        case "R":
          return "src/assets/pieces/white/rook.png";
        case "N":
          return "src/assets/pieces/white/knight.png";
        case "B":
          return "src/assets/pieces/white/bishop.png";
        case "Q":
          return "src/assets/pieces/white/queen.png";
        case "K":
          return "src/assets/pieces/white/king.png";
        case "P":
          return "src/assets/pieces/white/pawn.png";
      }
    };

    const isNumeric = (str: string) => {
      if (typeof str != "string") return false;
      return !isNaN(parseInt(str)) && !isNaN(parseFloat(str));
    };

    const convertFENtoArray = (FEN: string) => {
      const array = [];
      const board = FEN.split(" ")[0];

      for (let file of board.split("/")) {
        const newArray = [];

        for (let square of file.split("")) {
          if (isNumeric(square)) {
            const number = parseInt(square);

            for (let i = 0; i < number; i++) newArray.push("-");
            continue;
          }

          newArray.push(square);
        }

        array.push(newArray);
      }

      return array;
    };

    const boardArray = convertFENtoArray(startingFEN);
    console.log(boardArray);
    for (let fileIndex in boardArray) {
      const file = boardArray[fileIndex];

      for (let rankIndex in file) {
        const rank = file[rankIndex];
        const color =
          (parseInt(fileIndex) + parseInt(rankIndex)) % 2 === 0
            ? "light"
            : "dark";
        board.push(
          <div className={`square ${color}`}>
            {boardArray[fileIndex][rankIndex] !== "-" && (
              <img src={getIcon(boardArray[fileIndex][rankIndex])} />
            )}
          </div>
        );
      }

      console.log(board);
    }

    return <div className="board">{board}</div>;
  };

  return generateChessBoard();
};

export default App;
