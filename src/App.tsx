import { useEffect, useRef, useState } from "react";

const App = () => {
  const [FEN, setFEN] = useState(
    "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R"
  );

  const [legalMoves, setLegalMoves] = useState<number[][]>([]);
  const [grabbed, setGrabbed] = useState<string>("");

  const [currentPiece, setCurrentPiece] = useState<HTMLImageElement | null>(
    null
  );

  const boardRef = useRef<HTMLDivElement>(null);

  const readStream = async (stream: ReadableStream) => {
    const reader: ReadableStreamDefaultReader = stream.getReader();
    const decoder = new TextDecoder("utf-8");

    while (true) {
      const { done, value }: ReadableStreamReadResult<Uint8Array> =
        await reader.read();

      if (done) {
        console.log("Stream is done reading.");
        break;
      }

      console.log("Received chunk: ", decoder.decode(value));
    }
  };

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

  const movePiece = (e: MouseEvent) => {
    e.preventDefault();

    if (currentPiece === null) return;
    if ((e.buttons & 1) !== 1) return;

    currentPiece.style.left = `${e.clientX - 25}px`;
    currentPiece.style.top = `${e.clientY - 25}px`;
  };

  const generateChessBoard = () => {
    const boardArray = convertFENtoArray(FEN);
    const board = [];

    for (let fileIndex in boardArray) {
      const file = boardArray[fileIndex];

      for (let rankIndex in file) {
        let color =
          (parseInt(fileIndex) + parseInt(rankIndex)) % 2 === 0
            ? "light"
            : "dark";

        if (grabbed) {
          for (let legalMove of legalMoves[grabbed as any] as any) {
            if (legalMove[0] == fileIndex && legalMove[1] == rankIndex) {
              color = "move";
              break;
            }
          }
        }

        board.push(
          <div
            key={"square " + fileIndex + " " + rankIndex}
            className={`square ${color}`}
          >
            {boardArray[fileIndex][rankIndex] !== "-" && (
              <img
                key={"img " + fileIndex + " " + rankIndex}
                draggable="false"
                className={`piece ${boardArray[fileIndex][rankIndex]}`}
                src={getIcon(boardArray[fileIndex][rankIndex])}
                id={`${fileIndex}:${rankIndex}`}
              />
            )}
          </div>
        );
      }
    }

    return (
      <div ref={boardRef} className="board" id={FEN}>
        {board}
      </div>
    );
  };

  const getSquare = (mouseX: number, mouseY: number) => {
    const boardElement = boardRef.current;

    if (!boardElement) return;

    for (let index in boardElement.children) {
      const square = boardElement.children[index];

      const { x: x1, y: y1, width, height } = square.getBoundingClientRect();
      const x2 = x1 + width;
      const y2 = y1 + height;

      if (mouseX > x1 && mouseX < x2 && mouseY > y1 && mouseY < y2) {
        return {
          square,
          row: Math.ceil((parseInt(index) + 1) / 8) - 1,
          col: parseInt(index) % 8,
        };
      }
    }
  };

  const removeGrabbedPiece = (e: MouseEvent) => {
    const result = getSquare(e.clientX, e.clientY);

    if (!result) return;

    const { row, col } = result;

    changeFEN("-", row, col);
  };

  const grabPiece = (e: MouseEvent) => {
    const element = e.target as HTMLElement;

    if (element.classList.contains("piece") && currentPiece === null) {
      // currentPiece = document.createElement("img");
      // currentPiece.draggable = false;
      // currentPiece.className = element.className;
      // currentPiece.src = getIcon(
      //   element.className.replace("piece ", "")
      // ) as string;

      //document.querySelector("#root")?.appendChild(currentPiece);

      element.style.position = "absolute";
      element.style.left = `${e.clientX - 25}px`;
      element.style.top = `${e.clientY - 25}px`;
      element.style.width = `75px`;
      element.style.height = `$75px`;

      setGrabbed(element.id);

      setCurrentPiece(element as HTMLImageElement);
    }
  };

  const convertBoardToFEN = (board: string[][]) => {
    let newFEN = "";

    for (let rowIndex in board) {
      const row = board[parseInt(rowIndex)];
      let toSkip = 0;

      for (let squareIndex in row) {
        const square = row[squareIndex];

        if (square === "-") {
          toSkip++;
        } else {
          if (toSkip > 0) {
            newFEN += toSkip;
            toSkip = 0;
          }

          newFEN += square;
        }

        if (parseInt(squareIndex) === 7) {
          if (toSkip > 0) {
            newFEN += toSkip;
            toSkip = 0;
          }

          if (parseInt(rowIndex) === 7) break;

          newFEN += "/";
        }
      }
    }

    return newFEN + " w KQkq - 0 1";
  };

  const changeFEN = (piece: string, row: number, col: number) => {
    const board = convertFENtoArray(FEN);
    board[row][col] = piece;

    console.log(board);

    setFEN(convertBoardToFEN(board));
  };

  const placePiece = (e: MouseEvent) => {
    if (!currentPiece) return;

    const result = getSquare(e.clientX, e.clientY);

    if (!result) return;
    const { row, col } = result;

    const piece = currentPiece.className.replace("piece ", "");

    currentPiece.remove();
    setCurrentPiece(null);

    changeFEN(piece, row, col);
  };

  useEffect(() => {
    document.addEventListener("mousemove", movePiece);
    document.addEventListener("mouseup", placePiece);
    document.addEventListener("mousedown", grabPiece);

    const requestBody = JSON.stringify({ board: FEN.trim() });
    console.log("Request Body:", requestBody); // Log the JSON

    fetch("http://127.0.0.1:7878", {
      method: "POST",
      body: requestBody,
      headers: {
        "Content-Type": "application/json", // Change to application/json
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json(); // Parse as JSON
      })
      .then((data) => {
        setLegalMoves(data.message); // Access the message from the JSON response
      })
      .catch((error) => {
        console.error("Error fetching data from Rust server:", error);
      });

    return () => {
      document.removeEventListener("mousemove", movePiece);
      document.removeEventListener("mouseup", placePiece);
      document.addEventListener("mousedown", grabPiece);
    };
  }, [FEN, currentPiece]);

  return <>{generateChessBoard()}</>;
};

export default App;
