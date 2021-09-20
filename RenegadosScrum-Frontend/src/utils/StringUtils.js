import moment from 'moment'

export const DATE_PATTERN_FORMAT = "DD/MM/YYYY HH:mm"

export function ReturnFirstWord ( str )
{
    let arr = str.split( ' ' )[ 0 ]

    return arr.charAt( 0 ).toUpperCase() + arr.substring( 1, arr.length )
}

export function formatarTelefone ( v )
{
    v = v.replace( /\D/g, "" )
    v = v.replace( /^(\d{2})(\d)/g, "($1) $2" )
    v = v.replace( /(\d)(\d{4})$/, "$1-$2" )
    return v
}

export function formataCPF ( cpf )
{
    cpf = cpf.replace( /[^\d]/g, "" );
    return cpf.replace( /(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4" );
}

export function InsertPhoneMask ( v )
{
    return v.replace( /^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3' );
}

export function CreateNewPassword ( Email )
{
    return Email.substring( 0, 1 ).toUpperCase()
        + Email.substring( 1, 5 ).replace( "@", "" )
        + moment().utc().dayOfYear()
        + moment().utc().hour() + '321'
        + moment().utc().minute()
        + moment().utc().second()
}

export function GetFirstAndLastName ( str )
{
    let arr = str.trim().split( ' ' )

    return `${arr[ 0 ]} ${arr[ arr.length - 1 ]}`
}

const GetRawTypes = { CPF: 1, Telefone: 2 }
export function GetRaw ( str, type )
{
    switch ( type )
    {
        case GetRawTypes.CPF:
            return str.replaceAll( '.', '' ).replaceAll( '-', '' ).replaceAll( ' ', '' )
        case GetRawTypes.Telefone:
            return str.replaceAll( '(', '' ).replaceAll( ')', '' ).replaceAll( '-', '' ).replaceAll( ' ', '' )
    }
}




export function PasswordStrength(password) {
    if (!password) {
      throw new Error("Password is empty.");
    }
  
    const lowerCaseRegex = "(?=.*[a-z])";
    const upperCaseRegex = "(?=.*[A-Z])";
    const symbolsRegex = "(?=.*[!@#$%^&*])";
    const numericRegex = "(?=.*[0-9])";
  
    let strength = {
      id: null,
      value: null,
      length: null,
      contains: [],
    };
  
    // Default
    let passwordContains = [];
  
    if (new RegExp(`^${lowerCaseRegex}`).test(password)) {
      passwordContains = [
        ...passwordContains,
        {
          message: "lowercase",
        },
      ];
    }
  
    if (new RegExp(`^${upperCaseRegex}`).test(password)) {
      passwordContains = [
        ...passwordContains,
        {
          message: "uppercase",
        },
      ];
    }
  
    if (new RegExp(`^${symbolsRegex}`).test(password)) {
      passwordContains = [
        ...passwordContains,
        {
          message: "symbol",
        },
      ];
    }
  
    if (new RegExp(`^${numericRegex}`).test(password)) {
      passwordContains = [
        ...passwordContains,
        {
          message: "number",
        },
      ];
    }
  
    const strongRegex = new RegExp(
      `^${lowerCaseRegex}${upperCaseRegex}${numericRegex}${symbolsRegex}(?=.{8,})`
    );
    const mediumRegex = new RegExp(
      `^${lowerCaseRegex}${upperCaseRegex}${numericRegex}(?=.{6,})`
    );
  
    if (strongRegex.test(password)) {
      strength = {
        id: 2,
        value: "Strong",
      };
    } else if (mediumRegex.test(password)) {
      strength = {
        id: 1,
        value: "Medium",
      };
    } else {
      strength = {
        id: 0,
        value: "Weak",
      };
    }
    strength.length = password.length;
    strength.contains = passwordContains;
    return strength;
  }
  