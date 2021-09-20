import { encrypt } from '../crypto/crypto';
import { GetCodePersonalizado, UseAPI } from './api';
import { getToken } from './auth';

const controller = 'WEBV2';

export async function GetAllProvidersAPI() {
    try {
        const response = await UseAPI(`${controller}/GetFornecedores`, null, 2)

        return response
    }
    catch (err) {
        console.log(err)
    }
}

export async function GetAllUnitsAPI(IdUsuario) {
    try {
        const response = await UseAPI(`${controller}/GetUVCs?IdUsuario=` + IdUsuario, null, 2)

        return response
    }
    catch (err) {
        console.log(err)
    }
}

export async function GetUnitInfoAPI(Id) {
    try {
        let request = JSON.stringify({ Id })

        const response = await UseAPI(`${controller}/GetUVC?Id=` + Id, request, 2)

        return response
    }
    catch (err) {
        console.log(err)
    }
}

export async function SaveUnitAPI(unidade, acesso) {
    try {
        let request = JSON.stringify({
            UVC: unidade,
            Acesso: acesso
        });

        const response = await UseAPI(`${controller}/SalvarUVC`, request)

        return response

    }
    catch (err) {
        console.log(err)
    }
}

export async function UpdateUnitAPI(unidade, acesso) {
    try {
        let request = JSON.stringify({
            UVC: unidade,
            Acesso: acesso
        });

        const response = await UseAPI(`${controller}/AtualizarUVC`, request)

        return response

    }
    catch (err) {
        console.log(err)
    }
}

export async function RemoveUnitAPI(IdUvc, Removido, Status) {
    try {
        let request = JSON.stringify({
            UVC: {
                IdUvc,
                Removido,
                Status
            }
        });

        //console.log(request)

        const response = await UseAPI(`${controller}/RemoverUVC`, request)

        return response

    }
    catch (err) {
        console.log(err)
    }
}