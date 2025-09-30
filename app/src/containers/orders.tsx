import React, { useEffect, useMemo, useState } from "react"
import {Order, OrderModel, OrderStatus} from "../components/order";
import {Alert, Grid, Snackbar, ToggleButton, ToggleButtonGroup, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Select, InputLabel, FormControl, Box, Typography} from "@mui/material";

const nextStatus = (status: OrderStatus): OrderStatus => {
    if (status === 'queued') return 'in_progress';
    if (status === 'in_progress') return 'ready';
    return 'ready';
}

const LS_KEY = 'kds_orders_v1';

type SortBy = 'none' | 'priority' | 'eta';

export const Orders: React.FC = () => {
    const [orders, setOrders] = useState<OrderModel[]>([
        {
            id: '1',
            priority: 'HIGH',
            size: 'LARGE',
            crust: 'THIN',
            modifications: ['Extra Cheese', 'No Onions'],
            items: ['Pepperoni', 'Mushrooms'],
            serviceType: 'DINE IN',
            etaMinutes: 15,
            status: 'queued'
        },
        {
            id: '2',
            priority: 'MEDIUM',
            size: 'MEDIUM',
            crust: 'REGULAR',
            modifications: ['Gluten Free'],
            items: ['Margherita'],
            serviceType: 'TAKEOUT',
            etaMinutes: 10,
            status: 'in_progress'
        },
        {
            id: '3',
            priority: 'LOW',
            size: 'SMALL',
            crust: 'DEEP DISH',
            modifications: [],
            items: ['Veggie Supreme'],
            serviceType: 'DELIVERY',
            etaMinutes: 25,
            status: 'ready'
        }
    ]);

    const [snackOpen, setSnackOpen] = useState(false);
    const [snackMsg, setSnackMsg] = useState<string>('');
    const [sortBy, setSortBy] = useState<SortBy>('none');
    const [newOpen, setNewOpen] = useState(false);
    const [newOrder, setNewOrder] = useState<Omit<OrderModel, 'id' | 'status'>>({
        priority: 'MEDIUM',
        size: 'MEDIUM',
        crust: 'REGULAR',
        modifications: [],
        items: [],
        serviceType: 'DINE IN',
        etaMinutes: 15,
    } as any);

    // Load from localStorage once
    useEffect(() => {
        try {
            const raw = localStorage.getItem(LS_KEY);
            if (raw) {
                const parsed = JSON.parse(raw) as OrderModel[];
                if (Array.isArray(parsed)) setOrders(parsed);
            }
        } catch {}
    }, []);

    // Persist to localStorage whenever orders change
    useEffect(() => {
        try {
            localStorage.setItem(LS_KEY, JSON.stringify(orders));
        } catch {}
    }, [orders]);

    const sortOrders = (arr: OrderModel[]) => {
        if (sortBy === 'none') return arr;
        const copy = [...arr];
        if (sortBy === 'priority') {
            const weight: Record<string, number> = { HIGH: 3, MEDIUM: 2, LOW: 1 };
            copy.sort((a, b) => weight[b.priority] - weight[a.priority]);
        } else if (sortBy === 'eta') {
            copy.sort((a, b) => a.etaMinutes - b.etaMinutes);
        }
        return copy;
    };

    const grouped = useMemo(() => ({
        queued: sortOrders(orders.filter(o => o.status === 'queued')),
        in_progress: sortOrders(orders.filter(o => o.status === 'in_progress')),
        ready: sortOrders(orders.filter(o => o.status === 'ready')),
    }), [orders, sortBy]);

    const playChime = () => {
        try {
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.type = 'sine';
            o.frequency.value = 880; // A5
            o.connect(g);
            g.connect(ctx.destination);
            const now = ctx.currentTime;
            g.gain.setValueAtTime(0.001, now);
            g.gain.exponentialRampToValueAtTime(0.2, now + 0.02);
            g.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
            o.start();
            o.stop(now + 0.3);
        } catch {}
    };

    const notifyReady = (id: string) => {
        const order = orders.find(o => o.id === id);
        const name = order ? `Order #${order.id}` : 'Order';
        setSnackMsg(`${name} is Ready`);
        setSnackOpen(true);
        playChime();
    };

    const handleAdvance = (id: string) => {
        setOrders(prev => prev.map(o => {
            if (o.id !== id) return o;
            const newStatus = nextStatus(o.status);
            // Trigger notification after state updates
            if (newStatus === 'ready' && o.status !== 'ready') {
                // defer notify to next tick to ensure state consistency
                setTimeout(() => notifyReady(id), 0);
            }
            return { ...o, status: newStatus };
        }));
    };

    const startAllQueued = () => {
        setOrders(prev => prev.map(o => o.status === 'queued' ? { ...o, status: 'in_progress' } : o));
    };

    const completeAllInProgress = () => {
        const idsToNotify: string[] = [];
        setOrders(prev => prev.map(o => {
            if (o.status === 'in_progress') { idsToNotify.push(o.id); return { ...o, status: 'ready' }; }
            return o;
        }));
        // notify for all completed
        setTimeout(() => idsToNotify.forEach(id => notifyReady(id)), 0);
    };

    const openNew = () => setNewOpen(true);
    const closeNew = () => setNewOpen(false);
    const submitNew = () => {
        const id = Date.now().toString();
        setOrders(prev => [{ id, status: 'queued', ...newOrder }, ...prev]);
        setNewOrder({
            priority: 'MEDIUM', size: 'MEDIUM', crust: 'REGULAR',
            modifications: [], items: [], serviceType: 'DINE IN', etaMinutes: 15,
        } as any);
        setNewOpen(false);
    };

    return (
        <div>
            <Grid container spacing={2} sx={{mb: 2}}>
                <Grid item xs={12} md={6}>
                    <ToggleButtonGroup exclusive value={sortBy} onChange={(_, v) => v && setSortBy(v)} size="small">
                        <ToggleButton value="none">No Sort</ToggleButton>
                        <ToggleButton value="priority">Sort by Priority</ToggleButton>
                        <ToggleButton value="eta">Sort by ETA</ToggleButton>
                    </ToggleButtonGroup>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Box display="flex" gap={1} justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
                        <Button variant="outlined" onClick={startAllQueued}>Start All Queued</Button>
                        <Button variant="outlined" onClick={completeAllInProgress}>Complete All In Progress</Button>
                        <Button variant="contained" onClick={openNew}>New Order</Button>
                    </Box>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    <Typography variant="h6" sx={{mb:1}}>Queued</Typography>
                        {grouped.queued.map(o => (
                            <Order key={o.id} order={o} onAdvance={handleAdvance} />
                        ))}
                </Grid>
                <Grid item xs={12} md={4}>
                    <Typography variant="h6" sx={{mb:1}}>In Progress</Typography>
                        {grouped.in_progress.map(o => (
                            <Order key={o.id} order={o} onAdvance={handleAdvance} />
                        ))}
                </Grid>
                <Grid item xs={12} md={4}>
                    <Typography variant="h6" sx={{mb:1}}>Ready</Typography>
                        {grouped.ready.map(o => (
                            <Order key={o.id} order={o} onAdvance={handleAdvance} />
                        ))}
                </Grid>
            </Grid>

            <Dialog open={newOpen} onClose={closeNew} fullWidth maxWidth="sm">
                <DialogTitle>New Order</DialogTitle>
                <DialogContent sx={{pt: 2}}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Priority</InputLabel>
                                <Select label="Priority" value={newOrder.priority}
                                        onChange={e => setNewOrder(o => ({...o, priority: e.target.value as any}))}>
                                    <MenuItem value="HIGH">HIGH</MenuItem>
                                    <MenuItem value="MEDIUM">MEDIUM</MenuItem>
                                    <MenuItem value="LOW">LOW</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Service</InputLabel>
                                <Select label="Service" value={newOrder.serviceType}
                                        onChange={e => setNewOrder(o => ({...o, serviceType: e.target.value as any}))}>
                                    <MenuItem value="DINE IN">DINE IN</MenuItem>
                                    <MenuItem value="TAKEOUT">TAKEOUT</MenuItem>
                                    <MenuItem value="DELIVERY">DELIVERY</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Size</InputLabel>
                                <Select label="Size" value={newOrder.size}
                                        onChange={e => setNewOrder(o => ({...o, size: e.target.value as any}))}>
                                    <MenuItem value="SMALL">SMALL</MenuItem>
                                    <MenuItem value="MEDIUM">MEDIUM</MenuItem>
                                    <MenuItem value="LARGE">LARGE</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Crust</InputLabel>
                                <Select label="Crust" value={newOrder.crust}
                                        onChange={e => setNewOrder(o => ({...o, crust: e.target.value as any}))}>
                                    <MenuItem value="THIN">THIN</MenuItem>
                                    <MenuItem value="REGULAR">REGULAR</MenuItem>
                                    <MenuItem value="DEEP DISH">DEEP DISH</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth size="small" label="Items (comma separated)"
                                       value={newOrder.items.join(', ')}
                                       onChange={e => setNewOrder(o => ({...o, items: e.target.value.split(',').map(s => s.trim()).filter(Boolean)}))}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth size="small" label="Modifications (comma separated)"
                                       value={newOrder.modifications.join(', ')}
                                       onChange={e => setNewOrder(o => ({...o, modifications: e.target.value.split(',').map(s => s.trim()).filter(Boolean)}))}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth size="small" type="number" label="ETA (minutes)" inputProps={{ min: 1 }}
                                       value={newOrder.etaMinutes}
                                       onChange={e => setNewOrder(o => ({...o, etaMinutes: Math.max(1, Number(e.target.value)||1)}))}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeNew}>Cancel</Button>
                    <Button variant="contained" onClick={submitNew}>Create</Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackOpen}
                autoHideDuration={2500}
                onClose={() => setSnackOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity="success" variant="filled" sx={{ width: '100%' }}>
                    {snackMsg}
                </Alert>
            </Snackbar>
        </div>
    )
}