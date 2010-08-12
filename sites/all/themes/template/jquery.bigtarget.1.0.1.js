// bigTarget.js - A jQuery Plugin
// Version 1.0.1
// Written by Leevi Graham - Technical Director - Newism Web Design & Development
// http://newism.com.au
// Notes: Tooltip code from fitted.js - http://www.trovster.com/lab/plugins/fitted/

// create closure
(function($) {
	// plugin definition
	$.fn.bigTarget = function(options) {
		// build main options before element iteration
		var opts = $.extend({}, $.fn.bigTarget.defaults, options);
		// iterate and reformat each matched element
		return this.each(function() {
			// set the anchor attributes
			var $a = $(this);
			var href = $a.attr('href');
			var title = $a.attr('title');
			// build element specific options
			var o = $.meta ? $.extend({}, opts, $a.data()) : opts;
			// update element styles
			$a.parents(o.clickZone)
				.hover(function() {
					$h = $(this);
					if(typeof o.title != 'undefined' && o.title === true && title != '') {
						$h.attr('title',title);
					}
					if (typeof(o.hoverClass)=='function') {
						o.hoverClass.call($h, 1);
						return;
					}
					$h.addClass(o.hoverClass);
				}, function() {
					$h = $(this);
					if(typeof o.title != 'undefined' && o.title === true && title != '') {
						$h.removeAttr('title');
					}
					if (typeof(o.hoverClass)=='function') {
						o.hoverClass.call($h, 0);
						return;
					}
					$h.removeClass(o.hoverClass);
				})
				// click
				.click(function(event) {
					if(getSelectedText() == "" && !event.isPropagationStopped())
					{
						if($a.is('[rel*=external]')){
							window.open(href);
							return false;
						}
						else {
							//$a.click(); $a.trigger('click');
							window.location = href;
						}
					}
					return true;
				});
		});
	};
	// private function for debugging
	function debug($obj) {
		if (window.console && window.console.log)
		window.console.log('bigTarget selection count: ' + $obj.size());
	};
	// get selected text
	function getSelectedText(){
		if(window.getSelection){
			return window.getSelection().toString();
		}
		else if(document.getSelection){
			return document.getSelection();
		}
		else if(document.selection){
			return document.selection.createRange().text;
		}
		return null;
	};
	// plugin defaults
	$.fn.bigTarget.defaults = {
		hoverClass	: 'hover',
		clickZone	: 'li:eq(0)',
		title		: true
	};
// end of closure
})(jQuery);