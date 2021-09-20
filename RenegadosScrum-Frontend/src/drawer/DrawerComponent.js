//Externos
import { Avatar, Button, Slide, SvgIcon } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { AccountBalanceOutlined, Notifications, Work } from '@material-ui/icons';
import ApartmentIcon from '@material-ui/icons/Apartment';
import CancelPresentationIcon from '@material-ui/icons/CancelPresentation';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ComputerIcon from '@material-ui/icons/Computer';
import Edit from '@material-ui/icons/Edit';
import ExitToAppOutlined from '@material-ui/icons/ExitToAppOutlined';
import Home from '@material-ui/icons/Home';
import ListIcon from '@material-ui/icons/List';
import ListAltIcon from '@material-ui/icons/ListAlt';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import ShoppingCartTwoToneIcon from '@material-ui/icons/ShoppingCartTwoTone';
import clsx from 'clsx';
import React from 'react';
//Internos
import { Colors } from "../constants/Colors";
import { DefaultStyles } from '../constants/DefaultStyles';
import { Fonts } from "../constants/Fonts";
import { ReactComponent as CalendarIcon } from '../img/CalendarIcon.svg';
import { ReactComponent as CalendarIconInactive } from '../img/CalendarIconInactive.svg';
import { ReactComponent as DeliveryIcon } from '../img/DeliveryIcon.svg';
import { ReactComponent as DeliveryIconInactive } from '../img/DeliveryIconInactive.svg';
import { ReactComponent as LogoIcon } from '../img/Logo.svg';
import { ReactComponent as UserIcon } from '../img/UserIcon.svg';
import { ReactComponent as UserIconInactive } from '../img/UserIconInactive.svg';
import { getUserType, logout } from "../services/auth";
import { TypesPerfilUsuario } from '../utils/AppUtils';
import { useMobileListener } from '../utils/isMobile';
const drawerWidth = 225;
const LOGO_URL = 'http://www.ijobtech.com/images/ijoblogo02.png'


const DrawerItens = [
    { index: 0, name: "/", displayName: 'Início', IconType: 2 }
    , { index: 1, name: "/Reports", displayName: 'Relatórios', IconType: 4 }
    , { index: 2, name: "/Monitoring", displayName: 'Monitoramento', IconType: 7 }
    , { index: 3, name: "/ConfigureProduct", displayName: 'Configurar produtos', IconType: 10 }
    , { index: 4, name: "/InspectionList", displayName: 'Vistorias realizadas', IconType: 8 }
    , { index: 5, name: "/FranchiseeList", displayName: 'Representantes', IconType: 9 }
    , { index: 6, name: "/UnitList", displayName: 'Unidades', IconType: 9 }
    , { index: 7, name: "/UserList", displayName: 'Usuários', IconType: 12 }
]


const DrawerItensAdm = [
    { index: 0, name: "/", displayName: 'Início', IconType: 2 }
    , { index: 1, name: "/app", displayName: 'Produtos', IconType: 7 }
    , { index: 2, name: "/UserInfo", displayName: 'Meus dados', IconType: 1 }

    // => Telas exclusivas.
    , { index: 3, name: "/UnitList", displayName: 'Unidades', IconType: 8 }
    , { index: 4, name: "/UserList", displayName: 'Usuários', IconType: 8 }
]

const DrawerItensMesaAnalise = [
    { index: 1, name: "/app", displayName: 'Início', IconType: 2 }

    // => Telas exclusivas.
    //, { index: 3, name: '/UnitScheduleInfo', displayName: 'Mesa de análise', IconType: 7 }
    , { index: 4, name: "/InspectionList", displayName: 'Vistorias realizadas', IconType: 8 }
]

const ToolbarItens = [{

}]

