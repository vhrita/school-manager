import React from 'react'
import ReactDOM from 'react-dom/client'
import { NextUIProvider } from '@nextui-org/react'
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom";
import { Provider } from 'react-redux';


import App from './App.tsx'

import Navbar from './components/Navbar/index.tsx';
import DataTable from './components/DataTable/index.tsx';

import { store } from './app/store.ts'

import './index.css'

const HeaderLayout = () => {
  return (
    <>
      <Navbar />
      <div className='flex flex-col mt-20 items-center content-center justify-center mx-52'>
        <Outlet />
      </div>
    </>
  )
}

const router = createBrowserRouter([
  {
    element: <HeaderLayout />,
    children: [
      {
        path: "/",
        element: <App />,
      },
      {
        path: "/alunos",
        element: <DataTable />
      },
      {
        path: "/responsaveis",
        element: <h1>Responsáveis</h1>
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <NextUIProvider>
        <RouterProvider router={router} />
      </NextUIProvider>
    </Provider>
  </React.StrictMode>
)
