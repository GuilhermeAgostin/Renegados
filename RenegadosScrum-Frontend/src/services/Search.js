import { UseAPI } from './api';

const Controller = 'WEBV2'

const Actions = [
    'GetPesquisasComErro'
    , 'GetPesquisasPendentes'
    , 'GetVistoriasPendentesdeAnalise'
    , 'GetDeactivatedDevices'
    , 'LiberarDispositivo?IdDispositivo='
    , 'LiberarPesquisa?IdPesquisa='
    , 'GetAllDevices?page='
    , 'BloquearDispositivo?IdDispositivo='
    , 'GetVistoriasRealizadas?Page='
    , 'GetVistoriasRealizadasPorParametro'
    , 'GetVistoriasRealizadasPorParametroBIN'
]

export async function GetPesquisasComErroAPI ()
{
    try
    {
        const response = await UseAPI( `${ Controller }/${ Actions[ 0 ] }`, null, 2 )

        return response

    }
    catch ( err )
    {
        console.log( err )
    }
}

export async function GetPesquisasPendentesAPI ()
{
    try
    {
        const response = await UseAPI( `${ Controller }/${ Actions[ 1 ] }`, null, 2 )

        return response

    }
    catch ( err )
    {
        console.log( err )
    }
}

export async function GetVistoriasPendentesdeAnaliseAPI ()
{
    try
    {
        const response = await UseAPI( `${ Controller }/${ Actions[ 2 ] }`, null, 2 )

        return response

    }
    catch ( err )
    {
        console.log( err )
    }
}

export async function GetDeactivatedDevicesAPI ()
{
    try
    {
        const response = await UseAPI( `${ Controller }/${ Actions[ 3 ] }`, null, 2 )

        return response

    }
    catch ( err )
    {
        console.log( err )
    }
}

export async function ActivatePhoneAPI ( Id )
{
    try
    {
        const response = await UseAPI( `${ Controller }/${ Actions[ 4 ] }` + Id, null, 2 )

        return response

    }
    catch ( err )
    {
        console.log( err )
    }
}



export async function LiberarPesquisaAPI ( Id )
{
    try
    {
        const response = await UseAPI( `${ Controller }/${ Actions[ 5 ] }` + Id, null, 2 )

        return response

    }
    catch ( err )
    {
        console.log( err )
    }
}

export async function GetAllDevicesAPI ( page )
{
    try
    {
        const response = await UseAPI( `${ Controller }/${ Actions[ 6 ] }` + page, null, 2 )

        return response

    }
    catch ( err )
    {
        console.log( err )
    }
}

export async function DeactivatePhoneAPI ( Id )
{
    try
    {
        const response = await UseAPI( `${ Controller }/${ Actions[ 7 ] }` + Id, null, 2 )

        return response

    }
    catch ( err )
    {
        console.log( err )
    }
}

export async function GetVistoriasRealizadasAPI ( Page )
{
    try
    {
        const response = await UseAPI( `${ Controller }/${ Actions[ 8 ] }` + Page, null, 2 )

        return response


    }
    catch ( err )
    {
        console.log( err )
    }
}

export async function GetVistoriasRealizadasPerParameterAPI ( Parametro )
{
    try
    {
        let request = JSON.stringify( { Parametro } )

        const response = await UseAPI( `${ Controller }/${ Actions[ 9 ] }`, request )

        return response


    }
    catch ( err )
    {
        console.log( err )
    }
}

export async function GetVistoriasRealizadasPerBINParameterAPI ( Parametro, Type )
{
    try
    {
        let request = JSON.stringify( { Parametro, Type } )

        const response = await UseAPI( `${ Controller }/${ Actions[ 10 ] }`, request )

        return response
    }
    catch ( err )
    {
        console.log( err )
    }
}