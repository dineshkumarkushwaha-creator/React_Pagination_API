/*import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'*/
import {SimpleList} from './components/SimpleList.jsx'
import {ToDoItems} from './components/ToDoItems.jsx'
import {PaginatedList} from './components/PaginatedList.jsx'
import PaginationList from './components/PaginationList.jsx'
import { InfiniteScrolling } from './components/infiniteScrolling.jsx'
import { SearchWithDebounce } from './components/SearchwithDebounce.jsx'
import LiveSearchAPI  from './components/LiveSearchApi.jsx'
import './App.css'

function App() {
  return(
     <>
    <LiveSearchAPI></LiveSearchAPI>
    </>
  )
  }
export default App;
