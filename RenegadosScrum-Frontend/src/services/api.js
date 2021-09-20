import axios from "axios";
import { Buffer } from "buffer";
import moment from 'moment';
import { getToken } from "./auth";
const STORAGE_TOKENTIME = '@TOKENTIMEIVIST'
const STORAGE_TOKEN = '@TOKENIVIST'

const Types = { dev: 1, hml: 2, prod: 3 }

export const Environment = { Type: Types.prod }

export function GetActiveEnvironment () { return Environment.Type }

export function ReturnBaseUrl ()
{
  return (
    Environment.Type === 1 ? ""
      : Environment.Type === 2 ? ""
        : ""
  )
}

export function GetCodePersonalizado ( i )
{
  var x = i;
  x = x + moment.utc().year();
  x = x - ( moment.utc().date() * 2 );
  x = x * moment.utc().dayOfYear();
  return x
}

export function GetCodeOriginal ( i )
{
  var x = i;
  x = x / moment.utc().dayOfYear();
  x = x + ( moment.utc().date() * 2 );
  x = x - moment.utc().year();
  return x;
}

export async function UseAPI ( ControllerMetodo, request, Type = 1 )
{
  var token = ( await CriarToken() ).toString()

  if(Environment.Type === Types.dev)
    console.log( 'Token utilizado no método => ' + ControllerMetodo, token )
    
  let responseJson = ""
  try
  {
    switch ( Type )
    {
      case 1:
        const response = await fetch( ReturnBaseUrl() + ControllerMetodo, {
          method: 'POST',
          headers: { Accept: 'application/json', 'Content-Type': 'application/json','IdCliente': getToken() ?? '', 'Token': token !== null ? token : '' },
          body: request,
        } )

        responseJson = await response.json();
        break;

      case 2:
        const responseGet = await fetch( ReturnBaseUrl() + ControllerMetodo, {
          method: 'GET',
          headers: {'Token': token !== null ? token : '', 'IdCliente': getToken() ?? ''},
        } )
        responseJson = await responseGet.json();
        break;
    }

    return responseJson;
  }
  catch ( error )
  {
    console.error( error );
    return;
  }
}

export async function UseAPIBeforeToken ( ControllerMetodo, request )
{
  try
  {
    const response = await fetch( ReturnBaseUrl() + ControllerMetodo,
      {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: request,
      } );

    const responseJson = await response.json()

    return responseJson;
  }
  catch ( error )
  {
    console.error( error );
    return;
  }
}

export async function CriarToken ()
{
  var token = ""
  var time = []
  var key = []

  var TimeBefore = localStorage.getItem( STORAGE_TOKENTIME ) === null ? '01/01/1970 00:00:00' : localStorage.getItem( STORAGE_TOKENTIME )

  var diff = moment.utc().valueOf() - ( moment.utc( TimeBefore, 'DD/MM/YYYY HH:mm:ss' ).valueOf() );
  var Minutes = moment.utc( moment.duration( diff ).asMinutes() )

  if ( Minutes >= 4 )
  {

    const response = await UseAPIBeforeToken( 'Base/GetTimeForToken' );

    var myTime = Buffer.from( response, 'base64' )
    for ( var i = 0; i < myTime.length; i++ ) { time.push( myTime[ i ] ); }

    var pass = 'hki4iXGu2TXNGSi620rBqkLYnYikY8fBrfP4yfSDho4JKNKm2JjEAxP2LOUyfCn4dx/BL/1j+FwN7ot1faupXsz3EMbP++UlhTdufQQeNmVqTk7ZTg5N1/sNeUaOvxCK';
    var buffer = new Buffer.from( pass, 'ascii' );
    for ( var i = 0; i < buffer.length; i++ ) { key.push( buffer[ i ] ); }

    var uniao = ( time.concat( key ).concat( time ) );
    token = Buffer.from( uniao ).toString( 'base64' );

    localStorage.setItem( STORAGE_TOKEN, token );

    localStorage.setItem( STORAGE_TOKENTIME, moment.utc().format( 'DD/MM/YYYY HH:mm:ss' ) );
  }
  else
  {
    token = localStorage.getItem( STORAGE_TOKEN )
    console.log( TimeBefore )
  }


  return token
}

const api = axios.create( { baseURL: ReturnBaseUrl() } );

api.interceptors.request.use( async config =>
{
  const token = getToken();
  if ( token ) { config.headers.Authorization = `Bearer ${ token }`; }
  return config;
} );

export default api;