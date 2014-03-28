/**
 * List Projects Module > List Controller
 */
PERT.module( 
    "ProjectsApp.List", 
    function( List, PERT, Backbone, Marionette, $, _ )
{
    /**
     *  List Controller
     *
     *  Displays a list of projects
     */    
    List.Controller = 
    {
        /**
         *  List Projects
         */
        listProjects: function( )
        {
            var loadingView = new PERT.Common.Views.Loading();
            PERT.mainRegion.show( loadingView );

            var fetchingProjects = PERT.request( "project:entities" );

            var projectsListLayout = new List.Layout();
            var projectsListPanel = new List.Panel();

            $.when( fetchingProjects ).done( function( projects )
            {
                var projectsListView = new List.Projects(
                {
                    collection: projects
                } );

                projectsListLayout.on( "show", function( )
                { 
                    projectsListLayout.panelRegion.show( projectsListPanel );
                    projectsListLayout.projectsRegion.show( projectsListView ); 
                } );

                projectsListPanel.on( "project:new", function( )
                {
                    var newProject = new PERT.Entities.ProjectModel();

                    var view = new PERT.ProjectsApp.New.Project(
                    {
                        model: newProject
                    } );

                    view.on( "form:submit", function( data )
                    { 
                        // no server communication -> we create the id here
                        // and not wait for the rest response
                        if( projects.length > 0 )
                        {
                            var highestId = projects.max( function( project )
                            { 
                                return project.id;
                            } ); 
                            data.id = parseInt( highestId.id, 10 ) + 1;
                        }
                        else
                        {
                            data.id = 1;
                        }

                        if( newProject.save( data ) )
                        {
                            projects.add( newProject );
                            view.trigger( "dialog:close" );
                            projectsListView.children.findByModel( newProject )
                                            .flash( "success" );
                        }
                        else
                        {
                            view.triggerMethod( "form:data:invalid",
                                                newProject.validationError );
                        }
                    } );

                    PERT.dialogRegion.show( view );
                } );

                projectsListView.on(
                    "itemview:project:show",
                    function( childView, model )
                    {
                        PERT.trigger("project:show", model.get("id") );
                    } );

                projectsListView.on(
                    "itemview:project:edit",
                    function( childView, model )
                    {
                        PERT.trigger("project:edit", model.get("id") );
                    } );

                projectsListView.on( 
                    "itemview:project:delete", 
                    function( childView, model )
                    {
                        model.destroy();
                    } );            

                PERT.mainRegion.show( projectsListLayout );   
            } );        
        }
    }
} );