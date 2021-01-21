import Board from "./Board.js";
import { BLACK, WHITE, isValidColor } from "./Othello.js";


const expreimentTiles = [
	[null, null, null, null, null],
	[null, BLACK, null, null, null],
	[null, null, WHITE, BLACK, null],
	[null, null, null, null, null],
	[null, null, null, null, null],
];

class Game {
	constructor(selector, board = new Board({ startPosition: true })) {
		this.board = board;
		this.canvas = document.querySelector(selector);
		if (this.canvas == null) {
			// Given selector didn't find any elements
			throw new Error(`Didn't find any element matching (${selector})`);
		}
		if (this.canvas.tagName.toLowerCase() != "canvas") {
			// Given element isn't a canvas
			throw new Error(`Element matching (${selector}) isn't of tag "canvas"`);
		}

		this.ctx = this.canvas.getContext('2d');

		this.players = {
			[BLACK]: {
				func: () => new Promise(() => { }),
				showPlaceable: true
			},
			[WHITE]: {
				func: () => new Promise(() => { }),
				showPlaceable: true
			}
		};
		this.turn = BLACK;

		// on "function" arrays
		// these are called on things
		this.onMoveFunctions = [];
	}

	setPlayer(color, options = {}, func) {
		if (!isValidColor(color)) {
			throw new Error(`Color ${color} isn't a valid color`);
		}
		this.players[color].func = func;
		this.players[color].showPlaceable = options.showPlaceable || this.players[color].showPlaceable;
		return this;
	}

	onMove(func) {
		this.onMoveFunctions.push(func);
		return this;
	}

	/**
	 * Resets the canvas
	 */
	updateCanvas() {
		const { canvas } = this;

		const parent = canvas.parentElement;
		const smallestSize = parent.clientWidth < parent.clientHeight ? parent.clientWidth : parent.clientHeight

		canvas.width = smallestSize;
		canvas.height = smallestSize;

		this.render();
		return this;
	}

	/**
	 * Initilizes the board
	 */
	intilize() {
		this.updateCanvas();

		window.addEventListener("resize", _ => this.updateCanvas());

		this.players[BLACK].func({ bord: this.board.clone() }).then(v => {

		})

		return this;
	}

	async runMove() {
		if (this.turn === BLACK) {
			const move = await this.players[BLACK].func(this);
			this.board.makeMove(move.x, move.y, BLACK);
		} else {
			const move = await this.players[WHITE].func(this);
			this.board.makeMove(move.x, move.y, WHITE);
		}
		this.runMove();
	}

	/**
	 * Renders the board on the canvas
	 */
	render() {
		const { ctx, canvas: { width }, board } = this;
		const tileSize = width / board.xSize;
		const placeableTiles = board.getPlaceable(BLACK);

		for (let x = 0; x < board.xSize; x++) {
			for (let y = 0; y < board.ySize; y++) {
				// Get information about the current tiles
				const color = board.getPos(x, y);


				// First go trough and draw every tile
				ctx.beginPath();
				ctx.rect(tileSize * x, tileSize * y, tileSize, tileSize);

				ctx.fillStyle = "#58a17d";
				ctx.strokeStyle = "#376e53";
				ctx.fill();
				ctx.stroke();

				// Draw tiles

				if (color !== null) {
					switch (color) {
						case BLACK:
							ctx.fillStyle = "#000";
							break;
						case WHITE:
							ctx.fillStyle = "#fff";
							break;
					}
					ctx.beginPath();
					ctx.ellipse(tileSize * x + tileSize / 2, tileSize * y + tileSize / 2, tileSize / 2 * 0.9, tileSize / 2 * 0.9, 0, 0, 2 * Math.PI);
					ctx.fill();
				}


			}
		}

		placeableTiles.forEach(({ x, y }) => {
			ctx.fillStyle = "#0004";
			ctx.beginPath();
			ctx.ellipse(tileSize * x + tileSize / 2, tileSize * y + tileSize / 2, tileSize / 2 * 0.9, tileSize / 2 * 0.9, 0, 0, 2 * Math.PI);
			ctx.fill();
		})

		return this;
	}
}

export default Game;
