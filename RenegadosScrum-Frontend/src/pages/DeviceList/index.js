import { Backdrop, Button, Card, CardActions, CardContent, CircularProgress, IconButton, LinearProgress, Snackbar, TextField, Typography } from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import { cnpj } from 'cpf-cnpj-validator';
import React, { useEffect, useState } from 'react';
import 'react-awesome-slider/dist/styles.css';
import { animated, useSpring } from 'react-spring/web.cjs'; // web.cjs is required for IE 11 support
import { Colors } from "../../constants/Colors";
import { Fonts } from "../../constants/Fonts";
import { DrawerComponent } from '../../drawer/DrawerComponent';
import { ActivatePhoneAPI, DeactivatePhoneAPI, GetAllDevicesAPI, GetDeactivatedDevicesAPI, GetPesquisasComErroAPI, GetPesquisasPendentesAPI, GetVistoriasPendentesdeAnaliseAPI } from '../../services/Search';
import { GetFirstAndLastName } from '../../utils/StringUtils';
import { isMobile } from "../../utils/isMobile";
import DirectionsCarIcon from '@material-ui/icons/DirectionsCar';
import SearchIcon from '@material-ui/icons/Search';
import { FormatDate } from '../../utils/DateUtil';
import PhoneIphoneIcon from '@material-ui/icons/PhoneIphone';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Switch from '@material-ui/core/Switch';
import ListEmptyComponent from '../../components/ListEmptyComponent/ListEmptyComponent'
import Slide from '@material-ui/core/Slide';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { encrypt } from '../../crypto/crypto';
const TEXTFIELD_ID = "outlined-multiline-static"
const TEXTFIELD_VARIANT = "outlined"
const TEXTFIELD1_LABEL = "Pesquisa por parâmetro ou código (IdVistoria)"
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
            {children }
        </animated.div>
    );
} );

const SECONDS_TO_REFRESH = 60

