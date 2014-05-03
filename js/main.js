

;(function($){
    // Convenience vars for accessing elements
    var $body = $('body'),
    $pageslide = $('#pageslide');
    
    var _sliding = false,   // Mutex to assist closing only once
        _lastCaller;        // Used to keep track of last element to trigger pageslide

  // If the pageslide element doesn't exist, create it
  if( $pageslide.length == 0 ) {
   $pageslide = $('<div />').attr( 'id', 'pageslide' )
   .css( 'display', 'none' )
   .appendTo( $('body') );
 }

    /*
     * Private methods 
     */
     function _load( url, useIframe ) {
        // Are we loading an element from the page or a URL?
        if ( url.indexOf("#") === 0 ) {                
            // Load a page element                
            $(url).clone(true).appendTo( $pageslide.empty() ).show();
          } else {
            // Load a URL. Into an iframe?
            if( useIframe ) {
              var iframe = $("<iframe />").attr({
                src: url,
                frameborder: 0,
                hspace: 0
              })
              .css({
                width: "100%",
                height: "100%"
              });

              $pageslide.html( iframe );
            } else {
              $pageslide.load( url );
            }
            
            $pageslide.data( 'localEl', false );
            
          }
        }

    // Function that controls opening of the pageslide
    function _start( direction, speed ) {
      var slideWidth = $pageslide.outerWidth( true ),
      bodyAnimateIn = {},
      slideAnimateIn = {};

        // If the slide is open or opening, just ignore the call
        if( $pageslide.is(':visible') || _sliding ) return;         
        _sliding = true;

        switch( direction ) {
          case 'left':
          $pageslide.css({ left: 'auto', right: '-' + slideWidth + 'px' });
          bodyAnimateIn['margin-left'] = '-=' + slideWidth;
          slideAnimateIn['right'] = '+=' + slideWidth;
          break;
          default:
          $pageslide.css({ left: '-' + slideWidth + 'px', right: 'auto' });
          bodyAnimateIn['margin-left'] = '+=' + slideWidth;
          slideAnimateIn['left'] = '+=' + slideWidth;
          break;
        }

        // Animate the slide, and attach this slide's settings to the element
        $body.animate(bodyAnimateIn, speed);
        $pageslide.show()
        .animate(slideAnimateIn, speed, function() {
          _sliding = false;
        });
      }
      
    /*
     * Declaration 
     */
     $.fn.pageslide = function(options) {
      var $elements = this;

        // On click
        $elements.click( function(e) {
          var $self = $(this),
          settings = $.extend({ href: $self.attr('href') }, options);

            // Prevent the default behavior and stop propagation
            e.preventDefault();
            e.stopPropagation();
            
            if ( $pageslide.is(':visible') && $self[0] == _lastCaller ) {
                // If we clicked the same element twice, toggle closed
                $.pageslide.close();
              } else {                 
                // Open
                $.pageslide( settings );

                // Record the last element to trigger pageslide
                _lastCaller = $self[0];
              }       
            });                   
      };

  /*
     * Default settings 
     */
     $.fn.pageslide.defaults = {
        speed:      200,        // Accepts standard jQuery effects speeds (i.e. fast, normal or milliseconds)
        direction:  'left',    // Accepts 'left' or 'right'
        modal:      true,      // If set to true, you must explicitly close pageslide using $.pageslide.close();
        iframe:     true,       // By default, linked pages are loaded into an iframe. Set this to false if you don't want an iframe.
        href:       null        // Override the source of the content. Optional in most cases, but required when opening pageslide programmatically.
      };

  /*
     * Public methods 
     */

  // Open the pageslide
  $.pageslide = function( options ) {   

      $("canvas").attr('width', '900');
      canvasApp(70);
      // Extend the settings with those the user has provided
      var settings = $.extend({}, $.fn.pageslide.defaults, options);
      
      // Are we trying to open in different direction?
      if( $pageslide.is(':visible') && $pageslide.data( 'direction' ) != settings.direction) {
        $.pageslide.close(function(){
          _load( settings.href, settings.iframe );
          _start( settings.direction, settings.speed );
        });
      } else {                
        _load( settings.href, settings.iframe );
        if( $pageslide.is(':hidden') ) {
          _start( settings.direction, settings.speed );
        }
      }
      $('#menu').css('right', '400px');
      $pageslide.data( settings );

    }

  // Close the pageslide
  $.pageslide.close = function( callback ) {
    $('#menu').css('right', '0');
    $("canvas").attr('width', '1285');
      canvasApp(120);
    var $pageslide = $('#pageslide'),
    slideWidth = $pageslide.outerWidth( true ),
    speed = $pageslide.data( 'speed' ),
    bodyAnimateIn = {},
    slideAnimateIn = {}

        // If the slide isn't open, just ignore the call
        if( $pageslide.is(':hidden') || _sliding ) return;          
        _sliding = true;
        
        switch( $pageslide.data( 'direction' ) ) {
          case 'left':
          bodyAnimateIn['margin-left'] = '+=' + slideWidth;
          slideAnimateIn['right'] = '-=' + slideWidth;
          break;
          default:
          bodyAnimateIn['margin-left'] = '-=' + slideWidth;
          slideAnimateIn['left'] = '-=' + slideWidth;
          break;
        }
        
        $pageslide.animate(slideAnimateIn, speed);
        $body.animate(bodyAnimateIn, speed, function() {
          $pageslide.hide();
          _sliding = false;
          if( typeof callback != 'undefined' ) callback();
        });
      }

      /* Events */

  // Don't let clicks to the pageslide close the window
  $pageslide.click(function(e) {
    e.stopPropagation();
  });

  // Close the pageslide if the document is clicked or the users presses the ESC key, unless the pageslide is modal
  $(document).bind('click keyup', function(e) {
      // If this is a keyup event, let's see if it's an ESC key
      if( e.type == "keyup" && e.keyCode != 27) return;
      
      // Make sure it's visible, and we're not modal      
      if( $pageslide.is( ':visible' ) && !$pageslide.data( 'modal' ) ) {          
        $.pageslide.close();
      }
    });
  
})(jQuery);


