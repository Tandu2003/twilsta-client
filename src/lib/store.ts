import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/slices/authSlice';
import userReducer from '@/slices/userSlice';
import postReducer from '@/slices/postSlice';
import commentReducer from '@/slices/commentSlice';
import messageReducer from '@/slices/messageSlice';
import conversationReducer from '@/slices/conversationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    post: postReducer,
    comment: commentReducer,
    message: messageReducer,
    conversation: conversationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
