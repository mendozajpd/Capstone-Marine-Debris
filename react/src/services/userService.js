import axiosClient from './axios.config';

export const register = async (userData) => {
    try {
        const response = await axiosClient.post('/register', userData);
        return response.data;
    } catch (error) {
        console.error('Error during registration:', error);
        throw error;
    }
};

export const login = async (email, password) => {
    try {
        const response = await axiosClient.post('/login', { email, password });
        return response.data;
    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
};


export const getUsers = async () => {
    try {
        const response = await axiosClient.get('/users');
        return response.data;
    } catch (error) {
        console.error('Error during getting users:', error);
        throw error;
    }
}

export const getUsersInformation = async () => {
    try {
        const response = await axiosClient.get('/usersInformation');
        return response.data;
    } catch (error) {
        console.error('Error during getting users:', error);
        throw error;
    }
}

export const deleteUser = async (userId) => {
    try {
        const response = await axiosClient.delete(`/users/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error during deleting user:', error);
        throw error;
    }
}

export const updateUserInfo = async (userId, updatedUserData) => {
    try {
        const response = await axiosClient.put(`/usersInfo/${userId}`, updatedUserData);
        console.log('UPDATED', response);
        return response.data;
    } catch (error) {
        console.error('Error during updating user:', error);
        throw error;
    }
}