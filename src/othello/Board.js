const COLOR = {
	Black: "black",
	White: "white"
}

class Board {
	constructor(options = {}) {
		this.options = options // Used to

		// Setup board
		this.xSize = options.xSize || 8;
		this.ySize = options.ySize || 8;

		if (this.xSize <= 4 || this.ySize <= 4) {
			throw new Error("Othello board can't be smaller than 4 tiles");
		}

		this.board = new Array(this.xSize).fill(0).map(_ => new Array(this.ySize).fill(null));

		// Place start position
		if (options.startPosition === true) {
			// Cur == current
			const xCur = Math.floor(this.xSize / 2) - 1;
			const yCur = Math.floor(this.xSize / 2) - 1;

			this.setPos(xCur, yCur, COLOR.Black)
				.setPos(xCur, yCur + 1, COLOR.White)
				.setPos(xCur + 1, yCur, COLOR.White)
				.setPos(yCur + 1, xCur + 1, COLOR.Black);
		}
	}

	getPos(x, y) {
		if (!this.isValidPos(x, y)) {
			throw new Error(`Position { x: ${x}, y: ${y} } is out of bounds`);
		}

		return this.board[x][y];
	}

	getPlaceable() {
		return [{ x: 0, y: 0 }];
	}

	setPos(x, y, color) {
		if (!this.isValidColor(color)) {
			throw new Error(`Color: ${color} isn't recognized`);
		}

		if (!this.isValidPos(x, y)) {
			throw new Error(`Position { x: ${x}, y: ${y} } is out of bounds`);
		}

		this.board[x][y] = color;
		return this;
	}

	// Helper functions
	isValidColor(color) {
		return Object.values(COLOR).includes(color);
	}

	isValidPos(x, y) {
		return x >= 0 && y >= 0 && x < this.xSize && y < this.ySize;
	}
}

export default Board;
export {
	COLOR
}
