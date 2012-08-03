import VidPlayer.VidPlayer;

flash.system.Security.allowDomain("*");
flash.system.Security.allowInsecureDomain("*");

var theClickThru = root.loaderInfo.parameters.clickTag || false;
var js_close_function = root.loaderInfo.parameters.js_close_function || false;
var v:VidPlayer;
var vid_config = {
	source: 'http://videoads.washingtonpost.com/test.f4v' //for testing
	, poster: false
	, width: 737
	, height: 415
	, mute: false
	, autoplay: true
	//, progressBGFill :  [ 0xFFFFFF, 0xcccccc ]
	//, progressFill:  [ 0xae6b3d, 0x6e3308 ]fff3b1
	//, progressFill:  [ 0xddd2a0, 0xae6b3d ]
	//, bufferBGFill: [ 0x999999, 0x666666 ]
	, controls_alpha : 1
}; 

function init(){
	addVideo(vid_config);
	addEventListeners();
}

function addVideo(config){
	v = new VidPlayer(config)
	video_container.y = 92;
	video_container.x = 18;
	video_container.addChild(v);
}

function changePage(url:*, window:String = "_blank"):void {
	var req:URLRequest = url is String ? new URLRequest(url) : url;
	if (!ExternalInterface.available) {
		navigateToURL(req, window);
	} else {
		var strUserAgent:String = String(ExternalInterface.call('function() {return navigator.userAgent;}')).toLowerCase();
		if (strUserAgent.indexOf("firefox") != -1 || (strUserAgent.indexOf("msie") != -1 && uint(strUserAgent.substr(strUserAgent.indexOf("msie") + 5, 3)) >= 6)) {
			ExternalInterface.call("window.open", req.url, window);
		} else {
			navigateToURL(req, window);
		}
	}
	
	//pause video when navigating away from page:
	v.pauseClicked();
}

function border(x, y, w, h, thick, colour):Sprite{
	var b = new Sprite();
	b.graphics.lineStyle(thick, colour, 1);
	b.graphics.moveTo(x, y);
	b.graphics.lineTo(x, y);
	b.graphics.lineTo(w,y);
	b.graphics.lineTo(w,h);
	b.graphics.lineTo(x,h);
	b.graphics.lineTo(x,y);
	return b;
}

function doClose(e=null){	
	if(ExternalInterface.available && js_close_function){
		ExternalInterface.call(js_close_function);
	}
}

function addEventListeners(){
	close_btn.addEventListener(MouseEvent.CLICK, doClose);
	learn_more_btn.addEventListener(MouseEvent.CLICK, function(e){
		if(theClickThru){
			changePage(theClickThru);
		}
	});
}

init();