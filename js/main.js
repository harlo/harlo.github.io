var vidHolder = $("#vid_splash");
var vid, vidFileType, vidControl,isPlaying;
var w,h;

$(document).ready(function() {
	// get dimensions so we know how to place elements
	w = $(window).width();
	h = $(window).height();
	
	// inject the video
	vid = document.createElement("video");
	$(vid).attr({
		"src": "/assets/media/back.ogg",
		"loop": true,
		
	});
	$(vid).css({
		"width": w
	});
	$("#vid_splash").append(vid);
	
	// inject the video control
	$("#vid_control").click(toggleVideo);
	isPlaying = true;
	toggleVideo();
});

function toggleVideo() {
	$("#vid_control").empty();
	var vidControlImg = document.createElement("img");
	$(vidControlImg).css({
		"width":25
	});
	if(isPlaying) {
		$(vidControlImg).attr({
			"src": "/assets/media/vid_pause.png"
		});
		isPlaying = false;
		vid.play();
	} else {
		$(vidControlImg).attr({
			"src": "/assets/media/vid_play.png"		
		});
		isPlaying = true;
		vid.pause();
	}
	$("#vid_control").append(vidControlImg);
}

