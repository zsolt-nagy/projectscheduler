
/**
 *  List Projects Module
 */
PERT.module( 
"ProjectsApp.List", 
function( List, PERT, Backbone, Marionette, $, _ )
{
    /**
     *  List Layout
     *
     *  Displays all projects
     */
    List.Layout = Marionette.Layout.extend({
        template: "#project-list-layout",
        regions:
        {
            panelRegion:    "#panel-region",
            projectsRegion: "#projects-region"
        }
    } );

    /**
     *  List Projects panel
     *
     *  Lets you trigger creation of new projects
     */
    List.Panel = Marionette.ItemView.extend({
        template: "#project-list-panel",
        triggers: 
        {
            "click .js-new": "project:new" 
        }
    } );


    /**
     *  Project Item View
     *
     *  Displays one project and the number of activities in the project
     */
    List.Project = Marionette.ItemView.extend({
        tagName: "tr",
        template: "#project-list-item",
        events: 
        { 
            "click"           : "highlightName",
            "click .js-show"  : "showClicked",
            "click .js-edit"  : "editClicked",
            "click .js-delete": "deleteClicked" 
        },


        /**
         *  Flash
         *
         *  Highlights this item view with an animation and a css class
         */
        flash: function( cssClass )
        {
            var $view = this.$el;
            $view.hide().toggleClass( cssClass ).fadeIn( 800, function( )
            {
                setTimeout( function( )
                {
                    $view.toggleClass( cssClass );
                }, 500 );
            } );
        },


        /**
         *  Highlight Name
         *
         *  Toggles the highlighted UI state of this item view
         */
        highlightName: function( e )
        {
            e.preventDefault( );
            this.$el.toggleClass( "warning" );
        },


        /**
         *  Show Clicked
         *
         *  Fires an event to display details of this project
         */
        showClicked: function( e )
        {
            e.preventDefault( );
            e.stopPropagation( );
            this.trigger( "project:show", this.model );
        },


        /**
         *  Edit Clicked
         *
         *  Fires an event to edit details of this project
         */
        editClicked: function( e )
        {
            e.preventDefault( );
            e.stopPropagation( );
            this.trigger( "project:edit", this.model );
        },


        /**
         *  Delete Clicked
         *
         *  Fires an event to delete this project
         */
        deleteClicked: function( e )
        {
            e.stopPropagation();
            this.trigger( "project:delete", this.model );
        },


        /**
         *  Remove
         *
         *  Animation to delay removal of this view. Overrides the
         *  default remove method.
         */
        remove: function( )
        {
            var self = this;
            this.$el.fadeOut( function( ) 
            {
                Marionette.ItemView.prototype.remove.call( self );
            } );
        }
    } );


    /**
     *  Projects Composite View
     *
     *  Responsible for displaying an overview of a collection of projects
     */
    List.Projects = Marionette.CompositeView.extend({
        tagName:           "table",
        className:         "table  table-hover",
        template:          "#project-list",
        itemView:          List.Project,
        itemViewContainer: "tbody",


        /**
         *  Initialize
         *
         *  defines the default appendHtml function whenever the collection
         *  is reset so that projects are displayed in their normal order
         */
        initialize: function( )
        {
            this.listenTo( this.collection, "reset", function( )
            {
                this.appendHtml = function( collectionView, itemView, index )
                {
                    collectionView.$el.append( itemView.el );
                }
            } );
        },


        /**
         *  Once the collection is rendered, all new projects appear at the
         *  top of the list.
         */
        onCompositeCollectionRendered: function( )
        {
            this.appendHtml = function( collectionView, itemView, index )
            {
                collectionView.$el.prepend( itemView.el );
            }
        },

        /**
         *  Animation for deleting a project.
         */
        onItemviewProjectDelete: function( )
        {
            $( this ).fadeIn( 1000 ); 
        }
    } );
} );