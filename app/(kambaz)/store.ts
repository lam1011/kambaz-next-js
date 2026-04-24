import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "./account/reducer";
import coursesReducer from "./courses/reducer";
import modulesReducer from "./courses/[cid]/modules/reducer";
import assignmentsReducer from "./courses/[cid]/assignments/reducer";
import enrollmentsReducer from "./enrollments/reducer";
import quizzesReducer from "./courses/[cid]/quizzes/reducer";

export interface RootState {
  accountReducer: ReturnType<typeof accountReducer>;
  coursesReducer: ReturnType<typeof coursesReducer>;
  modulesReducer: ReturnType<typeof modulesReducer>;
  assignmentsReducer: ReturnType<typeof assignmentsReducer>;
  enrollmentsReducer: ReturnType<typeof enrollmentsReducer>;
  quizzesReducer: ReturnType<typeof quizzesReducer>;
}

const store = configureStore({
  reducer: {
    accountReducer,
    coursesReducer,
    modulesReducer,
    assignmentsReducer,
    enrollmentsReducer,
    quizzesReducer,
  },
});

export default store;