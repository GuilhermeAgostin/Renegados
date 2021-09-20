//import { Button } from '@material-ui/core'
import { Slide, Card, InputAdornment, Button, SvgIcon, Grid, Checkbox, Avatar, colors } from '@material-ui/core'
import { Fonts } from "../../constants/Fonts";
import CssBaseline from '@material-ui/core/CssBaseline'
import Divider from '@material-ui/core/Divider'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import Stepper from '@material-ui/core/Stepper'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import React, { Fragment, useEffect } from 'react'
import { Colors } from '../../constants/Colors'
import { DefaultStyles } from '../../constants/DefaultStyles'
import { Metrics } from '../../constants/Metrics'
import { DrawerComponent } from '../../drawer/DrawerComponent'
import { useMobileListener } from '../../utils/isMobile'
import { Setup } from './Config/Setup'
import SearchIcon from "@material-ui/icons/Search";
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import { makeStyles, ThemeProvider, withStyles } from '@material-ui/core/styles';
import { ReactComponent as CrossIcon } from '../../img/CrossIcon.svg';
import { ReactComponent as EditIcon } from '../../img/EditIcon.svg';
import { ReactComponent as BinIcon } from '../../img/BinIcon.svg';
import { ReactComponent as CheckBoxIcon } from '../../img/CheckBoxIcon.svg';
import { ReactComponent as FilterIcon } from '../../img/FilterIcon.svg';
import { ReactComponent as CalendarIcon } from '../../img/CalendarIcon.svg';

import { DataGrid } from '@material-ui/data-grid';
import { FormatDate, FormatHour } from '../../utils/DateUtil';
import CircleChecked from '@material-ui/icons/CheckCircleOutline';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import CircleUnchecked from '@material-ui/icons/RadioButtonUnchecked';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import clsx from 'clsx';
import Input from '@material-ui/core/Input';
import Modal from '@material-ui/core/Modal';
import { ColorizeSharp } from '@material-ui/icons';
import InputLabel from '@material-ui/core/InputLabel';



import { animated, useSpring } from 'react-spring/web.cjs'; // web.cjs is required for IE 11 support


const rows = [
    { id: 1, Photo: '', Name: 'Leonardo Nazareno', User: 'anderson.mrt00', ID: 13, Profile: 'Transportador', Status: 'Ativo', CreationDate: FormatDate( '2021-08-03T10:21:28-03:00' ), Actions: 'Editar' },
    { id: 2, Photo: 'Lannister', Name: 'Cersei', User: 'transp.x00', ID: 13, Profile: 'Transportador', Status: 'Ativo', CreationDate: FormatDate( '2021-08-03T10:21:28-03:00' ), Actions: 'Editar' },
    { id: 3, Photo: 'Lannister', Name: 'Jaime', User: 'everton.fr01', ID: 13, Profile: 'Transportador', Status: 'Ativo', CreationDate: FormatDate( '2021-08-03T10:21:28-03:00' ), Actions: 'Editar' },
    { id: 4, Photo: 'Stark', Name: 'Arya', User: 'Matheus Nogueira', ID: 13, Profile: 'Transportador', Status: 'Inativo', CreationDate: FormatDate( '2021-08-03T10:21:28-03:00' ), Actions: 'Editar' },
    { id: 5, Photo: 'Targaryen', Name: 'Daenerys', User: 'julia.snt77', ID: 13, Profile: 'Transportador', Status: 'Ativo', CreationDate: FormatDate( '2021-08-03T10:21:28-03:00' ), Actions: 'Editar' },
    { id: 6, Photo: 'Melisandre', Name: 'Test', User: 'transp.y00', ID: 13, Profile: 'Transportador', Status: 'Ativo', CreationDate: FormatDate( '2021-08-03T10:21:28-03:00' ), Actions: 'Editar' },
    { id: 7, Photo: 'Clifford', Name: 'Ferrara', User: 'transp.z00', ID: 13, Profile: 'Transportador', Status: 'Ativo', CreationDate: FormatDate( '2021-08-03T10:21:28-03:00' ), Actions: 'Editar' },
    { id: 8, Photo: 'Frances', Name: 'Rossini', User: 'andre.slv20', ID: 13, Profile: 'Transportador', Status: 'Ativo', CreationDate: FormatDate( '2021-08-03T10:21:28-03:00' ), Actions: 'Editar' },
    { id: 9, Photo: 'Roxie', Name: 'Harvey', User: 'transp.a00', ID: 13, Profile: 'Transportador', Status: 'Ativo', CreationDate: FormatDate( '2021-08-03T10:21:28-03:00' ), Actions: 'Editar' },
];

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