(function($){

 $.fn.splitter = function(args){
  args = args || {};
  return this.each(function() {
    var zombie;   // left-behind splitbar for outline resizes
    function startSplitMouse(evt) {
      if ( opts.outline )
        zombie = zombie || bar.clone(false).insertAfter(A);
      panes.css("-webkit-user-select", "none"); // Safari selects A/B text on a move
      bar.addClass(opts.activeClass);
      A._posSplit = A[0][opts.pxSplit] - evt[opts.eventPos];
      $(document)
      .bind("mousemove", doSplitMouse)
      .bind("mouseup", endSplitMouse);
    }
    function doSplitMouse(evt) {
      var newPos = A._posSplit+evt[opts.eventPos];
      if ( opts.outline ) {
        newPos = Math.max(0, Math.min(newPos, splitter._DA - bar._DA));
        bar.css(opts.origin, newPos);
      } else 
      resplit(newPos);
    }
    function endSplitMouse(evt) {
      bar.removeClass(opts.activeClass);
      var newPos = A._posSplit+evt[opts.eventPos];
      if ( opts.outline ) {
        zombie.remove(); zombie = null;
        resplit(newPos);
      }
      panes.css("-webkit-user-select", "text"); // let Safari select text again
      $(document)
      .unbind("mousemove", doSplitMouse)
      .unbind("mouseup", endSplitMouse);
    }
    function resplit(newPos) {
      // Constrain new splitbar position to fit pane size limits
      newPos = Math.max(A._min, splitter._DA - B._max, 
        Math.min(newPos, A._max, splitter._DA - bar._DA - B._min));
      // Resize/position the two panes
      bar._DA = bar[0][opts.pxSplit];   // bar size may change during dock
      bar.css(opts.origin, newPos).css(opts.fixed, splitter._DF);
      A.css(opts.origin, 0).css(opts.split, newPos).css(opts.fixed,  splitter._DF);
      B.css(opts.origin, newPos+bar._DA)
      .css(opts.split, splitter._DA-bar._DA-newPos).css(opts.fixed,  splitter._DF);
      // IE fires resize for us; all others pay cash
      if ( !$.browser.msie )
        panes.trigger("resize");
    }
    function dimSum(jq, dims) {
      // Opera returns -1 for missing min/max width, turn into 0
      var sum = 0;
      for ( var i=1; i < arguments.length; i++ )
        sum += Math.max(parseInt(jq.css(arguments[i])) || 0, 0);
      return sum;
    }
    
    // Determine settings based on incoming opts, element classes, and defaults
    var vh = (args.splitHorizontal? 'h' : args.splitVertical? 'v' : args.type) || 'v';
    var opts = $.extend({
      activeClass: 'active',  // class name for active splitter
      pxPerKey: 8,      // splitter px moved per keypress
      tabIndex: 0,      // tab order indicator
      accessKey: ''     // accessKey for splitbar
    },{
      v: {          // Vertical splitters:
        keyLeft: 39, keyRight: 37, cursor: "e-resize",
        splitbarClass: "vsplitbar", outlineClass: "voutline",
        type: 'v', eventPos: "pageX", origin: "left",
        split: "width",  pxSplit: "offsetWidth",  side1: "Left", side2: "Right",
        fixed: "height", pxFixed: "offsetHeight", side3: "Top",  side4: "Bottom"
      },
      h: {          // Horizontal splitters:
        keyTop: 40, keyBottom: 38,  cursor: "n-resize",
        splitbarClass: "hsplitbar", outlineClass: "houtline",
        type: 'h', eventPos: "pageY", origin: "top",
        split: "height", pxSplit: "offsetHeight", side1: "Top",  side2: "Bottom",
        fixed: "width",  pxFixed: "offsetWidth",  side3: "Left", side4: "Right"
      }
    }[vh], args);

    // Create jQuery object closures for splitter and both panes
    var splitter = $(this).css({position: "relative"});
    var panes = $(">*", splitter[0]).css({
      position: "absolute",       // positioned inside splitter container
      "z-index": "1",         // splitbar is positioned above
      "-moz-outline-style": "none"  // don't show dotted outline
    });
    var A = $(panes[0]);    // left  or top
    var B = $(panes[1]);    // right or bottom

    // Focuser element, provides keyboard support; title is shown by Opera accessKeys
    var focuser = $('<a href="javascript:void(0)"></a>')
    .attr({accessKey: opts.accessKey, tabIndex: opts.tabIndex, title: opts.splitbarClass})
    .bind($.browser.opera?"click":"focus", function(){ this.focus(); bar.addClass(opts.activeClass) })
    .bind("keydown", function(e){
      var key = e.which || e.keyCode;
      var dir = key==opts["key"+opts.side1]? 1 : key==opts["key"+opts.side2]? -1 : 0;
      if ( dir )
        resplit(A[0][opts.pxSplit]+dir*opts.pxPerKey, false);
    })
    .bind("blur", function(){ bar.removeClass(opts.activeClass) });

    // Splitbar element, can be already in the doc or we create one
    var bar = $(panes[2] || '<div></div>')
    .insertAfter(A).css("z-index", "100").append(focuser)
    .attr({"class": opts.splitbarClass, unselectable: "on"})
    .css({position: "absolute", "user-select": "none", "-webkit-user-select": "none",
      "-khtml-user-select": "none", "-moz-user-select": "none"})
    .bind("mousedown", startSplitMouse);
    // Use our cursor unless the style specifies a non-default cursor
    if ( /^(auto|default|)$/.test(bar.css("cursor")) )
      bar.css("cursor", opts.cursor);

    // Cache several dimensions for speed, rather than re-querying constantly
    bar._DA = bar[0][opts.pxSplit];
    splitter._PBF = $.boxModel? dimSum(splitter, "border"+opts.side3+"Width", "border"+opts.side4+"Width") : 0;
    splitter._PBA = $.boxModel? dimSum(splitter, "border"+opts.side1+"Width", "border"+opts.side2+"Width") : 0;
    A._pane = opts.side1;
    B._pane = opts.side2;
    $.each([A,B], function(){
      this._min = opts["min"+this._pane] || dimSum(this, "min-"+opts.split);
      this._max = opts["max"+this._pane] || dimSum(this, "max-"+opts.split) || 9999;
      this._init = opts["size"+this._pane]===true ?
      parseInt($.curCSS(this[0],opts.split)) : opts["size"+this._pane];
    });
    
    // Determine initial position, get from cookie if specified
    var initPos = A._init;
    if ( !isNaN(B._init) )  // recalc initial B size as an offset from the top or left side
      initPos = splitter[0][opts.pxSplit] - splitter._PBA - B._init - bar._DA;
    if ( opts.cookie ) {
      if ( !$.cookie )
        alert('jQuery.splitter(): jQuery cookie plugin required');
      var ckpos = parseInt($.cookie(opts.cookie));
      if ( !isNaN(ckpos) )
        initPos = ckpos;
      $(window).bind("unload", function(){
        var state = String(bar.css(opts.origin)); // current location of splitbar
        $.cookie(opts.cookie, state, {expires: opts.cookieExpires || 365, 
          path: opts.cookiePath || document.location.pathname});
      });
    }
    if ( isNaN(initPos) ) // King Solomon's algorithm
      initPos = Math.round((splitter[0][opts.pxSplit] - splitter._PBA - bar._DA)/2);

    // Resize event propagation and splitter sizing
    if ( opts.anchorToWindow ) {
      // Account for margin or border on the splitter container and enforce min height
      splitter._hadjust = dimSum(splitter, "borderTopWidth", "borderBottomWidth", "marginBottom");
      splitter._hmin = Math.max(dimSum(splitter, "minHeight"), 20);
      $(window).bind("resize", function(){
        var top = splitter.offset().top;
        var wh = $(window).height();
        splitter.css("height", Math.max(wh-top-splitter._hadjust, splitter._hmin)+"px");
        if ( !$.browser.msie ) splitter.trigger("resize");
      }).trigger("resize");
    }
    else if ( opts.resizeToWidth && !$.browser.msie )
      $(window).bind("resize", function(){
        splitter.trigger("resize"); 
      });

    // Resize event handler; triggered immediately to set initial position
    splitter.bind("resize", function(e, size){
      // Custom events bubble in jQuery 1.3; don't get into a Yo Dawg
      if ( e.target != this ) return;
      // Determine new width/height of splitter container
      splitter._DF = splitter[0][opts.pxFixed] - splitter._PBF;
      splitter._DA = splitter[0][opts.pxSplit] - splitter._PBA;
      // Bail if splitter isn't visible or content isn't there yet
      if ( splitter._DF <= 0 || splitter._DA <= 0 ) return;
      // Re-divvy the adjustable dimension; maintain size of the preferred pane
      resplit(!isNaN(size)? size : (!(opts.sizeRight||opts.sizeBottom)? A[0][opts.pxSplit] :
        splitter._DA-B[0][opts.pxSplit]-bar._DA));
    }).trigger("resize" , [initPos]);
  });
};

})(jQuery);


