import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, useTheme} from '@mui/material';
import { tokens } from '../../theme';

const ConfirmDeleteDialog = ({ open, onClose, onConfirm }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
                <Typography>Are you sure you want to delete this item?</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}
                sx={{
                    backgroundColor: colors.greenAccent[700],
                    color: colors.grey[200],
                    fontWeight: "bold"

                }}
                >Cancel</Button>
                <Button 
                 sx={{
                    backgroundColor: colors.redAccent[500],
                    color: colors.grey[200],
                    fontWeight: "bold"

                }}
                onClick={onConfirm} 
                >Delete</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDeleteDialog;