(function($){
  $.fn.button_control = function(board, options){
    var button = $('<button></button>').button(options);
    var opts = $.extend(this, button);

    this.addClass('control_button');
    this.board = board;

    return this;
  }

})(jQuery);
