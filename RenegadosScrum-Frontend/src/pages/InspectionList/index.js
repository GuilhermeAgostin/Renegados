import { Backdrop, Button, Card, CardActions, CardContent, CircularProgress, LinearProgress, Snackbar, TextField, Typography } from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import Slide from '@material-ui/core/Slide';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import PhoneIphoneIcon from '@material-ui/icons/PhoneIphone';
import React, { useEffect, useState } from 'react';
import 'react-awesome-slider/dist/styles.css';
import { animated, useSpring } from 'react-spring/web.cjs'; // web.cjs is required for IE 11 support
import ListEmptyComponent from '../../components/ListEmptyComponent/ListEmptyComponent';
import { Colors } from "../../constants/Colors";
import { Fonts } from "../../constants/Fonts";
import { encrypt } from '../../crypto/crypto';
import { DrawerComponent } from '../../drawer/DrawerComponent';
import { DeactivatePhoneAPI, GetVistoriasRealizadasAPI, GetVistoriasRealizadasPerParameterAPI, GetVistoriasRealizadasPerBINParameterAPI } from '../../services/Search';
import { FormatDate } from '../../utils/DateUtil';
import { isMobile } from "../../utils/isMobile";
import ReceiptIcon from '@material-ui/icons/Receipt';
import GetAppIcon from '@material-ui/icons/GetApp';
import { GetFirstAndLastName } from '../../utils/StringUtils';
import FindInPageOutlinedIcon from '@material-ui/icons/FindInPageOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import SearchIcon from '@material-ui/icons/SearchOutlined';
import { distinctFunc } from '../../utils/ArrayUtil';

const TEXTFIELD_ID = "outlined-multiline-static"
const TEXTFIELD_VARIANT = "outlined"
const TEXTFIELD1_LABEL = "Pesquisa por parâmetro"
const TEXTFIELD2_LABEL = "Mensagem"

const GET_USER_INFO_ERROR = "Ocorreu um erro ao tentar buscar por informações de seu usuário, tente novamente mais tarde."
const DATE_FORMAT = "DD/MM/YYYY HH:mm"
const SNACKBAR_VOUCHER_COPIED_TEXT = "Voucher copiado para área de transferência"
const FIRST_ACTION_TEXT = "Copiar Voucher"
const SECOND_ACTION_TEXT = "Finalizar agendamento"
const THIRD_ACTION_TEXT = "Link de pagamento"
const REMOVE_SCHEDULE_SUCCESS = 'Agendamento removido com sucesso'
const REMOVE_SCHEDULE_ERROR = 'Ocorreu um erro ao remover agendamento, tente novamente mais tarde'
const USER_ICON = 'https://image.flaticon.com/icons/png/128/3061/3061341.png'
const NOTHING_CHANGED_TEXT = 'Os dados atuais não diferem dos anteriores.'
const TITLE_TEXT = "Monitoramento"

const Fade = React.forwardRef( function Fade ( props, ref )
{
    const { in: open, children, onEnter, onExited, ...other } = props;
    const style = useSpring( {
        from: { opacity: 0 },
        to: { opacity: open ? 1 : 0 },
        onStart: () =>
        {
            if ( open && onEnter )
            {
                onEnter();
            }
        },
        onRest: () =>
        {
            if ( !open && onExited )
            {
                onExited();
            }
        },
    } );

    return (
        <animated.div ref={ ref } style={ style } { ...other }>
            { children }
        </animated.div>
    );
} );

const SECONDS_TO_REFRESH = 60

