import React, { useEffect, useState, useCallback } from "react";
import
{
  Backdrop,
  CircularProgress,
  Snackbar,
  Button,
  CssBaseline,
  Grid,
  Link,
  Paper,
  makeStyles,
  TextField,
  Typography,
  Box,
  Card,
  Input
} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Divider from "@material-ui/core/Divider";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import LanguageIcon from "@material-ui/icons/Language";
import { isMobile, useMobileListener } from "../../utils/isMobile";
import { Colors } from "../../constants/Colors";
import { Fonts } from "../../constants/Fonts";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { ReactComponent as HomeIcon } from '../../img/HomeIcon.svg';
import { ReactComponent as NewSessionIcon } from '../../img/NewSessionIcon.svg';


import api, { GetCodeOriginal, GetCodePersonalizado, GetCodePersonalizadoBigInteger } from "../../services/api";
import
{
  getToken,
  isAuthenticated,
  login,
  SetUser,
  loginSocialMedia,
  SetUserType,
} from "../../services/auth";
import { decrypt, encrypt } from "../../crypto/crypto";
//import { LoginUsuarioAPI, BuscaLoginAPI, LoginRedesSociaisAPI } from "../../services/Usuario";
//import { ReturnName } from '../../utils/StringUtils';

const LOGO_URL = "https://i.imgur.com/D8vEDOK.jpg";
const COMPANY_NAME = "WeAlter";

function Copyright ()
{
  return (
    <Typography variant="body2" align="left" style={ { color: Colors.GrayS, marginTop: '0.2rem' } }>
      { "Copyright ©" }
      <Link color="inherit" href="#">
        { COMPANY_NAME }
      </Link>{ " " }
      { new Date().getFullYear() }
      { "." }
    </Typography>
  );
}

const useStyles = makeStyles( ( theme ) => ( {
  root: {
    height: '100vh',
    backgroundColor: Colors.White,
    // root é a page inteira
  },
  image: {
    backgroundImage: `url(${ LOGO_URL })`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "100% 100%",
    //backgroundSize: "100% 100%",
    //justifyContent: 'cover'
  },
  paper: {
    // na prop margin eu defino o tamanho do componente
    // o primeiro valor dentro dos parenteses é responsável por definir a margem superior
    // o segundo valor dentro dos parenteses é responsável por definir a margem lateral
    margin: theme.spacing( 3, 5 ), // para deixar a parte de baixo da tela mais proxima do limite
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: Colors.White,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing( 1 ),
  },
  submit: {
    margin: theme.spacing( 3, 0, 0 ),
  },
  fbClass: {
    margin: "10px 0 0 0"
  }
} ) );

