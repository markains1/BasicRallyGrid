Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',

    // ---------------------------------------
    // The Launch Function, implicitly called
    launch: function() {
	console.log('Here we go');
	this._loadData();	// Scoping: go out to the app to find _loadData()
    },

    // ---------------------------------------
    // Function to Load the Data from Rally
    _loadData: function() {
	var myStore = Ext.create('Rally.data.wsapi.Store', {
	    model: 'UserStory',
	    pageSize: 1,
	    autoLoad: true,
	    listeners: {
		load: function(store, records) {
		    var story = records[0];
		    var defectInfo = story.get('Defects');
		    var defectCount = defectInfo.Count;
		    console.log('got data! ', store, records);

		this._loadGrid(myStore);
		},
		scope: this
	    }
	    
	    // What we're pulling from Rally
	    fetch: ['formattedID', 'Name', 'ScheduleState']
	});
    },

    // ---------------------------------------
    // Function to create and show the grid of the data
    _loadGrid: function(store) {
	var myGrid = Ext.create('Rally.ui.grid.Grid', {
	    store: myStore,
	    columnCfgs: [				// What we're showing in the Grid
		'FormattedID', 'Name', 'ScheduleState'
	    ]
	    });

	this.add(myGrid);	// The Rally.ap.App is the container we're adding to
    }









/**** Ignore Below, just part of the initial tutorial, better app structure above
    launch: function() {
        //Write app code here
	console.log('Here we go');

	var myStore = Ext.create('Rally.data.wsapi.Store', {
	    model: 'UserStory',
	    pageSize: 1,
	    autoLoad: true,
	    listeners: {
		load: function(store, records) {
		    var story = records[0];
		    var defectInfo = story.get('Defects');
		    var defectCount = defectInfo.Count;
		    console.log('got data! ', store, records);

		var myGrid = Ext.create('Rally.ui.grid.Grid', {
		    store: myStore,
		    columnCfgs: [				// What we're showing in the Grid
			'FormattedID', 'Name', 'ScheduleState'
		    ]
		    });

		this.add(myGrid);	// The Rally.ap.App is the container we're adding to
		},
		scope: this
	    }
	    fetch: ['formattedID', 'Name', 'ScheduleState']	// What we're pulling from Rally
	});

        //API Docs: https://help.rallydev.com/apps/2.1/doc/
    }
End Ignore ****/
});
