$(function() {
		
	var SearchView = Backbone.View.extend({
		el : '.wall',
		tag: 'test',
		row : 10,
		col : 10,
		initialize : function(options){
			var accessToken = "#",
    			url = 'https://api.instagram.com/v1/tags/'+options.tag+'/media/recent?access_token='+accessToken+'&callback=?&nocache=1'+ (new Date()).getTime(); 
    		this.render(url);
		},
		render: function(url){
			var picArray = [],
				that = this;
			$.getJSON(url, function(json) {
    			var dataLength = json.data.length;
				for(var i=0; i < dataLength; i++){
					var picImage = json.data[i].images.standard_resolution.url;
					picArray.push(picImage); 
				}
				that.build(picArray);
    		});
			that.build(picArray);
		},
		build: function(picArray){
			var col = this.options.col,
				row = this.options.row,
				total = row*col,
				length = picArray.length,
				blkWidth = $(document).width()/col,
				blkHeight = $(document).height()/row,
				newArray = [];

			//if odd number, remove last tile and add a placeholder
			if(total % 2 !== 0) { 
				total = total -1;
				newArray.push('img/blank.jpg');
			}

			//create array of images
			for(var i=0; i <  total/2; i++){
				var r = Math.floor(Math.random()*(length+1));
				var addPic = picArray[r];
				newArray.push(addPic); 
				newArray.push(addPic); 
			}

			//shuffle array of images
			var i = newArray.length, j, temp;
			if ( i === 0 ) return false;
			while ( --i ) {
				j = Math.floor( Math.random() * ( i + 1 ) );
				temp = newArray[i];
				newArray[i] = newArray[j]; 
				newArray[j] = temp;
			}

			var template = _.template($("#wall").html(), { images : newArray});
			this.$el.html(template);
			$('.block').css({width:blkWidth, height:blkHeight});
		}
	});

	var FormView = Backbone.View.extend({
		el : '.form',
		events : {
			'click button' : 'triggerSearch'
		},
		template : _.template($("#form").html()),
		initialize : function(){
			this.render();
		},
		render: function () {
			this.$el.html(this.template);
			return this;
		},
		triggerSearch: function(e){
			var tag = this.$el.find('.tag').val(),
				row = this.$el.find('.row').val(),
				col = this.$el.find('.col').val();
			var searchView = new SearchView({tag:tag, row:row, col:col});  
		}
	}); 

    var formView = new FormView();  
});
