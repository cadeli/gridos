




;(function ( $, window, document, undefined ) {

    "use strict";

        var pluginName = "gmatrix",
                defaults = {
            text          : 'just',        
            inner_padding : '0',
            inner_border  : '1',
            inner_color   : '1',
            inner_radius  : '1',
            nb_cols       : '50',
            nb_ligs       : '20'
       };

        // The actual plugin constructor
        function Plugin ( element, options ) {
                this.element = element;
                this.$element = $(element);

                this.settings = $.extend( {}, defaults, options );
                this._defaults = defaults;
                this._name = pluginName;
                this.init();
        }

        // Avoid Plugin.prototype conflicts
        $.extend(Plugin.prototype, {
                myfnt: function () {
                    this.$element.css( 'background-color', '#808080');
                    console.log("test ====================================================  ");
                },

 
                init: function () {
                    console.log("init gmatrix ==============" + this.$element.text());
                    this.$element.text( this.settings.text );

            if ( this.settings.color ) {
                this.$element.css( 'color', this.settings.color );
            }

            if ( this.settings.backgroundcolor ) {
                this.$element.css( 'background-color', this.settings.backgroundcolor );
            }

            if ( this.settings.border ) {
                this.$element.css( 'border', this.settings.border );
            }

            if ( this.settings.margin ) {
                this.$element.css( 'margin', this.settings.margin );
            }

            if ( this.settings.padding ) {
                this.$element.css( 'padding', this.settings.padding );
            }

            if ( this.settings.fontStyle ) {
                this.$element.css( 'font-style', this.settings.fontStyle );
            }
 
           // console.log("gridos  create ligs="+ this.settings.nb_ligs );
            
            for (var lig = 0; lig < this.settings.nb_ligs; lig++) {
                for (var col = 0; col <this. settings.nb_cols; col++) {
                    var $cell = jQuery('<div/>', {
                        class  : 'gm_cell',
                        id     :  this.$element.attr('id')+ '_cell_'+lig+"_"+col,
                        title  : 'cell_'+lig+"_"+col,
                       // text   : lig+"-"+col,
                    }).appendTo(this.$element);

                    $cell.css({ 
                        "border": this.settings.inner_border + 'px solid black'
                    });

                    $cell.click(function(e) {
                        console.log("click on " + e.target.id );
                        var s = e.target.id.split("_");
                        var col = parseInt(s[3]);
                        var lig = parseInt(s[2]);
                        console.log("click on lig=" + lig + " col="+col );
                        if ($cell.state == true) {
                            $cell.addClass('active');
                        } else {
                            $cell.removeClass('active');
                        }
                    });
                }
            }
            this.resize();

                },

                setState: function (col,lig,state) {
                    var idCell = this.$element.attr('id')+ '_cell_'+lig+"_"+col;
                    var cell = document.getElementById(idCell);
                    if (cell != null) {
                    cell.state = state;
                    if (state == true) {
                        $(cell).addClass('active');
                    } else {
                        $(cell).removeClass('active');
                    }} else {
                        console.log ("no cell for id="+ idCell);
                    }
                },

                resize: function() {
                    console.log("= resize");

            var pad  = parseInt( this.settings.inner_padding );
            var cols = parseInt( this.settings.nb_cols       );
            var ligs = parseInt( this.settings.nb_ligs       );
          

            var w =  (this.$element.width()   - pad*(cols+1) );
            var h =  (this.$element.height()  - pad*(ligs+1) );

            w  =parseInt(w/ this.settings.nb_cols);
            h  =parseInt(h/ this.settings.nb_ligs);

            var y =   0;
            var x =   0;
            var numCell =   0;
            console.log("resize gridos  w="+   w + " h="+h+" x="+x+ " y="+y+ " =="+ this.$element.width()  + "=" + this.$element.height() );
            
            for (var lig = 0; lig < ligs; lig++) {
                for (var col = 0; col < cols; col++) {
                    x =  parseInt(pad + col*(w+pad));
                    y =  parseInt(pad + lig*(h+pad));
                    var cell = this.$element.children("div")[numCell];
                    $(cell).css({ 
                        "top":  y+"px", 
                        "left": x+"px"
                    });

                    $(cell).width(w);
                    $(cell).height(h);
                    numCell++;
                }
            }
        }
                 
        });

        // A really lightweight plugin wrapper around the constructor,
        // preventing against multiple instantiations
        $.fn[ pluginName ] = function ( options ) {
                return this.each(function() {
                        if ( !$.data( this, "plugin_" + pluginName ) ) {
                                $.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
                        }
                });
        };

} )( jQuery, window, document );
