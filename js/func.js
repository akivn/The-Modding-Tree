function GetText(tag, text, color) {
	return `<${tag} style='color:${color};'>${text}</${tag}>`
}

function GetEffectText(tag, text, color) {
	return `<${tag} style='color:${color};text-shadow:0px 0px 10px;'>${text}</${tag}>`
}