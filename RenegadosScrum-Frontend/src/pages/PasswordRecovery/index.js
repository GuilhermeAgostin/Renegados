import React, { useEffect, useState } from 'react';
import { Backdrop, CircularProgress, Snackbar, Card, InputAdornment, SvgIcon, Switch, CardContent, CardActions } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import { makeStyles, ThemeProvider, withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import { Fonts } from "../../constants/Fonts";
import { ReactComponent as PasswordResetIcon } from '../../img/PasswordResetIcon.svg';
import { ReactComponent as RememberedPasswordIcon } from '../../img/RememberedPasswordIcon.svg';
import { ReactComponent as ReturnLoginIcon } from '../../img/ReturnLoginIcon.svg';

import { Colors } from '../../constants/Colors';
import api, { GetCodeOriginal } from "../../services/api";
import { isAuthenticated, login, SetUser, SetUserType } from "../../services/auth";
import { decrypt, encrypt } from '../../crypto/crypto';
import { Metrics } from '../../constants/Metrics';
import { isMobile, useMobileListener } from "../../utils/isMobile";
import { AccountCircle, FlashOnRounded } from '@material-ui/icons';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import { ArrayFind } from '../../utils/ArrayUtil';

const LOGO_URL = 'https://i.imgur.com/9Q2NePt.png'
const COMPANY_NAME = "Cauterfix"
const USER_CONFIG_TEXT = "Usuário não localizado";
const PASSWORD_CONFIG_TEXT = "Digite uma senha";

// => Texts
const TextItens = [
  { index: 0, name: "Title", text: "Esqueceu a senha?" },
  { index: 1, name: "Subtitle", text: "Vamos recuperar seu acesso!" },
  { index: 2, name: "Body", text: "Ok, insira seu e-mail no campo abaixo, para localizar-mos sua senha e encaminhar para você, caso não lembre seu email, solicite seu acesso para a equipe de TI." },
  { index: 3, name: "Body2", text: "Te enviamos um e-mail para alterar sua senha, acesse o link e insira uma nova senha, fico te aguardando!" },
  { index: 3, name: "Button", text: "Voltar para o login" },
];
const CssTextField = withStyles( {
  root: {
    '& label.Mui-focused': {
      color: '#949494', // quando foca no textfield
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#949494',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#949494',
      },
      '&:hover fieldset': {
        borderColor: '#949494',
      },
    },
  },
} )( TextField );


function Copyright ()
{
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      Qualquer dúvida entre em contato conosco <br /> Pablo Maranho (Gerente de marketing e comunicação) - <b>(12) 98131-5055</b><br /> ou por nosso email <br /><b>contato@cauterfix.com.br</b>
      <br />
      { 'Copyright © ' }
      <Link color="inherit" href="#">
        { COMPANY_NAME }
      </Link>{ ' ' }
      { new Date().getFullYear() }
      { '.' }
    </Typography>
  );
}

