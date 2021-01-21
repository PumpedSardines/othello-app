import Game from "./othello/Game.js";
import { BLACK, WHITE } from "./othello/Othello.js";

const game = new Game("#othello-game")

game.setPlayer(BLACK, {},
	async (canvas, board) => {
		const event = (e) => {
			console.log(e.clientX)
		}
	}
).intilize();
