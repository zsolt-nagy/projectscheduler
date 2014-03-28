
/**
 *  Projects App module
 *
 *  Router
 */
PERT.module(
"ProjectsApp",
function( ProjectsApp, PERT, Backbone, Marionette, $, _)
{
    /**
     *  Marionette Application Router
     *
     *  Callback functions will be provided on initialization (see below)
     */
    ProjectsApp.Router = Marionette.AppRouter.extend({
        appRoutes: 
        {
            "projects"          : "listProjects",
            "projects/:id"      : "showProject",
            "projects/:id/edit" : "editProject"
        }
    } );


    /**
     *  API
     *
     *  Route handler functions.
     */
    var API = 
    {
        listProjects: function( )
        {
            ProjectsApp.List.Controller.listProjects();
        },

        showProject: function( id )
        {
            ProjectsApp.Show.Controller.showProject( id );
        },

        editProject: function( id )
        {
            ProjectsApp.Edit.Controller.editProject( id );
        }
    };
    

    // List Projects route
    this.listenTo( PERT, "projects:list", function( )
    {
        PERT.navigate( "projects" );
        API.listProjects();
    } );

    // Show Project route
    this.listenTo( PERT, "project:show", function( id )
    {
        PERT.navigate( "projects/" + id );
        API.showProject( id );
    } );

    // Edit Project route
    this.listenTo( PERT, "project:edit", function( id )
    {
        PERT.navigate( "projects/" + id + "/edit" );
        API.editProject( id );
    } );


    /**
     *  Application initializer
     *
     *  Starts the router and passes API containing the route callbacks.
     */
    PERT.addInitializer( function( )
    {
        new ProjectsApp.Router( 
        {
            controller: API
        } );
    } );
} ); 