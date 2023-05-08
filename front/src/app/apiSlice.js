import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
    tagTypes: ['Users'],
    endpoints: builder => ({
        getUsers: builder.query({
            query: () => 'users',
            providesTags: ['Users'],
        }),
        getUsersById: builder.query({
            query: (id) => `users/${id}`,
            providesTags: ['Users'],
        }),
        getCrewcodes: builder.query({
            query: () => 'crewcodes',
            providesTags: ['Users'],
            select: 'crewcode',
        }),
        createUser: builder.mutation({
            query: ({ email, password, rank, crewcode, part, roster }) => ({
                url: 'users',
                method: 'POST',
                body: { email, password, rank, crewcode, part, roster },
            }),
            invalidatesTags: ['Users'],
            onError: (error, variables, context) => {
                console.error(error);
                throw new Error('Failed to create user');
            },
        }),
        deleteUser: builder.mutation({
            query: (id) => ({
                url: `users/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Users'],
        }),
        updateUser: builder.mutation({
            query: ({ id, rank, roster, part, password }) => ({
                url: `users/${id}`,
                method: 'PUT',
                body: { rank, roster, part, password },
            }),
            invalidatesTags: ['Users'],
        }),
        updateUserPassword: builder.mutation({
            query: ({ id, crewcode, password }) => ({
                url: `users/${id}`,
                method: 'PUT',
                body: { id, crewcode, password },
            }),
            invalidatesTags: ['Users'],
        }),
        createSwap: builder.mutation({
            query: ({ tipoSwap, date, inicio, fin, razon, rank, crewcode, roster, userId }) => ({
                url: 'swaps',
                method: 'POST',
                body: { tipoSwap, date, inicio, fin, razon, rank, crewcode, roster, userId },
            }),
            invalidatesTags: ['Users'],
        }),
        createNote: builder.mutation({
            query: ({ date, inicio, fin, razon, crewcode, userId, requested, denied }) => ({
                url: 'notes',
                method: 'POST',
                body: { date, inicio, fin, razon, crewcode, userId, requested, denied },
            }),
            invalidatesTags: ['Users'],
        }),
        updateNoteRequired: builder.mutation({
            query: ({ id, requested,denied }) => ({
                url: `notes/${id}/requested`,
                method: 'PUT',
                body: { requested,denied },
            }),
            invalidatesTags: ['Users'],
        }),
        updateNoteDenied: builder.mutation({
            query: ({ id,denied,requested }) => ({
                url: `notes/${id}/denied`,
                method: 'PUT',
                body: { denied,requested },
            }),
            invalidatesTags: ['Users'],
        }),
        deleteSwap: builder.mutation({
            query: ({ id }) => ({
                url: `swaps/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Users'],
        }),
        deleteNote: builder.mutation({
            query: ({ id }) => ({
                url: `notes/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Users'],
        }),
        getSwaps: builder.query({
            query: () => 'swaps',
            providesTags: ['Swaps'],
        }),
        getSwapsDate: builder.query({
            query: (date) => `swaps/${date}`,
            providesTags: ['Swaps'],
        }),
        getNotesDate: builder.query({
            query: (date) => `notes/${date}`,
            providesTags: ['Swaps'],
        }),
        createConversation: builder.mutation({
            query: ({ senderId, receiverId }) => ({
                url: 'conversations',
                method: 'POST',
                body: { senderId, receiverId },
            }),
            invalidatesTags: ['Messages'],
        }),
        getConversations: builder.query({
            query: (id) => `conversations/${id}`,
            providesTags: ['Conversations'],
        }),
        getMessagesConversation: builder.query({
            query: (id) => `conversations/${id}`,
            providesTags: ['Messages']
        }),
        createMessageChat: builder.mutation({
            query: ({ sender, text, conversationId }) => ({
                url: 'messages',
                method: 'POST',
                body: { sender, text, conversationId },
            }),
            invalidatesTags: ['Messages'],
        }),
        deleteConversation: builder.mutation({
            query: ({ conversationId }) => ({
                url: `conversations/${conversationId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Users'],
        }),
        createRequest: builder.mutation({
            query: ({ requestMessage }) => ({
                url: 'request',
                method: 'POST',
                body: { requestMessage },
            }),
            invalidatesTags: ['Request'],
        }),
    }),
});

export const { useGetUsersQuery, useCreateUserMutation, useDeleteUserMutation, useUpdateUserMutation, useGetCrewcodesQuery, useCreateSwapMutation, useGetSwapsQuery, useGetSwapsDateQuery, useGetUsersByIdQuery, useGetConversationsQuery, useGetMessagesConversationQuery, useCreateMessageChatMutation, useCreateConversationMutation, useDeleteSwapMutation, useDeleteConversationMutation, useUpdateUserPasswordMutation, useCreateRequestMutation, useCreateNoteMutation, useDeleteNoteMutation, useGetNotesDateQuery,useUpdateNoteDeniedMutation,useUpdateNoteRequiredMutation } = apiSlice;

export const apiReducer = apiSlice.reducer;
