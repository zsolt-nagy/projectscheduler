PERT.module( "ProjectsApp.Common.Views", 
function( Views, PERT, Backbone, Marionette, $, _ )
{
    /**
     *  Project Form
     *
     *  Abstract view. Template has to be provided.
     */
    Views.Form = Marionette.ItemView.extend(
    {
        template: "#project-form",

        formEvents: 
        {
            "click .js-submit":          "submitClicked",
            "click .js-cancel":          "cancelClicked",
            "click .js-list-projects":   "homeClicked"
        },

        extendedEvents: {},

        events: function() 
        {
            return _.extend( {} ,this.formEvents, this.extendedEvents );
        },


        serializeData: function( )
        {
            var data = this.model.toJSON();
            data.fullScreen = this.options.fullScreen;
            data.estimatedTime  = this.model.getEstimatedTime().toFixed(2); 
            return data;
        },

        /**
         *  Submit Clicked
         *
         *  Callback for submitting the form
         *
         *  @param e    Event Object
         */
        submitClicked: function( e )
        {
            e.preventDefault();
            // TODO: serialize data manually
            var data = Backbone.Syphon.serialize( this );
            this.trigger( "form:submit", data );
        },


        /**
         *  Cancel Clicked
         *
         *  Callback for cancelling the form
         *
         *  @param e    Event Object
         */
        cancelClicked: function( e )
        {
            e.preventDefault();
            this.trigger( "form:cancel" );            
        },


        /**
         *  Cancel Clicked
         *
         *  Callback for cancelling and returning to the Projects list
         *
         *  @param e    Event Object
         */
        homeClicked: function( e )
        {
            e.preventDefault();
            PERT.trigger( "projects:list" );
        },


        /**
         *  On Form Data Invalid
         *
         *  Callback when the event form:data:invalid is triggered.
         *  Displays all errors on the form. 
         *  
         *  @param errors Object
         */
        onFormDataInvalid: function( errors )
        {
            var $view = this.$el;

            /**
             *  Clear Form Errors
             *
             *  Clears all form errors (Bootstrap classes)
             */
            var clearFormErrors = function( )
            {
                var $form = $view.find( "form" );
                $form.find( ".help-inline.error" ).each( function( )
                {
                    $( this ).remove();
                } );
                $form.find( ".control-group.error" ).each( function( )
                {
                    $( this ).removeClass( "error" );
                } );
            }

            /**
             *  Mark Errors
             *
             *  Marks all errors (adding Bootstrap classes and text in span)
             */
            var markErrors = function( value, key )
            {
                var $controlGroup = $view.find( "#contact-" + key).parent();
                var $errorEl = $(   "<span>", 
                                    {class: "help-inline error", text: value} );
                $controlGroup.append( $errorEl ).addClass( "error" );
            }

            clearFormErrors( );
            _.each( errors, markErrors );
        }                       
    } );
} );