const useStyles = makeStyles( ( theme ) => ( {
  root: {
    display: 'flex',
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundImage: `url(${ LOGO_URL })`,
    backgroundRepeat: 'no-repeat',
    justifyContent: 'center',
    backgroundSize: 'cover',
    alignItems: 'center',
    overflow: 'hidden'
  },
  rectangle: {
    display: 'flex',
    backgroundColor: 'rgba(2, 67, 142, .8 )',
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    minInicialWidth: '400px',
    minWidth: '400px',
    //minInicialHeight: '400px',
    display: 'inline-block', // ou flex
    //paddingTop: '-20px',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#FFFFFF',
    padding: 20,
    // para mandar pra frente os dois tem te que ter position absolute
    zIndex: 1 // ainda nao tirar
  },
  largeRadiusRight:
  {
    border: '10px solid',
    color: 'rgba(235, 87, 87, 1)',
    position: 'absolute',
    left: '50.73%',
    right: '28%',
    top: '2.6%',
    bottom: '54.43%',
    boxSizing: 'border-box'
  },
  largeRadiusLeft:
  {
    border: '10px solid',
    color: '#EB5757',
    position: 'absolute',
    left: '28%',
    right: '50.73%',
    top: '55.21%',
    bottom: '1.82%',
    boxSizing: 'border-box'
  },
  textFields: {
    marginTop: '7%',
    fontSize: '16px',
  },
  input: {
    color: "red",
  },
  submit: {
    textTransform: "none",
    margin: theme.spacing( 2, 0, 0 ),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

} ) );

const IOSSwitch = withStyles( ( theme ) => ( {
  root: {
    width: 42,
    height: 26,
    padding: 5,
    margin: theme.spacing( 1 ),
  },
  switchBase: {
    padding: 1,
    '&$checked': {
      transform: 'translateX(16px)',
      color: '#2D9CDB',
      '& + $track': {
        backgroundColor: '#8ECAEC',
        opacity: 1,
        border: 'none',
      },
    },
    '&$focusVisible $thumb': {
      color: '#8ECAEC',
      border: '6px solid #fff',
    },
  },
  thumb: {
    width: 23,
    height: 22,
  },
  track: {
    borderRadius: 26 / 1,
    border: `1px solid ${ theme.palette.grey[ 400 ] }`,
    backgroundColor: '#ADADAD',
    opacity: 1,
    transition: theme.transitions.create( [ 'background-color', 'border' ] ),
  },
  checked: {},
  focusVisible: {},
} ) )( ( { classes, ...props } ) =>
{
  return (
    <Switch
      focusVisibleClassName={ classes.focusVisible }
      disableRipple
      classes={ {
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      } }
      { ...props }
    />
  );
} );

export default function SignIn ( props )
{
  const classes = useStyles();
  const [ Login, setLogin ] = React.useState( 'Login' )
  const [ Password, setPassword ] = useState( 'Senha' )
  const [ Error, setError ] = useState( '' )
  const [ ShouldDisableButton, setShouldDisableButton ] = React.useState( true );
  const [ stateText, setStateText ] = React.useState( false )

  const [ state, setState ] = React.useState( { open: false, vertical: 'top', horizontal: 'center', } )
  const [ SnackMessage, setSnackMessage ] = React.useState( '' )
  const { vertical, horizontal, open } = state
  const [ openBackground, setOpenBackground ] = React.useState( false );
  const [ checkedTerm, setCheckedTerm ] = useState( [ 'wifi' ] ); ///
  const useIsMobile = useMobileListener();

  const [ WrongUser, setWrongUser ] = useState( USER_CONFIG_TEXT )
  const [ WrongPassword, setWrongPassword ] = useState( PASSWORD_CONFIG_TEXT )


  const handleToggle = ( value ) => () =>
  {
    const currentIndex = checkedTerm.indexOf( value );
    const newChecked = [ ...checkedTerm ];
    if ( currentIndex === -1 )
    {
      newChecked.push( value );
    } else
    {
      newChecked.splice( currentIndex, 1 );
    }
    setCheckedTerm( newChecked );
  };

  const handleChange = ( value ) => () =>
  {
    const currentIndexTerm = checkedTerm.indexOf( value );
    const newCheckedTerm = [ ...checkedTerm ];
    if ( currentIndexTerm === -1 )
    {
      newCheckedTerm.push( value );
    } else
    {
      newCheckedTerm.splice( currentIndexTerm, 1 );
    }
    setCheckedTerm( newCheckedTerm );
  };

  useEffect( () =>
  {
    if ( isAuthenticated() )
    {
      props.history.push( '/app' )
    }

  }, [] )

  useEffect( () =>
  {
    if ( Login.length > 3 )
    {
      setShouldDisableButton( false )
      handleSelected( 'Title' )

    }
    else ( setShouldDisableButton( true ) )

    console.log( { Login } );
  }, [ Login ] );

  useEffect( () =>
  {
    console.log( { stateText } );
  }, [ stateText ] );

  function handleSelected ( search )
  {
    let response = ArrayFind( TextItens, 'name', search )
    search = response.text
    return search
  }

  async function handleSignIn ( e )
  {
    e.preventDefault();
    if ( !Login || !Password )
    {
      ShowSnackBar( "Preencha e-mail e senha para continuar!" );
    }
    else
    {
      try
      {
        setOpenBackground( true )

        const response = await api.post( "/WEBV2/Login", { Login: Login, Senha: Password } );

        if ( response.data.Sucesso )
        {
          login( response.data.IdUsuario )
          SetUser( response.data.Nome )
          SetUserType( response.data.Tipo )
          props.history.push( "/app" );
        }
        else
        {
          ShowSnackBar( "Houve um problema com o login, verifique suas credenciais." );
        }
      }
      catch ( err )
      {
        ShowSnackBar( "Houve um problema com o login, verifique suas credenciais." );

      }
      finally
      {
        setOpenBackground( false )
      }
    }
  }

  function ShowSnackBar ( text, vertical = 'bottom', horizontal = "center" )
  {
    setSnackMessage( text );
    setState( { open: true, vertical, horizontal } )
  }

  return (

    <div
      component="main"
      className={ classes.root }>
      <CssBaseline />
<div
        className={ classes.rectangle }>

        <div className={ classes.largeRadiusRight } />

        <div className={ classes.largeRadiusLeft } />

        <Card className={ classes.paper }
          style={ {
            height: useIsMobile ? '100%' : 'auto',
            width: useIsMobile ? '100%' : '400px',
            padding: useIsMobile ? '40px' : '20px',
            overflowY: 'visible',
          } }>

          <CardContent style={ {
            //display: 'flex',
            flexDirection: 'column',
            padding: '5%',
            justifyContent: 'center',
            alignItems: 'center',
            //margin: '2% 2% 2% 2%',
            //maxWidth: '50%',
          } }>

            <Typography
              variant='h4'
              align='center'
              fontFamily='Roboto'
              style={ { color: '#02438E', fontWeight: 600 } }>
              { handleSelected( 'Title' ) }
            </Typography>

            <Typography
              size='small'
              align="center"
              style={ { color: '#02438E80', marginTop: '5%' } } >
              { handleSelected( 'Subtitle' ) }
            </Typography>

            <Typography
              size='small'
              align="left"
              style={ { color: 'rgba(130, 130, 130, 1)', marginTop: '5%' } } >
              { stateText === true ? handleSelected( 'Body2' ) : handleSelected( 'Body' ) }
            </Typography>

            { stateText === true ?

              null
              :
              <div
                style={ { display: 'flex', flex: 1, flexDirection: 'row' } }>

                <MailOutlineIcon style={ { margin: '10% 2% 0 0', color: '#959595' } } />


                <CssTextField
                  variant="standard"
                  size='small'
                  style={ { marginTop: '5%', fontSize: '16px', marginBottom: '15%' } }
                  fullWidth
                  color={ !Password ? "primary" : "" }
                  autoComplete="current-password"
                  label="E-mail"
                  name="Password"
                  onChange={ e => { setLogin( e.target.value ) } } />

              </div>

            }

            { stateText === true ?

              <Button
                type="submit"
                variant="body2"
                fontFamily='Roboto'
                fullWidth
                disabled={ ShouldDisableButton }
                variant="contained"
                size="large"
                startIcon={
                  <div style={ { justifyContent: "center", alignItems: "center" } }>
                    <ReturnLoginIcon style={ { marginTop: "10px" } } />
                    <label
                      fontFamily='Roboto' style={ { fontSize: '16px', justifyContent: "center", marginLeft: '5px' } }>
                      { handleSelected( 'Button' ) }
                    </label>

                  </div>
                }
                className={ classes.submit }
                style={ { backgroundColor: '#27AE60', color: '#FFFFFF', marginTop: '30%', marginBottom: '38.5%' } }
                onClick={ () => setStateText( true ) }>
              </Button>

              :

              <div>
                <Button
                  type="submit"
                  variant="body2"
                  fontFamily='Roboto'
                  fullWidth
                  disabled={ ShouldDisableButton }
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={
                    <div style={ { justifyContent: "center", alignItems: "center" } }>
                      <PasswordResetIcon style={ { marginTop: '10px', marginRight: '10px'} } />
                      <label
                        fontFamily='Roboto' style={ { fontSize: '16px', justifyContent: "center" } }>
                        Recuperar senha
                      </label>

                    </div>
                  }
                  className={ classes.submit }
                  style={ { color: '#FFFFFF' } }
                  onClick={ () => setStateText( true ) }>
                </Button>

                <Button
                  type="submit"
                  variant="body2"
                  fontFamily='Roboto'
                  fullWidth

                  variant="contained"
                  //color={() => setColor('#ffff')}
                  size="large"
                  startIcon={
                    <div style={ { justifyContent: "center", alignItems: "center" } }>
                      <RememberedPasswordIcon style={ { marginRight: "10px" } } />

                      <label
                        onClick={ () => props.history.push( `/` ) }
                        fontFamily='Roboto' style={ { fontSize: '16px', justifyContent: "center", color: Colors.Primary } }>
                        Lembrei minha senha
                      </label>

                    </div>
                  }
                  onClick={ () => setStateText( true ) }
                  className={ classes.submit }
                  style={ { backgroundColor: '#FFFFFF', borderColor: 'primary', border: '1px solid #02438E' } }
                  onClick={ () => props.history.push( `/` ) }>
                </Button>
              </div>




            }

          </CardContent>
          <CardActions>
  
          </CardActions>
        </Card>      </div>

    </div>
  );
}
