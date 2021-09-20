import { Backdrop, Button, Card, CardActions, CardContent, CircularProgress, Snackbar, TextField, Typography } from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import CssBaseline from '@material-ui/core/CssBaseline';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import 'react-awesome-slider/dist/styles.css';
import { animated, useSpring } from 'react-spring/web.cjs'; // web.cjs is required for IE 11 support
import { Colors } from "../../constants/Colors";
import { Fonts } from "../../constants/Fonts";
import { CDX_ICON } from '../../utils/ExternalImages';
import { isMobile } from "../../utils/isMobile";

const LOGO_URL = 'https://i.imgur.com/8panx6E.jpg'


const Infos = [ {
    Titulo: 'Vistoria', Texto: `A vistoria cautelar automotiva surgiu da necessidade das lojas e concessionárias na hora da compra ou recebimento de um veículo, como parte do pagamento de seus clientes.
Antes esse tipo de laudo era usado somente pela polícia durante as Blits, para averiguar a procedência e possíveis adulterações de seus itens de identificação e danos estruturais que restrinjam a circulação de certos veículos.

Na vistoria cautelar são analisados:
- Documentação
- Histórico de procedência sobre antecedentes de leilões, Sinistros, Roubo e Furto etc… 
- Itens de identificação como padrão da numeração do Chassi, Motor, Câmbio, etiquetas, Gravação dos vidros e placa.
- Também são analisados todos os itens de sua estrutura como colunas, longarinas, assoalho e os itens de segurança obrigatórios.
Esse procedimento deve ser realizado antes da compra, para evitar possíveis problemas na hora da vistoria de transferência.

A vistoria de Transferência obrigatória por sua vez é realizada somente na hora de transferir o veículo de proprietário e se nessa hora for encontrado algo que bloquei o veículo, ou for constatado algum dano que comprometa a estrutura pode ser tarde de mais e o sonho da compra de um novo veículo pode se tornar um pesadelo.`
    , Icone: ''
}

    , { Titulo: 'Pesquisa', Texto: 'Com suporte 24 horas para você tirar as suas dúvidas. conta com o maior banco de dados privados de veículos automotores da América do Sul para garantir o sucesso de seus negócios com informações precisas e eficientes e cobertura nacional.Constantemente orientada para soluções inovadoras em informações cadastrais de veículos automotores e de pessoas físicas e jurídicas, Auto Cred Car vem, nos últimos anos, incorporando continuamente os mais avançados serviços de identificação e de autenticidade, proporcionando melhores condições de análise de informações veiculares.', Icone: '' }
    , { Titulo: 'Débitos', Texto: 'A CDX Express Services é uma empresa homologada pelo DENATRAN, autorizada a realizar parcelamento de débitos veiculares em até 12x no cartão de crédito. SETOR PÚBLICO: Débitos Cartoriais; Débitos Relativos aos Veículos; Débitos de Água; Débitos de Energia; Débitos da Secretária da Fazenda; Débitos de Conselho Profissional (anuidade); entre outros. SETOR PRIVADO: Comércio Varejista; Instituições de Ensino; Clínicas Médicas; Clínicas Odontológicas; Laboratórios; entre outros.', Icone: CDX_ICON, link: 'http://cdxexpress.com.br/' } ]

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



