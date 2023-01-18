import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  username: '',
  user_id: null,
  email: '',
  loggedIn: false,
  avatar: '',
  tasks: {
    all: [],
  },
  nextGeneration: 0,
  recommendations: [],
  metrics: [],
  settings: {
    darkMode: false,
  }
}


export const storageSlice = createSlice({
  name: 'Storage',
  initialState,
  reducers: {
    loginUser: (state, action) => {
      state.username = action.payload.username;
      state.user_id = action.payload.user_id;
      state.email = action.payload.email;
      state.loggedIn = true;
    },
    updateEmail: (state, action) => {
      state.email = action.payload.email;
    },
    logoutUser: (state, action) => {
      state = initialState
      return state;
    },
    updateGenerationCooldown: (state, action) => {
      //check if current time stamp is greater than action.payload.lastGeneration timestamp + 1 week.
      //If it is, set state.canGenerate = true;
      const nextGeneration = 259200000 + Number(action.payload.lastgeneration);
      state.nextGeneration = nextGeneration;
    },
    loadTasks: (state, action) => {
      state.tasks.all = action.payload.map((task) => ({...task, key: task.id}))
    },
    addTask: (state, action) => {
      state.tasks.all.push({...action.payload, key: action.payload.id})
    },
    deleteTask: (state, action) => {
      state.tasks.all = state.tasks.all.filter(task => task.id !== action.payload)
    },
    completeTask: (state, action) => {
      state.tasks.all = state.tasks.all.map(task => {
        if (task.id === action.payload) {
          return {
            ...task,
            completed: true
          }
        } else {
          return task
        }
      })
    },
    updateTask: (state, action) => {
      state.tasks.all = state.tasks.all.map(task => {
        if (task.id === action.payload.id) {
          return {
            ...task,
            ...action.payload
          }
        } else {
          return task
        }
      })
    },
    pushTask: (state, action) => {
      state.tasks.all = state.tasks.all.map(task => {
        if (task.id === action.payload.id) {
          return {
            ...task,
            completed: action.payload.completed,
            time_start: action.payload.time_start,
            time_finished: action.payload.time_finished
          }
        } else {
          return task
        }
      })
    },
    generateRec: (state, action) => {
      state.recommendations = action.payload
    }
  }
})


export const { loginUser, logoutUser, loadTasks, addTask, deleteTask, completeTask, updateTask, pushTask, updateEmail, generateRec, updateGenerationCooldown } = storageSlice.actions;
export default storageSlice.reducer;