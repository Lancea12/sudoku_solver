(function($){
  $.fn.board_cell = function(row, row_index, col_index){

    this.build_cell = function (){
      this.cell_el.addClass('board_cell');
      if(this.row_index == 0 || this.row_index == 3 || this.row_index == 6){
        this.cell_el.addClass('tic_top');
      }
      if(this.row_index == 8){
        this.cell_el.addClass('tic_bottom');
      }
      if(this.col_index == 0 || this.col_index == 3 || this.col_index == 6){
        this.cell_el.addClass('tic_left');
      }
      if(this.col_index == 8){
        this.cell_el.addClass('tic_right');
      }
      this.build_table();
      this.build_click();
      this.update_display();
    }

    this.build_table = function(){
      for(var y=0; y<3; y++){
        var $cell_row = $('<tr></tr>');
        for(var x=1; x<4; x++){
          var $cell_cell = $('<td>');
          $cell_cell.addClass('cell_cell');
          $cell_row.append($cell_cell);
        }
        this.table_el.append($cell_row);
        this.table_el.addClass('cell_table');
      } 
    }

    this.build_click = function(){
      this.cell_el.click($.proxy(this.select_cell, this));
    }
    
    this.select_cell = function(event){
        var board = this.row.board;
        if(board.selected_cell != null){
          board.selected_cell.cell_el.removeClass('selected_cell');
        } 
        board.selected_cell = this;
        this.cell_el.addClass('selected_cell');
    }

    this.update_table = function(){
      for(var y=0; y<this.table_el.children()[0].childNodes.length; y++){
        var cell_row = $(this.table_el.children()[0].childNodes.item(y));
        for(var x=0; x<cell_row[0].cells.length; x++){
          var cell_cell = $(cell_row[0].cells.item(x));
          var cur_choice = parseInt(y) * 3 + parseInt(x);
          if(this.choices[cur_choice] != undefined){
            cell_cell.html(this.choices[cur_choice]);
          }else{
            cell_cell.html(' ');
          }
        }
      }
    }

    this.update_display = function(){ 
      if(this.num_choices > 1){
        this.update_table();
        if(!this.table_displayed){
          this.cell_el.html(this.table_el);
        }
        this.table_displayed = 1;
      }else if(this.num_choices == 1){
        this.choices.forEach($.proxy(function(val, index){
          if(val != undefined){
            this.cell_el.html(val);
          }
        }, this));
        this.table_displayed = 0;
      }else{
        this.cell_el.html('');
        this.table_displayed = 0;
      }
    }

    this.add_choice = function(ch){
      if(ch < 1 || ch > 9){
        return false;;
      }
      if(this.choices[ch-1] != undefined || this.anchor_cell){
        return false;
      }
      this.choices[ch-1] = ch;
      this.num_choices++;
      this.update_display();
      return true;
    }

    this.remove_choice = function(ch){
      if(ch < 1 || ch > 9){
        return false;
      }
      if(this.choices[ch-1] == undefined || this.anchor_cell){
        return false;
      }
      delete(this.choices[ch-1]);
      this.num_choices--;
      this.update_display();
      return true;
    }

    this.toggle_choice = function(ch){
      if(this.choices[ch-1] == undefined){
        this.add_choice(ch);
      }else{
        this.remove_choice(ch);
     }
    }

    this.set_anchor_cell = function(val){
      this.anchor_cell = val;
      if(this.anchor_cell){
        this.cell_el.addClass('board_anchor_cell');
      }else{
        this.cell_el.removeClass('board_anchor_cell');
      }
    }

    this.add_all_choices = function(){
      for(var i=1; i<=9; i++){
        this.add_choice(i);
      }
    }

    this.remove_all_choices = function(){
      for(var i=1; i<=9; i++){
        this.remove_choice(i);
      }
    }

    this.get_single_choice = function(){
      if(this.num_choices != 1){
        return null;
      }
      for(var index in this.choices){
        if(this.choices[index] != undefined){
          return this.choices[index];
        }
      }
      return null;
    }

    this.has_choice = function(choice){
      return (this.choices[choice-1] != undefined);
    }

    this.load_data = function(cell_data){
      this.remove_all_choices();
      for(var choice_index=0; choice_index<9; choice_index++){
        var choice = cell_data['choices'][choice_index];
        if(choice != null){
          this.add_choice(choice);
        }
      }
    }
    

    this.choices = [];
    this.anchor_cell = false;
    this.num_choices = 0;
    this.row = row;
    this.row_index = row_index;
    this.col_index = col_index;
    this.cell_el = $('<td></td>');
    this.table_el = $('<table></table>');
    this.table_displayed = 0;
    this.build_cell();

    return this;
  }

})(jQuery);
