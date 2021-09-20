import { cpf } from 'cpf-cnpj-validator'

export function IsValidPassword ( str )
{
    const pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,}$/

    if ( pattern.test( str ) )
        return true
    else
        return false
}

export function IsValidFullName ( str )
{
    const pattern = /^[a-zA-Z]{4,}(?: [a-zA-Z]+){0,2}$/

    if ( pattern.test( str ) )
        return true
    else
        return false
}

export function IsValidEmail ( str )
{
    const pattern = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    if ( pattern.test( str ) )
        return true
    else
        return false
}

export function IsValidCPF ( str )
{
    const pattern = /^(\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}|\d{3}\.?\d{3}\.?\d{3}-?\d{2})$/

    if ( pattern.test( str ) && cpf.isValid( str ) )
        return true
    else
        return false
}
