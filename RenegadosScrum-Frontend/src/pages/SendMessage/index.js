import { Avatar, Button, Snackbar, TextField, Typography } from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect } from 'react';
import 'react-awesome-slider/dist/styles.css';
import { Colors } from "../../constants/Colors";
import { Fonts } from "../../constants/Fonts";
import { DrawerComponent } from '../../drawer/DrawerComponent';
import { isMobile } from "../../utils/isMobile";

import moment from 'moment'
import { Backdrop, CircularProgress } from '@material-ui/core';
import { decrypt } from '../../crypto/crypto';

const SaveTypes = {
    MessageTitle: 1,
    MessageContent: 2,
    SelectedUser: 3
}

const useStyles = makeStyles( ( theme ) => ( {
    root: { maxWidth: 400, minWidth: isMobile ? '100%' : 350 },
    media: { height: 0, paddingTop: '56.25%', },
    expandOpen: { transform: 'rotate(180deg)', },
    avatar: { backgroundColor: red[ 500 ], },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create( 'transform', { duration: theme.transitions.duration.shortest } ),
        borderLeftColor: Colors.Primary, borderLeftWidth: 3
    },
    EditTexts: { marginLeft: '2%', flex: 0.8 }
    , JunoButton: {
        flex: 1,
        width: '100%'
    }
    , EditButton: { fontFamily: Fonts.Primary, backgroundColor: Colors.White, minWidth: '2vw', minHeight: '2vw', borderRadius: 100 }
} ) )

const TEXTFIELD_ID = "outlined-multiline-static"
const TEXTFIELD_VARIANT = "outlined"
const TEXTFIELD1_LABEL = "Título"
const TEXTFIELD2_LABEL = "Mensagem"

const LOGO_URL = 'http://www.ijobtech.com/images/ijoblogo02.png'
const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss'

export default function SendMessage ( props )
{
    const classes = useStyles();

    const EncryptedParameter = props.history.location.pathname.replace( '/SendMessage:', '' )

    const arr = decrypt( EncryptedParameter ).split( '|' )

    const IdCliente = arr[ 0 ]
    const ClientPhoto = arr[ 1 ]
    const ClientName = arr[ 2 ]

    //Screen    
    const [ openBackground, setOpenBackground ] = React.useState( false );
    const [ ShouldDisableButton, setShouldDisableButton ] = React.useState( true );

    //Notification
    const [ MessageTitle, setMessageTitle ] = React.useState( '' )
    const [ MessageContent, setMessageContent ] = React.useState( '' )
    const [ SelectedUser, setSelectedUser ] = React.useState( IdCliente )

    //Snackbar
    const [ state, setState ] = React.useState( { open: false, vertical: 'top', horizontal: 'center', } )
    const [ SnackMessage, setSnackMessage ] = React.useState( '' )
    const { vertical, horizontal, open } = state
    const handleClose = () => { setState( { ...state, open: false } ); }

    useEffect( () =>
    {
        Mount()
    }, [] )

    useEffect( () =>
    {
        if ( MessageTitle.length > 5 && MessageContent.length > 5 )
        {
            setShouldDisableButton( false )
        }
        else
        {
            setShouldDisableButton( true )
        }

    }, [ MessageTitle, MessageContent ] )

    async function Mount ()
    {
        await Promise.all( [] )
    }

    async function handleSubmit ( e )
    {
        e.preventDefault()
        setOpenBackground( true )
        const response = await SendNotification( MessageTitle
            , MessageContent
            , LOGO_URL
            , false
            , 3
            , SelectedUser
            , 0
            , moment().utc().format( DATE_FORMAT ) )

        if ( response != undefined )
        {
            if ( response.Sucesso )
            {
                setSnackMessage( 'Notificação enviada com sucesso!' )
                setState( { open: true, vertical: 'bottom', horizontal: 'center' } )
                setOpenBackground( false )
            }
            else
            {
                setSnackMessage( 'Ocorreu um erro ao enviar esta notificação, tente novamente!' )
                setState( { open: true, vertical: 'bottom', horizontal: 'center' } )
                setOpenBackground( false )
            }

        }
    }

    const handleSave = ( value, type ) =>
    {
        switch ( type )
        {
            case SaveTypes.MessageTitle:
                setMessageTitle( value )
                break;
            case SaveTypes.MessageContent:
                setMessageContent( value )
                break;
            case SaveTypes.SelectedUser:
                setSelectedUser( value )
                break;
        }
    }

    return (
        <DrawerComponent
            history={ props.history }
            children={
                <div style={ styles.ScreenContainer }>
                    <div style={ styles.ClientContainer }>
                        <Avatar src={ ClientPhoto } onClick={ () => props.history.push( `/ProductDetail:${SelectedUser}` ) } />

                        <Typography style={ styles.BlackBoldText } paragraph >{ ClientName }</Typography>
                    </div>

                    <form onSubmit={ handleSubmit } style={ styles.ScreenContainer }>
                        <TextField
                            id={ TEXTFIELD_ID }
                            label={ TEXTFIELD1_LABEL }
                            variant={ TEXTFIELD_VARIANT }
                            onChange={ e => handleSave( e.target.value, SaveTypes.MessageTitle ) }
                            style={ styles.TextField }
                        />

                        <TextField
                            id={ TEXTFIELD_ID }
                            label={ TEXTFIELD2_LABEL }
                            multiline
                            rows={ 4 }
                            onChange={ e => handleSave( e.target.value, SaveTypes.MessageContent ) }
                            variant={ TEXTFIELD_VARIANT }
                            style={ styles.TextField }
                        />

                        <Button type="submit" disabled={ ShouldDisableButton } variant={ TEXTFIELD_VARIANT } color="primary">Enviar notificação</Button>
                    </form>

                    <Snackbar
                        anchorOrigin={ { vertical, horizontal } }
                        open={ open }
                        onClose={ handleClose }
                        message={ SnackMessage }
                        key={ vertical + horizontal }
                    />
                    <Backdrop className={ classes.backdrop } open={ openBackground }>
                        <CircularProgress color="inherit" />
                    </Backdrop>
                </div>
            } />
    );
}


