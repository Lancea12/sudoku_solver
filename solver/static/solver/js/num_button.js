(function($){
  $.fn.num_button_control = function(num, board){
    var button = $('<button>'+num+'</board>').button();
    var opts = $.extend(this, button);

    this.addClass('num_button');
    this.click($.proxy(function(event){
      if(this.board.selected_cell != null){
        this.board.selected_cell.toggle_choice(num);
      }
    }, this));

    this.num = num;

    return this;
  }

})(jQuery);