window.addEventListener('load', eventWindowLoaded, false);  
function eventWindowLoaded() {

  canvasApp(120);
}
    //consoleLog 
    //*** consoleLog util class
    //create constructor


    function eventWindowLoaded() {

      canvasApp();
    }


    function canvasApp(size) {
      if(size == null){
        size = 120;
      }

      var message = "Test Canvas";
      var fontSize = size;


      var theCanvas = document.getElementById('canvasOne');
      if (!theCanvas || !theCanvas.getContext) {
       return;
     }
     var context = theCanvas.getContext('2d'); 



     var formElement = document.getElementById("textBox");
     formElement.addEventListener('change', textBoxChanged, false);  

     formElement = document.getElementById("textSize");
     formElement.addEventListener('change', textSizeChanged, false); 

     formElement = document.getElementById("canvasWidth")
     formElement.addEventListener('change', canvasWidthChanged, false);  

     formElement = document.getElementById("canvasHeight")
     formElement.addEventListener('change', canvasHeightChanged, false);



     drawScreen();

     function drawScreen() {

      context.fillStyle = '#dddddd';
      context.fillRect(0, 0, theCanvas.width, theCanvas.height);
      context.strokeStyle = '#000000'; 

      context.strokeRect(5,  5, theCanvas.width-10, theCanvas.height-10);
      context.font =  fontSize + "px serif" 

      var metrics = context.measureText(message)
      var textWidth = metrics.width;
      var xPosition = (theCanvas.width/2 - textWidth/2);
      var yPosition = (theCanvas.height/2);
      var tempColor = "#000000";
      context.fillStyle    = tempColor;
      context.fillText  ( message,  xPosition ,yPosition);
      context.strokeStyle = "#FF0000";
      context.strokeText  ( message, xPosition,yPosition);

    }

    function textBoxChanged(e) {
      var target =  e.target;
      message = target.value;
      drawScreen();
    }

    function textSizeChanged(e) {
      var target =  e.target;
      fontSize = target.value;
      drawScreen();
    }

    function canvasWidthChanged(e) {
      var target =  e.target;
      theCanvas.width =  target.value;
      drawScreen();
    }

    function canvasHeightChanged(e) {
      var target =  e.target;
      theCanvas.height =  target.value;
      drawScreen();
    }
  }