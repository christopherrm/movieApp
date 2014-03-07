var movieApp = {};
movieApp.api_key = "f21b480d122e89c1eaf6c5db69b25a8f";


movieApp.init = function(){
	movieApp.grabConfig();
	movieApp.getSessionId();
	//listen for a click on our star ratings
	$('body').on('change','input[type=radio]',function(){
		var rating = $(this).val();
		var movieID = $(this).attr('id').split('-')[0].replace('movie','');
		movieApp.ratingHandler(rating,movieID);
		});// click function star rating

	$('select.genreList').change(function(e){
		e.preventDefault();
		var genreId = $(this).find(":selected").val();
		movieApp.grabMoviesbyGenre(genreId);
	});//end form search
	
	movieApp.grabGenres();
	}; // end movieapp init()

// this function will go to the moviedb api and get all the config data that we need. When it finishes it will put the data it gets onto movieApp.config
movieApp.grabConfig = function(){
	
	var configURL = 'http://api.themoviedb.org/3/configuration';
	$.ajax(configURL,{
		type : 'GET',
		dataType : 'jsonp',
		data : {
			api_key : movieApp.api_key
		}, 
		success : function(config){
			movieApp.config = config;
			
			 //call the next thing to do 
		},
	}); // config ajax
}; // end grabConfig function

movieApp.grabGenres = function(){
	var movieGenres ='http://api.themoviedb.org/3/genre/list'
	$.ajax(movieGenres,{
		type : 'GET',
		dataType : 'jsonp',
		data : {
			api_key : movieApp.api_key
		},
		success : function(data){
			movieApp.genres = data.genres;
			movieApp.makeGenreDropdown(movieApp.genres)

		},// end success
	});//end ajax movie genres
};// end grab genre function

movieApp.makeGenreDropdown = function(genres) {
	console.log(genres)
	for (var i = 0; i < genres.length; i++) {
		var name = genres[i].name;
		var id = genres[i].id;
		var option = $('<option>').text(name).val(id);
		$('select.genreList').append(option);
	};
};

movieApp.grabMoviesbyGenre = function(genre){
	var movieGenreURL = 'http://api.themoviedb.org/3/genre/' + genre + '/movies';
	$.ajax(movieGenreURL,{
		type : 'GET',
		dataType : 'jsonp',
		data : {
			api_key : movieApp.api_key,
		},
		success : function(data){
			movieApp.displayMovies(data.results);
			console.log(data);
			}		
	}); //end ajax grabMoviesbyGenre
};//end grabMoviesbyGenre function

movieApp.displayMovies = function(movies){
	for (var i = 0; i < movies.length; i++) {
		var title = $('<h3>').text( movies[i].original_title );
		var image = $('<img>').attr('src',movieApp.config.images.base_url + "w500" + movies[i].poster_path);
		var rating = $('fieldset.rateMovie')[0].outerHTML;
		rating = rating.replace(/star/g,'movie' +movies[i].id + '-star');
		rating = rating.replace(/rating/g,'rating-' +movies[i].id);
		var movieWrap = $('<div>').addClass('movie');

		movieWrap.append(title,image,rating);
		$('.movieContainer').append(movieWrap);
	};
}; // end displayMovies

movieApp.ratingHandler = function(rating,movieId){

	$.ajax('http://api.themoviedb.org/3/movie/'+movieId+'/rating',{
		type : 'POST',
		data : {
			api_key : movieApp.api_key,
			guest_session_id : movieApp.session_id,
			value : rating * 2
		},
		success : function(response){
			if(response.status_code){
				alert('thanks for the vote');
			}
			else{
				alert(response.status_message);
			}
		}
	});
};// rating handler function

movieApp.getSessionId = function(){
	$.ajax('http://api.themoviedb.org/3/authentication/guest_session/new',{
		data : {
			api_key : movieApp.api_key
		},
		type : 'GET',
		dataType : 'jsonp',
		success : function(session){
			// store the session id for later use
			movieApp.session_id = session.guest_session_id;
			//console.log(session);
		}
	});
}; //end getSession function


// start doc ready
$(function(){
	movieApp.init();
}); //end document ready