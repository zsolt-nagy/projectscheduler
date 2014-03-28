/**
 *  Common Views module > Loading view (preloader)
 */ 
PERT.module( 
"Common.Views",
function( Views, PERT, Backbone, Marionette, $, _ )
{
    /**
     *  Loading
     *
     *  @var Marionette.ItemView
     */
    Views.Loading = Marionette.ItemView.extend(
    {
        template: "#loading-view",


        /**
         *  Initialize
         *
         *  Sets the title and the message of this view.
         *
         *  @param options Object
         */
        initialize: function( options )
        {
            var options = options || {};
            this.title = options.title || "Loading Data";
            this.message = options.message || "Please wait.";
        },

        /**
         *  Serialize Data
         *
         *  @return Object  to be passed to the template renderer
         */
        serializeData: function( )
        {
            return {
                title: this.title,
                message: this.message
            }
        }
    } );
} );