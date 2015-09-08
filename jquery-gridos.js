/*!
 The MIT License (MIT)

 Copyright (c) 2015 Cadeli

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */

;(function ($) {


	var Cell = function (lig, col) {
		this.lig = lig;
		this.col = col;
		this.color = '0xFF0000'
		this.state = false;
		this.height = 10;
		this.width = 10;
		this.top = 0;
		this.left = 0;
		//console.log("new cell "+ lig + "="+ col);
	};

	Cell.prototype.computePostion = function ( canvasWidth, canvasHeight, nbLigs, nbCols, cell_pad_w, cell_pad_h) {
		var canvasW = Math.round((canvasWidth  - cell_pad_w) / (nbCols )) - cell_pad_w;
		var canvasH = Math.round((canvasHeight - cell_pad_h) / (nbLigs )) - cell_pad_h;
		var canvasX = Math.round(this.col  * (canvasW + cell_pad_w)+ cell_pad_w);
		var canvasY = Math.round(this.lig  * (canvasH + cell_pad_h)+ cell_pad_h);
		//console.log("coords w:" + canvasW + " h="+ canvasH + " x=" + canvasX + " y="+ canvasY);
		//console.log("canvas "+ canvas_id+ " w:" + canvasWidth + " h="+ canvasHeight + " nbLigs=" + nbLigs + " nbCols="+ nbCols);
		return {
			x: canvasX,
			y: canvasY,
			w: canvasW,
			h: canvasH
		}
	};

	Cell.prototype.toggle = function() {
		//console.log("toggle sel cell="+ this.lig + "=" + this.col);
		if (this.state == true) {
			this.state = false;
		} else {
			this.state = true;
		}
	}

	var CellFactory = {
		getNewCell(lig,col) {
			return new Cell(lig,col);
		}
	}

//-------------------------------------------------------------------------------

	$.fn.gridos = function (options) {
		var Cells     = [];
  		var step=0;
  		var frame = 0;

		var settings = $.extend({
			cell_pad_w        : 4,
			cell_pad_h        : 6,
			cell_border_color : '#000000',
			cell_on_color     : '#2bfffd',
			cell_off_color    : '#808080',
			time_interval_ms  : 60,
			nb_cols           : 6,
            nb_ligs           : 2
 
		}, options);

		$this = $(this);

		var width = $this.width();
		var height = $this.height();

		var canvas_id = "gridos-canvas-"+     $this.attr('id');
		//console.log("eee="+canvas_id+" ee="+ $this.attr('id') + " aa");

		var canvas = $('<canvas id="'+ canvas_id+'">')
			//.css({position: 'absolute', left: 0, top: 0, width: '100%', height: '100%'})
			.attr({width: $this.width(), height: $this.height()})
			.prependTo($this);

		for (var lig = 0; lig < settings.nb_ligs; lig++) {
           	for (var col = 0; col <settings.nb_cols; col++) {
 				Cells.push(CellFactory.getNewCell(lig,col));
           	}
        }

		var computeNextFrame = function () {
			//console.log ("step="+step);
			Cells[frame].state=false;
			frame++;
			frame%=Cells.length;
			Cells[frame].state=true;
		};

		function updateTimer() {
      		computeNextFrame();
 			draw();
    	}

    	var compute_resize = function () {
			var width = $this.width();
			var height = $this.height();

			var canvas = document.getElementById(canvas_id);
			canvas.setAttribute("width", width.toString());
			canvas.setAttribute("height", height.toString());
    		
    		$.each(Cells, function (index, cell) {
				var rect = cell.computePostion(width, height, settings.nb_ligs, settings.nb_cols, settings.cell_pad_w, settings.cell_pad_h);
				cell.width  = rect.w;
				cell.height = rect.h;
				cell.top    = rect.y;
				cell.left   = rect.x;
					//console.log ("index=" + index);
			});
    	}

		var draw = function () {
			//var canvas_id = "gridos-canvas-"+     $this.attr('id');
			//console.log("eee draw="+canvas_id+" ee="+ $this.attr('id') + " aa");
		
			var canvas = document.getElementById(canvas_id);
			var width = canvas.width;
			var height = canvas.height;

			if (canvas.getContext) {
				var ctx = canvas.getContext('2d');

				ctx.clearRect(0, 0, width, height);
				ctx.fillStyle = settings.cell_border_color;
				ctx.fillRect(0, 0, width, height);

				$.each(Cells, function (index, cell) {
					if (cell.state ==true) {
						ctx.fillStyle = settings.cell_on_color;
					} else {
						ctx.fillStyle = settings.cell_off_color;
					}
					ctx.fillRect(cell.left, cell.top, cell.width, cell.height);
					//console.log ("index=" + index);
				});

			}
		};

		var setState = function (lig, col, state) {
			$.each(Cells, function (index, cell) {
				if (cell.lig == lig && cell.col == col) {
					cell.state=state;
					//console.log ("index=" + index);
				}
			});
		};

		var toggleCellFromPos = function(lig, col) {
			//console.log("toggleCellFromPos lig="+ lig + " col="+col );
			$.each(Cells, function (index, cell) {
				//console.log("toggleCellFromPos lig="+ lig + " col="+col + " clig ="+ cell.lig + " cCol=" + cell.col);
				if (cell.lig == lig && cell.col == col) {
					//console.log("toggleCellFromPos FOUND");
					cell.toggle();
					//console.log ("index=" + index);
				}
			});
		};

		function getCursorPosition(canvas, event) {
    		var rect = canvas.getBoundingClientRect();
    		var x = event.clientX - rect.left;
    		var y = event.clientY - rect.top;
    		//console.log("getCursorPosition x: " + x + " y: " + y);
    		return {posX:x,posY:y}
		}

		function getCellPos(cursorPos, cell_pad_w, cell_pad_h) {
			var cell = Cells[0]; // TODO OPTMIZE
    		var	col = parseInt(cursorPos.posX/ (cell.width  + cell_pad_w));
    		var	lig = parseInt(cursorPos.posY/ (cell.height + cell_pad_h));
    		//console.log("getCellPos lig: " + lig + " col: " + col + " w="+ cell.width + " h="+ cell.height + " cx="+cursorPos.posX);
    		return {cellLig:lig,cellCol:col}
		}

 		// EVENT HANDLERS
		$this.click(
			function (e) {
				var $this = $(this);
				var offset = $this.offset();
				var canvas = document.getElementById(canvas_id);
				var cursorPos = getCursorPosition(canvas,e);
				var cellPos   = getCellPos(cursorPos,settings.cell_pad_w, settings.cell_pad_h);
				toggleCellFromPos(cellPos.cellLig,cellPos.cellCol);			
				draw();
			}
		);

		//callables functions
		var output = {
		'toggle':function(l,c) {
			toggleCellFromPos(l,c);
			draw();
		},
		'resize':function() {
			compute_resize();
			draw();
		}
        };

        compute_resize();
        draw();

//--- 
  		startStop = setInterval(updateTimer, settings.time_interval_ms);
		return output;
	};

}(jQuery));