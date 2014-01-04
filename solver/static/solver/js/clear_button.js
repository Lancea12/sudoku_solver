(function($){
  $.fn.clear_button_control = function(board){

    this.build_clear_button = function (){
      this.button_el.addClass('control_button');
      this.button_el.click($.proxy(function(event){
        this.board.clear();
      }, this));
    }

    this.board = board;
    this.button_el = $('<button>clear</board>');
    this.build_clear_button();

    return this;
  }

})(jQuery);
