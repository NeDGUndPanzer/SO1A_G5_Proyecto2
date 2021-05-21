import React, { useState } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from '@material-ui/core/Drawer';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
// import DeptMasInfec from '../Pyramid/depInfec'
// import CardMasInfectada from '../Card/masInfectada';
import StickyHeadTable from '../Table/tableRecop2';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
// import InfectadosPorEstado from '../Graph/InfectadosEstado';
// import InfectedType from '../Graph/TipoInfectados';
// import UltimosCasosRegistrados from '../Table/ultimosCasos';
// import RangoEdadesInfectados from '../GraphBar/EdadInfectados';
// import CardSystemMonitor from '../monitoreoServer/systemMonitor';
import PaisesMasVacunados from '../Table/paisesMasVacunados';
import VacunadosPorPais from '../Table/vacunadosPorPais';
import GenerosVacunadosPorPais from '../Graph/generosVacunados';
import UltimosVacunados from '../Table/ultimosVacunados';
import RangoEdades from '../Graph/rangoEdades';

const useStyles = makeStyles(() => ({
    drawerHeader: {
        display: 'flex',
        justifyContent: 'flex-end'
    },
    link: {
        textDecoration: 'none',
        color: "#f44336",
        fontWeight: 'bold',
    }, font: {

        textDecoration: 'none'
    }, title: {
        textAlign: "center",
        color: "#000"
    }

}));

const NavBar = () => {
    const classes = useStyles();
    const theme = useTheme();

    const [open, setOpen] = useState(false);

    const drawerOpen = () => {
        setOpen(true)
    }

    const drawerClose = () => {
        setOpen(false)
    }

    return (
        <div>
            <AppBar position='static'>
                <Toolbar variant='dense' style={{backgroundColor: '#000'}}>
                    <IconButton onClick={drawerOpen} edge='start'>
                        <MenuIcon style={{color: '#FFF'}} />
                    </IconButton>
                    <Typography variant='h6'>
                        COVID-19
                    </Typography>

                </Toolbar>
            </AppBar>
            
            <Router>
                <Drawer open={open}>
                    <div className={classes.drawerHeader}>
                        <IconButton onClick={drawerClose} edge='start' >
                            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                        </IconButton>
                    </div>
                    <List>
                        <Link to='datosRecopilados' className={classes.link}>
                            <ListItem button>
                                <ListItemText primary="Datos Recopilados" />
                            </ListItem>
                        </Link>
                        <Link to='paisesMasVacunados' className={classes.link}>
                            <ListItem button>
                                <ListItemText primary="Países Más Vacunados" />
                            </ListItem>
                        </Link>
                        <Link to='vacunadosPorPais' className={classes.link}>
                            <ListItem button>
                                <ListItemText primary="Personas vacunadas por país" />
                            </ListItem>
                        </Link>
                        <Link to='generosVacunadosPorPais' className={classes.link}>
                            <ListItem button>
                                <ListItemText primary="% Géneros Vacunados Por País" />
                            </ListItem>
                        </Link>
                        <Link to='ultimosVacunados' className={classes.link}>
                            <ListItem button>
                                <ListItemText primary="Últimos Vacunados Por País" />
                            </ListItem>
                        </Link>
                        <Link to='rangoEdades' className={classes.link}>
                            <ListItem button>
                                <ListItemText primary="Rango de Edades Por País" />
                            </ListItem>
                        </Link>
                    </List>
                </Drawer>
                <Switch>
                    <Route exact path='/'>
                        <h1 className={classes.title}>BIENVENIDO</h1>
                        <div align="center">
                            <img src="/corona2.jpeg" width="800" height="500" />
                        </div>
                    </Route>
                    <Route exact path='/datosRecopilados'>
                        <h1 className={classes.title}>Tabla de datos recopilados</h1>
                        <StickyHeadTable />
                    </Route>


                    <Route exact path='/paisesMasVacunados'>
                        <h1 className={classes.title}>10 Países Más Vacunados</h1>
                        <PaisesMasVacunados/>
                    </Route>
                    <Route exact path='/vacunadosPorPais'>
                        <h1 className={classes.title}>Personas Vacuandas Por País</h1>
                        <VacunadosPorPais/>
                    </Route>
                    <Route exact path='/generosVacunadosPorPais'>
                        <h1 className={classes.title}>Porcentaje De Géneros Vacuandos Por País</h1>
                        <GenerosVacunadosPorPais/>
                    </Route>
                    <Route exact path='/ultimosVacunados'>
                        <h1 className={classes.title}>Últimos 5 Vacunados Por País</h1>
                        <UltimosVacunados/>
                    </Route>
                    <Route exact path='/rangoEdades'>
                        <h1 className={classes.title}>Rango De Edades Por País</h1>
                        <RangoEdades/>
                    </Route>
                </Switch>
            </Router>
            
        </div>
    )
}


export default NavBar;