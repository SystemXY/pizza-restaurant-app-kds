import React from "react"
import {Button, Card, CardContent, Grid, Typography, Chip, Stack, Divider, Box} from "@mui/material";
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import DoneIcon from '@mui/icons-material/Done';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

export type OrderStatus = 'queued' | 'in_progress' | 'ready';

export interface OrderModel {
    id: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    size: 'SMALL' | 'MEDIUM' | 'LARGE';
    crust: 'THIN' | 'REGULAR' | 'DEEP DISH';
    modifications: string[];
    items: string[];
    serviceType: 'DINE IN' | 'TAKEOUT' | 'DELIVERY';
    etaMinutes: number;
    status: OrderStatus;
}

interface OrderProps {
    order: OrderModel;
    onAdvance: (id: string) => void;
}

const priorityColor: Record<OrderModel['priority'], 'default' | 'success' | 'warning' | 'error'> = {
    LOW: 'default',
    MEDIUM: 'warning',
    HIGH: 'error'
};

const statusLabel: Record<OrderStatus, string> = {
    queued: 'Queued',
    in_progress: 'In Progress',
    ready: 'Ready'
};

export const Order: React.FC<OrderProps> = ({ order, onAdvance }) => {
    const canAdvance = order.status !== 'ready';

    return (
            <Card variant="outlined" sx={{ borderRadius: 1.25 }}>
                <CardContent sx={{ p: 0.75 }}>
                    <Stack spacing={0.5}>
                        {/* Header */}
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Chip size="small" label={order.priority} color={priorityColor[order.priority]} variant="outlined" />
                            <Chip size="small" label={statusLabel[order.status]} color={order.status === 'ready' ? 'success' : order.status === 'in_progress' ? 'primary' : 'default'} />
                        </Stack>

                        {/* Main Info */}
                        <Typography sx={{ fontSize: 13, fontWeight: 700, lineHeight: 1.2 }}>
                            {order.size} • {order.crust}
                        </Typography>
                        <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>
                            {order.items.join(', ') || 'No items'}
                        </Typography>
                        {order.modifications.length > 0 && (
                            <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>
                                {order.modifications.map(m => `- ${m}`).join('  ')}
                            </Typography>
                        )}

                        <Divider flexItem sx={{ my: 0.4 }} />

                        {/* Meta */}
                        <Stack direction="row" spacing={0.5} useFlexGap flexWrap="wrap" alignItems="center">
                            <Chip size="small" variant="outlined" label={order.serviceType} />
                            <Chip size="small" variant="outlined" label={`${order.etaMinutes} min`} />
                            <Box sx={{ ml: 'auto' }}>
                                <PlayArrowIcon color={order.status === 'in_progress' ? 'primary' : 'disabled'} sx={{ fontSize: 14, mr: 0.25 }}/>
                                <HourglassEmptyIcon color={order.status === 'queued' ? 'secondary' : 'disabled'} sx={{ fontSize: 14, mr: 0.25 }}/>
                                <DoneIcon color={order.status === 'ready' ? 'success' : 'disabled'} sx={{ fontSize: 14 }}/>
                            </Box>
                        </Stack>

                        {/* Action */}
                        <Button size="small" variant="contained" fullWidth sx={{ py: 0.35 }} disabled={!canAdvance} onClick={() => onAdvance(order.id)}>
                            {order.status === 'queued' && 'Start'}
                            {order.status === 'in_progress' && 'Mark as Ready'}
                            {order.status === 'ready' && 'Ready'}
                        </Button>
                    </Stack>
                </CardContent>
            </Card>
    )
}