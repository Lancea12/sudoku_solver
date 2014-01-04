(function($){
  $.fn.num_button_control = function(num, board){

    this.build_num_button = function (){
      this.button_el.addClass('control_button');
      this.button_el.addClass('num_button');
      this.button_el.click($.proxy(function(event){
        if(this.board.selected_cell != null){
          this.board.selected_cell.toggle_choice(num);
        }
      }, this));
    }

    this.num = num;
    this.board = board;
    this.button_el = $('<button>'+num+'</board>');
    this.build_num_button();

    return this;
  }

})(jQuery);
