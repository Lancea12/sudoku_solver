(function($){
  $.fn.control_link = function(board, options){
    var link = $('<a></a>');
    var opts = $.extend(this, link);

    this.addClass('control_link');
    this.addClass('ui-icon');
    this.board = board;

    return this;
  }

})(jQuery);
