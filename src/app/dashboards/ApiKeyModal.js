import React from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';

const ApiKeyModal = ({ open, onClose, modalType, currentKey, setCurrentKey, saveApiKey, deleteApiKey, errors }) => {
    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', borderRadius: '12px', boxShadow: 24, p: 4 }}>
                <Typography variant="h6" component="h2">
                    {modalType === 'create' ? 'Create API Key' : modalType === 'edit' ? 'Edit API Key' : 'Delete API Key'}
                </Typography>
                {modalType !== 'delete' ? (
                    <Box>
                        <TextField
                            fullWidth
                            label="API Key Name"
                            value={currentKey.name}
                            onChange={(e) => setCurrentKey({ ...currentKey, name: e.target.value })}
                            error={!!errors.name}
                            helperText={errors.name}
                            sx={{ mt: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="API Key Value"
                            value={currentKey.value}
                            onChange={(e) => setCurrentKey({ ...currentKey, value: e.target.value })}
                            error={!!errors.value}
                            helperText={errors.value}
                            sx={{ mt: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Usage"
                            type="number"
                            value={currentKey.usage}
                            onChange={(e) => setCurrentKey({ ...currentKey, usage: parseInt(e.target.value, 10) })}
                            error={!!errors.usage}
                            helperText={errors.usage}
                            sx={{ mt: 2 }}
                        />
                    </Box>
                ) : (
                    <Typography sx={{ mt: 2 }}>Are you sure you want to delete this API key?</Typography>
                )}
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    {modalType !== 'delete' ? (
                        <Button variant="contained" color="primary" sx={{ mr: 1 }} onClick={saveApiKey}>Save</Button>
                    ) : (
                        <Button variant="contained" color="error" sx={{ mr: 1 }} onClick={deleteApiKey}>Delete</Button>
                    )}
                    <Button variant="outlined" onClick={onClose}>Cancel</Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default ApiKeyModal; 