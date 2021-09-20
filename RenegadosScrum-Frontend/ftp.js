var Deploy = require( 'ftp-deploy' );
var ftpDeploy = new Deploy();
const open = require( 'open' );
const URL = ""

var config = {
    host: "",
    user: "",
    password: "",
    port: 21,
    localRoot: __dirname + '/build',
    remoteRoot: '/' + '',
    include: [ '*' ],
    deleteRemote: true
}

ftpDeploy.deploy( config, function ( err, res )
{
    if ( err ) console.log( err )
    else 
    {
        console.log( 'finished:', res );
        ( async () => { open( 'http://' + URL, { "wait": true } ); } )();
    }
} );

ftpDeploy.on( "uploading", function ( data )
{
    data.totalFilesCount;
    data.transferredFileCount;
    data.filename;
} );

ftpDeploy.on( "uploaded", function ( data )
{
    console.log( data );


} );

ftpDeploy.on( "log", function ( data )
{
    console.log( data );
} );

ftpDeploy.on( "upload-error", function ( data )
{
    console.log( data.err );
} );