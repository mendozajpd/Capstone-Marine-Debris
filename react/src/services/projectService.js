import axiosClient from './axios.config';

export const getAllProjects = async () => {
    try {
        const response = await axiosClient.get('/projects');
        return response;
    } catch (error) {
        console.error(error);
    }
}

export const getProjectsByPortfolioId = async (portfolioId) => {
    try {
        const response = await axiosClient.get(`/portfolios/${portfolioId}/projects`);
        return response;
    } catch (error) {
        console.error(error);
    }
}

export const getProjectByProjectId = async (projectID) => {
    try {
        const response = await axiosClient.get(`/project/${projectID}`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const getProjectsForAuthenticatedUser = async () => {
    try {
        const response = await axiosClient.get('/auth/projects', {
            headers: {
                'Authorization' : 'Bearer ' + localStorage.getItem('token')
            }
        });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const createProject = async (project) => {
    try {
        const response = await axiosClient.post('/projects', project, {
            headers: {
                'Authorization' : 'Bearer ' + localStorage.getItem('token'),
            }
        });
        return response.data.projectID;
    } catch (error) {
        console.error(error);
    }
}

export const updateProject = async (project) => {
    try {
        const response = await axiosClient.put('/projects', project);
        return response;
    } catch (error) {
        console.error(error);
    }
}

export const deleteProject = async (projectId) => {
    try {
        const response = await axiosClient.delete('/projects', { data: { id: projectId } });
        return response;
    } catch (error) {
        console.error(error);
    }
}