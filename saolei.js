			
			const templateCell = function(line, x) {
				let result = ''
				    for (let i = 0; i < line.length; i++) {
				        let a = line[i]
				        result += `<div class="cell" data-number="${a}" data-x="${x}" data-y="${i}">${a}</div>`
				    }
				    return result
			}
			
			const templateRow = function(square) {
				let result = ''
				    for (let i = 0; i < square.length; i++) {
				        result += '<div class="row clearfix">'
				        let n = square[i]
				        let x = i
				        result += templateCell(n, x)
				        result += '</div><br>'
				    }
				    // log('asd', result)
				    return result
			}
			
			const renderSquare = function(square) {
				let map = document.querySelector('#id-div-mime')
				// log(map)
				map.innerHTML += templateRow(square)
			}
			
			//重置地图
			const restart = function() {
				let button = document.querySelector('#id-button-map')
				button.addEventListener('click', function() {
					 window.location.reload();
				})
			}
			
			const bindAll = function(element, eventName, callback) {
				for (let i = 0; i < element.length; i++) {
					let tag = element[i]
					tag.addEventListener(eventName, callback)
					tag.classList.add('rightclick')
				}
			}
		    //右键插旗功能
			const bindright = function() {
				let cells = document.querySelectorAll('.cell')
				bindAll(cells, 'contextmenu', function(event) {
					log('右键点到了')
					event.preventDefault()
					let rightself = event.target
					log(rightself, 'asd')
						if (!rightself.classList.contains('opened')) {
							if (rightself.classList.contains('rightclick')) {
								rightself.classList.add('imgflag')
								rightself.classList.remove('rightclick')
								rightself.classList.remove('imgblank')
							} else if (rightself.classList.contains('imgflag')) {
								rightself.classList.remove('imgflag')
								rightself.classList.add('imgask')
							} else if (rightself.classList.contains('imgask')) {
								rightself.classList.remove('imgask')
								rightself.classList.add('imgblank')
								rightself.classList.add('rightclick')
							}
						}
						errorreduce(rightself)
				})
	        }
			
			//雷中有旗子，雷数减一
			const errorreduce = function(rightself) {
				let sum = Number(document.querySelector('#score-bomb-count').innerHTML)
				if (rightself.dataset.number === '9') {
					if (rightself.classList.contains('imgflag')) {
						sum--
						document.querySelector('#score-bomb-count').innerHTML = ('00' + sum)
					} else if (rightself.classList.contains('imgask')) {
						sum++
						document.querySelector('#score-bomb-count').innerHTML = ('00' + sum)
					} else {
						return
					}
				}
			}
			
			//第一次点开为 0
			const firstzero = function(square, cell) {
				let x = Number(cell.dataset.x)
				let y = Number(cell.dataset.y)
				log(x, y, typeof x)
				while (square[x][y] !== 0) {
					let map = document.querySelector('#id-div-mime')
					square = markedSquare()
					map.innerHTML = templateRow(square)
					bindright()
					bindEventDelegate(square)
					//重置透视
					renderSquaresame(square)
				}
				vjklAround(square, x, y)
				starttime()
			}
			
			//取出不包含 9 的所有cell, 返回数组l
			const elsenine = function() {
				let  cell = document.querySelectorAll('.cell')
				let l = []
				for (let i = 0; i < cell.length; i++) {
					let n = cell[i]
					if (n.dataset.number !== '9') {
						l.push(n)
					}
				}
				return l
			}
			//判断取出的cell是否被点开过，如果没有点开过，返回false，全部点开了，返回true
			const choiceone = function() {
				let l = elsenine()
				for (let i = 0; i < l.length; i++) {
					let n = l[i]
					if (!n.classList.contains('opened')) {
						return false
					}
				}
				return true
			}
			//判断游戏胜利
			const win = function() {
				let choice = choiceone()
				let error = document.querySelectorAll('[data-number="9"]')
				if (choice) {
					alert('游戏胜利')
					clearInterval(clockId)
					for (let i = 0; i < error.length; i++) {
						let blood = error[i]
						blood.classList.add('imgmine')
					}
				}
			}
			
			//点击事件
			const bindEventDelegate = function(square) {
				let pass = document.querySelectorAll('.row')
				let error = document.querySelector('[data-number="9"]')
				bindAll(pass, 'click', function(event) {
					let self = event.target
					//判断是否包含旗子，问号，雷，如果包含，则不能点开
					if (!self.classList.contains('imgflag') && !self.classList.contains('imgask') && !error.classList.contains('imgmine')) {
						if (first) {
							firstzero(square, self)
							first = false
						} else {
							vjkl(self, square)
							win()
						}
					}
				})
			}
			
			const vjkl = function(cell, square) {
				let size = 'opened'
				cell.classList.remove('imgblank')
				if (!cell.classList.contains('.opened')) {
					//判断点开的是否为 9，点到 9 游戏结束
					if (Number(cell.dataset.number) === 9) {
						//获取全部雷，并显示全部雷
						let nine = document.querySelectorAll('[data-number="9"]')
						//哭脸
						let button = document.querySelector('#id-button-map')
						button.classList.add('imgface_fail')
						for (let i = 0; i < nine.length; i++) {
							let n = nine[i]
							n.classList.add('imgmine')
							n.classList.remove('imgflag')
							n.classList.remove('imgask')
						}
						cell.classList.remove('imgmine')
						cell.classList.add('imgblood')
						alert('游戏结束')
						clearInterval(clockId)
					}
					//判断点开的是否为 0
					if (Number(cell.dataset.number) === 0) {
						let x = Number(cell.dataset.x)
						let y = Number(cell.dataset.y)
						let z = Number(cell.dataset.number)
						// log(x, y, z)
						vjklAround(square, x, y)
					}
					//点到的是 1- 8 就显示出
					for (let i = 1; i < 9; i++) {
						if (Number(cell.dataset.number) === i) {
							// log('周围雷数量')
							cell.classList.add(size)
							cell.classList.add(`img${i}`)
						}
					}
  				}
			}
			
			const vjklAround = function(square, x, y) {
				// 判断左边三个
				vjkl1(square, x - 1, y - 1)
				vjkl1(square, x, y - 1)
				vjkl1(square, x + 1, y - 1)
				//判断中间两个
				vjkl1(square, x - 1, y)
				vjkl1(square, x , y)
				vjkl1(square, x + 1, y)
				//判断右边三个
				vjkl1(square, x - 1, y + 1)
				vjkl1(square, x, y + 1)
				vjkl1(square, x + 1, y + 1)
			}
			
			const vjkl1 = function(square, x, y) {
				let len = square[0].length
				if (x >= 0 && x < len && y >= 0 && y < len) {
					let choice = '[data-x="' + x + '"][data-y="' + y + '"]'
					let zero = document.querySelector(choice)
					if (!zero.classList.contains('opened')) {
						if (square[x][y] === 0) {
							zero.classList.add('opened')
							zero.classList.add('img0')
							vjklAround(square, x, y)
						} else if (square[x][y] !== 9) {
							let a = zero.dataset.number
							let b = `img${a}`
							zero.classList.add('opened')
							zero.classList.add(b)
						}
					}
				}
			}
			//时间
			const starttime = function () {
				let time = document.querySelector('#score-time-count')
				let num = 0
				clockId = setInterval(function() {
					if (time.innerHTML >= 99) {
						time.innerHTML = (num++)
					} else if (time.innerHTML >= 9) {
						time.innerHTML = '0' + (num++)
					} else {
						time.innerHTML = '00' + (num++)
					}
				}, 1000)
			}
			
			const __main = function() {
				renderSquare(square123)
				bindright()
				restart()
				bindEventDelegate(square123)
				//开一个透视
				renderSquaresame(square123)
			}
			let square123 = markedSquare()
			let clockId
			let first = true
			__main()