import { AcUnit } from "@material-ui/icons";
import { encrypt } from "../crypto/crypto";
import { GetCodePersonalizado } from "./api";

const COMPANY_LOCAL_STORAGE = 'CAUTERFIX'

export const TOKEN_KEY = `@${ COMPANY_LOCAL_STORAGE }USER-Token`
export const USER_KEY = `@${ COMPANY_LOCAL_STORAGE }USER-OBJ`
export const USER_TYPE = `@${ COMPANY_LOCAL_STORAGE }USER-TYPE`
export const USER_UNIT = `@${ COMPANY_LOCAL_STORAGE }USER-UNIT`

export const isAuthenticated = () => localStorage.getItem( TOKEN_KEY ) !== null;

export const getToken = () => localStorage.getItem( TOKEN_KEY );

export const getEncryptedNToken = () => encrypt(   localStorage.getItem( TOKEN_KEY )  );

export const getUser = () => localStorage.getItem( USER_KEY );

export const getUserType = () => localStorage.getItem( USER_TYPE );

export const login = token =>
{
  localStorage.setItem( TOKEN_KEY, token );
}

export const logout = () =>
{
  localStorage.removeItem( TOKEN_KEY );
}

export const SetUser = token =>
{
  localStorage.setItem( USER_KEY, token );
}

export const DeleteUser = () =>
{
  localStorage.removeItem( USER_KEY );
}

export const SetUserType = Type =>
{
  localStorage.setItem( USER_TYPE, Type );
}

export const SetUserUnit = Unit =>
{
  localStorage.setItem( USER_UNIT, Unit );
}

export const SetListCard = card =>
{
  localStorage.setItem( card );
}