const styles = {
    ScreenContainer:
    {
        flex: 1
        , backgroundColor: Colors.White
        , flexDirection: 'column'
        , display: 'flex'
    }
    , ClientContainer:
    {
        display: 'flex'
        , flex: 1
        , flexDirection: 'column'
        , justifyContent: 'center'
        , alignItems: 'center'
    }
    , WhiteBoldText:
    {
        fontFamily: Fonts.Primary
        , fontSize: 12
        , color: Colors.White
        , fontWeight: 'bold'
    }
    , BlackBoldText:
    {
        fontFamily: Fonts.Primary
        , fontSize: 12
        , color: Colors.Black
        , fontWeight: 'bold'
    }
    , GreenBoldText:
    {
        fontFamily: Fonts.Primary
        , fontSize: 12
        , color: Colors.White
        , fontWeight: 'bold'
        , borderRadius: 5
        , maxWidth: '50%'
    }
    , BlackNormalText:
    {
        fontFamily: Fonts.Primary
    }
    , WhiteBoldText:
    {
        fontFamily: Fonts.Primary,
        fontSize: 12,
        color: Colors.White,
        fontWeight: 'bold'
    }
    , ListItem:
    {
        shadowColor: "#000",
        shadowOffset:
        {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.37,
        shadowRadius: 7.49,
        borderRadius: 10,
        elevation: 12,
        marginTop: '2%',
        backgroundColor: Colors.Primary,
        width: isMobile ? '90vw' : '75vw'
    }
    , ListItem2:
    {
        shadowColor: "#000",
        shadowOffset:
        {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.37,
        shadowRadius: 7.49,
        borderRadius: 10,
        elevation: 12,
        marginTop: '2%',
        backgroundColor: Colors.Primary,
        flex: 1
    }
    , TextField:
    {
        marginBottom: '3%'
        , fontFamily: Fonts.Primary
    }
}
