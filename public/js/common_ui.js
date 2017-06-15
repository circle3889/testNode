var fontScale = 3
function sizeUp(){
	$('#module_wrap').removeClass('font_scale'+fontScale);
	if(fontScale >= 5)
		alert('최대 크기 입니다.');
	else
		fontScale++;
	$('#module_wrap').addClass('font_scale'+fontScale);
}
function sizeDown(){
	$('#module_wrap').removeClass('font_scale'+fontScale);
	if(fontScale <= 1)
		alert('최소 크기 입니다.');
	else
		fontScale--;
	$('#module_wrap').addClass('font_scale'+fontScale);
}

function toggleMenu(){
	$('#menuLayer').fadeToggle(100);
}