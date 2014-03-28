/**
 *  Show module > Layouts and views
 */
PERT.module(
"ProjectsApp.Show",
function( Show, PERT, Backbone, Marionette, $, _ )
{
    /**
     *  Show Layout
     *
     *  The layout of the Show Project page
     */
    Show.Layout = Marionette.Layout.extend(
    {
        template: "#project-layout",
        regions:
        {
            projectRegion:  "#project-region",
            activityRegion: "#activity-list-region"
        }      
    } );


    /**
     *  Missing Project
     *
     *  Dummy view displaying that the project cannot be found
     */
    Show.MissingProject = Marionette.ItemView.extend(
    {
        template: "#missing-project-view"
    } );



    /**
     *  Project View
     *
     *  Displays the project name and options to edit projects or
     *  return to the landing page.
     */
    Show.Project = Marionette.ItemView.extend(
    {
        template: "#project-view",
        events: 
        {
            "click .js-edit": "editClicked"
        },
        editClicked: function( e )
        {
            e.preventDefault( );
            this.trigger( "project:edit", this.model );
        }
    } );


    /**
     *  Activity Item
     *
     *  Displays one activity
     */
    Show.ActivityItem = Marionette.ItemView.extend(
    {
        template: "#activity-item-view",
        tagName:  "tr",
        serializeData: function( )
        {
            var data = _.clone( this.model.toJSON() );

            data.averageTime = 
                // TODO: delegate it to the model
                (   parseInt( data.optimalTime, 10 ) +
                    4 * parseInt( data.normalTime, 10 )  +
                    parseInt( data.pessimistTime, 10 ) 
                ) / 6;
            data.averageTime = data.averageTime.toFixed( 2 );

            return data;
        }        
    } );


    /**
     *  Activities Composite View
     *
     *  Responsible for displaying the activities collection
     *  of the project
     */
    Show.Activities = Marionette.CompositeView.extend(
    {
        template:          "#activity-list-view",
        tagName:           "table",
        className:         "table  table-hover",
        itemView:          Show.ActivityItem,
        itemViewContainer: ".js-activity-list"
    } );
} );