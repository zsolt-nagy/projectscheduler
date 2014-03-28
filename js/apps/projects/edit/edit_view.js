/**
 *  Edit Project Module > Edit Project and Activity views
 */
PERT.module( 
"ProjectsApp.Edit",
function( Edit, PERT, Backbone, Marionette, $, _ )
{

    /**
     *  Edit Project View
     */
    Edit.Project = PERT.ProjectsApp.Common.Views.Form.extend(
    {
        extendedEvents: 
        {
            'click .js-new-activity':       'addActivity',
            'click .js-toggle-dependency':  'toggleDependency'
        },

        /**
         *  Initialize
         *
         *  Set view title.
         */
        initialize: function( )
        {
            this.title = "Edit " + this.model.get( "projectName" );
        },


        /**
         *  On Render
         *
         *  Post render callback. Inserts the title of the view and sets the
         *  text of the Submit button.
         */
        onRender: function( )
        {
            if( this.options.fullScreen )
            {
                var $title = $( "<h1>", { text: this.title } );
                this.$el.prepend( $title );
            }
            this.$( ".js-submit" ).text( "Update Project" );
        },


        /**
         *  Add Activity
         *
         *  Adds a new act
         */
        addActivity: function( e )
        {
            e.preventDefault();

            var activities = this.model.get("activities");            


            var newModel = new PERT.Entities.ActivityModel({ id: 0});
            activities.add( newModel );
            this.render();
        },


        /**
         *  Toggle Dependency
         *
         *  Sets or unsets a dependency between the two activities
         *  specified by the Select dropdowns of this view.
         *
         *  @param e    Event Object
         */
        toggleDependency: function( e )
        {
            e.preventDefault();

            var from = this.$( '[name=dependency-first]' ).val();
            var to = this.$( '[name=dependency-last]').val();

            if( to <= from )
            {
                alert( 'Activity ' + from + ' has to precede Activity' + to + '.' );
            }
            else
            {
                var activity = this.model.get( 'activities' ).get( to );
                var predecessorList = activity.get( 'predecessorList' );

                if( _.indexOf( predecessorList, from ) >= 0 )
                {
                    predecessorList = _.without( predecessorList, from );
                } 
                else
                {
                    predecessorList = _.sortBy( 
                                          _.union( predecessorList, [from] ),
                                          function( item ) 
                                          {
                                              return parseInt( item, 10 );
                                          } );
                }
                activity.set( 'predecessorList', predecessorList );
                this.render();
            }
        }   
    } );


    /**
     *  Activity Item View
     */
    Edit.ActivityItem = Marionette.ItemView.extend(
    {
        template: "#edit-activity-item-view",
        tagName:  "tr",
        events:
        {
            'change .js-input':                 'valueChanged',
            'click  .js-update-dependencies':   'updateDependencies'
        },
        triggers:
        {
            'click .js-delete': 'delete:activity'
        },

        /**
         *  Serialize Data
         *
         *  Calculate the average time for the template variables.
         */
        serializeData: function( )
        {
            var data = _.clone( this.model.toJSON() );

            data.averageTime = this.model.getAverageTime( ).toFixed( 2 );

            return data;
        },

        /**
         *  Value Changed
         *
         *  Updates the model with the changed value and re-renders
         *  to update the average time.
         */
        valueChanged: function( e )
        {
            var $target = $( e.target );
            var modelKey = $target.attr( 'name' );
            var modelValue = $target.val();

            this.model.set( modelKey, modelValue );
            this.trigger( 'value:changed' );
        }
    } );


    /**
     *  Activities View
     */
    Edit.Activities = Marionette.CompositeView.extend(
    {
        template:          "#activity-list-view",
        tagName:           "table",
        className:         "table  table-hover",
        itemView:          Edit.ActivityItem,
        itemViewContainer: ".js-activity-list",


        collectionEvents:
        {
            'change:predecessorList': 'render'
        },

        /**
         *  On Item View Delete Activity
         *
         *  Callback for the delete:activity event of the
         *  item views of this view. Deletes the model of
         *  the item view triggering the event and re-render
         *  with the updated collection.
         */
        onItemviewDeleteActivity: function( view )
        { 
            var model = view.model;
            var id = model.id;
            this.collection.remove( model );
            this.trigger( 'view:changed' );
        },


        onItemviewValueChanged: function( )
        {
            this.trigger( 'view:changed' );
        }       
    } );

} );