// import packages
import {
  BrowserRouter,
  Routes, Route, Link, Navigate
} from 'react-router-dom'
import {
  createBrowserRouter,
  RouterProvider,
  useNavigate
} from "react-router-dom";
import Page_Color from './pages/Page_Color';
import MainLayout from './components/MainLayout/MainLayout';
import { useContext, useState, useEffect } from 'react';
import { Skeleton } from "antd"
// import pages
import PageTest from './pages/PageTest';
import FolderTree from './components/FolderTree/FolderTree';

import Page_Company from './pages/Page_Documents_Company/Page_Documents_Company';
import Page_Documents_My from './pages/Page_Documents_My/Page_Documents_My';
import Page_Documents_Shared from './pages/Page_Documents_Shared/Page_Documents_Shared';
import Page_Trash from './pages/Page_Trash/Page_Trash';
import Page_Search from './pages/Page_Search/Page_Search';
import Page_Upload from './pages/Page_Upload/Page_Upload';
import Page_Ontology from './pages/Page_Ontology/Page_Ontology';
import Page_Ontology_Url from './pages/Page_Ontology_Url/Page_Ontology_Url';
import Page_Login from './pages/Page_Login/Page_Login';
import Page_Document_Id from './pages/Page_Document_Id/Page_Document_Id';
import Page_Ontology_Id from './pages/Page_Ontology_Id/Page_Ontology_Id';
import Page_Ontology_All from './pages/Page_Ontology_All/Page_Ontology_All';
import Unauthorized from './components/Unauthorized/Unauthorized';
import UserContext from './context/UserContext';
// import apis
import { getSearchResult } from './apis/searchApi';
import { getMe } from './apis/userApi';
// import Context
import Page_Documents_Company from './pages/Page_Documents_Company/Page_Documents_Company';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const App = () => {
  // search
  // router
  let [user, dispatchUser] = useContext(UserContext)
  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          path: "company",
          element: user?.is_expertuser ? <Unauthorized /> : <Page_Documents_Company />,
        },
        {
          path: "my-documents",
          element: user?.is_expertuser ? <Unauthorized /> : <Page_Documents_My />,
        },
        {
          path: "shared-documents",
          element: user?.is_expertuser ? <Unauthorized /> : <Page_Documents_Shared />,
        },
        {
          path: "search",
          element: user?.is_expertuser ? <Unauthorized /> : <Page_Search />,
        },
        {
          path: "trash",
          element: user?.is_expertuser ? <Unauthorized /> : <Page_Trash />,
        },
        {
          path: "upload",
          element: user?.is_expertuser ? <Unauthorized /> : <Page_Upload />,
        },
        {
          path: "ontology",
          element: user?.is_expertuser ? <Page_Ontology_All /> : <Unauthorized />,
        },
        {
          path: "ontologyold",
          element: user?.is_expertuser ? <Page_Ontology /> : <Unauthorized />,
        },
        {
          path: "ontologyold/:ontologyUrl",
          element: <Page_Ontology_Url />,
        },
        {
          path: "ontology/:ontologyId",
          element: user?.is_expertuser ? <Page_Ontology_Id /> : <Unauthorized />,
        },
        {
          path: "document/:document_id",
          element: user?.is_expertuser ? <Unauthorized /> : <Page_Document_Id />,
        }
      ]
    },
    {
      path: '/color',
      element: <Page_Color />
    },
    {
      path: '/login',
      element: <Page_Login />
    }
  ]);
  return (
    <>
      <ToastContainer />
      <RouterProvider router={router} />
    </>
  );
};

export default App;