export default function InfoScreen ( props )
{
    const classes = useStyles();

    const Id = props.history.location.pathname.replace( '/InfoScreen:', '' )

    //Screen        
    const [ openBackground, setOpenBackground ] = React.useState( false );
    const [ ModalVisibility, setModalVisibility ] = React.useState( false );

    //Snackbar
    const [ state, setState ] = React.useState( { open: false, vertical: 'top', horizontal: 'center', } )
    const [ SnackMessage, setSnackMessage ] = React.useState( '' )
    const { vertical, horizontal, open } = state
    const handleClose = () => { setState( { ...state, open: false } ); }

    function ShowSnackBar ( text, vertical = 'bottom', horizontal = "center" )
    {
        setSnackMessage( text );
        setState( { open: true, vertical, horizontal } )
    }

    return (
        <div style={ styles.ScreenContainer }>
            <CssBaseline />
            <div style={ { alignItems: 'center', justifyContent: 'center', flex: 0, display: 'flex', flexDirection: 'column', backgroundColor: Colors.Primary, borderRadius: 5 } }>
                <img src={ LOGO_URL } style={ { height: '20rem', width: '20rem' } } />

            </div>
            <Card style={ { margin: '2%', backgroundColor: '#fff' } }>

                <div style={ { alignItems: 'center', justifyContent: 'center', flex: 1, display: 'flex', flexDirection: 'column', borderRadius: 5 } }>
                    <Typography style={ { fontFamily: Fonts.Primary, fontSize: 15, color: Colors.Primary, fontWeight: 'bold', margin: '1%' } } >{ Infos[ Id - 1 ].Titulo }</Typography>
                    {
                        Infos[ Id - 1 ].Icone.length > 0 &&
                        <img src={ Infos[ Id - 1 ].Icone } style={ { height: '5rem', width: isMobile ? '50%' : '10%' } } />
                    }
                </div>

                <CardContent>
                    <Typography style={ styles.TextoCompleto } >{ Infos[ Id - 1 ].Texto }</Typography>
                </CardContent>

                <CardActions>
                    {
                        Infos[ Id - 1 ].link &&
                        <Button onClick={ () => { window.open( Infos[ Id - 1 ].link, '_blank' ); } } style={ styles.BlackButton }> Simulação </Button>
                    }
                    <Button onClick={ () => { props.history.push( `` ) } } style={ styles.Button }> Retornar </Button>
                </CardActions>
            </Card>

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
                    </div>
                </Fade>
            </Modal>
        </div>
    )
}


const styles = {
    ScreenContainer:
    {
        flex: 1
        , backgroundColor: Colors.Primary
        , flexDirection: 'column'
        , display: 'flex'
        , minHeight: '100vh'

    }
    , Button: { display: 'flex', flex: 1, backgroundColor: Colors.Primary, fontFamily: Fonts.Primary, color: Colors.White }
    , TextoCompleto: { color: Colors.Primary, fontFamily: Fonts.Primary, textAlign: 'justify', padding: 5, fontWeight: '500', }
    , ModalContainer: {
        backgroundColor: Colors.White
        , display: 'flex'
        , flexDirection: 'column'
        , alignItems: 'center'
        , flex: 1
        , padding: '3%'
    }
    , OrangeBoldText: {
        color: Colors.Primary,
        fontFamily: Fonts.Primary,
        fontSize: 14,
        fontWeight: 'bold'
    }
    , CopyVoucherButton: {
        backgroundColor: Colors.White
        , padding: '0.5%'
        , color: Colors.Primary
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
        , color: Colors.Primary
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
        backgroundColor: Colors.Primary,
        padding: 3,
        textAlign: 'center',
        color: Colors.White,
        borderRadius: 5,
        fontFamily: Fonts.Primary,
        fontWeight: 'bold'
    }
    , SecondaryInfo: {
        backgroundColor: Colors.Primary,
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
        , borderRadius: 5
        , fontWeight: 'bold'
        , textAlign: 'center'
        , color: Colors.White
        , padding: 5
        , background: `linear-gradient(45deg, ${ Colors.Primary } 50%, ${ Colors.Primary } 50%)`
        , marginBottom: 10
    }
    , CardActionsContainer: {
        alignItems: 'center'
        , justifyContent: 'space-between'
        , flex: 1
        , display: 'flex'
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
    , BlackButton: {
        display: 'flex'
        ,flex: 1
        ,backgroundColor: Colors.Black
        , fontFamily: Fonts.Primary
        , color: Colors.White
        
    }
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

