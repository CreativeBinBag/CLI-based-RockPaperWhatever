import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, useTheme} from '@mui/material';

const ConfirmDeleteDialog = ({ open, onClose, onConfirm }) => {
 
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
                <Typography>Are you sure you want to delete this item?</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}
                sx={{
              
                    fontWeight: "bold"

                }}
                >Cancel</Button>
                <Button 
                 sx={{
                   
                    fontWeight: "bold"

                }}
                onClick={onConfirm} 
                >Delete</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDeleteDialog;