import { Backdrop, Button, Card, CardActions, CardContent, CircularProgress, IconButton, Snackbar, TextField, Typography } from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import { Add, Edit, Delete } from '@material-ui/icons';
import React, { useEffect } from 'react';
import 'react-awesome-slider/dist/styles.css';
import { animated, useSpring } from 'react-spring/web.cjs'; // web.cjs is required for IE 11 support
import { Colors } from "../../constants/Colors";
import { Fonts } from "../../constants/Fonts";
import { decrypt } from '../../crypto/crypto';
import { DrawerComponent } from '../../drawer/DrawerComponent';
import { GetAllUnitsAPI, RemoveUnitAPI } from '../../services/Unit';
import { getUserType, getToken } from "../../services/auth";
import { isMobile } from "../../utils/isMobile";


const GET_USER_INFO_ERROR = "Ocorreu um erro ao tentar buscar por informações, tente novamente mais tarde."
const DATE_FORMAT = "DD/MM/YYYY HH:mm"

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

export default function UnitList(props) {
    const classes = useStyles();

    const [UnitList, setUnitList] = React.useState([]);
    const [Query, setQuery] = React.useState('');

    //Screen        
    const [openBackground, setOpenBackground] = React.useState(false);

    //Snackbar
    const [state, setState] = React.useState({ open: false, vertical: 'top', horizontal: 'center', })
    const [SnackMessage, setSnackMessage] = React.useState('')
    const { vertical, horizontal, open } = state
    const handleClose = () => { setState({ ...state, open: false }); }

    const userType = getUserType();

    if (userType != "1" && userType != "2" && userType != "3" && userType != "4" && userType != "7")
        props.history.push("/app");

    let idUsuario = 0;

    if (userType == "4")
        idUsuario = decrypt(getToken());

    useEffect(() => { Mount() }, [])

    useEffect(() => {
        if (Query.length > 0) {
            if (Object.keys(UnitList).length > 0) {
                let Units = UnitList;
                let NewUnitList = []

                Units.forEach(item => {
                    if (formatSearchValue(item.NomeFantasia).includes(formatSearchValue(Query)) ||
                        formatSearchValue(item.Franqueado).includes(formatSearchValue(Query)))
                        NewUnitList.push(item)
                })

                setUnitList(NewUnitList)
            }
        }
        else {
            Mount()
        }
    }, [Query])

    async function Mount() {
        await Promise.all([GetUnitList()])
    }

    async function GetUnitList() {
        if (openBackground) return null

        setOpenBackground(true)

        const response = await GetAllUnitsAPI(idUsuario)

        if (response !== undefined) {
            if (response.Sucesso) {
                setUnitList(response.UVCs);
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

    async function RemoveUnit(IdUnidade) {
        const response = await RemoveUnitAPI(IdUnidade, true, false);

        if (response !== undefined) {
            if (response.Sucesso) {
                GetUnitList();

                ShowSnackBar("Unidade removida com sucesso");
            }
            else {
                ShowSnackBar(response.Erro)
            }
        }
        else {
            ShowSnackBar(GET_USER_INFO_ERROR)
        }
    }

    function formatSearchValue(value) {
        value = value.toLowerCase().normalize("NFD").replace(/[^a-zA-Zs]/g, "");

        return value;
    }

    function ShowSnackBar(text, vertical = 'bottom', horizontal = "center") {
        setSnackMessage(text);
        setState({ open: true, vertical, horizontal })
    }

    return (
        <DrawerComponent
            history={props.history}
            children={
                <div style={styles.ScreenContainer}>
                    <Typography style={styles.HeaderTitle}>Lista de Unidades</Typography>

                    <div>
                        <Button
                            style={styles.AddButton}
                            onClick={() => props.history.push(`UnitInfo:0`)}
                        >
                            <Add color='secondary' />
                            Adicionar Unidade
                        </Button>
                    </div>

                    <div style={{ flexDirection: 'row', display: 'flex', flex: 0, alignItems: 'center' }}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            id="nome"
                            label="Pesquisar unidade por: Nome Fantasia ou Franqueadora"
                            name="nome"
                            type="text"
                            autoFocus
                            onChange={e => { setQuery(e.target.value) }}
                        />
                    </div>

                    {
                        UnitList.map(item => {
                            return (
                                <Card
                                    key={item.IdUvc.toString()}
                                    style={{ flex: 0, display: 'flex', marginBottom: 10 }}
                                    variant="outlined"
                                >
                                    <CardContent style={{ width: '80%' }}>
                                        <div style={{ display: 'flex' }}>
                                            <Typography style={styles.CompanyName}>{item.NomeFantasia}</Typography>
                                            <br />
                                            <Typography style={styles.CompanyName}>Franqueadora: {item.Franqueado}</Typography>
                                        </div>
                                    </CardContent>

                                    <CardActions style={{ marginLeft: 'auto' }}>
                                        <div style={styles.CardActionsContainer}>
                                            <Button
                                                size="small"
                                                style={styles.EditButton}
                                                onClick={() => props.history.push(`UnitInfo:${item.IdUvc}`)}
                                            >
                                                <Edit />
                                                Editar
                                            </Button>

                                            <Button
                                                size="small"
                                                style={styles.DeleteButton}
                                                onClick={() => RemoveUnit(item.IdUvc)}
                                            >
                                                <Delete />
                                                Excluir
                                            </Button>
                                        </div>
                                    </CardActions>
                                </Card>
                            )
                        })
                    }


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
    , TextField:
    {
        marginBottom: '3%'
        , fontFamily: Fonts.Primary
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
        , flex: 0
        , display: 'flex'
        , marginLeft: 'auto'
    }
    , CardActionText: {
        fontFamily: Fonts.Primary
        , color: Colors.Secondary
    },
    CompanyName: {
        fontFamily: Fonts.Primary,
        fontWeight: 'bold',
        backgroundColor: Colors.Primary,
        color: Colors.White,
        padding: 5,
        borderRadius: 5,
        marginRight: 5
    },
    AddButton: {
        background: Colors.Primary,
        color: Colors.White,
        fontFamily: Fonts.Primary,
        fontSize: 14,
        float: 'right'
    },
    EditButton: {
        background: Colors.Secondary,
        color: Colors.White,
        fontFamily: Fonts.Primary,
        fontSize: 14,
        float: 'right',
        marginRight: 10,
    },
    DeleteButton: {
        background: Colors.Red,
        color: Colors.White,
        fontFamily: Fonts.Primary,
        fontSize: 14,
        float: 'right'
    },
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