export default function InspectionList ( props )
{
    const classes = useStyles();

    const [ Vistorias, setVistorias ] = useState( [] )
    const [ Total, setTotal ] = useState( [] )
    const [ Page, setPage ] = useState( 0 )
    const [ IsTabLoading, setIsTabLoading ] = useState( false )
    const [ SearchType, setSearchType ] = useState( 0 )

    //Screen        
    const [ openBackground, setOpenBackground ] = useState( false );
    const [ ShouldDisableButton, setShouldDisableButton ] = useState( false );
    const [ ModalVisibility, setModalVisibility ] = useState( false );
    const [ Query, setQuery ] = useState( '' );
    const [ LoadingIds, setLoadingIds ] = useState( [] );

    //Snackbar
    const [ state, setState ] = useState( { open: false, vertical: 'top', horizontal: 'center', } )
    const [ SnackMessage, setSnackMessage ] = useState( '' )
    const { vertical, horizontal, open } = state
    const handleClose = () => { setState( { ...state, open: false } ); }

    useEffect( () => { Mount( true ) }, [] )

    useEffect( () =>
    {
        if ( Query.length === 0 && Page === 0 )
        {
            Mount( true )
        }
    }, [ Query ] )

    async function Mount ( ShowLoading = false )
    {
        if ( ShowLoading )
            setOpenBackground( true )

        await Promise.all( [ GetVistoriasRealizadas() ] )
        setOpenBackground( false )
    }

    async function GetVistoriasRealizadas ()
    {
        if ( IsTabLoading )
            return null

        if ( Object.keys( Vistorias ).length > 0 && Object.keys( Vistorias ).length === Total && Page > 0 )
            return null

        setIsTabLoading( true )

        const response = await GetVistoriasRealizadasAPI( Page + 1 )

        if ( response !== undefined )
        {

            if ( response.Sucesso )
            {
                if ( Page === 0 )
                    setVistorias( response.Vistorias )
                else
                    setVistorias( [ ...Vistorias, ...response.Vistorias ] )

                setTotal( response.Total )
                setPage( Page + 1 )
            }
            else
            {
                ShowSnackBar( 'Não foi possível buscar vistorias. Tente novamente.' )
            }
        }

        setIsTabLoading( false )
    }

    async function GetVistoriasRealizadasPerParameter ()
    {
        if ( Query.trim().length >= 7 )
        {
            setOpenBackground( true )

            const response = await GetVistoriasRealizadasPerParameterAPI( Query.trim() )

            if ( response.Sucesso )
            {
                if ( response.Vistorias != null && Object.keys( response.Vistorias ).length > 0 )
                {
                    setVistorias( response.Vistorias )
                    setTotal( response.Vistorias.length )
                }
                else
                {
                    ShowSnackBar( `Não há registro com o parâmetro ${ Query }` )
                    setVistorias( [] )
                    setTotal( 0 )
                }

                setPage( 0 )
            }
            else
                ShowSnackBar( "Não foi possível concluir a operação" )

            setOpenBackground( false )
        }
        else
            ShowSnackBar( "O parâmetro deve ter no mínimo 7 caracteres (Placa)" )
    }

    async function GetVistoriasRealizadasPerBinParameter ()
    {
        if ( Query.trim().length >= 7 || SearchType === 4 )
        {
            setOpenBackground( true )

            const response = await GetVistoriasRealizadasPerBINParameterAPI( Query.trim(), SearchType )

            if ( response.Sucesso )
            {
                if ( response.Vistorias != null && Object.keys( response.Vistorias ).length > 0 )
                {
                    setVistorias( response.Vistorias )
                    setTotal( response.Vistorias.length )
                }
                else
                {
                    ShowSnackBar( `Não há registro com o parâmetro ${ Query }` )
                    setVistorias( [] )
                    setTotal( 0 )
                }

                setPage( 0 )
            }
            else
                ShowSnackBar( "Não foi possível concluir a operação" )

            setOpenBackground( false )
        }
        else
            ShowSnackBar( "O parâmetro deve ter no mínimo 7 caracteres (Placa)" )
    }

    function ShowSnackBar ( text, vertical = 'bottom', horizontal = "center" )
    {
        setSnackMessage( text );
        setState( { open: true, vertical, horizontal } )
    }

    function DownloadFile ( url, InspectionParameter, InspectionId )
    {

        let arr = [ ...LoadingIds, { InspectionId } ]

        setLoadingIds( distinctFunc( arr, [ 'InspectionId' ] ) )

        const requestOptions = { method: 'POST', headers: { 'Content-Type': 'data:application/octet-stream', 'Content-Disposition': 'attachment', 'filename': "filename.pdf" }, };

        fetch( `${ url }`, requestOptions ).then( ( res ) => { return res.blob() } )
            .then( ( blob ) =>
            {
                const href = window.URL.createObjectURL( blob );
                const link = document.createElement( 'a' );
                link.href = href;
                link.style = "display: none";
                link.hidden = true;
                link.target = '_blank';
                link.setAttribute( 'download', `${ InspectionParameter }.pdf` );
                document.body.appendChild( link );
                link.click();
                link.remove()

                let newLoadingIds = []
                LoadingIds.filter( function ( elem, pos ) { return arr.indexOf( elem ) == pos; } ).forEach( item =>
                {
                    if ( item[ 'InspectionId' ] !== InspectionId )
                    {
                        newLoadingIds.push( item )
                    }
                } )
                setLoadingIds( distinctFunc( newLoadingIds, [ 'InspectionId' ] ) )
            } )
            .catch( ( err ) =>
            {
                return Promise.reject( { Error: 'Something Went Wrong', err } );
            } )
    }

    function HandleSearchType ( type )
    {
        if ( SearchType !== type )
            setSearchType( type )
        else
            setSearchType( 0 )
    }

    function returnPlaceHolder ()
    {
        const TEXTFIELD1_LABEL_PLATE = 'Pesquisa por placa na base nacional.'
        const TEXTFIELD1_LABEL_CHASSI = 'Pesquisa por chassi na base nacional'
        const TEXTFIELD1_LABEL_MOTOR = 'Pesquisa por motor na base nacional'
        const TEXTFIELD1_LABEL_GRV = 'Pesquisa por GRV'

        switch ( SearchType )
        {
            case 1: return TEXTFIELD1_LABEL_PLATE
            case 2: return TEXTFIELD1_LABEL_CHASSI
            case 3: return TEXTFIELD1_LABEL_MOTOR
            case 4: return TEXTFIELD1_LABEL_GRV

            default: return TEXTFIELD1_LABEL
        }
    }

    return (
        <DrawerComponent
            history={ props.history }
            children={
                <div style={ styles.ScreenContainer }>

                    <div style={ { flex: 1, display: 'flex', maxHeight: '4rem', justifyContent: 'space-around' } }>
                        <Button style={ { flex: 0, display: 'flex' } } onClick={ () => { HandleSearchType( 1 ) } }>
                            <Typography style={ SearchType === 1 ? styles.SubTitleHeader : styles.BigBlackBoldText }>Placa</Typography>
                        </Button>
                        <Button style={ { flex: 0, display: 'flex' } } onClick={ () => { HandleSearchType( 2 ) } }>
                            <Typography style={ SearchType === 2 ? styles.SubTitleHeader : styles.BigBlackBoldText }>Chassi</Typography>
                        </Button>
                        <Button style={ { flex: 0, display: 'flex' } } onClick={ () => { HandleSearchType( 3 ) } }>
                            <Typography style={ SearchType === 3 ? styles.SubTitleHeader : styles.BigBlackBoldText }>Motor</Typography>
                        </Button>
                        <Button style={ { flex: 0, display: 'flex' } } onClick={ () => { HandleSearchType( 4 ) } }>
                            <Typography style={ SearchType === 4 ? styles.SubTitleHeader : styles.BigBlackBoldText }>GRV</Typography>
                        </Button>
                    </div>
                    <div style={ { flex: 1, display: 'flex', maxHeight: '4rem' } }>
                        <TextField
                            id={ TEXTFIELD_ID }
                            label={ returnPlaceHolder() }
                            variant={ TEXTFIELD_VARIANT }
                            value={ Query }
                            onChange={ e => setQuery( e.target.value ) }
                            style={ { display: 'flex', flex: 1, marginBottom: 5 } }
                        />
                        <Button
                            style={ { flex: 0, display: 'flex' } }
                            onClick={ SearchType ? GetVistoriasRealizadasPerBinParameter : GetVistoriasRealizadasPerParameter }>
                            <SearchIcon />
                        </Button>
                    </div>


                    <div style={ { flex: 0, display: 'flex', flexDirection: 'row', marginTop: 0 } }>

                        <div style={ { flex: 1, display: 'flex', flexDirection: 'column' } }>
                            { !!Vistorias && <Typography style={ styles.SubTitleHeader }>Vistorias realizadas ({ Object.keys( Vistorias ).length } de { Total }) </Typography> }

                            {
                                Object.keys( Vistorias ).length === 0 ?
                                    <ListEmptyComponent
                                        fullViewWidth={ true }
                                        iconType={ 4 }
                                        color={ Colors.Primary }
                                        text={ openBackground ? `Estamos procurando suas vistorias...` : `Não conseguimos encontrar suas vistorias finalizadas :( ` } />
                                    : Vistorias.map( item =>
                                    {
                                        return (
                                            <Slide
                                                style={{flex:1, display:'flex'}}
                                                direction="up" in={ true }
                                                mountOnEnter
                                                unmountOnExit
                                                key={ item.IdDispositivo }
                                                timeout={ { appear: 1500, enter: 1500, exit: 500 } }>
                                                <Paper elevation={ 0 } className={ classes.paper }>
                                                    <Card
                                                        className={ classes.root }
                                                        variant="outlined">


                                                        <CardContent style={ { alignItems: 'center', display: 'flex', flex: 0, justifyContent: 'flex-start' } }>
                                                            <ReceiptIcon style={ { color: Colors.Primary, marginRight: 5, fontSize: 30 } } />

                                                            <div style={ { flex: 1, display: 'flex', alignItems: 'center', } }>
                                                                <Typography style={ styles.BigBlackBoldText }>{ item.CodigoVistoria } - { item.PlacaChassiMotor }</Typography>
                                                            </div>
                                                            {
                                                                LoadingIds.filter( data => data.InspectionId === item.CodigoVistoria ).length > 0 &&
                                                                <CircularProgress color={ 'primary' } />
                                                            }
                                                        </CardContent>

                                                        <TableContainer component={ Paper }>
                                                            <Typography style={ styles.HeaderTitle }>{ item.NomeProduto }</Typography>
                                                            <Table className={ classes.table } size="small" aria-label="a dense table">
                                                                <TableHead>
                                                                    <TableRow>
                                                                        <TableCell style={ styles.BlackBoldText } align="center">Código</TableCell>
                                                                        <TableCell style={ styles.BlackBoldText } align="center">Entrada</TableCell>
                                                                        <TableCell style={ styles.BlackBoldText } align="center">Parâmetro</TableCell>
                                                                        {
                                                                            !isMobile &&
                                                                            <>
                                                                                <TableCell style={ styles.BlackBoldText } align="center">Modelo</TableCell>
                                                                                <TableCell style={ styles.BlackBoldText } align="center">Cor</TableCell>
                                                                                <TableCell style={ styles.BlackBoldText } align="center">Unidade</TableCell>
                                                                                <TableCell style={ styles.BlackBoldText } align="center">Examinador</TableCell>
                                                                                <TableCell style={ styles.BlackBoldText } align="center">Representante</TableCell>
                                                                                <TableCell style={ styles.BlackBoldText } align="center">Analista</TableCell>
                                                                            </>
                                                                        }
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    <TableCell style={ styles.BlackBoldText } align="center">{ item.CodigoVistoria }</TableCell>
                                                                    <TableCell style={ styles.BlackBoldText } align="center">{ FormatDate( item.DataVistoria ) }</TableCell>
                                                                    <TableCell style={ styles.BlackBoldText } align="center">{ item.PlacaChassiMotor }</TableCell>
                                                                    {
                                                                        !isMobile &&
                                                                        <>
                                                                            <TableCell style={ styles.BlackBoldText } align="center">{ item.ModeloVeiculo }</TableCell>
                                                                            <TableCell style={ styles.BlackBoldText } align="center">{ item.CorVeiculo }</TableCell>
                                                                            <TableCell style={ styles.BlackBoldText } align="center">{ item.NomeUVC }</TableCell>
                                                                            <TableCell style={ styles.BlackBoldText } align="center">{ GetFirstAndLastName( item.NomeExaminador ) }</TableCell>
                                                                            <TableCell style={ styles.BlackBoldText } align="center">{ item.NomeFranqueado }</TableCell>
                                                                            <TableCell style={ styles.BlackBoldText } align="center">{ GetFirstAndLastName( item.NomeAnalistaMesa ) }</TableCell>
                                                                        </>
                                                                    }
                                                                </TableBody>
                                                            </Table>
                                                        </TableContainer>

                                                        <CardActions style={ { flexDirection: 'row', justifyContent: 'space-between' } }>
                                                            <Button
                                                                onClick={ () => window.open( item.UrlPDFPesquisa, '_blank' ) }
                                                                style={ { backgroundColor: Colors.Secondary } }>
                                                                { !isMobile && <Typography style={ styles.WhiteBoldText }>Visualizar pesquisa</Typography> }
                                                                <FindInPageOutlinedIcon style={ { color: Colors.White } } />
                                                            </Button>
                                                            <Button
                                                                style={ { backgroundColor: Colors.Secondary } }
                                                                onClick={ () => { } }>
                                                                { !isMobile && <Typography style={ styles.WhiteBoldText }>Editar laudo</Typography> }
                                                                <EditOutlinedIcon style={ { color: Colors.White } } />
                                                            </Button>
                                                            <Button
                                                                style={ { backgroundColor: Colors.Secondary } }
                                                                onClick={ () => { } }>
                                                                { !isMobile && <Typography style={ styles.WhiteBoldText }>Visualizar laudo</Typography> }
                                                                <ReceiptIcon style={ { color: Colors.White } } />
                                                            </Button>
                                                            <Button
                                                                style={ { backgroundColor: Colors.Secondary } }
                                                                onClick={ () => { DownloadFile( `http://servicos.cauterfix.com/Laudo/ObterLaudoWeb/${ item.CodigoVistoria }`, item.PlacaChassiMotor, item.CodigoVistoria ) } }>
                                                                { !isMobile && <Typography style={ styles.WhiteBoldText }>Baixar laudo</Typography> }
                                                                <GetAppIcon style={ { color: Colors.White } } />
                                                            </Button>
                                                        </CardActions>

                                                    </Card>
                                                </Paper>
                                            </Slide>
                                        )
                                    } )
                            }

                            {
                                IsTabLoading
                                    ?
                                    <div>
                                        <LinearProgress
                                            style={ { backgroundColor: Colors.Primary } } color={ 'secondary' } />
                                    </div>
                                    :
                                    Object.keys( Vistorias ).length !== Total &&
                                    <Button style={ { width: '100%', backgroundColor: Colors.Primary } } onClick={ GetVistoriasRealizadas }>
                                        <Typography style={ styles.WhiteBoldText }>Ver mais</Typography>
                                    </Button>

                            }

                        </div>
                    </div>

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

                    <Modal
                        aria-labelledby="spring-modal-title"
                        aria-describedby="spring-modal-description"
                        style={ styles.ModalStyle }
                        open={ ModalVisibility }
                        onClose={ () => setModalVisibility( false ) }
                        closeAfterTransition>
                        <Fade in={ ModalVisibility }  >
                            <div style={ styles.ModalContainer }>
                                <Typography style={ styles.PrimaryBoldText }>Digite o Voucher para finalizar o pedido!</Typography>

                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="name"
                                    label=""
                                    name="name"
                                    style={ styles.VoucherTextField }
                                // onChange={ e => { setName( e.target.value ) } }
                                />

                                <Button style={ styles.CopyVoucherButton }> Confirmar</Button>
                            </div>
                        </Fade>
                    </Modal>
                </div>
            } />
    )
}

