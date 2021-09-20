import { UseAPI } from './api';

const Controller = 'Agendamento'

const Actions = [
    'CadastrarAgendamento'
    , 'ListarAgendamentosDoMesDaUnidadeX'
    , 'ListaAgendamentosStatusX'
    , 'DetalhesDoAgendamentoX'
    , 'RemoverAgendamentoX'
    , 'AtualizarStatusDoAgendamentoX'
]

export async function SaveScheduleiVistAPI ( DataCadastro, DataMarcada, Status, Placa, IdUnidade, IdUsuario, IdProduto, Removido = false )
{
    try
    {
        let request = JSON.stringify( {
            DataCadastro,
            DataMarcada,
            Status,
            Placa,
            IdUnidade,
            IdUsuario,
            IdProduto,
            Removido
        } )                

        const response = await UseAPI( `${ Controller }/${ Actions[ 0 ] }`, request )

        return response

    }
    catch ( err )
    {
        console.log( err )
    }
}

export async function AllSchedulePerMonthAPI ( Ano, Mes, IdUsuario )
{
    try
    {
        let request = JSON.stringify( { Ano, Mes, IdUsuario } )

        const response = await UseAPI( `${ Controller }/${ Actions[ 1 ] }`, request )

        return response

    }
    catch ( err )
    {
        console.log( err )
    }
}

export async function AllSchedulePerTypeAPI ( IdUsuario, Status = "ATIVO" )
{
    try
    {
        let request = JSON.stringify( { IdUsuario, Status } )

        const response = await UseAPI( `${ Controller }/${ Actions[ 2 ] }`, request )

        return response
    }
    catch ( err )
    {
        console.log( err )
    }
}

export async function GetScheduleInfoAPI ( Id )
{
    try
    {
        let request = JSON.stringify( { Id } )

        const response = await UseAPI( `${ Controller }/${ Actions[ 3 ] }`, request )

        return response

    }
    catch ( err )
    {
        console.log( err )
    }
}

export async function RemoveSchedule ( IdAgendamento )
{
    try
    {
        let request = JSON.stringify( { IdAgendamento } )

        const response = await UseAPI( `${ Controller }/${ Actions[ 4 ] }`, request )

        return response

    }
    catch ( err )
    {
        console.log( err )
    }

}

export async function UpdateStatusAPI ( Voucher, Status )
{
    try
    {
        let request = JSON.stringify( { Voucher, Status } )

        const response = await UseAPI( `${ Controller }/${ Actions[ 5 ] }`, request )

        return response

    }
    catch ( err )
    {
        console.log( err )
    }
}