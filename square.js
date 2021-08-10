const log = console.log.bind(console)
// const random = function() {
// 	let a = Math.random()
// 	let b = a * 10
// 	let c = Math.floor(b)
// 	if (c < 5) {
// 		// log(c)
// 		return 0
// 	} else {
// 		return 9
// 	}
// }
// const row = function() {
// 	let l = []
// 	for (let i = 0; i < 9; i++) {
// 		l.push(random())
// 	}
// 	// log(l)
// 	return l
// }
const shuffle = function(arr) {
	// let arr = square(arr)
	let result = new Array(), randomIndex;
	// 条件判断,只要arr.length > 0 就走while循环里面的
	while(arr.length > 0) {
		
	// Math.random() 0 - 1
	// arr.length     n
	// Math.random() * arr.length  0 - n(但是不等于5)
	// 结果:       0 - (n-1)

	randomIndex = Math.floor(Math.random() * arr.length) // 得到数组范围内下标
	result.push(arr[randomIndex])
	arr.splice(randomIndex, 1)
	}
	return result;
}
const square = function() {
	let l = []
	for (let i = 0; i < 9; i++) {
		let array = [0, 0, 0, 0, 0, 0, 0, 0, 9]
		let arr = shuffle(array)
		// log(arr, array)
		l.push(arr)
	}
	// log(l)
	return l
}
const plus = function(array, x, y) {
	let len = array.length
	if (x >= 0 && x < len && y >= 0 && y < len) {
		if (array[x][y] !== 9) {
			array[x][y] += 1
		}
	}
}
const markAround = function(array, x, y) {
	if (array[x][y] === 9) {
		//判断左边两个
		plus(array, x - 1, y - 1)
		plus(array, x, y - 1) 
		plus(array, x + 1, y -1) 
		//判断中间两个
		plus(array, x - 1, y)
		plus(array, x + 1, y)
		//判断右边三个
		plus(array, x - 1, y + 1)
		plus(array, x, y + 1)
		plus(array, x + 1, y + 1)
	}
}
const markedSquare = function() {
	let array = square()
	// log(array)
	for (let i = 0; i < array.length; i++) {
		let n = array[i]
		// log(n)
		for (let j = 0; j < n.length; j++) {
			// let k = n[j]
			// log(k)
			markAround(array, i, j)
		}
	}
	log(array)
	return array
}
// const __main = function() {
// 	// row()
// 	// random()
// 	// square()
// 	square()
// 	// shuffle()
// 	markedSquare()
// }
// __main()