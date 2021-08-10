		//  接下来就可以实现相关的函数
			// 1. templateCell 函数, 参数为数组 line 和变量 x
			// line 是每一行的数组
			// 比如第一行就是 | 9 | 1 | 0 | 0 | 0 | 1 | 1 | 1 | 0 |
			// x 表示第几行
			// 这个函数返回 line.length 个 cell 拼接的字符串
			const templateCell = function(line, x) {
				let result = ''
				    for (let i = 0; i < line.length; i++) {
				        let a = line[i]
				        result += `<div class="cell" data-number="${a}" data-x="${x}" data-y="${i}">${a}</div>`
				    }
				    return result
			}
			
			// 2. templateRow 的参数 square 是二维数组
			// 用来表示雷相关的数据, 我们这里是直接写死的数据
			// 返回 square.length 个 row 拼接的字符串
			// row 的内容由 templateCell 函数生成
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
			
			// 3. square 是二维数组, 用来表示雷相关的数据
			// 用 square 生成 9 * 9 的格子, 然后插入到页面中
			// div container 是 <div id="id-div-mime"></div>
			//生成地图
			const renderSquare = function(square) {
				let map = document.querySelector('#id-div-mime')
				// log(map)
				map.innerHTML += templateRow(square)
			}
			
			//重置地图
			const restart = function() {
				let button = document.querySelector('#id-button-map')
				button.addEventListener('click', function() {
					 // window.location.replace("http://127.0.0.1:8848/saolei/saolei3.html")
					 let map = document.querySelector('#id-div-mime')
					 let square = markedSquare()
					 map.innerHTML = templateRow(square)
					 bindright()
					 bindEventDelegate(square)
					 //重置透视
					 renderSquaresame(square)
				})
			}
			
			// 4. 实现 bindEventDelegate 函数
			// 用事件委托的形式在父元素上面绑定 click 事件, 只处理格子
			// 也就是 .cell(即 class 包含 cell 字符串) 元素
			// 如果点击的是 .cell 元素, 那么调用 vjkl 函数
			// 注意, 我们在 bindEventDelegate 里面不处理具体的逻辑, 只调用函数
			// 具体逻辑放在 vjkl 函数里面实现
			const bindAll = function(element, eventName, callback) {
				for (let i = 0; i < element.length; i++) {
					let tag = element[i]
					tag.addEventListener(eventName, callback)
				}
			}
		    //右键插旗功能
			const bindright = function() {
				let cell = document.querySelectorAll('.cell')
				for (let i = 0; i < cell.length; i++) {
					let right = cell[i]
					right.classList.add('rightclick')
					right.addEventListener('contextmenu', function(event) {
					log('右键点到了')
					event.preventDefault()
					let rightself = event.target
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
					bindwin()
					})
				}
	        }
			
			//第一次点开为 0
			const firstzero = function(square, cell) {
				let x = cell.dataset.x
				let y = cell.dataset.y
				while (square[x][y] !== 0) {
					x = Math.floor(square.length * Math.random())
					y = Math.floor(square[0].length * Math.random())
				}
				vjklAround(square, x, y)
			}
			
			// //过关
			// const bindwin = function() {
			// 	let error = document.querySelectorAll('[data-number="9"]')
			// 	let len = error.length
			// 	log(error, len)
			// 	for (let i = 0; i < error.length; i++) {
			// 		let n = error[i]
			// 		// log(n)
			// 		if (n.classList.contains('imgflag') || n.classList.contains('bomb') || n.classList.contains('imgask')) {
			// 			len -= 1
			// 			log(len)
			// 		}
			// 	}
			// 	if (len === 0) {
			// 		alert('游戏胜利')
			// 		for (let i = 0; i < error.length; i++) {
			// 			let blood = error[i]
			// 			blood.classList.add('imgblood')
			// 		}
			// 	}
			// }
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
				// log(l)
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
				log(choice)
				if (choice) {
					alert('游戏胜利')
					for (let i = 0; i < error.length; i++) {
						let blood = error[i]
						blood.classList.add('imgblood')
					}
				}
			}
			
			const bindEventDelegate = function(square) {
				let pass = document.querySelectorAll('.row')
				let error = document.querySelector('[data-number="9"]')
				bindAll(pass, 'click', function(event) {
					log('点到了')
					let self = event.target
					//判断是否包含旗子，问号，雷，如果包含，则不能点开
					if (!self.classList.contains('imgflag') && !self.classList.contains('imgask') && !error.classList.contains('imgerror')) {
					vjkl(self, square)
					win()
					}
				})
			}
			// 5. vjkl 是点击格子后执行的函数, 我们需要把扫雷的逻辑写在这个函数中
			// 要注意的是我们在初始情况下就把数字写到了 html 中
			// <div class="cell" data-number="1" data-x="0" data-y="1">1</div>
			// 而初始情况下数字不应该显示出来的, 可以直接用 font-size: 0; 来隐藏文字
			// 点击的时候根据情况用 font-size: 14px; 的方式显示文字
			// 当然这一步应该用 class 来完成, 比如 opened class 里面写 font-size: 14px;
			// 点击的时候根据 class 来执行具体逻辑
			// 如果已经显示过(也就是 class 包含 opened), 则不做任何处理
			// 如果没有显示过(也就是 class 不包含 opened), 判断下列情况
			// 1. 假设点击的是数字 9, 展开, 游戏结束
			// 2. 假设点击的是数字 0
			    // 此时需要展开 0 周围的一片, 通过调用 vjklAround 函数来完成
			    // 也就是说依然把逻辑写在下一层函数 vjklAround 中
			// 3. 假设点击的是其他数字, 展开
			const vjkl = function(cell, square) {
				let size = 'opened'
				cell.classList.remove('imgblank')
				// firstzero(square, cell)
				if (!cell.classList.contains('.opened')) {
					//判断点开的是否为 9，点到 9 游戏结束
					if (Number(cell.dataset.number) === 9) {
						// log('雷', cell.dataset.number)
						// log(document.querySelectorAll('[data-number="9"]'))
						//获取全部雷，并显示全部雷
						let nine = document.querySelectorAll('[data-number="9"]')
						for (let i = 0; i < nine.length; i++) {
							let n = nine[i]
							n.classList.add('imgerror')
							n.classList.remove('imgflag')
							n.classList.remove('imgask')
						}
						alert('游戏结束')
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
			
			// 6. vjklAround 展开周围 cell 周围 8 个元素,
			// x 和 y 分别是下标
			// 展开周围的元素通过调用 vjkl1 来解决
			// 注意, 依然把逻辑放在下一层来处理
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
				// log('递归')
			}
			
			// 7. vjkl1 是重点函数
			// 如果满足边界调节, 则继续
			    // 满足边界的意思是下标符合范围
			// 因为 vjkl1 这个函数的作用是展开格子, 所以如果已经展开过, 那么就不展开元素
			// 根据 x 和 y 还有属性选择器选择出格子, 具体可以参考
			// https://developer.mozilla.org/zh-CN/docs/Web/CSS/Attribute_selectors
			// 比如想选中 data-x=3 的元素, 语法是 e('[data-x="3"]')
			// 比如想同时选中 data-x=3 且 data-y=5 的元素, 语法是 e('[data-x="3"][data-y="5"]')
			// 选择元素之后根据情况来判断
			// 如果没有展开过, 继续判断下列情况
			    // 如果碰到的是 9, 什么都不做.
			        // 注意, 这里 9 的处理方式和直接点击格子 9 的处理方式不一样
			        // 点击格子 9 也就是点击到雷, 直接结束游戏
			        // 这里展开到 9 是指展开到边界情况
			    // 如果碰到的是 0, 展开, 并且递归调用 vjklAround 函数
			    // 如果碰到的是其他元素, 展开
			const vjkl1 = function(square, x, y) {
				let len = square[0].length
				// log('len', len)
				if (x >= 0 && x < len && y >= 0 && y < len) {
					let choice = '[data-x="' + x + '"][data-y="' + y + '"]'
					let zero = document.querySelector(choice)
					// log('zero', zero)
					if (!zero.classList.contains('opened')) {
						if (square[x][y] === 0) {
							// log('html', zero.innerHTML)
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
			const __main = function() {
				let square = markedSquare()
				renderSquare(square)
				bindright()
				restart()
				// bindwin()
				bindEventDelegate(square)
				//开一个透视
				renderSquaresame(square)
			}
			__main()