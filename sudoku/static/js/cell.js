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

    this.add_choice = function(ch, add_to_hist){
      add_to_hist = typeof add_to_hist !== 'undefined' ? add_to_hist : true;
      if(ch < 1 || ch > 9){
        return false;;
      }
      if(this.choices[ch-1] != undefined || this.anchor_cell){
        return false;
      }
      this.choices[ch-1] = ch;
      this.num_choices++;
      if(add_to_hist){
        this.add_to_history(ch, this.ADD);
      }
      this.update_display();
      return true;
    }

    this.remove_choices = function(ch_arr){
      //this.mod = false;
      var mod = false;
      ch_arr.forEach(function(choice){
        if(this.remove_choice(choice)){
           mod = true;
           //this.mod = true;
        }
      }, this);    
     return mod;
     //return this.mod;
    }

    this.remove_choice = function(ch, add_to_hist){
      add_to_hist = typeof add_to_hist !== 'undefined' ? add_to_hist : true;
      if(ch < 1 || ch > 9){
        return false;
      }
      if(this.choices[ch-1] == undefined || this.anchor_cell){
        return false;
      }
      delete(this.choices[ch-1]);
      this.num_choices--;
      if(add_to_hist){
        this.add_to_history(ch, this.REMOVE);
      }
      this.update_display();
      return true;
    }

    this.add_to_history = function(ch, action){
      row.board.add_to_history(row_index, col_index, ch, action);
    }

    this.undo = function(ch, action){
      if(action == this.ADD){
        this.remove_choice(ch, false);
      } else if(action == this.REMOVE){
        this.add_choice(ch, false);
      }
    }

    this.redo = function(ch, action){
      if(action == this.ADD){
        this.add_choice(ch, false);
      } else if(action == this.REMOVE){
        this.remove_choice(ch, false);
      }
    }

    this.choices_issubset = function(test_choices){
      var issubset = true;
      this.choices.every(function(choice){
        if(test_choices.indexOf(choice) == -1){
          issubset= false;
          return false;
        }
        return true;
      }, this);
      return issubset;
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

    this.remove_all_choices = function(add_to_hist){
      add_to_hist = typeof add_to_hist !== 'undefined' ? add_to_hist : true;
      for(var i=1; i<=9; i++){
        this.remove_choice(i, add_to_hist);
      }
    }

    this.remove_all_but_one_choice = function(choice){
      if(this.choices.element_count() == 1 && this.choices[choice-1] == choice){
        return false;
      }
      this.remove_all_choices();
      this.add_choice(choice);
      return true;
    }

    this.make_random_selection = function(){
      var ch_count = Math.floor(Math.random() * this.num_choices);
      var ch = this.get_choice_from_beg_count(ch_count);
      this.remove_all_but_one_choice(ch);
    }

    // this function gets a choice from the number of valid choices it is from
    // the beginning of the list
    this.get_choice_from_beg_count = function(count){
      var j = 0;
      for(var index in this.choices){
        if(this.choices[index] != undefined){
          if(j == count){
            return this.choices[index];
          }
          j+=1;
        }
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
          this.add_choice(choice, false);
        }
      }

      // have to set anchored cell at the end because it locks out changes
      this.set_anchor_cell(cell_data['anchored']);
    }

    this.save_data = function(){
      var data = {};
      data.cell_index = this.cell_index;
      data.choices = this.get_choices();
      data.anchored = this.anchor_cell;
      return data;
    }

    this.get_choices = function(){
      var choices = [];
      this.choices.forEach(function(choice){
        choices.push(choice);
      }, this);
      return choices;
    }
    
    

    this.ADD = 'add';
    this.REMOVE = 'remove';
    this.choices = [];
    this.anchor_cell = false;
    this.num_choices = 0;
    this.row = row;
    this.row_index = row_index;
    this.col_index = col_index;
    this.tic_index = (row_index - (row_index % 3)) + (col_index - (col_index %3))/3;
    this.cell_el = $('<td></td>');
    this.table_el = $('<table></table>');
    this.table_displayed = 0;
    this.build_cell();

    return this;
  }

})(jQuery);