const styles = {
    ScreenContainer:
    {
        flex: 1
        , backgroundColor: Colors.White
        , flexDirection: 'column'
        , display: 'flex'
        , minHeight: '87vh'
    }
    , ModalContainer: {
        backgroundColor: Colors.White
        , display: 'flex'
        , flexDirection: 'column'
        , alignItems: 'center'
        , flex: 1
        , padding: '3%'
    }
    , OrangeBoldText: {
        color: Colors.Secondary,
        fontFamily: Fonts.Primary,
        fontSize: 14,
        fontWeight: 'bold'
    }
    , CopyVoucherButton: {
        backgroundColor: Colors.Secondary
        , marginTop: '1.5%'
        , color: Colors.White
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
        , fontSize: 14
        , color: Colors.White
        , fontWeight: 'bold'
    }
    , PrimaryBoldText: {
        fontFamily: Fonts.Primary
        , fontSize: 12
        , color: Colors.Secondary
        , fontWeight: 'bold'
    }
    , WhiteBoldTextWrap: {
        fontFamily: Fonts.Primary
        , fontSize: 12
        , color: Colors.White
        , fontWeight: 'bold'
        , whiteSpace: 'pre'

    }
    , BlackBoldText:
    {
        fontFamily: Fonts.Primary
        , fontSize: 12
        , color: Colors.Black
        , fontWeight: 'bold'
    }
    , BigBlackBoldText:
    {
        fontFamily: Fonts.Primary
        , fontSize: 15
        , color: Colors.Black
        , fontWeight: 'bold'
    }
    , GreenBoldText:
    {
        fontFamily: Fonts.Primary
        , fontSize: 12
        , color: Colors.Primary
        , fontWeight: 'bold'


    }
    , RedBoldText:
    {
        fontFamily: Fonts.Primary
        , fontSize: 12
        , color: Colors.Red
        , fontWeight: 'bold'


    }
    , LightRedBoldText:
    {
        fontFamily: Fonts.Primary
        , fontSize: 12
        , color: Colors.LightRed
        , fontWeight: 'bold'


    }
    , BlackBoldText:
    {
        fontFamily: Fonts.Primary
        , fontSize: 12
        , color: Colors.Black
        , fontWeight: 'bold'


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
    , SubTitleHeader: {
        fontFamily: Fonts.Primary,
        fontSize: 15,
        color: Colors.White,
        fontWeight: 'bold',
        textAlign: 'center',
        backgroundColor: Colors.Primary,
        margin: 5,
        padding: 3,
        borderRadius: 2




    }
    , SubTitleHeaderGreen: {
        fontFamily: Fonts.Primary,
        fontSize: 15,
        color: Colors.White,
        fontWeight: 'bold',
        textAlign: 'center',
        backgroundColor: Colors.Primary,
        margin: 5,
        padding: 3,
        borderRadius: 2
    }
    , SubTitleHeaderBlack: {
        fontFamily: Fonts.Primary,
        fontSize: 15,
        color: Colors.Primary,
        fontWeight: 'bold',
        textAlign: 'center',

        margin: 5,
        padding: 3,
        borderRadius: 2,
        flex: 0,
        display: 'flex'
    }
    , SubTitleHeaderRed: {
        fontFamily: Fonts.Primary,
        fontSize: 15,
        color: Colors.White,
        fontWeight: 'bold',
        textAlign: 'center',
        backgroundColor: Colors.Red,
        margin: 5,
        padding: 3,
        borderRadius: 2
    }
    , SubTitleHeaderLightRed: {
        fontFamily: Fonts.Primary,
        fontSize: 15,
        color: Colors.White,
        fontWeight: 'bold',
        textAlign: 'center',
        backgroundColor: Colors.LightRed,
        margin: 5,
        padding: 3,
        borderRadius: 2
    }
    , SubTitleHeaderBlack: {
        fontFamily: Fonts.Primary,
        fontSize: 15,
        color: Colors.White,
        fontWeight: 'bold',
        textAlign: 'center',
        backgroundColor: Colors.Black,
        margin: 5,
        padding: 3,
        borderRadius: 2,

    }
    , SubTitleHeaderOrange: {
        fontFamily: Fonts.Primary,
        fontSize: 15,
        color: Colors.White,
        fontWeight: 'bold',
        textAlign: 'center',
        backgroundColor: Colors.Orange,
        margin: 5,
        padding: 3,
        borderRadius: 2
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
        backgroundColor: Colors.Secondary,
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
        backgroundColor: Colors.Secondary,
        flex: 1
    }
    , TextField:
    {
        marginBottom: '3%'
        , fontFamily: Fonts.Primary
    }
    , ImageContainer: {
        display: 'flex',
        flex: 1,
        justifyContent: 'center'
    }
    , Image: {
        height: '30%',
        width: '30%',
        marginBottom: 10
    }
    , PrimaryInfo: {
        backgroundColor: Colors.Secondary,
        padding: 3,
        textAlign: 'center',
        color: Colors.White,
        borderRadius: 5,
        fontFamily: Fonts.Primary,
        fontWeight: 'bold'
    }
    , SecondaryInfo: {
        backgroundColor: Colors.Secondary,
        padding: 3,
        textAlign: 'center',
        color: Colors.White,
        borderRadius: 5,
        fontFamily: Fonts.Primary,
        fontWeight: 'bold'
    }
    , ThirdInfo: {
        fontFamily: Fonts.Primary
        , fontWeight: '500'
    }
    , HeaderTitle: {
        fontFamily: Fonts.Primary
        , fontSize: 14
        , borderRadius: 2
        , fontWeight: 'bold'
        , textAlign: 'center'
        , color: Colors.White
        , padding: 5
        , background: `linear-gradient(45deg, ${ Colors.Primary } 50%, ${ Colors.Primary } 50%)`
        , marginTop: 5
    }
    , RedHeaderTitle: {
        fontFamily: Fonts.Primary
        , fontSize: 14
        , borderRadius: 2
        , fontWeight: 'bold'
        , textAlign: 'center'
        , color: Colors.White
        , padding: 5
        , background: `linear-gradient(45deg, ${ Colors.Red } 50%, ${ Colors.Red } 50%)`
        , marginTop: 5
    }
    , LightRedHeaderTitle: {
        fontFamily: Fonts.Primary
        , fontSize: 14
        , borderRadius: 2
        , fontWeight: 'bold'
        , textAlign: 'center'
        , color: Colors.White
        , padding: 5
        , background: `linear-gradient(45deg, ${ Colors.LightRed } 50%, ${ Colors.LightRed } 50%)`
        , marginTop: 5
    }
    , BlackHeaderTitle: {
        fontFamily: Fonts.Primary
        , fontSize: 14
        , borderRadius: 2
        , fontWeight: 'bold'
        , textAlign: 'center'
        , color: Colors.White
        , padding: 5
        , background: `linear-gradient(45deg, ${ Colors.Black } 50%, ${ Colors.Black } 50%)`
        , marginTop: 5
        , width: '100%'
    }
    , OrangeHeaderTitle: {
        fontFamily: Fonts.Primary
        , fontSize: 14
        , borderRadius: 2
        , fontWeight: 'bold'
        , textAlign: 'center'
        , color: Colors.White
        , padding: 5
        , background: `linear-gradient(45deg, ${ Colors.Orange } 50%, ${ Colors.Orange } 50%)`
        , marginTop: 5
    }
    , CardActionsContainer: {
        alignItems: 'center'
        , justifyContent: 'space-between'
        , flex: 1
        , display: 'flex'
        , flexDirection: 'column'
    }
    , ModalStyle: {
        justifyContent: 'center'
        , alignItems: 'center'
        , padding: '5%'
        , borderRadius: 50
    }
    , VoucherTextField: {
        backgroundColor: Colors.White
        , borderRadius: 5
    }
    , CardActionText: {
        fontFamily: Fonts.Primary
    }
}

const useStyles = makeStyles( ( theme ) => ( {
    root: { flex: 1, display: 'flex', flexDirection: 'column', margin: 10, boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)' },
    media: { height: 0, paddingTop: '56.25%', },
    expandOpen: { transform: 'rotate(180deg)', },
    avatar: { backgroundColor: red[ 500 ], },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create( 'transform', { duration: theme.transitions.duration.shortest } ),
        borderLeftColor: Colors.Secondary, borderLeftWidth: 3
    },
    EditTexts: { marginLeft: '2%', flex: 0.8 }
    , JunoButton: {
        flex: 1,
        width: '100%'
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

    }
    , backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    }
    , EditButton: { fontFamily: Fonts.Primary, backgroundColor: Colors.White, minWidth: '2vw', minHeight: '2vw', borderRadius: 100 }
} ) )

