(function($){
  $.fn.load_link_control = function(board){
    var link = $(document.body).control_link(board, {label: 'Load'});
    var opts = $.extend(this, link);


    this.click($.proxy(function(event){
      board.load_data();
    }, this));

    this.addClass('ui-icon-refresh');

    return this;
  }

})(jQuery);
