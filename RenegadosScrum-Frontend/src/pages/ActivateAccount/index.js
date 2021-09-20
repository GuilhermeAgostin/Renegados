import { Backdrop, Button, CircularProgress, Snackbar, TextField, Typography } from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import CssBaseline from '@material-ui/core/CssBaseline';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment';
import React, { useEffect } from 'react';
import 'react-awesome-slider/dist/styles.css';
import { animated, useSpring } from 'react-spring/web.cjs'; // web.cjs is required for IE 11 support
import { Colors } from "../../constants/Colors";
import { Fonts } from "../../constants/Fonts";
//import { GetActivateAccountAPI } from '../../services/User';
import { isMobile } from "../../utils/isMobile";

const LOGO_URL = 'https://i.imgur.com/8panx6E.jpg'
const GET_USER_INFO_ERROR = "Ocorreu um erro ao tentar buscar por informações de seu usuário, tente novamente mais tarde."
const DATE_FORMAT = "DD/MM/YYYY HH:mm"
const SNACKBAR_VOUCHER_COPIED_TEXT = "Voucher copiado para área de transferência"
const FIRST_ACTION_TEXT = "Copiar Voucher"
const SECOND_ACTION_TEXT = "Finalizar agendamento"
const THIRD_ACTION_TEXT = "Link de pagamento"
const REMOVE_SCHEDULE_SUCCESS = 'Agendamento removido com sucesso'
const REMOVE_SCHEDULE_ERROR = 'Ocorreu um erro ao remover agendamento, tente novamente mais tarde'
const USER_ICON = 'https://image.flaticon.com/icons/png/128/2550/2550359.png'

const Fade = React.forwardRef(function Fade(props, ref) {
    const { in: open, children, onEnter, onExited, ...other } = props;
    const style = useSpring({
        from: { opacity: 0 },
        to: { opacity: open ? 1 : 0 },
        onStart: () => {
            if (open && onEnter) {
                onEnter();
            }
        },
        onRest: () => {
            if (!open && onExited) {
                onExited();
            }
        },
    });

    return (
        <animated.div ref={ref} style={style} {...other}>
            {children}
        </animated.div>
    );
});

export default function ActivateAccount(props) {
    const classes = useStyles();

    const IdCliente = props.history.location.pathname.replace('/ActivateAccount:', '')

    //Screen        
    const [openBackground, setOpenBackground] = React.useState(false);
    const [ShouldDisableButton, setShouldDisableButton] = React.useState(true);
    const [IsActive, setIsActive] = React.useState(false);
    const [ModalVisibility, setModalVisibility] = React.useState(false);
    const [Copied, setCopied] = React.useState(false);
    const [UserDetails, setUserDetails] = React.useState([]);

    //Snackbar
    const [state, setState] = React.useState({ open: false, vertical: 'top', horizontal: 'center', })
    const [SnackMessage, setSnackMessage] = React.useState('')
    const { vertical, horizontal, open } = state
    const handleClose = () => { setState({ ...state, open: false }); }

    useEffect(() => { Mount() }, [])

    async function Mount() {
        await Promise.all([ActivateAccount()])
    }

    async function ActivateAccount() {
        setOpenBackground(true)

        const response = await GetActivateAccountAPI(IdCliente, moment.utc().format("YYYY-MM-DDTHH:mm:ss"))

        if (response !== undefined) {
            if (response.Sucesso) {
                setIsActive(true)
            }
            else {
                ShowSnackBar(response.Erro)
            }
        }
        else {
            ShowSnackBar(GET_USER_INFO_ERROR)
        }

        setOpenBackground(false)
    }


    function ShowSnackBar(text, vertical = 'bottom', horizontal = "center") {
        setSnackMessage(text);
        setState({ open: true, vertical, horizontal })
    }


    return (
        <div style={styles.ScreenContainer}>


            <CssBaseline />

            <div style={{ alignItems: 'center', justifyContent: 'center', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <img src={LOGO_URL} style={{ height: '300px', width: '300px' }} />


                {IsActive
                    ? <Typography style={styles.HeaderTitle}>E-mail confirmado com sucesso!</Typography>
                    : <Typography style={styles.HeaderTitle}>Aguardando confirmação</Typography>
                }

                <Button
                    onClick={() => { props.history.push(`App`) }}
                    style={styles.CopyVoucherButton}> Retornar </Button>
            </div>

            <Snackbar
                anchorOrigin={{ vertical, horizontal }}
                open={open}
                onClose={handleClose}
                message={SnackMessage}
                key={vertical + horizontal}
            />

            <Backdrop className={classes.backdrop} open={openBackground}>
                <CircularProgress color="inherit" />
            </Backdrop>

            <Modal
                aria-labelledby="spring-modal-title"
                aria-describedby="spring-modal-description"
                style={styles.ModalStyle}
                open={ModalVisibility}
                onClose={() => setModalVisibility(false)}
                closeAfterTransition>
                <Fade in={ModalVisibility}  >
                    <div style={styles.ModalContainer}>
                        <Typography style={styles.PrimaryBoldText}>Digite o Voucher para finalizar o pedido!</Typography>

                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="name"
                            label=""
                            name="name"
                            style={styles.VoucherTextField}
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
        , background: `linear-gradient(45deg, ${Colors.Primary} 50%, ${Colors.Primary} 50%)`
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
}

const useStyles = makeStyles((theme) => ({
    root: { maxWidth: 400, minWidth: isMobile ? '100%' : 350 },
    media: { height: 0, paddingTop: '56.25%', },
    expandOpen: { transform: 'rotate(180deg)', },
    avatar: { backgroundColor: red[500], },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', { duration: theme.transitions.duration.shortest }),
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
}))

