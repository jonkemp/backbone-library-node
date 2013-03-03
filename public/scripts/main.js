(function ($) {
  $("#releaseDate").datepicker();

    var Book = Backbone.Model.extend({
      defaults:{
        coverImage:"img/placeholder.png",
        title:"No title",
        author:"Unknown",
        releaseDate:"Unknown",
        keywords:"None"
      },
      parse:function (response) {
        //console.log(response);
        response.id = response._id;
        return response;
      }
    });

    var BookView = Backbone.View.extend({
      tagName:"div",
      className:"bookContainer",
      template:$("#bookTemplate").html(),

      render:function () {
          var tmpl = _.template(this.template); //tmpl is a function that takes a JSON object and returns html

          this.$el.html(tmpl(this.model.toJSON())); //this.el is what we defined in tagName. use $el to get access to jQuery html() function
          return this;
      },

      events: {
        "click .delete":"deleteBook"
      },

      deleteBook:function () {
        //Delete model
        this.model.destroy();

        //Delete view
        this.remove();
      }
    });

    var Library = Backbone.Collection.extend({
      model:Book,
      url:'/api/books'
    });

    var LibraryView = Backbone.View.extend({
      el:$("#books"),

      events:{
        "click #add":"addBook"
      },

      initialize:function(){
        this.collection = new Library();
        this.collection.fetch();
        console.log(this.collection);
        this.render();

        this.collection.on("add", this.renderBook, this);
        this.collection.on("remove", this.removeBook, this);
        this.collection.on("reset", this.render, this);
      },

      render:function(){
          var that = this;
          _.each(this.collection.models, function(item){
              that.renderBook(item);
          }, this);
      },

      renderBook:function(item){
          var bookView = new BookView({
              model:item
          });
          this.$el.append(bookView.render().el);
      },

      addBook: function( e ) {
          e.preventDefault();

          var formData = {};

          $( '#addBook div' ).children( 'input' ).each( function( i, el ) {
              if( $( el ).val() != '' )
              {
                  if( el.id === 'keywords' ) {
                      formData[ el.id ] = [];
                      _.each( $( el ).val().split( ' ' ), function( keyword ) {
                          formData[ el.id ].push({ 'keyword': keyword });
                      });
                  } else if( el.id === 'releaseDate' ) {
                      formData[ el.id ] = $( '#releaseDate' ).datepicker( 'getDate' ).getTime();
                  } else {
                      formData[ el.id ] = $( el ).val();
                  }
              }
          });

          this.collection.create( formData );
      },

      removeBook:function(removedBook){
        var removedBookData = removedBook.attributes;

        _.each(removedBookData, function(val, key){
          if(removedBookData[key] === removedBook.defaults[key]){
            delete removedBookData[key];
          }
        });

        _.each(books, function(book){
          if(_.isEqual(book, removedBookData)){
            books.splice(_.indexOf(books, book), 1);
          }
        });
      }
    });

    var books = [{title:"JS the good parts", author:"John Doe", releaseDate:"2012", keywords:"JavaScript Programming"},
    {title:"CS the better parts", author:"John Doe", releaseDate:"2012", keywords:"CoffeeScript Programming"},
    {title:"Scala for the impatient", author:"John Doe", releaseDate:"2012", keywords:"Scala Programming"},
    {title:"American Psyco", author:"Bret Easton Ellis", releaseDate:"2012", keywords:"Novel Splatter"},
    {title:"Eloquent JavaScript", author:"John Doe", releaseDate:"2012", keywords:"JavaScript Programming"}];

    var libraryView = new LibraryView();

})(jQuery);