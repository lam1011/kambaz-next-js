import { configureStore } from "@reduxjs/toolkit";
import helloReducer from "../lab4/redux/hello/helloReducer";
import counterReducer from "../lab4/redux/CounterRedux/counterReducer";
import addReducer from "../lab4/redux/AddRedux/addReducer";
import todosReducer from "../lab4/redux/todos/todosReducer";


const store = configureStore({
  reducer: { helloReducer, 
    counterReducer,
    addReducer,
    todosReducer,
   }});
export type RootState = ReturnType<typeof store.getState>;
export default store;