export const DrawerComponent = ({ children, history, active = 0 }) => {
    const UseMobileInfo = useMobileListener()
    const classes = useStyles();
    const theme = useTheme();

    const [open, setOpen] = React.useState(false);
    const handleDrawerOpen = () => { setOpen(true) }
    const handleDrawerClose = () => { setOpen(false) }

    function handleLogout(e) {
        logout();
        history.push("/");
    }

    function HandleDrawerClick(item, index) {
        history.push(item.name)
    }

    const _returnIcon = (item) => {
        switch (item.IconType) {
            case 1:
                return <Edit color={'primary'} />
            case 2:
                return <Home color={'primary'} />
            case 3:
                return <AccountBalanceOutlined color={'primary'} />
            case 4:
                return <ListAltIcon color={'primary'} />
            case 5:
                return <Notifications color={'primary'} />
            case 6:
                return <Work color={'primary'} />
            case 7:
                return <ComputerIcon color={'primary'} />
            case 8:
                return <ListIcon color={'primary'} />
            case 9:
                return <ApartmentIcon color={'primary'} />
            case 10:
                return <ShoppingCartTwoToneIcon color={'primary'} />
            case 11:
                return <CancelPresentationIcon color={'primary'} />
            case 12:
                return <PersonAddIcon color={'primary'} />
        }
    }

    const ToolbarItens = [
        { index: 0, name: "/", displayName: 'Usuários', IconType: 1 }
        , { index: 1, name: "/", displayName: 'Agendamentos', IconType: 2 }
        , { index: 2, name: "/", displayName: 'Entregas', IconType: 3 }
    ]

    const returnSvgByType = (type, active = false) => {
        switch (type) {
            case 1:
                return (
                    <SvgIcon>
                        {
                            active
                                ? <UserIcon height={20} width={20} />
                                : <UserIconInactive height={20} width={20} />
                        }
                    </SvgIcon >
                )
            case 2:
                return (
                    <SvgIcon>
                        {
                            active
                                ? <CalendarIcon height={20} width={20} />
                                : <CalendarIconInactive height={20} width={20} />
                        }
                    </SvgIcon >
                )
            default:
                return (
                    <SvgIcon>
                        {
                            active
                                ? <DeliveryIcon height={20} width={20} />
                                : <DeliveryIconInactive height={20} width={20} />
                        }
                    </SvgIcon >
                )
        }
    }

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar position="fixed" className={clsx(classes.appBar, { [classes.appBarShift]: open })}>

                <Toolbar style={{ display: 'flex', justifyContent: 'space-around', }}>
                    {
                        !UseMobileInfo &&
                        <Slide
                            direction="right"
                            in={true}
                            mountOnEnter
                            unmountOnExit
                            timeout={{ appear: 1000, enter: 1000, exit: 1000 }}>
                            <LogoIcon height={70} width={70} />
                        </Slide>
                    }

                    {
                        ToolbarItens.map((item, index) => (
                            <div
                                key={item.index}
                                style={{ ...DefaultStyles.Flex, flex: 0, marginLeft: !UseMobileInfo ? 30 : 0, height: 70, justifyContent: 'space-between' }}>
                                <div style={{ ...DefaultStyles.Flex, alignItems: 'center', justifyContent: 'center' }}>
                                    <Button
                                        disableRipple
                                        disableFocusRipple
                                        style={{ ...DefaultStyles.FlexRow, flex: .09, height: 'inherit', opacity: 1, }}>
                                        {returnSvgByType(item.IconType, active === index)}
                                        {
                                            !UseMobileInfo
                                            &&
                                            <Slide
                                                direction="down"
                                                in={true}
                                                mountOnEnter
                                                unmountOnExit
                                                timeout={{ appear: 1000, enter: 1000, exit: 1000 }}>

                                                <Typography style={{ ...DefaultStyles.TitleText, fontSize: 14, paddingLeft: 5, color: active !== index ? Colors.SecondLightGray : Colors.Primary }}>{item.displayName}</Typography>
                                            </Slide>
                                        }

                                    </Button>
                                </div>
                                {
                                    active === index &&
                                    <Slide
                                        direction="right"
                                        in={true}
                                        mountOnEnter
                                        unmountOnExit
                                        timeout={{ appear: 1000, enter: 1000, exit: 1000 }}>
                                        <div style={{ height: 4, backgroundColor: Colors.Primary }} />
                                    </Slide>
                                }
                            </div>
                        ))}

                    {
                        !UseMobileInfo &&
                        <Slide
                            direction="left"
                            in={true}
                            mountOnEnter
                            unmountOnExit
                            timeout={{ appear: 1000, enter: 1000, exit: 1000 }}>

                            <div style={{ marginLeft: 'auto', ...DefaultStyles.FlexRow, flex: 0, alignItems: 'center', }}>
                                <Avatar alt="Remy Sharp" src="https://thispersondoesnotexist.com/image" />

                                <IconButton
                                    color="inherit"
                                    aria-label="open drawer"
                                    onClick={handleLogout}
                                    edge="start"
                                    className={clsx(classes.menuButtonRight)}>
                                    <ExitToAppOutlined />
                                </IconButton>
                            </div>
                        </Slide>
                    }

                </Toolbar>
            </AppBar>
            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="left"
                open={open}
                classes={{ paper: classes.drawerPaper, }}>

                <div className={classes.drawerList}>
                    <List>
                        {parseInt(getUserType()) === TypesPerfilUsuario.Cauterfix && DrawerItens.map((item, index) => (
                            <ListItem style={{ paddingTop: '10%' }} button key={item.displayName} onClick={() => HandleDrawerClick(item, index)}>
                                <ListItemIcon>{_returnIcon(item)}</ListItemIcon>
                                <Typography variant="caption" noWrap
                                    style={{ fontFamily: Fonts.Primary, color: Colors.Black, fontWeight: '500' }}>
                                    {item.displayName}</Typography>
                            </ListItem>
                        ))}

                        {parseInt(getUserType()) === TypesPerfilUsuario.UVC && DrawerItensAdm.map((item, index) => (
                            <ListItem button key={item.displayName} onClick={() => HandleDrawerClick(item, index)}>
                                <ListItemIcon>{_returnIcon(item)}</ListItemIcon>
                                <Typography
                                    variant="caption"
                                    noWrap
                                    style={{ fontFamily: Fonts.Primary, color: Colors.Black, fontWeight: '500' }}>
                                    {item.displayName}</Typography>
                            </ListItem>
                        ))}

                        {parseInt(getUserType()) === TypesPerfilUsuario.MesaAnalise && DrawerItensMesaAnalise.map((item, index) => (
                            <ListItem button key={item.displayName} onClick={() => HandleDrawerClick(item, index)}>
                                <ListItemIcon>{_returnIcon(item)}</ListItemIcon>
                                <Typography variant="caption" noWrap style={{ fontFamily: Fonts.Primary, color: Colors.Black, fontWeight: '500' }}>{item.displayName}</Typography>
                            </ListItem>
                        ))}

                        <Divider variant='fullWidth' style={{ marginTop: '5%', marginBottom: '3%' }} />
                        <ListItem button onClick={handleDrawerClose} >
                            <ListItemIcon>
                                <ChevronLeftIcon style={{ color: Colors.Primary }} />
                            </ListItemIcon>
                            <Typography variant="caption" noWrap style={{ fontFamily: Fonts.Primary, color: Colors.Black, fontWeight: '500' }}>Fechar menu</Typography>
                        </ListItem>
                    </List>
                </div>
                {/*  */}

                <div style={{ backgroundColor: Colors.White, flex: 1, display: 'flex', borderBottom: `solid 1px ${Colors.Primary}`, alignItems: 'center', justifyContent: 'center' }}>

                </div>

            </Drawer>
            <main className={clsx(classes.content, { [classes.contentShift]: open, })}>
                <div className={classes.drawerHeader} />
                {children}
            </main>


        </div >

    );
}

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        backgroundColor: Colors.White
    },
    menuButtonRight: {
        flex: 0,
        marginLeft: 'auto',
        color: Colors.Black
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        backgroundColor: Colors.White
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),


    },
    menuButton: {
        marginRight: theme.spacing(2),
        color: Colors.Black
    },
    hide: {
        display: 'none',

    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,

    },
    drawerPaper: {
        width: drawerWidth,
        backgroundColor: Colors.White
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 0),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    drawerList: {
        position: 'absolute',
    },
    Iconcolor: {
        backgroundColor: Colors.Primary
    },
    content: {
        flexGrow: 1,
        flex:1,
        padding: theme.spacing(0),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
        minHeight:`calc(100vh - ${30}px)`
        , backgroundColor: Colors.White
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
    Img: { opacity: 0, resizeMode: 'cover' }
}));
