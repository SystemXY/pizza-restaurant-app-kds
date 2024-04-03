import React from "react"
import {Button, Card, CardContent, Grid, Paper, Typography} from "@mui/material";
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import DoneIcon from '@mui/icons-material/Done';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

export const Order = () => {
    return (
        <Grid item md={3} lg={3} sm={3}>
            <Card variant={'outlined'}>
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item md={12} sm={12}>
                            <Paper variant={'outlined'}>
                                <Typography>HIGH</Typography>
                            </Paper>
                        </Grid>
                        <Grid item md={6} sm={6}>
                            <img width={'170px'} src={'./pizza.jpeg'} alt={''}/>
                        </Grid>
                        <Grid item md={6} sm={6}>
                            <Paper variant={'outlined'}>
                                <Typography>LARGE</Typography>
                                ----------------
                                <Typography>THIN</Typography>
                            </Paper>
                        </Grid>
                        <Grid item md={6} sm={6}>
                            <Paper variant={'outlined'}>
                                <Typography>- Extra Cheese</Typography>
                                <Typography>- No Onions</Typography>
                            </Paper>
                        </Grid>
                        <Grid item md={6} sm={6}>
                            <Paper variant={'outlined'}>
                                <Typography>1. Pepperoni</Typography>
                                <Typography>2. Mushrooms</Typography>
                            </Paper>
                        </Grid>
                        <Grid item md={12} sm={12}>
                            <Paper variant={'outlined'}>DINE IN</Paper>
                        </Grid>
                        <Grid item md={12} sm={12}>
                            <Paper variant={'outlined'}>15 minutes</Paper>
                        </Grid>
                        <Grid item md={12} sm={12}>
                            <PlayArrowIcon color={'primary'} sx={{fontSize: 40}}/>
                            <HourglassEmptyIcon color={'secondary'} sx={{fontSize: 40}}/>
                            <DoneIcon color={'success'} sx={{fontSize: 40}}/>
                        </Grid>
                        <Grid item md={12} sm={12}>
                            <Button variant={'contained'} fullWidth> Mark as Ready</Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Grid>
    )
}