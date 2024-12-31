import "./style.css"
import {Init} from "./events"
import {
	BLOCK_SIZE,
	BOARD_WIDTH,
	BOARD_HEIGHT,
	DEFAULT_PIECE_POSITION,
	SHAPES
} from "./consts"

const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")

canvas.width = BLOCK_SIZE * BOARD_WIDTH
canvas.height = BLOCK_SIZE * BOARD_HEIGHT

ctx.scale(BLOCK_SIZE, BLOCK_SIZE)

const board = createBoard(BOARD_WIDTH, BOARD_HEIGHT)

let counter = 0
let lastTime = 0

const piece = {
	position: { ...DEFAULT_PIECE_POSITION },
	shape: SHAPES[Math.floor(Math.random() * SHAPES.length)]
}

function update(time = 0) {
	const deltaTime = time - lastTime
	lastTime = time

	counter += deltaTime

	if(counter > 200) {
		piece.position.y++
		counter = 0

		if(checkCollision()) {
			piece.position.y--
			solidify()
		}

	}
	draw()
	window.requestAnimationFrame(update)
}

function draw() {
	ctx.fillStyle = '#000'
	ctx.fillRect(0, 0, canvas.width, canvas.height)

	ctx.lineWidth = 0.05;
	ctx.strokeStyle = "#010";

	ctx.beginPath();

	for (let x = 1; x < BOARD_WIDTH; x++) {
	  ctx.moveTo(x, 0);
	  ctx.lineTo(x, BOARD_HEIGHT);
	}

	for (let y = 1; y < BOARD_HEIGHT; y++) {
	  ctx.moveTo(0, y);
	  ctx.lineTo(BOARD_WIDTH, y);
	}

	ctx.stroke();

	board.forEach((row, y) => {
		row.forEach((value, x) => {
			if (value === 1) {
				ctx.fillStyle = "yellow"
				ctx.fillRect(x, y, 1, 1)
			}
		})
	})

	piece.shape.forEach((row, y) => {
		row.forEach((value, x) => {
			if(value) {
				ctx.fillStyle = "red"
				ctx.fillRect(x + piece.position.x, y + piece.position.y, 1, 1)
			}
		})
	})
}

function checkCollision() {
	return piece.shape.find((row, y) => {
		return row.find((value, x) =>
				value !== 0 &&
				board[y + piece.position.y]?.[x + piece.position.x] !== 0
		)
	})
}

function checkCompleteLines() {
	const lineToDelete = board.findIndex((row) => row.every(value => value === 1))
	if(lineToDelete >= 0) {
		board.splice(lineToDelete, 1)
		board.unshift(new Array(BOARD_WIDTH).fill(0))
	}

}

function solidify() {
	piece.shape.forEach((row, y) => {
		row.forEach((value, x) => {
			if(value === 1) {
				board[y + piece.position.y][x + piece.position.x] = 1
			}
		})
	})

	resetPiece()
	checkCompleteLines()
}

function resetPiece() {
	piece.position = { ...DEFAULT_PIECE_POSITION }
	piece.shape = SHAPES[Math.floor(Math.random() * SHAPES.length)]

	if (checkCollision()) {
		window.alert("GAME OVER")
		board.forEach((row) => row.fill(0))
	}
}

function createBoard(WIDTH, HEIGHT) {
	const board = new Array(HEIGHT).fill().map(() => new Array(WIDTH).fill(0))
	return board
}

Init(piece, checkCollision, solidify)
update()
