import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const apiUrl = process.env.API_URL




export const getMessagesID = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3001/messages/${id}`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

export const fetchMessagesId = createAsyncThunk("messages/fetchMessagesId", async (id) => {
  const response = await getMessagesID(id);
  return response;
});

