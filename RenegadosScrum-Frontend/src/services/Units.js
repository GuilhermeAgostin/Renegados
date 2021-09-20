import { encrypt } from '../crypto/crypto';
import { GetCodePersonalizado, UseAPI } from './api';
import { getToken } from './auth';

export async function GetAllUnitsAPI ( Start, End, Parametro = "" )
{
    try
    {
        let request = JSON.stringify( { Start, End, Parametro } )

        const response = await UseAPI( 'Unidade/ObterTodasUnidades', request )

        return response

    }
    catch ( err )
    {
        console.log( err )
    }
}

export async function GetAllUnitsPerProximityAPI ( Latitude, Longitude, Radius )
{
    try
    {
        let request = JSON.stringify( { Latitude, Longitude, Radius } )

        const response = await UseAPI( 'Unidade/ObterUnidadesPorProximidade', request )

        return response

    }
    catch ( err )
    {
        console.log( err )
    }
}

export async function GetUnitDetailsAPI ( Id )
{
    try
    {
        let request = JSON.stringify( { Id } )

        const response = await UseAPI( 'Unidade/DetalhesDaUnidadeX', request )

        return response

    }
    catch ( err )
    {
        console.log( err )
    }
}

export async function UpdateUnityAPI ( IdUnidade, CNPJ, RazaoSocial, NomeFantasia, Nome, Telefone, Celular, Email, Latitude, Longitude, Logradouro, Numero, Bairro, Municipio, UF, CEP, Status, Franqueadora )
{
    try
    {
        let IdUsuario = encrypt(GetCodePersonalizado(parseInt(getToken())))
        
        let request = JSON.stringify( {
            IdUnidade,
            CNPJ,
            RazaoSocial,
            NomeFantasia,
            Nome,
            Telefone,
            Celular,
            Email,
            Latitude,
            Longitude,
            Logradouro,
            Numero,
            Bairro,
            Municipio,
            UF,
            CEP,
            Status,
            Franqueadora,
            IdUsuario 
        } )

        console.log(request)

        const response = await UseAPI( 'Unidade/EditarUnidade', request )

        return response

    }
    catch ( err )
    {
        console.log( err )
    }
}

export async function RemoveUnityAPI ( IdUnidade )
{
    try
    {
        let IdUsuario = getToken()
        
        let request = JSON.stringify( { IdUnidade, IdUsuario } )

        const response = await UseAPI( 'Unidade/EditarUnidade', request )

        return response

    }
    catch ( err )
    {
        console.log( err )
    }
}