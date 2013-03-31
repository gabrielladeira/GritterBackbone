GritterBackbone = new (Backbone.View.extend({
	
	Models: {},
	
	Views: {},
	
	tagName: 'div',
	
	className: 'gritter-notice-wrapper',
	
	start: function(rootEl) {

		rootEl = rootEl || 'body';
		$(rootEl).append(this.render().el);
	},
	
	add: function(params) {

		if($('.' + this.className).length < 1)
			this.start();
		
		var note = new GritterBackbone.Models.Note(params);

		this.renderOne(note);
	},
	
	renderOne: function(note) {

		var noteView = new GritterBackbone.Views.NoteView({model : note});
		this.$el.append(noteView.render().el);
		noteView.fadeIn();
	},

	removeAll: function(params) {

	}

}))(); 

GritterBackbone.Models.Note = Backbone.Model.extend({
	
	// Default attributes for a GritterBackbone item.
	defaults: function() {
		return {
			title: '',
			text: '',
			image: '',
			customClass: '',
			position: '',
			sticky: false,
			fade_in_speed: 'medium', // how fast notifications fade in
			fade_out_speed: 1000, // how fast the notices fade out
			time: 6000 // hang on the screen for...
		};
	}
});

GritterBackbone.Views.NoteView = Backbone.View.extend({
	
	tagName : 'div',
	
	className : 'gritter-item-wrapper',

	Model : GritterBackbone.Models.Note,

	template: _.template('<div class="gritter-top"></div><div class="gritter-item"><div class="gritter-close"></div><img src="<%= image %>" class="gritter-image" /><div class="gritter-with-image"><span class="gritter-title"><%= title %></span><p><%= text %></p></div><div style="clear:both"></div></div><div class="gritter-bottom"></div>'),
	
	templateWithoutImage: _.template('<div class="gritter-top"></div><div class="gritter-item"><div class="gritter-close"></div><div class="gritter-without-image"><span class="gritter-title"><%= title %></span><p><%= text %></p></div><div style="clear:both"></div></div><div class="gritter-bottom"></div>'),
	
	events: {
		'mouseenter' : 'mouseEnter',
		'mouseleave' : 'mouseLeave'
	},

	render: function() {

		if(this.beforeOpen() === false)
			return false;

		var innerHTML = '';
		if(this.model.get('image')) 
			innerHTML = this.template({title : this.model.get('title'), text: this.model.get('text'), image : this.model.get('image')});
		else
			innerHTML = this.templateWithoutImage({title : this.model.get('title'), text: this.model.get('text')});
		
		this.$el.html(innerHTML);

		// Clicking (X) makes the perdy thing close
        this.$el.find('.gritter-close').bind('click', _.bind(this.close, this));

        this.$el.addClass(this.model.get('customClass'));

        this.$el.css('display', 'none');

		return this;
	},

	mouseEnter: function() {

		this.$el.addClass('hover');
        // Show close button
        this.$el.find('.gritter-close').show();
        
        this.clearTimeout();
	},

	mouseLeave: function() {

		this.$el.removeClass('hover');
        // Hide close button
        this.$el.find('.gritter-close').hide();
        
        this.setTimeout();
	},

	close: function() {
		this.fadeOut();
	},

	remove: function() {
		this.$el.remove();
	},

	fadeIn: function() {
		
		this.$el.fadeIn(this.model.get('fade_in_speed'), _.bind(this.afterOpen, this));
		
		this.setTimeout();
	},

	fadeOut: function() {

		if(this.beforeClose() === false)
			return false;

		this.$el.fadeOut(this.model.get('fade_out_speed'), _.bind(this.animeClose, this));
	},

	beforeOpen: function() {
		return this._callbackFunction('before_open');
	},

	afterOpen: function() {
		this._callbackFunction('after_open');
	},

	beforeClose: function() {
		return this._callbackFunction('before_close');
	},
	
	afterClose: function() {
		this._callbackFunction('after_close');
		this.$el.remove();
	},

	animeClose: function() {
		this.$el.animate({ height: 0 }, 300, _.bind(this.afterClose, this));
	},

	setTimeout: function() {
		if(!this.model.get('sticky'))
        	this.model.set('timeoutId', setTimeout(_.bind(this.fadeOut, this), this.model.get('time')));
	},

	clearTimeout: function() {
		if(!this.model.get('sticky')) {
        	clearTimeout(this.model.get('timeoutId'));
        	this.$el.stop().css({ opacity: '' });
        }
	},

	_callbackFunction: function(functionName) {
		if(this.model.get(functionName) && jQuery.isFunction(this.model.get(functionName)))
			return this.model.get(functionName)(this.model);

		return true;
	}	
});


GritterBackbone.Views.NotesView = new Backbone.View.extend({


});

$(function() {
	//GritterBackbone.add({title : 'Titulo', text : 'Texto a ser apresentado'});
	//GritterBackbone.add({title : 'Titulo 2', text : 'Texto a ser apresentado 2'});
	//GritterBackbone.add({title : 'Titulo 3', text : 'Texto a ser apresentado 3'});
});