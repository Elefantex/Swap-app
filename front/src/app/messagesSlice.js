import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;





export const getMessagesID = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/messages/${id}`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

export const fetchMessagesId = createAsyncThunk("messages/fetchMessagesId", async (id) => {
  const response = await getMessagesID(id);
  return response;
});

