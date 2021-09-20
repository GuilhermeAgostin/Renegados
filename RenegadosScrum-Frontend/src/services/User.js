import { encrypt } from '../crypto/crypto';
import { GetCodePersonalizado, UseAPI } from './api';
import { getToken } from './auth';

const controller = 'WEBV2';

export async function GetAllUsersAPI(Page, IdUsuario, IdFranqueado = 0, IdUVC = 0) {
    try {
        const response = await UseAPI(`${controller}/GetUsuarios?Page=${Page}&IdUsuario=${IdUsuario}&IdFranqueado=${IdFranqueado}&IdUVC=${IdUVC}`, null, 2);

        return response;
    }
    catch (err) {
        console.log(err)
    }
}

export async function GetUserInfoAPI(Id) {
    try {
        const response = await UseAPI(`${controller}/GetUsuario?Id=${Id}`, null, 2)

        return response
    }
    catch (err) {
        console.log(err)
    }
}

export async function GetUserTypesAPI() {
    try {
        const response = await UseAPI(`${controller}/GetTipoPerfilUsuario`, null, 2);

        return response;
    }
    catch (err) {
        console.log(err)
    }
}

export async function SaveUserAPI(usuario, acesso) {
    try {
        let request = JSON.stringify({
            Usuario: usuario,
            Acesso: acesso
        });

        const response = await UseAPI(`${controller}/SalvarUsuario`, request)

        return response
    }
    catch (err) {
        console.log(err)
    }
}

export async function UpdateUserAPI(usuario, acesso) {
    try {
        let request = JSON.stringify({
            Usuario: usuario,
            Acesso: acesso
        });

        const response = await UseAPI(`${controller}/AtualizarUsuario`, request)

        return response

    }
    catch (err) {
        console.log(err)
    }
}

export async function RemoveUserAPI(IdUsuario, Removido, Status) {
    try {
        let request = JSON.stringify({
            Usuario: {
                IdUsuario,
                Removido,
                Status
            }
        });

        //console.log(request)

        const response = await UseAPI(`${controller}/RemoverUsuario`, request)

        return response

    }
    catch (err) {
        console.log(err)
    }
}