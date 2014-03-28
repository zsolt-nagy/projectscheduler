/**
 *   Entities Module > Local Storage extension
 */
PERT.module( 
"Entities",  
function( Entities, PERT, Backbone, Marionette, $, _ )
{
    /**
     *  Find Storage Key
     *
     *  Retrieves the storage key from the Backbone Model or Collection.
     *
     *  @param entity   Backbone.Model or Backbone.Collection
     */
    var findStorageKey = function( entity )
    {
        // use a model's urlRoot value
        if( entity.urlRoot )
        {
            return _.result( entity, "urlRoot" );
        }

        // use a collection's url value
        if( entity.url )
        {
            return _.result( entity, "url" );
        }

        // fallback to obtaining a model's storage key from the 
        // collection it belongs to
        if( entity.collection && entity.collection.url )
        {
            return _.result( entity.collection, "url" );
        }

        throw new Error("Unable to determine storage key.");
    }


    /**
     *  Storage Mixin constructor
     *
     *  @param entityPrototype  Prototype of a Backbone model or collection
     *
     *  @return Object  having a localStorage key of type Backbone.LocalStorage
     */
    var StorageMixin = function( entityPrototype )
    {
        var storageKey = findStorageKey( entityPrototype );
        return {
            localStorage: new Backbone.LocalStorage( storageKey )
        }
    };


    /**
     *  Configure Storage
     *
     *  Configures local storage for the Backbone Model or Colleciton entity
     *
     *  @param entity   Backbone Model or Collection
     *
     */
    Entities.configureStorage = function( entity )
    {
        _.extend( entity.prototype, new StorageMixin( entity.prototype ) );
    }
} );