const CssTextField = withStyles( {
    root: {
        '& label.Mui-focused': {
            color: Colors.Primary, // quando foca no textfield
            bordeRadius: '4px',
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: 'yellow',
            //bordeRadius: '4px',
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: '#F7F7FC',
                bordeRadius: '4px',
            },
            '&:hover fieldset': {
                //borderColor: 'yellow',
                //bordeRadius: '4px',
            },
            // '&.Mui-focused fieldset': {
            //     borderColor: 'yellow',
            //     //bordeRadius: '4px',
            // },
        },
    },
} )( TextField );





export default function UserListPage ( props )
{
    const UseMobileInfo = useMobileListener()
    const steps = Setup.Steps
    const InputArray = Setup.InputArray

    const InputExampleIconPosition = () => (
        <Input icon='users' iconPosition='left' placeholder='Search users...' />
    )
    //const classes = useStyles();

    const [ activeStep, setActiveStep ] = React.useState( 0 )
    const [ Search, setSearch ] = React.useState( '' )
    const [ skipped, setSkipped ] = React.useState( new Set() )
    const [ UserList, setUserList ] = React.useState( [] )
    const [ checked, setChecked ] = React.useState( false );
    const [ ClickButtonAdd, setClickButtonAdd ] = React.useState( 0 )
    const [ ClickButtonFilter, setClickButtonFilter ] = React.useState( 0 )
    const [ ColorButtonAdd, setColorButtonAdd ] = React.useState( '#FFFFFF' )
    const [ ColorButtonFilter, setColorButtonFilter ] = React.useState( '#FFFFFF' )
    const [ ColorIconAdd, setColorIconAdd ] = React.useState( Colors.Primary )
    const [ ColorIconFilter, setColorIconFilter ] = React.useState( Colors.Primary )
    const [ ModalVisibility, setModalVisibility ] = React.useState( false );
    const [ DataCriacao, setDataCriacao ] = React.useState( '' );
    const [ FocusInput, setFocusInput ] = React.useState( false );



    const handleChange = ( event ) =>
    {
        setChecked( event.target.checked );
    };

    useEffect( () => { Mount() }, [] )


    useEffect( () =>
    {
        console.log( UserList )
    }, [ UserList ] )


    useEffect( () =>
    {
        if ( ClickButtonAdd === 1 )
        {
            setColorIconAdd( Colors.White )
            setColorButtonAdd( Colors.Primary )
            //setColorButtonFilter(Colors.Primary)
        }
        else
        {
            setColorIconAdd( Colors.Primary )
            setColorButtonAdd( Colors.White )
            //setColorButtonFilter(Colors.White)
        }

        if ( ClickButtonFilter === 1 )
        {
            setColorIconFilter( Colors.White )
            setColorButtonFilter( Colors.Primary )
        }
        else
        {
            setColorIconFilter( Colors.Primary )
            setColorButtonFilter( Colors.White )
        }



    }, [ ClickButtonAdd, ClickButtonFilter, ModalVisibility ] )

    async function Mount ()
    {
        await Promise.all( [ setUserList( [] ), setUserList( rows ) ] )
    }


    function isStepOptional ( step )
    {
        return step === 1
    }

    function isStepSkipped ( step )
    {
        return skipped.has( step )
    }

    function handleReset ()
    {
        setActiveStep( 0 )
    }

    function handleNext ()
    {
        let newSkipped = skipped
        if ( isStepSkipped( activeStep ) )
        {
            newSkipped = new Set( newSkipped.values() )
            newSkipped.delete( activeStep )
        }

        setActiveStep( ( prevActiveStep ) => prevActiveStep + 1 )
        setSkipped( newSkipped )
    }

    function handleBack ()
    {
        setActiveStep( ( prevActiveStep ) => prevActiveStep - 1 )
    }

    function handleSkip ()
    {
        if ( !isStepOptional( activeStep ) )
        {
            // You probably want to guard against something like this,
            // it should never occur unless someone's actively trying to break something.
            throw new Error( "You can't skip a step that isn't optional." )
        }

        setActiveStep( ( prevActiveStep ) => prevActiveStep + 1 )
        setSkipped( ( prevSkipped ) =>
        {
            const newSkipped = new Set( prevSkipped.values() )
            newSkipped.add( activeStep )
            return newSkipped
        } )
    }



    function AddItem ( item )
    {
        setUserList( [ ...UserList.filter( f => f !== item ), item ] )
    }

    function RemoveItem ( item )
    {
        setUserList( UserList.filter( f => f !== item ) )
    }

    const handleOpen = () =>
    {
        setModalVisibility( true );
    };

    const handleClose = () =>
    {
        setModalVisibility( false );
    };





    return (
        <DrawerComponent
            history={ props.history }
            active={ 0 }
            children={
                <div style={ { ...DefaultStyles.Flex, backgroundColor: Colors.White } }>

                    <CssBaseline />

                    <Card>
                        <div style={ { margin: '3% 0 0 2%', display: 'flex', justifyContent: 'space-between' } }>
                            <Typography style={ { ...DefaultStyles.MediumTitleText } }>{ Setup.Strings.SUB_TITLE_TEXT }</Typography>

                            <div style={ { display: 'flex', marginRight: '1%', flex: .8, flexDirection: 'row', maxHeight: '40px', marginBottom: '1%', justifyContent: 'space-between' } }>

                                <Input
                                    startAdornment={ <SearchIcon position="start" style={ { margin: '3%', color: Colors.LightGray } }></SearchIcon> }
                                    disableUnderline="true"
                                    placeholder="Busque por nome"
                                    style={ { backgroundColor: '#F7F7FC', display: 'flex', flex: 1, marginRight: '1.5%', borderRadius: '4px' } }
                                />

                                <Button
                                    type="submit"
                                    variant="body2"
                                    fontFamily='Roboto'
                                    fullWidth
                                    variant="contained"
                                    size="small"
                                    startIcon={
                                        <div style={ { justifyContent: "center", alignItems: "center" } }>
                                            <CrossIcon style={ { marginRight: "10px", color: ColorIconAdd } } />
                                            <label
                                                fontFamily='Roboto' style={ { fontSize: '16px', justifyContent: "center", color: ClickButtonAdd === 1 ? Colors.White : Colors.Primary, textTransform: 'none' } }>
                                                Adicionar novo Usuário
                                            </label>

                                        </div>
                                    }
                                    onClick={ () => setModalVisibility( true ) }
                                    //onFocus={()=> setClickButton(1)}
                                    //onBlur={()=> setClickButton(0)}
                                    style={ { backgroundColor: ColorButtonAdd, borderColor: 'primary', border: '1px solid #02438E', maxWidth: '25%', marginRight: '1%', boxShadow: 'none' } }
                                >
                                </Button>

                                <Button
                                    type="submit"
                                    variant="body2"
                                    fontFamily='Roboto'
                                    fullWidth
                                    variant="contained"
                                    size="small"
                                    startIcon={
                                        <div style={ { justifyContent: "center", alignItems: "center" } }>

                                            <FilterIcon style={ { marginRight: "10px", color: ColorIconFilter } } />

                                            <label
                                                fontFamily='Roboto' style={ { fontSize: '16px', justifyContent: "center", color: ClickButtonFilter === 1 ? Colors.White : Colors.Primary, textTransform: 'none' } }>
                                                Filtrar
                                            </label>

                                        </div>
                                    }
                                    onFocus={ () => setClickButtonFilter( 1 ) }
                                    onBlur={ () => setClickButtonFilter( 0 ) }
                                    onClick={ () => setModalVisibility( true ) }
                                    style={ { backgroundColor: ColorButtonFilter, borderColor: 'primary', border: '1px solid #02438E', maxWidth: '15%', boxShadow: 'none' } }
                                >
                                </Button>

                            </div>
                        </div>

                        <div style={ { height: '100%', width: '100%', padding: '2%' } }>

                            <Grid container>

                                <Grid item xs={ 0 } style={ { textAlign: 'center', justifyContent: 'center', borderBottom: '1px solid #BDBDBD', width: '4%' } }>
                                    <Typography style={ { padding: '.5%', paddingLeft: '5px', fontWeight: 'bold', color: Colors.Primary, fontFamily: Fonts.Primary } }> * </Typography>

                                </Grid>

                                <Grid item xs={ 1 } style={ { textAlign: 'center', borderBottom: '1px solid #BDBDBD' } }>
                                    <Typography style={ { padding: '.5%', fontWeight: 'bold', color: Colors.Primary, fontFamily: Fonts.Primary } }>Foto</Typography>
                                </Grid>

                                <Grid item xs={ 3 } style={ { textAlign: 'left', borderBottom: '1px solid #BDBDBD' } }>
                                    <Typography style={ { padding: '.5%', fontWeight: 'bold', color: Colors.Primary, fontFamily: Fonts.Primary } }>Nome { <ExpandLessIcon style={ { width: '.8rem', height: '.8rem' } } /> }</Typography>

                                </Grid>

                                <Grid item xs={ 2 } style={ { textAlign: 'left', borderBottom: '1px solid #BDBDBD' } }>
                                    <Typography style={ { padding: '.5%', fontWeight: 'bold', color: Colors.Primary, fontFamily: Fonts.Primary } }> Usuário { <ExpandLessIcon style={ { width: '.8rem', height: '.8rem' } } /> }</Typography>

                                </Grid>

                                <Grid item xs={ 0 } style={ { textAlign: 'left', borderBottom: '1px solid #BDBDBD', width: '6%' } }>
                                    <Typography style={ { padding: '.5%', paddingBottom: 0, fontWeight: 'bold', color: Colors.Primary, fontFamily: Fonts.Primary } }>ID { <ExpandLessIcon style={ { width: '.8rem', height: '.8rem' } } /> }</Typography>

                                </Grid>

                                <Grid item xs={ 0 } style={ { textAlign: 'left', borderBottom: '1px solid #BDBDBD', width: '10%' } }>
                                    <Typography style={ { padding: '.5%', paddingBottom: 0, fontWeight: 'bold', color: Colors.Primary, fontFamily: Fonts.Primary } }>Perfil { <ExpandLessIcon style={ { width: '.8rem', height: '.8rem' } } /> }</Typography>

                                </Grid>

                                <Grid item xs={ 1 } style={ { textAlign: 'left', borderBottom: '1px solid #BDBDBD' } }>
                                    <Typography style={ { padding: '.5%', paddingBottom: 0, fontWeight: 'bold', color: Colors.Primary, fontFamily: Fonts.Primary } }>Status { <ExpandLessIcon style={ { width: '.8rem', height: '.8rem' } } /> }</Typography>

                                </Grid>

                                <Grid item xs={ 1 } style={ { textAlign: 'left', borderBottom: '1px solid #BDBDBD' } }>
                                    <Typography style={ { padding: '.5%', paddingBottom: 0, fontWeight: 'bold', color: Colors.Primary, fontFamily: Fonts.Primary } }>Dt. Criação{ <ExpandLessIcon style={ { width: '.8rem', height: '.8rem' } } /> }</Typography>

                                </Grid>

                                <Grid item xs={ 0 } style={ { textAlign: 'left', borderBottom: '1px solid #BDBDBD', width: '11.65%' } }>
                                    <Typography style={ { padding: '.5%', paddingBottom: 0, fontWeight: 'bold', color: Colors.Primary, fontFamily: Fonts.Primary } }>Ações</Typography>

                                </Grid>

                                {
                                    UserList.map( item =>
                                        <Fragment>

                                            <Grid item xs={ 0 } style={ { borderBottom: '1px solid #BDBDBD', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '4%' } }>
                                                {/* <Typography style={ { padding: '.5%', fontFamily: Fonts.Primary } }>{ item.Name }</Typography> */ }

                                                {/* <div style={ { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' } }> */ }
                                                <Checkbox
                                                    icon={ <CircleUnchecked style={ { color: Colors.LightGray } } /> }
                                                    checkedIcon={ <CheckBoxIcon style={ { color: Colors.Primary, width: '1.3rem', height: '1.3rem' } } /> }
                                                    name="foo"
                                                    ////defaultChecked={ !!UserList.find( f => f === item ) }
                                                    checked={ checked }
                                                    // //checked={ !!UserList.find( f => f === item ) } // existe dentro da lista  e a !! é para quando a variavel retornar o obj e realiza a verificacao para tranformar em true ou false
                                                    style={ { color: Colors.Primary } }
                                                    onChange={ handleChange }
                                                    // // onClick={ () => !!UserList.find( f => f === item )
                                                    // //     ? RemoveItem( item )
                                                    // //     : AddItem( item ) }
                                                    name="checkedA" />

                                                {/* </div> */ }
                                            </Grid>

                                            <Grid item xs={ 1 } style={ { borderBottom: '1px solid #BDBDBD', display: 'flex', justifyContent: 'center', alignItems: 'center' } }>
                                                <Typography style={ { padding: '.5%', fontFamily: Fonts.Primary, justifyContent: 'center', display: 'flex' } }>{ <Avatar alt="Remy Sharp" src="https://thispersondoesnotexist.com/image" /> }</Typography>
                                            </Grid>

                                            <Grid item xs={ 3 } style={ { borderBottom: '1px solid #BDBDBD', display: 'flex', justifyContent: 'left', alignItems: 'center' } }>
                                                <Typography style={ { padding: '.5%', fontFamily: Fonts.Primary, color: Colors.Gray } }> { item.Name } </Typography>
                                            </Grid>

                                            <Grid item xs={ 2 } style={ { borderBottom: '1px solid #BDBDBD', display: 'flex', justifyContent: 'left', alignItems: 'center' } }>
                                                <Typography style={ { padding: '.5%', fontFamily: Fonts.Primary, color: Colors.Gray } }> { item.User } </Typography>
                                            </Grid>

                                            <Grid item xs={ 0 } style={ { borderBottom: '1px solid #BDBDBD', width: '6%', display: 'flex', justifyContent: 'left', alignItems: 'center' } }>
                                                <Typography style={ { padding: '.5%', fontFamily: Fonts.Primary, color: Colors.Gray } }>{ item.ID } </Typography>
                                            </Grid>

                                            <Grid item xs={ 0 } style={ { borderBottom: '1px solid #BDBDBD', display: 'flex', justifyContent: 'left', alignItems: 'center', width: '10%' } }>
                                                <Typography style={ { padding: '.5%', fontFamily: Fonts.Primary, color: Colors.Gray } }>{ item.Profile } </Typography>
                                            </Grid>

                                            <Grid item xs={ 1 } style={ { borderBottom: '1px solid #BDBDBD', alignItems: 'center', display: 'flex', justifyContent: 'left' } }>

                                                <div style={ { borderRadius: '5px', flexDirection: 'row', display: 'flex', marginLeft: '3%', padding: '2.5%', flex: .8, justifyContent: 'center', backgroundColor: item.Status === 'Ativo' ? '#e3fdef' : '#FCE4E5' } }>

                                                    <FiberManualRecordIcon style={ { width: '15px', marginRight: '3%', color: item.Status === 'Ativo' ? '#72E727' : 'red' } } />
                                                    <Typography style={ { padding: '.5%', fontFamily: Fonts.Primary } }>{ item.Status } </Typography>

                                                </div>

                                            </Grid>

                                            <Grid item xs={ 1 } style={ { borderBottom: '1px solid #BDBDBD', justifyContent: 'left', alignItems: 'left', minHeight: '50px', direction: 'column' } }>
                                                <Typography style={ { padding: '.5%', fontFamily: Fonts.Primary, color: Colors.Gray } }>{ item.CreationDate.slice( 0, 10 ) } </Typography>
                                                <Typography style={ { padding: '.5%', fontFamily: Fonts.Primary, color: Colors.LightGray, fontSize: 15 } }>{ item.CreationDate.slice( 10, 19 ) } </Typography>
                                            </Grid>

                                            <Grid item xs={ 0 } style={ { justifyContent: 'space-between', display: 'flex', alignItems: 'center', borderBottom: '1px solid #BDBDBD', width: '10%' } }>

                                                <EditIcon />
                                                <VisibilityOutlinedIcon style={ { color: Colors.Gray } } />
                                                <BinIcon />

                                            </Grid>

                                        </Fragment>
                                    )

                                }
                            </Grid>
                        </div>



                    </Card>

                    <Modal
                        aria-labelledby="spring-modal-title"
                        aria-describedby="spring-modal-description"
                        style={ styles.ModalStyle }
                        open={ ModalVisibility }
                        onClose={ () => setModalVisibility( false ) }
                        closeAfterTransition>
                        <Fade in={ ModalVisibility }  >
                            <div style={ styles.ModalContainer }>
                                <div style={ { padding: '7%', alignItems: 'center' } }>
                                    <Typography style={ styles.PrimaryBoldText }>Filtrar</Typography>

                                    <TextField
                                        variant="standard"
                                        margin="normal"
                                        type="text"
                                        label="Nome"
                                        fullWidth
                                        id="name"
                                        name="name"
                                        style={ styles.VoucherTextField }
                                    // onChange={ e => { setName( e.target.value ) } }
                                    />

                                    <TextField
                                        variant="standard"
                                        type="text"
                                        size="small"
                                        margin="normal"
                                        label="Usuário"
                                        fullWidth
                                        id="user"
                                        name="usuario"
                                        style={ styles.VoucherTextField }
                                    // onChange={ e => { setName( e.target.value ) } }
                                    />

                                    <div style={ { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flex: 1 } }>
                                        <div style={ { maxWidth: '50%', marginTop: 0 } } >
                                            <TextField
                                                variant="standard"
                                                type="text"
                                                size="small"
                                                margin="normal"
                                                label="Id de"
                                                fullWidth
                                                id="idde"
                                                name="idde"
                                                style={ styles.VoucherTextField }
                                            // onChange={ e => { setName( e.target.value ) } }
                                            />
                                        </div>
                                        <div style={ { maxWidth: '50%' } } >
                                            <TextField
                                                variant="standard"
                                                type="text"
                                                size="small"
                                                margin="normal"
                                                label="Id até"
                                                fullWidth
                                                id="idate"
                                                name="idate"
                                                style={ styles.VoucherTextField }
                                            // onChange={ e => { setName( e.target.value ) } }
                                            />
                                        </div>
                                    </div>

                                    <TextField
                                        variant="standard"
                                        type="text"
                                        size="small"
                                        margin="normal"
                                        label="Perfil"
                                        fullWidth
                                        id="profile"
                                        name="perfil"
                                        style={ styles.VoucherTextField }
                                    // onChange={ e => { setName( e.target.value ) } }
                                    />

                                    <TextField
                                        variant="standard"
                                        type="text"
                                        size="small"
                                        margin="normal"
                                        label="Status"
                                        fullWidth
                                        id="status"
                                        name="status"
                                        style={ styles.VoucherTextField }
                                    // onChange={ e => { setName( e.target.value ) } }
                                    />

                                    <div style={ {
                                        marginTop: '6%', display: 'flex',
                                        flexDirection: 'column',
                                        minWidth: '350px',
                                    } }>

                                        {/* {FocusInput ?  <InputLabel for="password_field" 
                                       
                                       style={{color: Colors.Primary,
                                        webkitTransition: 'all .2s',
                                        transition: 'all .2s',
                                        fontSize: '13px'
                                                                        }}>Data de criação </InputLabel> : null }  */}
                                        {/* <Input
                                            startAdornment={ <CalendarIcon position="start" style={ { margin: '2.5%', color: Colors.Gray } }></CalendarIcon> }
                                            //disableUnderline="true"
                                            placeholder="Data de criação"
                                            onFocus={ () => setFocusInput( true ) }
                                            onBlur={ () => setFocusInput( false ) }
                                            input="Data de criação"
                                            style={ { display: 'flex', flex: 1, marginRight: '1.5%', width: '100%', marginBottom: '6%' } }
                                        >
                                            
                                        </Input> */}

                                        <input type="email" style={ {
                                            width: '100%',
                                            height: '56px',
                                            padding: '14px 16px 0 10px',
                                            outline: 0,
                                            border: '1px solid #ddd',
                                            borderRadius: '4px',
                                            background: '#fff',
                                            fontSize: '16px'
                                        } } />

                                        <label style={{position: relative}}>
                                            E-mail
                                        </label>




                                    </div>

                                    <Button
                                        type="submit"
                                        variant="body2"
                                        fontFamily='Roboto'
                                        fullWidth
                                        variant="contained"
                                        size="small"
                                        startIcon={
                                            <div style={ { justifyContent: "center", alignItems: "center" } }>

                                                <FilterIcon style={ { marginRight: "10px", color: Colors.White } } />

                                                <label
                                                    fontFamily='Roboto' style={ { fontSize: '16px', justifyContent: "center", color: Colors.White, textTransform: 'none' } }>
                                                    Filtrar
                                                </label>

                                            </div>
                                        }
                                        onFocus={ () => setClickButtonFilter( 1 ) }
                                        onBlur={ () => setClickButtonFilter( 0 ) }
                                        onClick={ () => setModalVisibility( true ) }
                                        style={ { backgroundColor: Colors.Primary, boxShadow: 'none' } }
                                    >
                                    </Button>

                                </div>

                            </div>
                        </Fade>
                    </Modal>

                </ div>

            } />
    )
}



const styles = {
    project: { flexGrow: 1 },
    NewUserContainer: {
        ...DefaultStyles.Flex
        , flexDirection: 'column'
        , paddingLeft: Metrics.MinMargin
        , paddingRight: Metrics.MinMargin
    },
    submit: {
        textTransform: "none",
        margin: '2 0 0 0',
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        widht: '5%',
    }
    , ModalContainer: {
        backgroundColor: Colors.White
        , direction: 'column'
        , alignItems: 'center'
        , padding: '3%'
    }

    , ModalStyle: {
        alignItems: 'center'
        , padding: '1%'
        , position: 'absolute'
        , width: '36%'
        , color: Colors.Primary
        , margin: 'auto'
        , minHeight: '583.48px'


    }

}