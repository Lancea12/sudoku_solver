(function($){
  $.fn.control_link = function(options){
    var opts = $.extend(this, options);

    this.addClass('control_link');
    this.addClass('ui-icon');

    this[0].title = this.title;
    this.tooltip();

    return this;
  }

})(jQuery);