export default function DeviceList ( props )
{
    const classes = useStyles();

    const [ Devices, setDevices ] = useState( [] )
    const [ Total, setTotal ] = useState( [] )
    const [ Page, setPage ] = useState( 0 )
    const [ IsTabLoading, setIsTabLoading ] = useState( false )

    //Screen        
    const [ openBackground, setOpenBackground ] = useState( false );
    const [ ShouldDisableButton, setShouldDisableButton ] = useState( false );
    const [ ModalVisibility, setModalVisibility ] = useState( false );
    const [ Query, setQuery ] = useState( '' );


    //Snackbar
    const [ state, setState ] = useState( { open: false, vertical: 'top', horizontal: 'center', } )
    const [ SnackMessage, setSnackMessage ] = useState( '' )
    const { vertical, horizontal, open } = state
    const handleClose = () => { setState( { ...state, open: false } ); }

    useEffect( () => { Mount( true ) }, [] )

    async function Mount ( ShowLoading = false )
    {
        if ( ShowLoading )
            setOpenBackground( true )

        await Promise.all( [ GetAllDevices() ] )
        setOpenBackground( false )
    }

    async function GetAllDevices ()
    {
        if ( IsTabLoading )
            return null

        if ( Object.keys( Devices ).length > 0 && Object.keys( Devices ).length === Total )
            return null

        setIsTabLoading( true )

        const response = await GetAllDevicesAPI( Page + 1 )

        if ( response !== undefined )
        {
            if ( response.Sucesso )
            {
                setDevices( [ ...Devices, ...response.Devices ] )
                setTotal( response.Total )
                setPage( Page + 1 )
            }
            else
            {
                ShowSnackBar( 'Não foi possível buscar dispositivos. Tente novamente.' )
            }
        }

        setIsTabLoading( false )
    }

    async function DeactivatePhone ( Id )
    {
        let encrypted = encrypt( Id )

        const response = await DeactivatePhoneAPI( encrypted )

        if ( response.Sucesso )
        {
            ShowSnackBar( 'Telefone desativado com sucesso.' )

            let oldDevices = Devices
            let newDevices = []

            oldDevices.forEach(item=>{
                if(item.IdDispositivo !== Id){
                    newDevices.push(item)
                }
            })

            setDevices(newDevices)
        }
        else
        {
            ShowSnackBar( 'Não foi possível desativar o telefone.' )
        }
    }

    function ShowSnackBar ( text, vertical = 'bottom', horizontal = "center" )
    {
        setSnackMessage( text );
        setState( { open: true, vertical, horizontal } )
    }


    return (
        <DrawerComponent
            history={ props.history }
            children={
                <div style={ styles.ScreenContainer }>

{/* 
                    <TextField
                        id={ TEXTFIELD_ID }
                        label={ TEXTFIELD1_LABEL }
                        variant={ TEXTFIELD_VARIANT }
                        value={ Query }
                        onChange={ e => setQuery( e.target.value ) }
                        style={ { display: 'flex', flex: 0, marginBottom: 5 } }
                    /> */}
                    <div style={ { flex: 0, display: 'flex', flexDirection: 'row', marginTop: 0 } }>

                        {/* Devices */ }
                        <div style={ { flex: 0, display: 'flex', flexDirection: 'column' } }>
                            { !!Devices && <Typography style={ styles.SubTitleHeaderLightGreen }>Dispositivs ativos ({ Object.keys( Devices ).length } de { Total }) </Typography> }
                            {
                                Object.keys( Devices ).length === 0 ?
                                    <ListEmptyComponent
                                        fullViewWidth={ true }
                                        iconType={ 3 }
                                        color={ Colors.LightGreen }
                                        text={ `Não existem dipositivos liberados.` } />
                                    : Devices.map( item =>
                                    {
                                        return (
                                            <Slide direction="right" in={ true } mountOnEnter unmountOnExit key={ item.IdDispositivo } timeout={ { appear: 1500, enter: 1500, exit: 500 } }>
                                                <Paper elevation={ 0 } className={ classes.paper }>
                                                    <Card
                                                        className={ classes.root }
                                                        variant="outlined">


                                                        <CardContent style={ { alignItems: 'center', display: 'flex', flex: 0, justifyContent: 'flex-start' } }>
                                                            <PhoneIphoneIcon style={ { color: Colors.LightGreen, marginRight: 5, fontSize: 30 } } />

                                                            <div style={ { flex: 1, display: 'flex', alignItems: 'center', } }>
                                                                <Typography style={ styles.BigBlackBoldText }>{ item.Modelo } - { item.NomeUsuario }</Typography>
                                                            </div>
                                                        </CardContent>

                                                        <TableContainer component={ Paper }>
                                                            <Typography style={ styles.LightGreenHeaderTitle }>{ item.NomeProduto }</Typography>
                                                            <Table className={ classes.table } size="small" aria-label="a dense table">
                                                                <TableHead>
                                                                    <TableRow>
                                                                        <TableCell style={ styles.BlackBoldText } align="center">Código</TableCell>
                                                                        <TableCell style={ styles.BlackBoldText } align="center">Sistema Operacinal</TableCell>
                                                                        <TableCell style={ styles.BlackBoldText } align="center">Modelo</TableCell>
                                                                        <TableCell style={ styles.BlackBoldText } align="center">Entrada</TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    <TableCell style={ styles.BlackBoldText } align="center">{ item.IdDispositivo }</TableCell>
                                                                    <TableCell style={ styles.BlackBoldText } align="center">{ item.SistemaOperacinal }</TableCell>
                                                                    <TableCell style={ styles.BlackBoldText } align="center">{ item.Modelo }</TableCell>
                                                                    <TableCell style={ styles.BlackBoldText } align="center">{ FormatDate( item.DataCadastro ) }</TableCell>
                                                                </TableBody>
                                                            </Table>
                                                        </TableContainer>

                                                        <CardActions style={ { flexDirection: 'row', justifyContent: 'space-between' } }>
                                                            <Button onClick={ () => DeactivatePhone( item.IdDispositivo ) }>
                                                                <Typography style={ styles.LightGreenBoldText }>Desativar Dispositivo</Typography>
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
                                            style={ { backgroundColor: Colors.LightGreen } } color={ 'secondary' } />
                                    </div>
                                    :
                                    Object.keys( Devices ).length !== Total &&
                                    <Button style={ { width: '100%', backgroundColor: Colors.LightGreen } } onClick={ GetAllDevices }>
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
    , LightGreenBoldText:
    {
        fontFamily: Fonts.Primary
        , fontSize: 12
        , color: Colors.LightGreen
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
        backgroundColor: Colors.Secondary,
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
    , SubTitleHeaderLightGreen: {
        fontFamily: Fonts.Primary,
        fontSize: 15,
        color: Colors.White,
        fontWeight: 'bold',
        textAlign: 'center',
        backgroundColor: Colors.LightGreen,
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
    , LightGreenHeaderTitle: {
        fontFamily: Fonts.Primary
        , fontSize: 14
        , borderRadius: 2
        , fontWeight: 'bold'
        , textAlign: 'center'
        , color: Colors.White
        , padding: 5
        , background: `linear-gradient(45deg, ${ Colors.LightGreen } 50%, ${ Colors.LightGreen } 50%)`
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
    root: { flex: 1, width: '96vw', display: 'flex', flexDirection: 'column', margin: 10, boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)' },
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

