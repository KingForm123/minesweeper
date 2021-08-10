		const templateCellsame = function(line, x) {
			let result = ''
				for (let i = 0; i < line.length; i++) {
					let a = line[i]
					result += `<div class="cellsame" data-num="${a}" data-x="${x}" data-y="${i}">${a}</div>`
				}
				return result
		}

		// 2. templateRow 的参数 square 是二维数组
		// 用来表示雷相关的数据, 我们这里是直接写死的数据
		// 返回 square.length 个 row 拼接的字符串
		// row 的内容由 templateCell 函数生成
		const templateRowsame = function(square) {
			let result = ''
				for (let i = 0; i < square.length; i++) {
					result += '<div class="rowsame clearfix">'
					let n = square[i]
					let x = i
					result += templateCellsame(n, x)
					result += '</div><br>'
				}
				// log('asd', result)
				return result
		}

		// 3. square 是二维数组, 用来表示雷相关的数据
		// 用 square 生成 9 * 9 的格子, 然后插入到页面中
		// div container 是 <div id="id-div-mime"></div>
		//生成地图
		const renderSquaresame = function(square) {
			let map = document.querySelector('#id-div-same')
			map.innerHTML = templateRowsame(square)
		}