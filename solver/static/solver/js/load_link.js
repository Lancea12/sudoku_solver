(function($){
  $.fn.load_link_control = function(board){
    this.control_link({board: board, title: 'Reload Board'});

    this.click($.proxy(function(event){
      board.load_data();
    }, this));

    this.addClass('ui-icon-refresh');

    return this;
  }

})(jQuery);
