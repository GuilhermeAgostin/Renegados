import React, { useEffect, useState, useCallback } from 'react';
import { Backdrop, CircularProgress, Snackbar, Card, InputAdornment, SvgIcon, Switch, CardContent, CardActions, Checkbox } from '@material-ui/core';
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
import { ReactComponent as AccountIcon } from '../../img/AccountIcon.svg';
import { ReactComponent as PasswordIcon } from '../../img/PasswordIcon.svg';
import { ReactComponent as LoginIcon } from '../../img/LoginIcon.svg';
import { ReactComponent as SquareIcon } from '../../img/SquareIcon.svg';
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import IconButton from "@material-ui/core/IconButton";
import clsx from "clsx";
import ListItemText from "@material-ui/core/ListItemText";

import { Colors } from '../../constants/Colors';
import api, { GetCodeOriginal } from "../../services/api";
import { isAuthenticated, login, SetUser, SetUserType } from "../../services/auth";
import { decrypt, encrypt } from '../../crypto/crypto';
import { Metrics } from '../../constants/Metrics';
import { isMobile, useMobileListener } from "../../utils/isMobile";
import { AccountCircle, Beenhere, CropSquareOutlined, CropSquare, CompareArrowsOutlined, HighlightOff } from '@material-ui/icons';
import Input from '@material-ui/core/Input';
import Menu from "@material-ui/core/Menu";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";


import
{
  SetListCard
} from "../../services/auth";

const LOGO_URL = 'https://i.imgur.com/9Q2NePt.png'
const COMPANY_NAME = "Cauterfix"
const USER_CONFIG_TEXT = "Usuário não localizado";
const PASSWORD_CONFIG_TEXT = "Digite uma senha";

const StyledMenu = withStyles( {
  paper: {
    border: "1px solid #d3d4d5",
  },
} )( ( props ) => (
  <Menu
    elevation={ 0 }
    getContentAnchorEl={ null }
    anchorOrigin={ {
      vertical: "bottom",
      horizontal: "center",
    } }
    transformOrigin={ {
      vertical: "top",
      horizontal: "center",
    } }
    { ...props }
  />
) );

const StyledMenuItem = withStyles( ( theme ) => ( {
  root: {
    "&:focus": {
      backgroundColor: theme.palette.primary.main,
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: theme.palette.common.white,
      },
    },
  },
} ) )( MenuItem );

