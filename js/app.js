
// 1. Create the Marionette Application
var PERT = new Marionette.Application();

// 2. Define its regions
PERT.addRegions({
    mainRegion: "#main-region",
    dialogRegion: Marionette.Region.Dialog.extend(
    {
        el: "#dialog-region"
    } )
} );

/**
 *  Navigate
 *
 *  Navigates to the new route with specified options (if exist).
 *
 *  @param  route   String   new route
 *  @param  options Object   routing options
 */
PERT.navigate = function( route, options )
{
    options || ( options = {} );
    Backbone.history.navigate( route, options );
};

/**
 *  Get Current Route
 *
 *  Returns Backbone.history.fragment
 */
PERT.getCurrentRoute = function( )
{
    return Backbone.history.fragment;
}

// 3. Start the Marionette application
PERT.on( "initialize:after", function() 
{
    if( Backbone.history )
    {
        Backbone.history.start();
    
        if( this.getCurrentRoute() === "" )
        {
            PERT.trigger("projects:list");
        }
    }   
} );