import React from 'react';
import Box from '@material-ui/core/Box';
import DonaRam from './DonaRam';
import PoligRam from './PoligRam';
import TablaProcesos from './TablaProcesos';


export default function CardMasInfectada() {


    return (
        <div style={{ height: '100%', width: '100%', backgroundColor: "#grey.300 " }}>

            <Box display="flex" justifyContent="flex-start" m={1} p={1} bgcolor="#EA4700 ">
                <Box p={1} bgcolor="#EA4700">
                    <PoligRam />
                </Box>
                <Box p={1} bgcolor="#EA4700 ">
                    <h1 style={{ textAlign: "center", font: "Verdana", color: "#EA4700" }}>SASajajkjajsjsjskakakakalalalasjsjsjjsjs</h1>
                </Box>
                <Box p={1} bgcolor="#EA4700">
                    <h1 style={{ textAlign: "center", font: "Verdana", color: "#EA4700" }}>apapa</h1>
                </Box>
                <Box p={1} bgcolor="#EA4700">
                    <DonaRam />
                </Box>
            </Box>
            <Box display="flex" justifyContent="center" m={1} p={1} bgcolor="background.paper">
                <Box p={1} bgcolor="#EA4700"></Box>
                <Box p={1} bgcolor="#EA4700">
                    <TablaProcesos />
                </Box>
                <Box p={1} bgcolor="#EA4700"></Box>
            </Box>

        </div>
    );
}
