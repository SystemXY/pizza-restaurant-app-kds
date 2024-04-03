import React from "react"
import {Order} from "../components/order";
import {Grid} from "@mui/material";

export const Orders = () => {
    return (
        <div>
            <Grid container spacing={2}>
                <Order/>
            </Grid>
        </div>
    )
}