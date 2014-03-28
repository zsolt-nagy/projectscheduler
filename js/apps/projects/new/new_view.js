/**
 *  New module
 *
 *  To create a new project
 */
PERT.module(
"ProjectsApp.New",
function( New, PERT, Backbone, Marionette, $, _ )
{
    New.Project = PERT.ProjectsApp.Common.Views.Form.extend(
    {
        title: "New Project",
        onRender: function( )
        {
            this.$( ".js-submit" ).text( "Create Project" );
        }
    } );
} );