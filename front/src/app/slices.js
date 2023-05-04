import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


export const getSwaps = async () => {
    try {
        const response = await axios.get(`http://localhost:3001/swaps`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
};
export const getNotes = async () => {
    try {
        const response = await axios.get(`http://localhost:3001/notes`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
};


export const getUsers = async () => {
    try {
        const response = await axios.get(`http://localhost3001/users`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

export const fetchUsersInfo = createAsyncThunk("users/getUsers", async () => {
    const response = await getUsers();
    return response;
});

export const getUsersLogin = async ({ crewcode, password }) => {
    try {
        const response = await axios.post(`http://localhost:3001/users/login`, { crewcode, password });
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

export const fetchUsersLogin = createAsyncThunk("users/getUsersLogin", async ({ crewcode, password }) => {
    const response = await getUsersLogin({ crewcode, password });
    return response
});
export const getUsersLoginRecover = async ({ crewcode,rank,email }) => {
    try {
        const response = await axios.post(`http://localhost:3001/users/loginRecover`, { crewcode,rank,email });
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

export const fetchUsersLoginRecover = createAsyncThunk("users/getUsersLoginRecover", async ({ crewcode,rank,email}) => {
    const response = await getUsersLoginRecover({ crewcode,rank,email});
    return response
});
export const getPasswordChangeCreate = async ({ _id,password}) => {
    try {
        const response = await axios.post(`http://localhost:3001/users/recoverPassword`, { _id,password});
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

export const fetchPasswordChangeCreate= createAsyncThunk("users/getPasswordChangeCreate", async ({ _id,password}) => {
    const response = await getPasswordChangeCreate({ _id,password});
    return response
});




export const getSwapsId = async (id) => {
    try {
        const response = await axios.get(`http://localhost:3001/swaps/${id}}`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

export const fetchSwapsId = createAsyncThunk("swaps/getSwapsId", async (id) => {
    const response = await getSwapsId(id);
    return response;
});

export const getSwapsDate = async (date) => {
    try {
        const response = await axios.get(`http://localhost:3001/swaps/${date}`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

export const fetchSwapsDate = createAsyncThunk("swaps/getSwapsDate", async (date) => {
    const response = await getSwapsDate(date);
    return response;
});
export const getNotesDate = async (date) => {
    try {
        const response = await axios.get(`http://localhost:3001/notes/${date}`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

export const fetchNotesDate = createAsyncThunk("notes/getNotesDate", async (date) => {
    const response = await getNotesDate(date);
    return response;
});




export const getConversation = async (id) => {
    try {
        const response = await axios.get(`http://localhost:3001/conversations/${id}`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

export const fetchConversation = createAsyncThunk("conversations/getConversation", async (id) => {
    const response = await getConversation(id);
    return response;
});




export const createUSer = async (userData) => {
    try {
        const response = await axios.post(`http://localhost:3001/users`, userData);
        return response.data;
    } catch (error) {
        if (error.response && error.response.status >= 400 && error.response.status < 500) {
            throw new Error(error.response.data.message);
        } else {
            console.error(error);
        }
    }
};

export const fetchUsers = createAsyncThunk("users/createUSer", async () => {
    const response = await createUSer();
    return response;
});

export const getInfoCrewcode = async (crewcode) => {
    try {
        const response = await axios.get(`http://localhost:3001/users?crewcode=${crewcode}`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

export const fetchInfoCrewcode = createAsyncThunk("users/getInfoCrewcode", async (crewcode) => {
    const response = await getInfoCrewcode(crewcode);
    return response;
});

export const createRequestSlice = async () => {
    try {
        const response = await axios.post(`http://localhost:3001/request`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

export const fetchRequest = createAsyncThunk("request/createRequestSlice", async () => {
    const response = await createRequestSlice();
    return response;
});
