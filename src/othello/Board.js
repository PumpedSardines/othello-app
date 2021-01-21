import { BLACK, WHITE, isValidColor } from "./Othello.js";

class Board {
	constructor(options = {}) {
		// Setup board
		this.xSize = options.xSize || 8;
		this.ySize = options.ySize || 8;

		if (this.xSize < 4 || this.ySize < 4) {
			throw new Error("Othello board can't be smaller than 4 tiles");
		}

		this.board = new Array(this.xSize).fill(0).map(_ => new Array(this.ySize).fill(null));

		// Place start position
		if (options.startPosition === true) {
			// Cur == current
			const xCur = Math.floor(this.xSize / 2) - 1;
			const yCur = Math.floor(this.xSize / 2) - 1;

			this.setPos(xCur, yCur, BLACK)
				.setPos(xCur, yCur + 1, WHITE)
				.setPos(xCur + 1, yCur, WHITE)
				.setPos(yCur + 1, xCur + 1, BLACK);
		}

		if (options.tiles) {

			// A lot of checking to make sure tiles is an ok to use array.
			/*
				options.tiles must be
				* An array 
				* be of length of 4 or higher

				every item in options.tiles must be
				* An array
				* be of length of 4 or higher
				* have the same length as every other item
			*/
			if (!Array.isArray(options.tiles)) {
				throw new Error("Tiles must be an array");
			}
			if (options.tiles.length < 4) {
				throw new Error("Othello board can't be smaller than 4 tiles");
			}

			// This is a check to know if all items in tiles are arrays and are the same length
			let length = null;
			for (const item of options.tiles) {
				if (!Array.isArray(item)) {
					throw new Error("Every item in tiles must be an array");
				}
				if (length === null) {
					length = item.length;

					if (length < 4) {
						throw new Error("Othello board can't be smaller than 4 tiles");
					}
				} else if (item.length != length) {
					throw new Error("All arrays in tiles must be the same length");
				}
			}

			this.xSize = options.tiles.length;
			this.ySize = length;

			// Loops trouch all items in tiles and verifys that every item is a valid color
			options.tiles.map(array => array.map(v => isValidColor(v) ||
				(() => { throw new Error(`Every tile in options.tiles must be a valid color`) })()
			));

			this.board = options.tiles;

		}
	}

	getPos(x, y) {
		// In order to prevent flipping we need to invery x y for these functions

		if (!this.isValidPos(y, x)) {
			throw new Error(`Position { x: ${x}, y: ${y} } is out of bounds`);
		}

		return this.board[y][x];
	}

	setPos(x, y, color) {
		// In order to prevent flipping we need to invery x y for these functions

		if (!isValidColor(color)) {
			throw new Error(`Color: ${color} isn't recognized`);
		}

		if (!this.isValidPos(y, x)) {
			throw new Error(`Position { x: ${x}, y: ${y} } is out of bounds`);
		}

		this.board[y][x] = color;
		return this;
	}

	makeMove(x, y, color) {
		// In order to prevent flipping we need to invery x y for these functions

		if (!isValidColor(color)) {
			throw new Error(`Color: ${color} isn't recognized`);
		}

		if (!this.isValidPos(y, x)) {
			throw new Error(`Position { x: ${x}, y: ${y} } is out of bounds`);
		}

		if (this.getPos(x, y) !== null) {
			throw new Error(`Cannot make move on tile that isn't empty`);
		}

		const newBoard = JSON.parse(JSON.stringify(this.board));
		const getScore = (array) => array.map(v => v.reduce((a, c) => (c == BLACK ? -1 : (c == WHITE ? 1 : 0)) + a, 0)).reduce((a, c) => a + c, 0);
		const startScore = getScore(newBoard);

		// Direction is an array with direcitons for example [-1,-1] [0, -1] [1, 1]
		const directions = [...new Array(9).keys()].map(v => ([v % 3 - 1, Math.floor(v / 3) - 1])).filter(([x,y]) => !(x === 0 && y === 0));
		for (const [xDir, yDir] of directions) {
			
			const positions = [];
			for(let i = 1; i < this.xSize + this.ySize; i++ ) {

				const xCur = xDir * i + y;
				const yCur = yDir * i + x;

				if(xCur < 0 || xCur >= this.xSize || yCur < 0 || yCur >= this.ySize) {
					break;
				}

				if(newBoard[xCur][yCur] === null) {
					break;
				}

				positions.push({x: xCur, y: yCur});

				if(newBoard[xCur][yCur] === color) {
					positions.forEach(({x: xBac, y: yBac}) => {
						newBoard[xBac][yBac] = color;
					});
					break;
				}
			}

		}

		if(startScore == getScore(newBoard)) {
			throw new Error(`Move didn't change anything`);
		}

		newBoard[y][x] = color;
		
		this.board = newBoard;

		return this;
	}

	getPlaceable(color) {
		const positions = [];

		for(let x = 0; x < this.xSize; x++) {
			for(let y = 0; y < this.ySize; y++) {
				try {
					const moveBoard = this.clone();
					moveBoard.makeMove(x,y,color);
					positions.push({
						x,
						y
					});
				}catch (err) {}
			}
		}

		return positions;
	}

	clone() {
		return new Board({tiles: this.board});;
	}

	// Helper functions

	isValidPos(x, y) {
		// In order to prevent flipping we need to invery x y for these functions
		return x >= 0 && y >= 0 && x < this.xSize && y < this.ySize;
	}

}

export default Board;
