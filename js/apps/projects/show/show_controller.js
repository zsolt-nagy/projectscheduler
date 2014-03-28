/**
 *  Show Module
 */
PERT.module( 
"ProjectsApp.Show",
function( Show, PERT, Backbone, Marionette, $, _ )
{
    Show.Controller =
    {
        /**
         *  Show Project
         *
         *  Loads a project with a given id and displays it
         *
         *  @param id   Integer
         */
        showProject: function( id )
        {
            var loadingView = new PERT.Common.Views.Loading(
                {
                    title: "Loading...",
                    message: "Please wait."
                });
            PERT.mainRegion.show( loadingView );
            
            // Fetch the project
            var fetchingProject = PERT.request( "project:entity", id ); 

            $.when( fetchingProject ).done( function( project )
            {
                var projectView;

                if( project !== undefined && 
                    project.get( 'projectName' ) !== undefined )
                {
                    // Create Layout
                    projectView = new Show.Layout( { model: project } );

                    // Create Regions
                    var projectRegion = new Show.Project( { model: project } ); 
                    var activityRegion = new Show.Activities( 
                                         {
                                             collection: project.get( "activities" ) 
                                         } );

                    // Insert regions
                    projectView.on( "show", function( )
                    { 
                        projectView.projectRegion.show( projectRegion );
                        projectView.activityRegion.show( activityRegion ); 
                    } );

                    // Navigate to the Edit page on clicking the Edit button
                    Show.listenTo( projectRegion, "project:edit", function( project )
                    {
                        PERT.trigger( "project:edit", project.get("id") );
                    } );        
                }
                else
                {
                    projectView = new Show.MissingProject();
                }

                PERT.mainRegion.show( projectView );
                project = null;
            } );
        }
    }
} );