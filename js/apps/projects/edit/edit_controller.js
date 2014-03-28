/**
 * Edit Project Module > Edit Controller
 */
PERT.module(
"ProjectsApp.Edit", 
function( Edit, PERT, Backbone, Marionette, $, _ )
{
    /**
     *  Edit Controller
     *
     *  Load and edit a single project
     */
    Edit.Controller =
    {
        /**
         *  Edit Project
         *
         *  Handle fetching, displaying and saving a given project
         *
         *  @param id   Project Id
         */
        editProject: function( id )
        {
            /**
             *  Preloader animation
             */
            var loadingView = new PERT.Common.Views.Loading(
            {
                title:   "Loading...", 
                message: "Please wait."
            } );
            PERT.mainRegion.show( loadingView );

            // Fetch the project
            var fetchingProject = PERT.request( "project:entity", id );

            $.when( fetchingProject ).done( function( project )
            {
                var view;

                if( project !== undefined && 
                    project.get( "projectName" ) !== undefined )
                {
                    view = new PERT.ProjectsApp.Show.Layout( { model: project } );

                    // Display fetched result
                    var projectRegion = new Edit.Project( 
                    { 
                        model: project,
                        fullScreen: true
                    } );

                    var activityRegion = new Edit.Activities( 
                    {
                        collection: project.get( "activities" ) 
                    } ); 

                    view.on( "show", function( )
                    { 
                        view.projectRegion.show( projectRegion );
                        view.activityRegion.show( activityRegion ); 
                    } );                                       

                    // Submit handler: validate and save changes
                    projectRegion.on( "form:submit", function( data )
                    {
                        if( project.save( data ) )
                        {
                            PERT.trigger( "project:show", project.get( "id" ) );
                        }
                        else
                        {
                            view.triggerMethod( "form:data:invalid", 
                                                project.validationError );
                        }
                    } );

                    // Cancel handler: validate and save changes
                    projectRegion.on( "form:cancel", function( )
                    {
                        PERT.trigger( "project:show", project.get( "id" ) );
                    } );  

                    activityRegion.on( "view:changed", function( )
                    {
                        projectRegion.render();
                        activityRegion.render();
                    } );                
                }
                else
                {
                    // Project does not exist
                    view = new PERT.ProjectsApp.Show.MissingProject();
                }

                // Project is fetched -> show created view
                PERT.mainRegion.show( view );
            } );
        }
    }
} );