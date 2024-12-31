import { KEYS } from "./consts"

export function Init(piece, checkCollision, solidify) {
    document.addEventListener("keydown", (event) => {
    	if(event.key === KEYS.DOWN) {
    		piece.position.y++

    		if(checkCollision()) {
    			piece.position.y--
    			solidify()
    		}
    	}
    	if(event.key === KEYS.LEFT) {
    		piece.position.x--

    		if(checkCollision()) piece.position.x++

    	}
    	if(event.key === KEYS.RIGHT) {
    		piece.position.x++

    		if(checkCollision()) piece.position.x--

    	}
    	if (event.key === KEYS.UP) {
    		const rotated = []
        
    		for (let i = 0; i < piece.shape[0].length; i++) {
    			const row = []
            
    			for (let j = piece.shape.length - 1; j >= 0; j--) {
    				row.push(piece.shape[j][i])
    			}
            
    			rotated.push(row)
    		}
        
    		const previousShape = piece.shape

    		piece.shape = rotated
    		if (checkCollision()) {
    			piece.shape = previousShape
    		}
    	}
    })
}