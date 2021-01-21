const COLOR = {
	Black: "black",
	White: "white"
}

function isValidColor(color) {
	return Object.values(COLOR).includes(color) || color === null;
}

export const BLACK = COLOR.Black;
export const WHITE = COLOR.White;
export {
	isValidColor
}
