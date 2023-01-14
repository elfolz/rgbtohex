navigator.serviceWorker?.register('service-worker.js').then(reg => {
	reg.addEventListener('updatefound', () => {
		let newWorker = reg.installing
		newWorker?.addEventListener('statechange', () => {
			console.log('Update Installed. Restarting...')
			if (newWorker.state == 'activated') location.reload(true)
		})
	})
})

function init() {
	const initialColor = location.search.match(/(color=)([0-9a-f]{6})/i)

	const hexInput = document.querySelector('#hexa')
	const redInput = document.querySelector('input[name=red')
	const greenInput = document.querySelector('input[name=green')
	const blueInput = document.querySelector('input[name=blue')

	if (initialColor && initialColor[[2]]) {
		hexInput.value = initialColor[2]
		refreshRGBInputs()
	}
	refreshColor(hexInput.value)

	IMask(hexInput, {
		mask: 'HHHHHH',
		blocks: {
			H: {
				mask: /^[0-9a-f]$/i
			}
		}
	})
	document.querySelectorAll('#rgb').forEach(el => {
		IMask(el, {
			mask: Number,
			min: 0,
			max: 255
		})
	})
	
	hexInput.oninput = e => {
		if (!e.isTrusted) return
		let rgb = hexToRgb(e.target.value)
		redInput.value = rgb.red
		greenInput.value = rgb.green
		blueInput.value = rgb.blue
		refreshColor(hexInput.value)
	}

	redInput.oninput = e => {
		if (!e.isTrusted) return
		hexInput.value = rgbInputsToValue()
		refreshColor(hexInput.value)
	}

	greenInput.oninput = e => {
		if (!e.isTrusted) return
		hexInput.value = rgbInputsToValue()
		refreshColor(hexInput.value)
	}

	blueInput.oninput = e => {
		if (!e.isTrusted) return
		hexInput.value = rgbInputsToValue()
		refreshColor(hexInput.value)
	}

	document.querySelector('#lighten').onclick = e => {
		hexInput.value = lighten(hexInput.value)
		refreshRGBInputs()
		refreshColor(hexInput.value)
	}
	document.querySelector('#darken').onclick = e => {
		hexInput.value = darken(hexInput.value)
		refreshRGBInputs()
		refreshColor(hexInput.value)
	}
	document.querySelector('#copy').onclick = async e => {
		if (!/^[0-9a-f]{6}$/i.test(hexInput.value)) return
		try {
			await navigator.clipboard.writeText(`#${hexInput.value}`)
			alert('Copiado para o clipboard!')
		} catch(e) {
			alert('Falha ao copiar para o clipboard!')
		}
	}

	function refreshRGBInputs() {
		redInput.value = hexToRgb(hexInput.value).red
		greenInput.value = hexToRgb(hexInput.value).green
		blueInput.value = hexToRgb(hexInput.value).blue
	}

	function rgbInputsToValue() {
		return rgbToHex({
			red: parseInt(redInput.value || '0'),
			green: parseInt(greenInput.value || '0'),
			blue: parseInt(blueInput.value || '0')
		})
	}
}

function refreshColor(color) {
	if (!/^[0-9a-f]{6}$/i.test(color)) return ''
	document.querySelector('#color').style.backgroundColor = `#${color}`
}

function lighten(color) {
	if (!/^[0-9a-f]{6}$/i.test(color)) return ''
	let rgb = hexToRgb(color)
	rgb.red = parseInt(Math.max(10, rgb.red) + (rgb.red * 20 / 100))
	if (rgb.red > 255) rgb.red = 255
	rgb.green = parseInt(Math.max(10, rgb.green) + (rgb.green * 20 / 100))
	if (rgb.green > 255) rgb.green = 255
	rgb.blue = parseInt(Math.max(10, rgb.blue) + (rgb.blue * 20 / 100))
	if (rgb.blue > 255) rgb.blue = 255
	return rgbToHex(rgb)
}

function darken(color) {
	if (!/^[0-9a-f]{6}$/i.test(color)) return ''
	let rgb = hexToRgb(color)
	rgb.red = parseInt(rgb.red - (rgb.red * 20 / 100))
	if (rgb.red < 0) rgb.red = 0
	rgb.green = parseInt(rgb.green - (rgb.green * 20 / 100))
	if (rgb.green < 0) rgb.green = 0
	rgb.blue = parseInt(rgb.blue - (rgb.blue * 20 / 100))
	if (rgb.blue < 0) rgb.blue = 0
	return rgbToHex(rgb)
}

function hexToRgb(hex) {
	hex = '0x'+hex
	return {
		red: (hex >> 16) & 0xFF,
		green: (hex >> 8) & 0xFF,
		blue: hex & 0xFF
	}
}

function rgbToHex(rgb) {
	const color = (rgb.red << 16) | (rgb.green << 8) | rgb.blue
	return color.toString(16).padStart(6, 0).toLocaleUpperCase()
}

document.onreadystatechange = () => {
	if (document.readyState == 'complete') init()
}