(function($){
  $.fn.clear_link_control = function(board){
    this.control_link({board: board, title : 'Clear Unanchored Cells'});

    this.click($.proxy(function(event){
      this.board.clear();
    }, this));

    this.addClass('ui-icon-scissors');

    return this;
  }

})(jQuery);
