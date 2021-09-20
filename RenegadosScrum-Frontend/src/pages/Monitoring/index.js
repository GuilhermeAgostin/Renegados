import { Backdrop, Button, Card, CardActions, CardContent, CircularProgress, IconButton, Snackbar, TextField, Typography } from '@material-ui/core';
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
import { ActivatePhoneAPI, GetDeactivatedDevicesAPI, GetPesquisasComErroAPI, GetPesquisasPendentesAPI, GetVistoriasPendentesdeAnaliseAPI, LiberarPesquisaAPI } from '../../services/Search';
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

export default function Monitoring ( props )
{
    const classes = useStyles();

    const [ VistoriasPendentesdeAnalise, setVistoriasPendentesdeAnalise ] = useState( [] )
    const [ VistoriasEmAnalise, setVistoriasEmAnalise ] = useState( [] )
    const [ PesquisasPendentes, setPesquisasPendentes ] = useState( [] )
    const [ PesquisasComErro, setPesquisasComErro ] = useState( [] )
    const [ Devices, setDevices ] = useState( [] )

    //Screen        
    const [ openBackground, setOpenBackground ] = useState( false );
    const [ ShouldDisableButton, setShouldDisableButton ] = useState( false );
    const [ ModalVisibility, setModalVisibility ] = useState( false );
    const [ Query, setQuery ] = useState( '' );
    const [ Count, setCount ] = useState( SECONDS_TO_REFRESH );

    //Snackbar
    const [ state, setState ] = useState( { open: false, vertical: 'top', horizontal: 'center', } )
    const [ SnackMessage, setSnackMessage ] = useState( '' )
    const { vertical, horizontal, open } = state
    const handleClose = () => { setState( { ...state, open: false } ); }

    useEffect( () => { Mount( true ) }, [] )

    useEffect( () =>
    {
        const id = setTimeout( () =>
        {
            if ( Count > 0 )
            {
                DecreaseCounter()
            }
            else
            {
                Mount()
                setCount( SECONDS_TO_REFRESH )
            }
        }, 1000 )

        return () =>
        {
            clearTimeout( id )
        }
    }, [ Count ] )

    useEffect( () =>
    {
        if ( Query.length > 0 )
        {
            if ( Object.keys( VistoriasEmAnalise ).length > 0 )
            {

                let EmAnalise = VistoriasEmAnalise
                let NewEmAnalise = []

                EmAnalise.forEach( element =>
                {
                    if ( element.PlacaChassiMotor.toUpperCase().includes( Query.trim().toUpperCase() ) || element.IdVistoria.toString().includes( Query.trim() ) )
                        NewEmAnalise.push( element )
                } )

                setVistoriasEmAnalise( NewEmAnalise )
            }

            if ( Object.keys( VistoriasPendentesdeAnalise ).length > 0 )
            {
                let PendentesdeAnalise = VistoriasPendentesdeAnalise
                let NewPendentesdeAnalise = []

                PendentesdeAnalise.forEach( element =>
                {
                    if ( element.PlacaChassiMotor.toUpperCase().includes( Query.trim().toUpperCase() ) || element.IdVistoria.toString().includes( Query.trim() ) )
                        NewPendentesdeAnalise.push( element )
                } )

                setVistoriasPendentesdeAnalise( NewPendentesdeAnalise )
            }

            if ( Object.keys( PesquisasPendentes ).length > 0 )
            {

                let PesquisasPendentesOld = PesquisasPendentes
                let NewPesquisasPendentes = []

                PesquisasPendentesOld.forEach( element =>
                {
                    if ( element.PlacaChassiMotor.toUpperCase().includes( Query.trim().toUpperCase() ) || element.IdPesquisa.toString().includes( Query.trim() ) )
                        NewPesquisasPendentes.push( element )
                } )

                setPesquisasPendentes( NewPesquisasPendentes )
            }


            if ( Object.keys( PesquisasComErro ).length > 0 )
            {
                let PesquisasComErroOld = PesquisasComErro
                let NewPesquisasComErro = []

                PesquisasComErroOld.forEach( element =>
                {
                    if ( element.PlacaChassiMotor.toUpperCase().includes( Query.trim().toUpperCase() ) || element.IdPesquisa.toString().includes( Query.trim() ) )
                        NewPesquisasComErro.push( element )
                } )

                setPesquisasComErro( NewPesquisasComErro )
            }
        }
        else
        {
            Mount()
        }


    }, [ Query ] )

    async function Mount ( ShowLoading = false )
    {
        if ( ShowLoading )
            setOpenBackground( true )

        await Promise.all( [ GetPesquisasPendentes(), GetVistoriasPendentesdeAnalise(), GetPesquisasComErro(), GetDeactivatedDevices() ] )
        setOpenBackground( false )
    }

    async function GetPesquisasComErro ()
    {
        const response = await GetPesquisasComErroAPI()

        if ( response !== undefined )
        {
            if ( response.Sucesso )
            {

                if ( response.Pesquisas === null || Object.keys( response.Pesquisas ).length === 0 )
                    setPesquisasComErro( [] )
                else
                    setPesquisasComErro( response.Pesquisas )
            }
            else
            {
                ShowSnackBar( GET_USER_INFO_ERROR )
            }
        }
        else
        {
            ShowSnackBar( GET_USER_INFO_ERROR )
        }
    }

    async function GetPesquisasPendentes ()
    {
        const response = await GetPesquisasPendentesAPI()

        if ( response !== undefined )
        {
            if ( response.Sucesso )
            {
                if ( response.Pesquisas === null || Object.keys( response.Pesquisas ).length === 0 )
                    setPesquisasPendentes( [] )
                else
                    setPesquisasPendentes( response.Pesquisas )
            }
            else
            {
                ShowSnackBar( GET_USER_INFO_ERROR )
            }
        }
        else
        {
            ShowSnackBar( GET_USER_INFO_ERROR )
        }
    }

    async function GetVistoriasPendentesdeAnalise ()
    {
        const response = await GetVistoriasPendentesdeAnaliseAPI()

        if ( response !== undefined )
        {
            if ( response.Sucesso )
            {
                if ( response.Vistorias !== null && response.Vistorias.length > 0 )
                {

                    let All = response.Vistorias
                    let NewVistoriasPendentes = []
                    let NewVistoriasEmAnalise = []


                    All.forEach( element =>
                    {
                        if ( element.StatusMesaAnalise === 1 )
                            NewVistoriasPendentes.push( element )
                        else if ( element.StatusMesaAnalise === 2 )
                            NewVistoriasEmAnalise.push( element )
                    } )

                    setVistoriasPendentesdeAnalise( NewVistoriasPendentes )
                    setVistoriasEmAnalise( NewVistoriasEmAnalise )
                }
                else
                {
                    setVistoriasPendentesdeAnalise( [] )
                    setVistoriasEmAnalise( [] )
                }
            }
            else
            {
                ShowSnackBar( GET_USER_INFO_ERROR )
            }
        }
        else
        {
            ShowSnackBar( GET_USER_INFO_ERROR )
        }
    }

    async function GetDeactivatedDevices ()
    {
        const response = await GetDeactivatedDevicesAPI()

        if ( response !== undefined )
        {
            if ( response.Sucesso )
            {
                setDevices( response.Devices )
            }
            else
            {
                ShowSnackBar( GET_USER_INFO_ERROR )
            }
        }
        else
        {
            ShowSnackBar( GET_USER_INFO_ERROR )
        }
    }

    async function ActivatePhone ( Id )
    {
        let encrypted = encrypt( Id )
        const response = await ActivatePhoneAPI( encrypted )

        if ( response.Sucesso )
        {
            let oldDevices = Devices
            let newDevices = []

            oldDevices.forEach( item =>
            {
                if ( item.IdDispositivo !== Id )
                {
                    newDevices.push( item )
                }
            } )

            setDevices( newDevices )
        }
    }

    async function LiberarPesquisa ( Id )
    {
        const response = await LiberarPesquisaAPI( Id )

        if ( response !== undefined )
        {
            if ( response.Sucesso )
            {
                Mount()
            }
        }
    }

    function ShowSnackBar ( text, vertical = 'bottom', horizontal = "center" )
    {
        setSnackMessage( text );
        setState( { open: true, vertical, horizontal } )
    }

    function DecreaseCounter ()
    {
        setCount( Count - 1 )
    }

    const EmptyComponent = ( { text, color, iconType = 1 } ) =>
    {
        return (
            <Card
                className={ classes.root }
                variant="outlined">


                <CardContent style={ { alignItems: 'center', display: 'flex', flex: 0, justifyContent: 'flex-start' } }>
                    {
                        iconType === 1
                            ?
                            <DirectionsCarIcon style={ { color: color, marginRight: 5, fontSize: 30 } } />
                            : iconType == 2 ?
                                <SearchIcon style={ { color: color, marginRight: 5, fontSize: 30 } } />
                                :
                                <PhoneIphoneIcon style={ { color: color, marginRight: 5, fontSize: 30 } } />

                    }
                    <Typography style={ styles.BlackBoldText }>{ text }</Typography>
                </CardContent>
            </Card>
        )

    }

    return (
        <DrawerComponent
            history={ props.history }
            children={
                <div style={ styles.ScreenContainer }>

                    <Typography style={ styles.SubTitleHeaderBlack }>Próxima atualização em { Count } { Count === 1 ? 'segundo.' : 'segundos.' }</Typography>
                    <TextField
                        id={ TEXTFIELD_ID }
                        label={ TEXTFIELD1_LABEL }
                        variant={ TEXTFIELD_VARIANT }
                        value={ Query }
                        onChange={ e => setQuery( e.target.value ) }
                        style={ { display: 'flex', flex: 0, marginBottom: 5 } }
                    />
                    <div style={ { flex: 0, display: 'flex', flexDirection: 'row', marginTop: 0 } }>

                        {/* Vistorias pendentes de Análise */ }
                        <div style={ { flex: 0, display: 'flex', flexDirection: 'column' } }>
                            { !!VistoriasPendentesdeAnalise && <Typography style={ styles.SubTitleHeaderGreen }>{ `Novos veículos (${ Object.keys( VistoriasPendentesdeAnalise ).length })` }</Typography> }
                            {
                                Object.keys( VistoriasPendentesdeAnalise ).length === 0 ?
                                    <EmptyComponent color={ Colors.Primary } text={ `Não existem vistorias pendentes de análise` } />
                                    :
                                    VistoriasPendentesdeAnalise.map( item =>
                                    {
                                        return (
                                            <Slide direction="down" in={ true } mountOnEnter unmountOnExit key={ item.IdVistoria } timeout={ { appear: 1500, enter: 1500, exit: 500 } }>
                                                <Paper elevation={ 0 } className={ classes.paper }>
                                                    <Card
                                                        className={ classes.root }
                                                        variant="outlined">


                                                        <CardContent style={ { alignItems: 'center', display: 'flex', flex: 0, justifyContent: 'flex-start' } }>
                                                            <DirectionsCarIcon style={ { color: Colors.Primary, marginRight: 5, fontSize: 30 } } />

                                                            <div style={ { flex: 1, display: 'flex', alignItems: 'center', } }>
                                                                <Typography style={ styles.BigBlackBoldText }>{ item.PlacaChassiMotor }</Typography>
                                                            </div>
                                                        </CardContent>
                                                        <TableContainer component={ Paper }>
                                                            <Typography style={ styles.HeaderTitle }>{ item.NomeProduto }</Typography>
                                                            <Table className={ classes.table } size="small" aria-label="a dense table">
                                                                <TableHead>
                                                                    <TableRow>
                                                                        <TableCell style={ styles.BlackBoldText }>Código</TableCell>
                                                                        <TableCell style={ styles.BlackBoldText } align="center">Parâmetro</TableCell>
                                                                        <TableCell style={ styles.BlackBoldText } align="center">Entrada</TableCell>
                                                                        <TableCell style={ styles.BlackBoldText } align="center">Unidade</TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    <TableCell style={ styles.BlackBoldText } align="center">{ item.IdVistoria }</TableCell>
                                                                    <TableCell style={ styles.BlackBoldText } align="center">{ item.PlacaChassiMotor }</TableCell>
                                                                    <TableCell style={ styles.BlackBoldText } align="center">{ FormatDate( item.DataCadastro ) }</TableCell>
                                                                    <TableCell style={ styles.BlackBoldText } align="center">{ item.NomeUVC }</TableCell>
                                                                </TableBody>
                                                            </Table>
                                                        </TableContainer>

                                                        <Button style={ { flexDirection: 'column', backgroundColor: Colors.Primary, width: '100%' } }>
                                                            <CardActions >

                                                                <Typography style={ styles.WhiteBoldText }>Visualizar Vistoria</Typography>

                                                            </CardActions>
                                                        </Button>

                                                    </Card>
                                                </Paper>
                                            </Slide>
                                        )
                                    } )
                            }

                        </div>

                        {/* Vistorias em análise */ }
                        <div style={ { flex: 0, display: 'flex', flexDirection: 'column' } }>
                            { !!VistoriasEmAnalise && <Typography style={ styles.SubTitleHeaderOrange }>{ `Em análise (${ Object.keys( VistoriasEmAnalise ).length })` }</Typography> }
                            {
                                Object.keys( VistoriasEmAnalise ).length === 0 ?
                                    <EmptyComponent color={ Colors.Orange } text={ `Não existem vistorias em análise` } />
                                    :

                                    VistoriasEmAnalise.map( item =>
                                    {
                                        return (

                                            <Slide direction="up" in={ true } mountOnEnter unmountOnExit key={ item.IdVistoria } timeout={ { appear: 1500, enter: 1500, exit: 500 } }>
                                                <Paper elevation={ 0 } className={ classes.paper }>
                                                    <Card
                                                        className={ classes.root }
                                                        variant="outlined">


                                                        <CardContent style={ { alignItems: 'center', display: 'flex', flex: 0, justifyContent: 'flex-start' } }>
                                                            <DirectionsCarIcon style={ { color: Colors.Orange, marginRight: 5, fontSize: 30 } } />

                                                            <div style={ { flex: 1, display: 'flex', alignItems: 'center', } }>
                                                                <Typography style={ styles.BigBlackBoldText }>{ item.PlacaChassiMotor } - { item.NomeAnalistaAtual ?? GetFirstAndLastName( item.NomeAnalistaAtual ) }</Typography>
                                                            </div>
                                                        </CardContent>
                                                        <TableContainer component={ Paper }>
                                                            <Typography style={ styles.OrangeHeaderTitle }>{ item.NomeProduto }</Typography>
                                                            <Table className={ classes.table } size="small" aria-label="a dense table">
                                                                <TableHead>
                                                                    <TableRow>
                                                                        <TableCell style={ styles.BlackBoldText }>Código</TableCell>
                                                                        <TableCell style={ styles.BlackBoldText } align="center">Parâmetro</TableCell>
                                                                        <TableCell style={ styles.BlackBoldText } align="center">Entrada</TableCell>
                                                                        <TableCell style={ styles.BlackBoldText } align="center">Unidade</TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    <TableCell style={ styles.BlackBoldText } align="center">{ item.IdVistoria }</TableCell>
                                                                    <TableCell style={ styles.BlackBoldText } align="center">{ item.PlacaChassiMotor }</TableCell>
                                                                    <TableCell style={ styles.BlackBoldText } align="center">{ FormatDate( item.DataCadastro ) }</TableCell>
                                                                    <TableCell style={ styles.BlackBoldText } align="center">{ item.NomeUVC }</TableCell>
                                                                </TableBody>
                                                            </Table>
                                                        </TableContainer>

                                                        <Button style={ { flexDirection: 'column', backgroundColor: Colors.Orange, width: '100%', borderRadius: 5 } }>
                                                            <CardActions >

                                                                <Typography style={ styles.WhiteBoldText }>Visualizar Vistoria</Typography>

                                                            </CardActions>
                                                        </Button>

                                                    </Card>
                                                </Paper>
                                            </Slide>
                                        )
                                    } )
                            }

                        </div>

                        {/* Pesquisas pendentes */ }
                        <div style={ { flex: 0, display: 'flex', flexDirection: 'column' } }>
                            { !!PesquisasPendentes && <Typography style={ styles.SubTitleHeaderLightGreen }>Pesquisas Pendentes ({ Object.keys( PesquisasPendentes ).length }) </Typography> }
                            {
                                Object.keys( PesquisasPendentes ).length === 0 ?
                                    <EmptyComponent iconType={ 2 } color={ Colors.LightGreen } text={ `Não existem pesquisas pendentes` } /> :
                                    PesquisasPendentes.map( item =>
                                    {
                                        return (
                                            <Slide direction="right" in={ true } mountOnEnter unmountOnExit key={ item.IdPesquisa } timeout={ { appear: 1500, enter: 1500, exit: 500 } }>
                                                <Paper elevation={ 0 } className={ classes.paper }>
                                                    <Card
                                                        className={ classes.root }
                                                        variant="outlined">


                                                        <CardContent style={ { alignItems: 'center', display: 'flex', flex: 0, justifyContent: 'flex-start' } }>
                                                            <SearchIcon style={ { color: Colors.LightGreen, marginRight: 5, fontSize: 30 } } />

                                                            <div style={ { flex: 1, display: 'flex', alignItems: 'center', } }>
                                                                <Typography style={ styles.BigBlackBoldText }>{ item.PlacaChassiMotor }</Typography>
                                                            </div>
                                                        </CardContent>

                                                        <TableContainer component={ Paper }>
                                                            <Typography style={ styles.LightGreenHeaderTitle }>{ item.NomeProduto }</Typography>
                                                            <Table className={ classes.table } size="small" aria-label="a dense table">
                                                                <TableHead>
                                                                    <TableRow>
                                                                        <TableCell style={ styles.BlackBoldText }>Código</TableCell>
                                                                        <TableCell style={ styles.BlackBoldText } align="center">Parâmetro</TableCell>
                                                                        <TableCell style={ styles.BlackBoldText } align="center">Entrada</TableCell>

                                                                        <TableCell style={ styles.BlackBoldText } align="center">Solicitante</TableCell>
                                                                        <TableCell style={ styles.BlackBoldText } align="center">IdFornecedor</TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    <TableCell style={ styles.BlackBoldText } align="center">{ item.IdPesquisa }</TableCell>
                                                                    <TableCell style={ styles.BlackBoldText } align="center">{ item.PlacaChassiMotor }</TableCell>
                                                                    <TableCell style={ styles.BlackBoldText } align="center">{ FormatDate( item.DataSolicitada ) }</TableCell>

                                                                    <TableCell style={ styles.BlackBoldText } align="center">{ GetFirstAndLastName( item.Solicitante ) }</TableCell>
                                                                    <TableCell style={ styles.BlackBoldText } align="center">{ item.IdPesquisaFornecedor }</TableCell>
                                                                </TableBody>
                                                            </Table>
                                                        </TableContainer>

                                                        <CardActions style={ { flexDirection: 'row', justifyContent: 'space-between' } }>
                                                            {
                                                                item.UrlPesquisa !== null &&
                                                                <>
                                                                    <Button onClick={ () => window.open( item.UrlPesquisa, '_blank' ) }>
                                                                        <Typography style={ styles.LightGreenBoldText }>Visualizar pesquisa</Typography>
                                                                    </Button>
                                                                    <Button onClick={ () => LiberarPesquisa( item.IdPesquisa ) }>
                                                                        <Typography style={ styles.LightGreenBoldText }>Liberar pesquisa</Typography>
                                                                    </Button>
                                                                </>
                                                            }
                                                        </CardActions>

                                                    </Card>
                                                </Paper>
                                            </Slide>
                                        )
                                    } )
                            }

                        </div>

                        {/* Pesquisas com erro */ }
                        <div style={ { flex: 0, display: 'flex', flexDirection: 'column' } }>
                            { !!PesquisasComErro && <Typography style={ styles.SubTitleHeaderRed }>Pesquisas com erro ({ Object.keys( PesquisasComErro ).length }) </Typography> }
                            {
                                Object.keys( PesquisasComErro ).length === 0 ?
                                    <EmptyComponent iconType={ 2 } color={ Colors.Red } text={ `Não existem pesquisas com erro` } />
                                    : PesquisasComErro.map( item =>
                                    {
                                        return (
                                            <Slide direction="right" in={ true } mountOnEnter unmountOnExit key={ item.IdPesquisa } timeout={ { appear: 1500, enter: 1500, exit: 500 } }>
                                                <Paper elevation={ 0 } className={ classes.paper }>
                                                    <Card
                                                        className={ classes.root }
                                                        variant="outlined">


                                                        <CardContent style={ { alignItems: 'center', display: 'flex', flex: 0, justifyContent: 'flex-start' } }>
                                                            <SearchIcon style={ { color: Colors.Red, marginRight: 5, fontSize: 30 } } />

                                                            <div style={ { flex: 1, display: 'flex', alignItems: 'center', } }>
                                                                <Typography style={ styles.BigBlackBoldText }>{ item.PlacaChassiMotor }</Typography>
                                                            </div>
                                                        </CardContent>

                                                        <TableContainer component={ Paper }>
                                                            <Typography style={ styles.RedHeaderTitle }>{ item.NomeProduto }</Typography>
                                                            <Table className={ classes.table } size="small" aria-label="a dense table">
                                                                <TableHead>
                                                                    <TableRow>
                                                                        <TableCell style={ styles.BlackBoldText }>Código</TableCell>
                                                                        <TableCell style={ styles.BlackBoldText } align="center">Parâmetro</TableCell>
                                                                        <TableCell style={ styles.BlackBoldText } align="center">Entrada</TableCell>
                                                                        <TableCell style={ styles.BlackBoldText } align="center">Solicitante</TableCell>
                                                                        <TableCell style={ styles.BlackBoldText } align="center">IdFornecedor</TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    <TableCell style={ styles.BlackBoldText } align="center">{ item.IdPesquisa }</TableCell>
                                                                    <TableCell style={ styles.BlackBoldText } align="center">{ item.PlacaChassiMotor }</TableCell>
                                                                    <TableCell style={ styles.BlackBoldText } align="center">{ FormatDate( item.DataSolicitada ) }</TableCell>
                                                                    <TableCell style={ styles.BlackBoldText } align="center">{ GetFirstAndLastName( item.Solicitante ) }</TableCell>
                                                                    <TableCell style={ styles.BlackBoldText } align="center">{ item.IdPesquisaFornecedor }</TableCell>
                                                                </TableBody>
                                                            </Table>
                                                        </TableContainer>

                                                        <CardActions style={ { flexDirection: 'row', justifyContent: 'space-between' } }>
                                                            {
                                                                item.UrlPesquisa !== null &&
                                                                <>
                                                                    <Button onClick={ () => window.open( item.UrlPesquisa, '_blank' ) }>
                                                                        <Typography style={ styles.RedBoldText }>Visualizar pesquisa</Typography>
                                                                    </Button>
                                                                    <Button onClick={ () => LiberarPesquisa( item.IdPesquisa ) }>
                                                                        <Typography style={ styles.RedBoldText }>Liberar pesquisa</Typography>
                                                                    </Button>
                                                                </>
                                                            }
                                                        </CardActions>

                                                    </Card>
                                                </Paper>
                                            </Slide>
                                        )
                                    } )
                            }

                        </div>

                        {/* Devices */ }
                        <div style={ { flex: 0, display: 'flex', flexDirection: 'column' } }>
                            { !!Devices && <Typography style={ styles.SubTitleHeaderLightRed }>Permissões de uso do aplicativo ({ Object.keys( Devices ).length }) </Typography> }
                            {
                                Object.keys( Devices ).length === 0 ?
                                    <EmptyComponent iconType={ 3 } color={ Colors.LightRed } text={ `Não existem dipositivos a serem liberados` } />
                                    : Devices.map( item =>
                                    {
                                        return (
                                            <Slide direction="right" in={ true } mountOnEnter unmountOnExit key={ item.IdDispositivo } timeout={ { appear: 1500, enter: 1500, exit: 500 } }>
                                                <Paper elevation={ 0 } className={ classes.paper }>
                                                    <Card
                                                        className={ classes.root }
                                                        variant="outlined">


                                                        <CardContent style={ { alignItems: 'center', display: 'flex', flex: 0, justifyContent: 'flex-start' } }>
                                                            <PhoneIphoneIcon style={ { color: Colors.LightRed, marginRight: 5, fontSize: 30 } } />

                                                            <div style={ { flex: 1, display: 'flex', alignItems: 'center', } }>
                                                                <Typography style={ styles.BigBlackBoldText }>{ item.Modelo } - { item.NomeUsuario }</Typography>
                                                            </div>
                                                        </CardContent>

                                                        <TableContainer component={ Paper }>
                                                            <Typography style={ styles.LightRedHeaderTitle }>{ item.NomeProduto }</Typography>
                                                            <Table className={ classes.table } size="small" aria-label="a dense table">
                                                                <TableHead>
                                                                    <TableRow>
                                                                        <TableCell style={ styles.BlackBoldText }>Código</TableCell>
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
                                                            <Button onClick={ () => ActivatePhone( item.IdDispositivo ) }>
                                                                <Typography style={ styles.LightRedBoldText }>Liberar Dispositivo</Typography>
                                                            </Button>
                                                        </CardActions>

                                                    </Card>
                                                </Paper>
                                            </Slide>
                                        )
                                    } )
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
        , fontSize: 12
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
        borderRadius: 2
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
    root: { maxWidth: 600, minWidth: isMobile ? '100%' : 400, margin: 5, boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)' },
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

