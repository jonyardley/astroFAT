var App = require('app'),
	FitsCollection = require('../dataModel/FitsCollection'),
	HeaderView = require('../views/header/header'),
	StageView = require('../views/stage/stage'),
	SidebarView = require('../views/sidebar/sidebar'),
	EditView = require('../views/edit/edit'),
	HomeView = require('../views/home/home');


//Add App Regions
App.addRegions({
	header: '#header',
	sidebar: '#sidebar',
	edit: '#edit',
	stage: '#stage',
	overlay: '#overlay'
});

App.FITS = new FitsCollection();


App.addInitializer(function(){

	//set up initial views!
	App.header.show(new HeaderView());
	App.stage.show(new HomeView());
	App.sidebar.show(new SidebarView());

	//for easier development
	if(window.location.hostname === 'localhost'){
		require('./dev');
	}

});


function updateStage(){
	if(App.FITS.length > 0) {
		App.stage.show(new StageView({collection: App.FITS}));
		App.FITS.off('add', updateStage);
	}
}

App.FITS.on('add', updateStage);

/** Attach global events **/

App.vent.on('edit:open', function(model){
	App.stage.$el.addClass('isEditing');

	App.edit.show(new EditView({
		model: model
	}));
});

App.vent.on('edit:close', function(model){
	App.stage.$el.removeClass('isEditing');
	//TODO: Might want to close this view?
});


//Kick off!
App.start();

console.log('--- Application Started ---');