export default function SignIn ( props )
{
  const classes = useStyles();
  const [ Login, setLogin ] = React.useState( ' ' );
  const [ ValidLogin, setValidLogin ] = React.useState( false )

  ///////////////////////////////////////////////////////////////////////////////////////////////

  const [ Email, setEmail ] = React.useState( '' );
  const [ EmailGmail, setEmailGmail ] = React.useState( '' );

  ///////////////////////////////////////////////////////////////////////////////////////////////

  const [ Password, setPassword ] = useState( '' );
  const [ ValidPassword, setValidPassword ] = React.useState( false )


  const [ ShowPassword, setShowPassword ] = useState( false );



  const [ state, setState ] = React.useState( {
    open: false,
    vertical: "top",
    horizontal: "center",
  } );
  const [ SnackMessage, setSnackMessage ] = React.useState( "" );
  const { vertical, horizontal, open } = state;
  const [ openBackground, setOpenBackground ] = React.useState( false );



    


  async function Mount ()
  {
    //CleanFields()
    await Promise.all( [ CleanFields() ] ) // executa todos os requests para executar tudo simultaniamente
  }




  useEffect( () => { Mount() }, [] )


  //   useEffect( () =>
  // {
  //   console.log( { Login } );
  // }, [ Login ] );

  useEffect( () =>
  {
    if ( Login != " " )
      setValidLogin( true )
    else
      setValidLogin( false )

  }, [ Login ] )


  useEffect( () =>
  {
    if ( Password != " " )
      setValidPassword( true )
    else

      setValidPassword( false )

  }, [ Password ] )

  useEffect( () =>  
  {
    console.log( Email );
  }, [ Email ] ); // quando tem dependencia observa o valor da variável


  async function handleSignIn ( e )
  {
    e.preventDefault();
    if ( ValidLogin == true && ValidPassword == true )
    {
      UserLogin();
    }

    else 
    {
      ShowSnackBar( "Preencha e-mail e senha para continuar." );
    }
  }

  async function UserLogin ()
  {
    var LoginCripto = ""
    var PasswordCripto = ""

    try
    {
      setOpenBackground( true ); // para dar o loading na tela

      if ( !Login.includes( "@" ) )
      {
        //LoginCripto = encrypt(GetCodePersonalizado(Login));
        LoginCripto = encrypt( Login.trim() );
        console.log( LoginCripto );
      }
      else
      {
        LoginCripto = Login.trim();
      }

      PasswordCripto = encrypt( Password );

      const response = await LoginUsuarioAPI( LoginCripto, PasswordCripto );

      console.log( response );

      // switch (response.data.Tipo) {
      //   default: //CLI
      //     SetUserType(1)
      //     break
      //   case "ADM":
      //     SetUserType(2)
      //     break
      // }

      if ( response != undefined && response.Sucesso )
      {
        login( response.Nome );
        SetUser( ReturnName( response.Nome ) );

        //login( GetCodeOriginal( decrypt( response.IdIndividuo ) ) );

        //SetUser( response.Nome )
        //SetUserType( 1 )
        props.history.push( "/app" );
      }
      else if ( response.Sucesso == false )
      {
        ShowSnackBar( "O email ou senha inserido não está vinculado a uma conta." );
      }

    }

    catch ( err )
    {
      // quando nao esta funcionando a api
      ShowSnackBar( "Não foi possível concluir a operação, tente novamente mais tarde." );
    }
    finally
    {
      setOpenBackground( false )
    }
  }

  const useMobileListenerisMobile = useMobileListener();// so chama a funcao// antes dos parenteses dar ctrl+space para importar o hook
  // dar um useEffect para observar ela

  // Mandando variavel para outra tela 
  // Exemplo: Primeiro tenho aqui já na tela de SignIn a const responsavel por verificar o estado 
  // do botão, que habilita o individuo ter uma organizacao, essa varivel, retorna true ou false,
  // sendo true eu mando para tela de organizacao e habilito o botao de continuar. Sendo false eu 
  // habilito o botao de criar conta, e jogo para tela de confirmacao de email.

  // aqui eu ja consigo fazer a verificacao do isMobile, sendo mobile eu mandaria pra tela de mobile
  useEffect( () =>
  {

    if ( isAuthenticated() && useMobileListenerisMobile && isMobile ) // no isAuthenticated() verifico se ja tem o token no local storage
    {
      props.history.push( "/appMobile" );// dashboard mobile
    }
    else if ( isAuthenticated() && !useMobileListenerisMobile && !isMobile )
    {
      props.history.push( "/" );
    }
    else
    {
      if ( useMobileListenerisMobile && isMobile )
      {
        props.history.push( "/signinMobile" );
      }
    }
  }, [] ); // quando monta a tela

  useEffect( () =>
  {
    console.log( { isMobile } );
  }, [ isMobile ] ); // quando tem dependencia observa o valor da variável

  useEffect( () =>
  {
    console.log( { useMobileListenerisMobile } );
  }, [ useMobileListenerisMobile ] ); // quando tem dependencia observa o valor da variável
  // aviso a dependendencia, toda vez que muda de valor ele retorna o console log



  function CleanFields ()
  {
    setLogin( ' ' )
    setPassword( ' ' )
  }

  function ShowSnackBar ( text, vertical = "bottom", horizontal = "center" )
  {
    setSnackMessage( text );
    setState( { open: true, vertical, horizontal } );
  }

  function handleClose ()
  {
    setState( { ...state, open: false } );
  }

  function ScreenOption ()
  {
    const [ isOpened, setIsOpened ] = useState( false );

    function screen ()
    {
      setIsOpened( ( wasOpened ) => !wasOpened );
    }
  }

  return (
    <div style={ { textAlign: 'center' } }>
      <Card style={ { backgroundColor: Colors.Primary, marginBottom: '1%', marginTop: '3%', marginLeft: '5%', marginRight: '5%' } }>
        <Typography variant='h6' style={ { padding: '2%', color: Colors.White, fontFamily: Fonts.Primary, fontWeight: 'bold', border: '3px solid', borderColor: Colors.White } }>Renegados Scrum</Typography>
      </Card>
      <div style={ { display: "flex", alignItems: "center", justifyContent: "center" } } id='Root'>

        <CssBaseline />

        <Grid container style={ { padding: '3%', paddingTop: 0, display: 'flex', marginTop: 0, marginBottom: 'auto', flexDirection: 'row' } } >

          <Grid item xs={ 6 } style={ { textAlign: 'center', padding: '2%', borderRight: '2px solid', borderColor: Colors.LightGray } }>

            <Typography variant='h6' style={ { padding: '.5%', color: Colors.Primary, fontFamily: Fonts.Primary, fontWeight: 'bold' } }>Check-in</Typography>
            <Divider></Divider>

            <Input
              startAdornment={ <AccountCircleIcon position="start" style={ { margin: '3%', color: Colors.LightGray } }></AccountCircleIcon> }
              disableUnderline="true"
              placeholder="Nome do usuário"
              style={ { backgroundColor: '#F7F7FC', display: 'flex', flex: 1, marginRight: '1.5%', borderRadius: '4px', marginTop: '5%', border: '1px solid', borderColor: Colors.Primary, color: Colors.Black } }
            />

            <Input
              startAdornment={ <HomeIcon position="start" style={ { margin: '4%', color: Colors.LightGray } }></HomeIcon> }
              disableUnderline="true"
              placeholder="Sessão"
              style={ { backgroundColor: '#F7F7FC', display: 'flex', flex: 1, marginRight: '1.5%', borderRadius: '4px', marginTop: '5%', border: '1px solid', borderColor: Colors.Primary } }
            />

            <Button
              //disabled={ DisableButton }
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              style={ { marginTop: '5%', width: '50%', border: '3px solid', borderColor: Colors.White } }
              className={ classes.submitButton }
              >Entrar na sessão  </Button>

          </Grid>

          <Grid item xs={ 6 } style={ { textAlign: 'center', padding: '2%', justifyContent: 'center', borderLeft: '2px solid', borderColor: Colors.LightGray } }>

            <Typography variant='h6' style={ { padding: '.5%', color: Colors.Primary, fontFamily: Fonts.Primary, fontWeight: 'bold' } }>Criar sessão</Typography>
            <Divider></Divider>

            <Button
              //disabled={ DisableButton }
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              startIcon={
                <NewSessionIcon></NewSessionIcon>
              }
              style={ { marginTop: '20%', width: '50%', display: 'flex-end', border: '3px solid', borderColor: Colors.White } }
              className={ classes.submitButton }
              onClick={ () => props.history.push( "/Dashboard" ) }
              >
              Nova sessão  </Button>


          </Grid>

        </Grid>

      </div>
    </div>

  );
}
