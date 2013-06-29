$(function() {

	window.TileModel = Backbone.Model.extend({
		defaults: {
			row: 5,
			col: 5,
			tag: '8675309'
		},
		validate: function(attrs, options) {
			var intRegex = /^\d+$/;
		    if(!attrs.tag || !attrs.row || !attrs.col){
		    	alert('you forgot to fill out all the fields, here are some puppies...');
		    	return "false";
		    }
		    if(!intRegex.test(attrs.row) || !intRegex.test(attrs.col)) {
			   alert('you\'re not using whole numbers, here are some puppies...');
			   return "false";
			}
		},
	});

	window.SearchView = Backbone.View.extend({
		el : '.wall',
		events : {
			'click .matchable' : 'showTile'
		},
		initialize : function(options){
			var accessToken = "#",
    			url = 'https://api.instagram.com/v1/tags/'+ this.model.get('tag') +'/media/recent?access_token='+accessToken+'&callback=?&nocache=1'+ (new Date()).getTime(); 
    		this.render(url); 
		},
		render: function(url){
			var picArray = [],
				that = this;

			//if no tag is provided, use data.js and save an api call
			if(this.model.get('tag')=="8675309") that.build(data);
			else {
				$.getJSON(url, function(json) {
	    			var dataLength = json.data.length;
					for(var i=0; i < dataLength; i++){
						var picImage = json.data[i].images.standard_resolution.url;
						picArray.push(picImage); 
					}
					that.build(picArray);
	    		});
	    	}
		},
		build: function(picArray){
			var col = this.model.get('col'),
				row = this.model.get('row'),
				total = row*col,
				length = picArray.length,
				blkWidth = $(document).width()/col,
				blkHeight = $(document).height()/row,
				bgHeight = 'center '+(blkHeight+1)+'px',
				newArray = [];

			//if odd number, remove last tile and add a placeholder
			var newTotal = total;
			if(newTotal % 2 !== 0) { 
				newTotal = newTotal -1;
				newArray.push('img/blank.jpg');
			}

			//create array of images
			for(var i=0; i <  newTotal/2; i++){
				var r = Math.floor(Math.random()*(length-1));
				var addPic = picArray[r];
				newArray.push(addPic); 
				newArray.push(addPic); 
			}

			//shuffle array of images
			this.shuffle(newArray);
			var template = _.template($("#wall").html(), { images : newArray});
			this.$el.html(template); 
			$('.block').css({width:blkWidth, height:blkHeight, backgroundPosition:bgHeight});
			this.show(total);
		},
		show: function(total){
			var nums = [],
				that = this,
				b = 0,
				showTile = null;

			//array of numbers
			for (var i = 0; i < total; i++) { nums.push(i); }

			//shuffle 'em
			this.shuffle(nums);

			//show tiles randomly, then hide them once all displayed
			var b = 0;
			function blast(i){
				that.$el.find('.block').eq(nums[i]).addClass('visible');
				b++;
			}

			setTimeout(function(){
				var showTile = setInterval(function () {
			        if(b<total) blast(b); 
					else{ 
						clearInterval(showTile);
						setTimeout(function(){ 
							that.$el.find('.block').removeClass('visible').addClass('matchable'); 
							alert('match game activated'); 
						}, 2000);
					}
			    }, 200);
			},2000);
			

		},
		showTile: function(e){
			$(e.target).addClass('selected');
		},
		shuffle: function(shuffledArray){
			var i = shuffledArray.length, j, temp;
			if ( i === 0 ) return false;
			while ( --i ) {
				j = Math.floor( Math.random() * ( i + 1 ) );
				temp = shuffledArray[i];
				shuffledArray[i] = shuffledArray[j]; 
				shuffledArray[j] = temp;
			}
			return shuffledArray;
		}		

	});

	window.FormView = Backbone.View.extend({
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
			tile.set({ tag:tag, row:row, col:col }, {validate: true})
			var searchView = new SearchView({model:tile});  
		}
	}); 

	var tile = new TileModel();
    var formView = new FormView(); 
    
});
