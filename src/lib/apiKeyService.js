import { supabase } from './supabaseClient';

export const fetchApiKeys = async () => {
    const { data, error } = await supabase.from('api_keys').select('*');
    if (error) throw new Error(error.message);
    return data;
};

export const createApiKey = async (key) => {
    const { data, error } = await supabase.from('api_keys').insert([key]);
    if (error) throw new Error(error.message);
    return data;
};

export const updateApiKey = async (id, key) => {
    const { data, error } = await supabase.from('api_keys').update(key).eq('id', id);
    if (error) throw new Error(error.message);
    return data;
};

export const deleteApiKey = async (id) => {
    const { data, error } = await supabase.from('api_keys').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return data;
}; 