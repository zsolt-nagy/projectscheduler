/**
 *  Dialog Region
 *
 *  Extends Marionette.Region. Displays a jQuery UI dialog.
 */
Marionette.Region.Dialog = Marionette.Region.extend(
{
  /**
   *  On Show
   *
   *  The region listens to the "dialog:close" event of its view and closes the
   *  dialog once the event is fired.
   *
   *  @param view   Marionette.View   the view being displayed in the region
   */
  onShow: function( view )
  {
    this.listenTo( view, "dialog:close", this.closeDialog );

    var self = this;
    this.$el.dialog(
    {
      modal: true,
      title: view.title,
      width: "auto",
      close: function( e, ui )
      {
        self.closeDialog( );
      }
    } );
  },


  /**
   *  Close Dialog
   *
   *  Performs operations required to close the dialog.
   */
  closeDialog: function( )
  {
    this.stopListening( );
    this.close( );
    this.$el.dialog( "destroy" );
  }
} );