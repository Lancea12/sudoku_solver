(function($){
  $.fn.clear_link_control = function(board){
    var link = $(document.body).control_link(board, {label : 'Clear'});
    var opts = $.extend(this, link);

    this.click($.proxy(function(event){
      this.board.clear();
    }, this));

    this.addClass('ui-icon-scissors');

    return this;
  }

})(jQuery);
