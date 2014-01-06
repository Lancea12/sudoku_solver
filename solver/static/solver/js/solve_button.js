(function($){
  $.fn.solve_button_control = function(board){
    var button = $(document.body).button_control(board, {label : 'Solve'});
    var opts = $.extend(this, button);


    this.click($.proxy(function(event){
      this.board.solve();
    }, this));

    return this;
  }

})(jQuery);
