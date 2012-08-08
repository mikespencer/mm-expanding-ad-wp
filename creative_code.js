/* AD ID: %eaid! */

(function(d, $){

  'use strict';

  var s=d.createElement('script'),
    i=d.createElement('img'),
    imp=d.createElement('img'),
    tileCreative='http://img.wpdigital.net/wp-adv/advertisers/norfolksouthern/2012/tile.png';

  wpAd.mmoverlay_vars = {
    ct: '%c%u'
  };

  s.type='text/javascript';
  s.src='http://js.washingtonpost.com/wp-adv/advertisers/norfolksouthern/2012/mm_ns.js';

  imp.src='%i%h/dot.gif';
  imp.width='1';
  imp.height='1';
  imp.alt='Impression Pixel';
  imp.style.border='0';
  imp.style.display='none';
  
  i.src=tileCreative;
  i.width='150';
  i.height='40';
  i.alt='Click here for more information';
  i.style.border='0';
  i.style.cursor='pointer';
  i.onclick = function(){
    try{
      wpAd.mmoverlay.exec()
    }catch(e){}
  };

  $('head').append(s);
  $('p.mm-ad-sponsored').css({display:'block'});
  $('#wp-ad-slug').empty().append(i).append(imp);

})(document, window.jQuery);