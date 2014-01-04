(function($){
  $.fn.solve_button_control = function(board){

    this.build_solve_button = function (){
      this.button_el.addClass('control_button');
      this.button_el.click($.proxy(function(event){
        this.board.solve();
      }, this));
    }

    this.board = board;
    this.button_el = $('<button>solve</board>');
    this.build_solve_button();

    return this;
  }

})(jQuery);
