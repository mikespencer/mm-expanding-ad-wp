/*global commercialNode, placeAd2, ActiveXObject*/
var wpAd = window.wpAd || {};

(function(win, $, wpAd, undefined){

  'use strict';

  function MMOverlay(atts){
    for(var key in atts){
      if(atts.hasOwnProperty(key)){
        this[key] = atts[key];
      }
    }
    this.creative = document.createElement('div');
    this.expanded = false;
    //this.buildSlug();
    this.overlay = this.buildOverlay();
    this.styleOverlay();
    this.pageWidth = parseInt(($('#shell').outerWidth() || 1012), 10);
    this.zIndexVal = (Number($('div.wp-float-bar:first').css('zIndex')) || 555550) - 1;
    
    if(this.tileImpPix){
      this.addPixel(this.tileImpPix);
    }
    
    $(win).resize(function(e){
      if(wpAd.mmoverlay.expanded){
        wpAd.mmoverlay.positionOverlay();
      }
    });
    return this;
  }

  MMOverlay.prototype.exec = function(){
    if(this.flashver > 8){
      if(!this.expanded){
        
        var target = $('div.wp-float-bar').length ? $('div.wp-float-bar:first').parent() : 'body:first';

        //only load expanded .swf on click, not on the tile load:
        if(!this.initialised){
          this.initialised=true;
          this.buildCreative();
        }

        this.expanded = true;
        this.positionOverlay();
        $(this.overlay).appendTo(target).stop(true, false).slideDown();
        
        //placeAd2('politics/mentionmachine/expand', 'mm_overlay', 'AJAX', '');
        
        //track expands/clicks on tile
        this.addPixel('http://ad.doubleclick.net/ad/wpni.politics/mentionmachine/expand;sz=1x1;pos=mm_overlay;ord=[timestamp]?');
        
        if(this.expandedImpPix){
          this.addPixel(this.expandedImpPix);
        }
      }
    } else {
      try{
        window.open(this.ct);
      }catch(e){}
    }
  };

  MMOverlay.prototype.close = function(){
    $(this.overlay).slideUp(function(){
      $(this).remove();
      wpAd.mmoverlay.expanded = false;
    });
  };

  MMOverlay.prototype.buildSlug = function(){
    var slug = document.createElement('div'),
      wpni_adi = document.createElement('div');

    slug.id = 'slug_mm_overlay';
    slug.style.height='0';
    slug.style.width='0';
    slug.style.display='none';
    wpni_adi.id = 'wpni_adi_mm_overlay';

    slug.appendChild(wpni_adi);
    document.body.appendChild(slug);
  };
  
  MMOverlay.prototype.buildCreative = function(){
    $(this.creative).append('<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" width="'+ this.width +'" height="'+ this.height +'" id="overlay-swf-ie"style="position:relative;z-index:'+ this.zIndexVal +'">' +
      '<param name="movie" value="' + this.creativeURL + '" />' +
      '<param name="quality" value="high" />' +
      '<param name="bgcolor" value="#000000" />' +
      '<param name="play" value="true" />' +
      '<param name="wmode" value="window" />' +
      '<param name="allowScriptAccess" value="always" />' +
      '<param name="flashvars" value="clickTag=' + this.ct + '&js_close_function=wpAd.mmoverlay.close" />' +
      '<!--[if !IE]>-->' +
      '<object type="application/x-shockwave-flash" data="' + this.creativeURL + '" width="'+ this.width +'" height="'+ this.height +'" id="overlay-swf" style="position:relative;z-index:'+ this.zIndexVal +'">' +
        '<param name="movie" value="' + this.creativeURL + '" />' +
        '<param name="quality" value="high" />' +
        '<param name="bgcolor" value="#000000" />' +
        '<param name="play" value="true" />' +
        '<param name="wmode" value="window" />' +
        '<param name="allowScriptAccess" value="always" />' +
        '<param name="flashvars" value="clickTag=' + this.ct + '&js_close_function=wpAd.mmoverlay.close" />' +
      '</object>' +
      '<!--<![endif]-->' +
    '</object>');
  };

  MMOverlay.prototype.buildOverlay = function(){
    var d = document.createElement('div');

    d.style.width = this.width + 'px';
    d.style.height = this.height + 'px';
    d.id = 'mm_overlay_container';

    d.appendChild(this.creative);
    return d;
  };

  MMOverlay.prototype.addCloseListener = function(){
    $(this.closeBtn).unbind().click(function(e){
      wpAd.mmoverlay.close();
      wpAd.mmoverlay.expanded = false;
    });
  };
  
  MMOverlay.prototype.styleCloseBtn = function(){
    var css = $.extend({
      cursor: 'pointer',
      position: 'absolute',
      zIndex: '9999999'
    }, this.closeBtnCSS);
    $(this.closeBtn).css(css);
  };

  MMOverlay.prototype.positionOverlay = function(){
    var $win = $(window), 
      props = {
        'left': (parseInt($win.width(), 10)/2) - (this.pageWidth/2) + 'px',
        'width': this.width + 'px'
      }, 
      mm_height = parseInt($('div.wp-float-bar').height(), 10) || 58,
      win_height = $win.height();

    if(win_height - mm_height >= this.height){
      props.top = '';
      props.height = (win_height - mm_height) + 'px';
      props.bottom = mm_height + 'px';
      $(this.creative).css({paddingTop: ((win_height - this.height - mm_height)/2) + 'px'});
    } else{
      props.height=this.height + 'px';
      props.bottom = '';
      props.top = '0px';
      $(this.creative).css({paddingTop:'0'});
    }
    $(this.overlay).css(props);
  };


  MMOverlay.prototype.styleOverlay = function(){
    $(this.overlay).css({
      'position': 'fixed',
      'z-index': this.zIndexVal,
      'background-color':'#000',
      'border': '1px solid #000',
      'border-bottom': '0',
      '-moz-box-shadow': '#333 0 0 20px 3px',
      '-webkit-box-shadow': '#333 0 0 20px 3px',
      'box-shadow': '#333 0 0 20px 3px'
    });
  };
  
  MMOverlay.prototype.trackHandler = function(videoIndex){
    var pixels = [
      '', //video 1 pixel
      '', //video 2 pixel
      ''  //video 3 pixel
    ];
    if(pixels[videoIndex]){
      this.addPixel(pixels[videoIndex]);
    }
  };
  
  MMOverlay.prototype.addPixel = function(pix){
    $(document.createElement('img')).attr({
      'height': '1',
      'width': '1',
      'alt': '@MM Pixel',
      'src': pix.replace('[timestamp]', Math.floor(Math.random() * 1E9))
    }).css({
      border: '0',
      display: 'none'
    }).appendTo('body:first');
  };

  wpAd.MMOverlay = MMOverlay;
  wpAd.mmoverlay_vars = wpAd.mmoverlay_vars || {};
  
  //CONFIG:
  wpAd.mmoverlay = new wpAd.MMOverlay({
    'width': '1012',
    'height': '585',
    'ct': wpAd.mmoverlay_vars.ct || '',
    'creativeURL':  'http://media.washingtonpost.com/wp-adv/advertisers/norfolksouthern/2012/ns_mm_overlay.swf',
    'backup': '',

    //Tracking Pixels:
    'expandedImpPix': '',
    'tileImpPix': '',

    //object of css properties for close button (if needed):
    'closeBtnCSS': {},
    'flashver': (function(){
      var i,a,o,p,s="Shockwave",f="Flash",t=" 2.0",u=s+" "+f,v=s+f+".",rSW=new RegExp("^"+u+" (\\d+)");
      if((o=navigator.plugins)&&(p=o[u]||o[u+t])&&(a=p.description.match(rSW)))return a[1];
      else if(!!(window.ActiveXObject))for(i=10;i>0;i--)try{if(!!(new ActiveXObject(v+v+i)))return i;}catch(e){}
      return 0;
    })()
  });
  

})(window, jQuery, wpAd);