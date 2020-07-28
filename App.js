Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',

    defectStore: undefined,
    myGrid: undefined,

    // ---------------------------------------
    // The Launch Function, implicitly called
    launch: function() {
	console.log('Here we go');

	// Create a wrapping container for positioning the dropdowns
	this.pulldownContainer = Ext.create('Ext.container.Container', {
	    layout: {
		type: 'hbox',
		align: 'stretch'
	    }
	});
	
	this.add(this.pulldownContainer);

	this._loadIterations();	// xx

	//this._loadData();	// Scoping: go out to the app to find _loadData()
    },

    // ---------------------------------------
    // Function to create and place the combo box for selecting iteration
    // iterComboBox is at the app level, so it can be reached in _loadData
    // Daisy-Chain loading the other dropdown selector when starting up
    _loadIterations: function() {
	this.iterComboBox = Ext.create('Rally.ui.combobox.IterationComboBox', {
	    fieldLabel: 'Iteration:',
	    labelAlign: 'Right',
	    width: 300,
	    listeners: {
		ready: function() {
		    this._loadSeverities();
		},
		select: function() {
		    this._loadData();
		},
		scope: this
	    }
	});

	this.pulldownContainer.add(this.iterComboBox);
    },
    // ---------------------------------------
    // Function to create and place the combo box for selecting Severity
    // The last selector to create, just load data now
    _loadSeverities: function() {
	this.severityComboBox = Ext.create('Rally.ui.combobox.FieldValueComboBox', {
	    model: 'Defect',
	    field: 'Severity',
	    fieldLabel: 'Severity:',
	    labelAlign: 'Right',
	    width: 300,
	    listeners: {
		ready: function() {
		    this._loadData();
		},
		select: function() {
		    this._loadData();
		},
		scope: this
	    }
	});

	this.pulldownContainer.add(this.severityComboBox);
    },


    // ---------------------------------------
    // Function to get the Data from Rally
    _loadData: function() {
	var selectedIterRef = this.iterComboBox.getRecord().get('_ref');
	var selectedSeverityValue = this.severityComboBox.getRecord().get('value');
	console.log('Selected combo box items: ', selectedIterRef, selectedSeverityValue);

	var myFilters = [
		{
		property: 'Iteration',
		operation: '=',
		value: selectedIterRef,
		},
		{ 
		property: 'Severity',
		operation: '=',
		value: selectedSeverityValue 
		}
	    ];

	// If store exists, just load the new data. If first time, then
	// create the new Store.
	if (this.defectStore) {
	    console.log("Store exists.");
	    this.defectStore.setFilter(myFilters);
	    this.defectStore.load();
	} else {
	    console.log("Creating Store...");
	    this.defectStore = Ext.create('Rally.data.wsapi.Store', {
		model: 'Defect',
		autoLoad: true,
		filters: myFilters,
		listeners: {
		    load: function(store, records) {
			console.log('got data! ', store, records);

			if (!this.myGrid) {
			    this._createGrid(this.defectStore);
			}
		    },
		    scope: this
		},
		// What we're pulling from Rally
		fetch: ['formattedID', 'Name', 'Severity', 'Iteration']
	    });
	}
    },

    // ---------------------------------------
    // Function to create and show the grid of the data
    _createGrid: function(myDataStore) {
	this.myGrid = Ext.create('Rally.ui.grid.Grid', {
	    store: myDataStore,
	    columnCfgs: [				// What we're showing in the Grid
		'FormattedID', 'Name', 'Severity', 'Iteration'
	    ]
	    });

	this.add(this.myGrid);	// The Rally.ap.App is the container we're adding to
    }

});