const useStyles = makeStyles( ( theme ) => ( {
  root: {
    display: 'flex',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paper: {
    minInicialWidth: '400px',
    minWidth: '400px',
    display: 'inline-block', // ou flex
    //paddingTop: '-20px',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#FFFFFF',
    padding: 20,
    // para mandar pra frente os dois tem te que ter position absolute
    zIndex: 1 // ainda nao tirar
  },
  textFields: {
    marginTop: '7%',
    fontSize: '16px',
  },
  inputError: {
    color: "red",
  },
  inputErrorPassword: {
    color: "yellow",
  },
  submit: {
    textTransform: "none",
    margin: theme.spacing( 2, 0, 0 ),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

} ) );

export default function Dashboard ( props )
{
  const classes = useStyles();
  const [ Login, setLogin ] = React.useState( 'Login' )
  const [ Password, setPassword ] = useState( 'Senha' )
  const [ Error, setError ] = useState( '' )
  const [ Color, setColor ] = React.useState( '#828282' )

  const [ state, setState ] = React.useState( { open: false, vertical: 'top', horizontal: 'center', } )
  const [ SnackMessage, setSnackMessage ] = React.useState( '' )

  const { vertical, horizontal, open } = state
  const [ openBackground, setOpenBackground ] = React.useState( false );
  const [ checkedTerm, setCheckedTerm ] = useState( [ 'wifi' ] ); ///
  const useIsMobile = useMobileListener();
  const [ anchorEl, setAnchorEl ] = useState( null );
  const [ QuantidadeHistoria, setQuantidadeHistoria ] = React.useState( 1 )
  const [ Historias, setHistorias ] = React.useState( '' )

  const [ WrongUser, setWrongUser ] = useState( USER_CONFIG_TEXT )
  const [ WrongPassword, setWrongPassword ] = useState( PASSWORD_CONFIG_TEXT )

  const [ SessionList, setSessionList ] = React.useState( [] );

  const handleUserKeyPress = useCallback( event =>
  {
    const { key, keyCode } = event;

    let i = document.getElementById( 'myInput' )

    if ( key === 'Enter' || ( keyCode == 13 ) )
    {
      //test()
      //CalculationList.push(calculationText)
      console.log( 'Apertei enter' )

      setQuantidadeHistoria( prevState => prevState.valueOf() + 1 )


    }

    if ( key === 'Backspace' || ( keyCode == 8 ) )
    {
      console.log( 'Apertei backspace' ) // aqui mesmo estando na row 2 aparece a 1
      //setQuantidadeHistoria( prevState => prevState.valueOf() - 1 )
      //setQuantidadeHistoria( prevState => prevState.valueOf() != 0 ? prevState.valueOf() - 1 : 1 )




    }
  }, [] );


  useEffect( () =>
  {
    //QuantidadeHistoria == 10 ? setQuantidadeHistoria(10) : console.log(  'Ainda nao é 10');  

    // 
    console.log( QuantidadeHistoria );
  }, [ QuantidadeHistoria ] );


  // useEffect( () =>
  // {
  //   console.log( { Historias } );
  // }, [ Historias ] );

  useEffect( () =>
  {
    let i = document.getElementById( 'myInput' )

    i.addEventListener( "keydown", handleUserKeyPress );
    return () =>
    {
      i.removeEventListener( "keydown", handleUserKeyPress );
    };
  }, [ handleUserKeyPress ] );



  function AddItem ( item )
  {
    setSessionList( [ ...SessionList, item ] )
  }

  function RemoveItem ( item )
  {
    setSessionList( SessionList.filter( f => f !== item ) )
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

  function ConverterCards ()
  {
    console.log( SessionList )
    if ( !!Historias && Historias.length > 0 )
    {
      let a = Historias.split( /\r\n|\r|\n/ )
      setSessionList( a )
    }
  }

  function ShowSnackBar ( text, vertical = 'bottom', horizontal = "center" )
  {
    setSnackMessage( text );
    setState( { open: true, vertical, horizontal } )
  }

  const handleClose = () =>
  {
    setAnchorEl( null );
  };

  const handleClick = ( event ) =>
  {
    setAnchorEl( event.currentTarget );
  };

  return (

    <div
      component="main"
      className={ classes.root }>
      <CssBaseline />


      <Card className={ classes.paper }
        style={ {
          height: useIsMobile ? '100%' : 'auto',
          width: useIsMobile ? '100%' : '100%',
          padding: useIsMobile ? '40px' : '20px',
        } }>

        <CardContent style={ {
          //display: 'flex',
          flexDirection: 'column',

          justifyContent: 'center',
          alignItems: 'center',
          //margin: '2% 2% 2% 2%',
          //maxWidth: '50%',
        } }>

          <Card style={ { backgroundColor: Colors.Primary, marginBottom: '2%' } }>
            <Typography variant='h6' style={ { padding: '2%', color: Colors.White, fontFamily: Fonts.Primary, fontWeight: 'bold', border: '3px solid', borderColor: Colors.White, textAlign: 'center' } }>Dashboard</Typography>
          </Card>

          <Card style={ { padding: '1%', border: '1px solid', borderColor: Colors.LightGray } }>

            <Typography
              variant='h6'
              align='left'
              fontFamily='Roboto'
              style={ { color: '#02438E', fontWeight: 600 } }>
              Escolha a técnica para aplicar no poker planning
            </Typography>

            <div
              style={ { display: 'flex', alignItems: 'center', flex: 1, flexDirection: 'row' } }>

              <Checkbox color='primary' />

              <Typography
                align='center'
                fontFamily='Roboto'
                style={ { color: Colors.LightGray, fontWeight: 'bold' } }>
                Tempo ( 1h, 2h, 4h, 1d, 2d, 3d, 4d, 1sem, ?, Pass, Break )
              </Typography>

            </div>


            <div
              style={ { display: 'flex', alignItems: 'center', flex: 1, flexDirection: 'row' } }>

              <Checkbox color='primary' />

              <Typography
                align='center'
                fontFamily='Roboto'
                style={ { color: Colors.LightGray, fontWeight: 'bold' } }>
                Fibonacci ( 0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, ?, Pass, Break)
              </Typography>

            </div>

            <div
              style={ { display: 'flex', alignItems: 'center', flex: 1, flexDirection: 'row' } }>

              <Checkbox color='primary' />

              <Typography
                align='center'
                fontFamily='Roboto'
                style={ { color: Colors.LightGray, fontWeight: 'bold' } }>
                Voto ( Sim, Espera, Não)
              </Typography>

            </div>
          </Card>

          <Card style={ { padding: '1%', border: '1px solid', borderColor: Colors.LightGray } }>

            <Typography
              variant='h6'
              align='left'
              fontFamily='Roboto'
              style={ { color: Colors.Primary, fontWeight: 600 } }>
              Escolha um nome para o poker planning
            </Typography>

            <div
              style={ { display: 'flex', alignItems: 'center', flex: 1, flexDirection: 'row' } }>

              <Input
                startAdornment={ <Beenhere position="start" style={ { margin: '10px', color: Colors.LightGray } }></Beenhere> }
                disableUnderline="true"
                placeholder="Task"
                style={ { backgroundColor: '#F7F7FC', display: 'flex', flex: 1, marginRight: '1.5%', borderRadius: '4px' } }
              />

            </div>

          </Card>

          <Card style={ { padding: '1%', border: '1px solid', borderColor: Colors.LightGray } }>

            <Typography
              variant='h6'
              align='left'
              fontFamily='Roboto'
              style={ { color: Colors.Primary, fontWeight: 600 } }>
              Selecione um tema
            </Typography>

            <div
              style={ { display: 'flex', alignItems: 'center', flex: 1, flexDirection: 'row' } }>

              <Typography
                align='left'
                fontFamily='Roboto'
                style={ { color: Colors.LightGray, fontWeight: 600, marginLeft: '1%' } }>
                Cores
              </Typography>

              <IconButton
                color="#B8B9B9"
                aria-label="open drawer"
                onClick={ handleClick }
                edge="start"
                className={ clsx( classes.menuButtonRight ) }
                style={ { padding: '1%', marginLeft: '1%' } }

              >
                <ExpandMoreIcon />
              </IconButton>

              <StyledMenu
                id="customized-menu"
                anchorEl={ anchorEl }
                keepMounted
                disableAutoFocusItem="true"
                open={ Boolean( anchorEl ) }
                onClose={ handleClose }
                style={ { color: Colors.White } }
              >
                <StyledMenuItem style={ { textColor: Colors.Black } }>

                  <ListItemIcon >
                    <SquareIcon fontSize="small" style={ { color: Colors.Secondary } } />
                  </ListItemIcon>

                  <ListItemText primary="Vermelho" style={ { color: Colors.Black } } />

                </StyledMenuItem>

                <StyledMenuItem>

                  <ListItemIcon>
                    <SquareIcon fontSize="small" style={ { color: Colors.Green } } />
                  </ListItemIcon>
                  <ListItemText primary="Verde" />

                </StyledMenuItem>

                <StyledMenuItem>

                  <ListItemIcon>
                    <SquareIcon fontSize="small" style={ { color: Colors.Primary } } />
                  </ListItemIcon>
                  <ListItemText primary="Azul" />

                </StyledMenuItem>

              </StyledMenu>

            </div>

          </Card>

          <Card style={ { padding: '1%', border: '1px solid', borderColor: Colors.LightGray } }>

            <Typography
              variant='h6'
              align='left'
              fontFamily='Roboto'
              style={ { color: Colors.Primary, fontWeight: 600 } }>
              Crie as listas do poker planning
            </Typography>

            <div
              style={ { display: 'flex', alignItems: 'center', flex: 1, flexDirection: 'row' } }>

              <Input
                //startAdornment={ <Beenhere position="start" style={ { margin: '10px', color: Colors.LightGray } }></Beenhere> }
                disableUnderline="true"
                id="myInput"
                multiline="true"
                rows={ QuantidadeHistoria }
                onChange={ e => { setHistorias( e.target.value ) } } // fazer uma funcao que 
                placeholder="Digite uma história em cada linha e depois click no botão para converter"
                style={ { backgroundColor: '#F7F7FC', display: 'flex', flex: 1, marginRight: '1.5%', borderRadius: '4px', padding: '2%' } }
              />

            </div>

            <Button
              //disabled={ DisableButton }
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              startIcon={
                <CompareArrowsOutlined></CompareArrowsOutlined>
              }
              style={ { marginTop: '1%', marginBottom: '1%', display: 'flex-end', border: '3px solid', borderColor: Colors.White } }
              className={ classes.submitButton }
              onClick={ () => ConverterCards() }
            >
              Converter em Cards  </Button>
            {
              SessionList.length > 0 &&

              SessionList.map( (item,index) =>
              {
                return (
                  <Card key={ index } style={ { marginBottom: '1%', display: 'flex', padding: '.5%' } }>
                    <Typography
                      align='left'
                      fontFamily='Roboto'
                      style={ { color: Colors.LightGray, fontWeight: 600, marginLeft: '1%' } }>
                      { item }
                    </Typography>

                    <HighlightOff style={ { marginLeft: '5%' } }></HighlightOff>

                  </Card> );
              } )


            }


          </Card>




          <Button
            type="submit"
            variant="body2"
            fontFamily='Roboto'
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            startIcon={
              <div style={ { justifyContent: "center", alignItems: "center" } }>
                <SvgIcon >
                  <LoginIcon fontSize="50" />
                </SvgIcon>

                <label
                  fontFamily='Roboto' style={ { fontSize: '16px', justifyContent: "center", marginTop: '5%' } }>
                  Salvar e iniciar
                </label>

              </div>
            }
            className={ classes.submit }>
          </Button>


        </CardContent>
        <CardActions>
        </CardActions>
      </Card >
    </div >


  );
}