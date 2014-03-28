/**
 *  Entities module
 *
 *  Contains project models and collections.
 */
PERT.module( 
"Entities", 
function( Entities, PERT, Backbone, Marionette, $, _ ) 
{
    /**
     *  Activity Model
     *
     *  Stores data of one activity.
     *
     *  @var Backbone.Model
     */
    Entities.ActivityModel = Backbone.Model.extend( 
    {
        defaults: 
        {
            activityName:    "",
            optimalTime:     0,
            normalTime:      0,
            pessimistTime:   0,
            predecessorList: []
        },


        /**
         *  Get Average Time
         * 
         *  @return  ( optimalTime + 4*normalTime + pessimistTime ) / 6
         */
        getAverageTime: function( )
        {
            var averageTime = 
                (   parseInt( this.get( 'optimalTime' ), 10 ) +
                    4 * parseInt( this.get( 'normalTime' ), 10 )  +
                    parseInt( this.get( 'pessimistTime' ), 10 ) 
                ) / 6;
            return averageTime;            
        }        
    } );


    /**
     *  Activity Collection
     *
     *  Stores project activities
     *
     *  @var Backbone.Collection
     */
    Entities.ActivityCollection = Backbone.Collection.extend(
    {
        model: Entities.ActivityModel,

        /**
         *  Initialize
         *
         *  Establish collection event bindings
         */
        initialize: function( id )
        {
            this.listenTo( this, 'remove', this.onRemove );
            this.listenTo( this, 'change:id', this.onIdChange );
            this.listenTo( this, 'add', this.shiftIds );
        },


        /**
         *  Shift Ids
         *
         *  Re-arranges the Ids of the models of this collection to
         *  1, 2, 3, ... in the order of the index of the models.
         */
        shiftIds: function( )
        {
            var replaceIds = [];
            this.each( function( model, i )
            {
                model.set( "id", "" + ( i + 1 ) );
            } );
        },


        /**
         *  On Id Changed
         *
         *  Callback once the id of a model changes. Updates all the references
         *  of all model predecessor lists.
         *  
         *  @param model    reference to the model with the changed Id
         */
        onIdChange: function( model )
        {
            var oldId = model.previous("id");
            var newId = model.get("id");

            var sortFunction = function( id )
            {
                return parseInt( id, 10 );
            }

            this.each( function( model, i )
            {
                var predecessorList = model.get( 'predecessorList' );
                if( predecessorList.indexOf( oldId ) >= 0 )
                {
                    predecessorList = _.without( predecessorList, oldId );
                    predecessorList.push( newId );
                    predecessorList = _.sortBy( predecessorList, sortFunction );
                    model.set( 'predecessorList', predecessorList );
                }
            } );
        },


        /**
         *  On Remove
         *
         *  Removes the model Id from the predecessor list of all models
         *  
         *  @param model    The removed model
         */
        onRemove: function( model )
        {
            var deletedId = model.id;

            this.each( function( model, i ) 
            {
                var predecessorList = _.without( model.get( 'predecessorList' ), 
                                                 deletedId );
                model.set( 'predecessorList', predecessorList );
            } );

            this.shiftIds();
        }
    } );


    /**
     *  Project Model
     *
     *  Represents data belonging to one project.
     */
    Entities.ProjectModel = Backbone.Model.extend(
    {
        urlRoot: "projects",
        defaults: 
        {
            projectName:  "",
            activities:   new Backbone.Collection( ) 
        },


        /**
         *  Parse
         *
         *  Creates the Activity collection based on the activities key
         *  in the response
         *
         *  @return Object
         */
        parse: function( data )
        {
            data.activities = new Entities.ActivityCollection( data.activities );
            return data;
        },


        /**
         *  toJSON
         *
         *  Serializes the model, including the Activities collection
         *
         *  @return Object
         */
        toJSON: function( options )
        {
            var activities = this.get( "activities" );
            if( activities && activities.toJSON )
            {
                activities = activities.toJSON();
            }

            return {
                id:          this.get( "id" ),
                projectName: this.get( "projectName" ),
                activities:  activities
            }
        },


        /** 
         *  Get Estimated Time
         *
         *  Returns the estimated time of the project.
         *
         *  @return Integer
         */
        getEstimatedTime: function( )
        {
            var activities = this.get( 'activities');

            var times = [];

            for( var i = 0; i < activities.length; ++i )
            {
                var activity = activities.at( i );
                var predecessorList = activity.get( 'predecessorList' );
                var preTime = 0;
                for( var j = 0; j < predecessorList.length; ++j )
                {
                    var pre = activities.get( predecessorList[j] ); 
                    var preIndex = activities.indexOf( pre );  
                    preTime = Math.max( preTime, times[preIndex] ); 
                }
                times[i] = preTime + activity.getAverageTime();
            }

            return _.max( times );
        },  


        /**
         *  Validate
         *
         *  Performs validation of model attributes. 
         *
         *  @returns Mixed  undefined if everything is correct. If the model is
         *  erroneous, an Object is returned containing keys with the error type
         *  and values with a string description of the error.
         */
        validate: function( attrs, options )
        {
            var errors = {};

            if( ! attrs.projectName )
            {
                errors.projectName = "Please enter a project name.";
            }
            if( ! _.isEmpty( errors ) )
            {
                return errors;
            }
        }
       
    } );   

    // Configure the local storage to store Project Models by injecting the
    // Local Storage mixin into the Project Model
    Entities.configureStorage( Entities.ProjectModel );

    /**
     *  Project Collection
     *
     *  Collection of Project Models. 
     */
    Entities.ProjectCollection = Backbone.Collection.extend(
    {
        model: Entities.ProjectModel,
        url: "projects",

        /**
         *  Comparator
         *
         *  Specifies what sorting of the models should be based on.
         */
        comparator: function( model )
        {
            return model.escape( "projectName" );
        }
    } );   

    // Configure the local storage to store the Projects Collection by injecting
    // the Local Storage mixin into the collection
    Entities.configureStorage( Entities.ProjectCollection );


    var projects;

    /**
     *  Initialize Projects
     *
     *  Initializes the projects collection with dummy data
     *
     *  @return Array of Backbone.Model objects
     */
    var initializeProjects = function( ) 
    {
        // remove it once the new button is active
        projects = new Entities.ProjectCollection(
        [
            {
                id:            1,
                projectName:   "Test1"
            },
            {
                id:            2,
                projectName:   "Test2",
                activities:
                [
                    {
                        id:              "1",
                        activityName:    "T 1",
                        optimalTime:     2,
                        normalTime:      4,
                        pessimistTime:   8,
                        predecessorList: []
                    },
                    {
                        id:              "2",
                        activityName:    "T 2",
                        optimalTime:     3,
                        normalTime:      5,
                        pessimistTime:   9,
                        predecessorList: ["1"]                        
                    },
                    {
                        id:              "3",
                        activityName:    "T 3",
                        optimalTime:     4,
                        normalTime:      10,
                        pessimistTime:   12,
                        predecessorList: ["1", "2"]
                    },
                    {

                        id:              "4",
                        activityName:    "T 4",
                        optimalTime:     5,
                        normalTime:      11,
                        pessimistTime:   14,
                        predecessorList: ["1"]    
                    },   
                ]
            },
            {
                id:           3,
                projectName:  "Test3",
                activities:
                [
                    {
                        id:              "1",
                        activityName:    "Activity 1",
                        optimalTime:     5,
                        normalTime:      8,
                        pessimistTime:   14,
                        predecessorList: []
                    },
                    {
                        id:              "2",
                        activityName:    "Activity 2",
                        optimalTime:     2,
                        normalTime:      3,
                        pessimistTime:   5,
                        predecessorList: ["1"]                        
                    },
                    {
                        id:              "3",
                        activityName:    "Activity 3",
                        optimalTime:     7,
                        normalTime:      10,
                        pessimistTime:   15,
                        predecessorList: ["1"]
                    },
                    {

                        id:              "4",
                        activityName:    "Activity 4",
                        optimalTime:     5,
                        normalTime:      8,
                        pessimistTime:   14,
                        predecessorList: ["2", "3"]    
                    }                
                ]
            }                                                                                                  
        ] );    


        projects.forEach( function( project ) { project.save(); });

        return projects.models;     
    }


    /**
     *  API
     *
     *  API for fetching a list of projects or an individual project.
     */
    var API =
    {
        /**
         *  Get Projects
         *
         *  Returns a promise to fetch a collection of projects from the
         *  server or local storage.
         *
         */
        getProjects: function( ) 
        {
            var projects = new Entities.ProjectCollection( );

            var defer = $.Deferred();

            projects.fetch(
            {
                success: function( data )
                {
                    defer.resolve( data );
                }
            } );

            var promise = defer.promise();


            promise.done( function( projects )
            {
                if( projects.length === 0 )
                {
                    var models = initializeProjects();                       
                    projects.reset( models );
                }

            } );

            return promise;
        },


        /**
         *  Get Project
         *
         *  Returns a promise to fetch project with id projectId from the
         *  server or local storage.
         *
         *  @param projectId    Integer
         */
        getProject: function( projectId )
        {
            var project = new Entities.ProjectModel( { id: projectId } );
            var defer = $.Deferred();

            project.fetch(
            { 
                success: function( data )
                {
                    defer.resolve( data );
                },
                error: function( data )
                {
                    defer.resolve( void 0 );
                }
            });

            return defer.promise();
        }
    }

    // Attach the request/response handler functions to entity retrieval events.
    PERT.reqres.setHandler( 
        "project:entities",
        function( ) 
        {
            return API.getProjects( );
        } );
    PERT.reqres.setHandler( 
        "project:entity",
        function( id ) 
        {
            return API.getProject( id );
        } );


} );