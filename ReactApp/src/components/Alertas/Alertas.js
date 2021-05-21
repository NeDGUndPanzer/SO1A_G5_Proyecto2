import Alert from '@material-ui/lab/Alert';
import Collapse from '@material-ui/core/Collapse';
import Box from '@material-ui/core/Box';

export default function Alertas(data) {
    return (
        <Collapse in={data.bandera}>
            <Box p={1} >
                <Alert  variant="filled" severity={data.tipo}>
                    {data.mensaje}
                </Alert>
            </Box>
        </Collapse>
    );
};