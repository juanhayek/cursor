"use client";

import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, Box, Typography } from '@mui/material';
import { FaEdit, FaTrash, FaPlus, FaCopy } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchApiKeys, createApiKey, updateApiKey, deleteApiKey } from '../../lib/apiKeyService';
import ApiKeyModal from './ApiKeyModal';

const ApiKeysPage = () => {
    const [apiKeys, setApiKeys] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState('');
    const [currentKey, setCurrentKey] = useState({ id: null, name: '', value: '', usage: 0 });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const loadApiKeys = async () => {
            try {
                const keys = await fetchApiKeys();
                setApiKeys(keys);
            } catch (error) {
                console.error('Error fetching data:', error.message);
            }
        };
        loadApiKeys();
    }, []);

    const handleCreate = () => {
        setModalType('create');
        setCurrentKey({ id: null, name: '', value: '', usage: 0 });
        setErrors({});
        setIsModalOpen(true);
    };

    const handleEdit = (id) => {
        const keyToEdit = apiKeys.find(key => key.id === id);
        setCurrentKey(keyToEdit);
        setModalType('edit');
        setErrors({});
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        const keyToDelete = apiKeys.find(key => key.id === id);
        setCurrentKey(keyToDelete);
        setModalType('delete');
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setCurrentKey({ id: null, name: '', value: '', usage: 0 });
        setErrors({});
    };

    const validateFields = () => {
        const newErrors = {};
        if (!currentKey.name) newErrors.name = 'Name is required';
        if (!currentKey.value) newErrors.value = 'Value is required';
        if (currentKey.usage < 0) newErrors.usage = 'Usage cannot be negative';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const saveApiKey = async () => {
        if (!validateFields()) return;

        try {
            if (modalType === 'create') {
                await createApiKey({ name: currentKey.name, value: currentKey.value, usage: currentKey.usage });
                toast.success('API Key created successfully!');
            } else if (modalType === 'edit') {
                await updateApiKey(currentKey.id, { name: currentKey.name, value: currentKey.value, usage: currentKey.usage });
                toast.info('API Key updated successfully!');
            }
            const keys = await fetchApiKeys();
            setApiKeys(keys);
            handleClose();
        } catch (error) {
            console.error('Error saving API key:', error.message);
        }
    };

    const deleteApiKeyHandler = async () => {
        try {
            await deleteApiKey(currentKey.id);
            toast.error('API Key deleted successfully!');
            const keys = await fetchApiKeys();
            setApiKeys(keys);
            handleClose();
        } catch (error) {
            console.error('Error deleting API key:', error.message);
        }
    };

    const copyToClipboard = (value) => {
        navigator.clipboard.writeText(value).then(() => {
            toast.success('Copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy:', err);
        });
    };

    return (
        <Box sx={{ maxWidth: '900px', margin: '50px auto', padding: '20px', backgroundColor: '#f5f5f7', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
            <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <Typography variant="h5">API Keys</Typography>
                <Button variant="contained" color="primary" startIcon={<FaPlus />} onClick={handleCreate}>
                    Add Key
                </Button>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Usage</TableCell>
                            <TableCell>Value</TableCell>
                            <TableCell>Options</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {apiKeys.map((apiKey) => (
                            <TableRow key={apiKey.id}>
                                <TableCell>{apiKey.name}</TableCell>
                                <TableCell>{apiKey.usage}</TableCell>
                                <TableCell>{apiKey.value.slice(0, 2)}••••••••</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => copyToClipboard(apiKey.value)}><FaCopy /></IconButton>
                                    <IconButton onClick={() => handleEdit(apiKey.id)}><FaEdit /></IconButton>
                                    <IconButton onClick={() => handleDelete(apiKey.id)}><FaTrash /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <ApiKeyModal 
                open={isModalOpen} 
                onClose={handleClose} 
                modalType={modalType} 
                currentKey={currentKey} 
                setCurrentKey={setCurrentKey} 
                saveApiKey={saveApiKey} 
                deleteApiKey={deleteApiKeyHandler} 
                errors={errors} 
            />
        </Box>
    );
};

export default ApiKeysPage;
