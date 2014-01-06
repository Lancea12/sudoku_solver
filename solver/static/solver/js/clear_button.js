(function($){
  $.fn.clear_button_control = function(board){
    var button = $(document.body).button_control(board, {label : 'Clear'});
    var opts = $.extend(this, button);

    this.click($.proxy(function(event){
      this.board.clear();
    }, this));


    return this;
  }

})(jQuery);
