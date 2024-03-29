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

import Page_Company from './pages/Page_Company/Page_Company';
import Page_My_Documents from './pages/Page_My_Documents/Page_My_Documents';
import Page_Shared_Documents from './pages/Page_Shared_Documents/Page_Shared_Documents';
import Page_Trash from './pages/Page_Trash/Page_Trash';
import Page_Search from './pages/Page_Search/Page_Search';
import Page_Upload from './pages/Page_Upload/Page_Upload';
import Page_Ontology from './pages/Page_Ontology/Page_Ontology';
import Page_Ontology_Url from './pages/Page_Ontology_Url/Page_Ontology_Url';
import Page_Login from './pages/Page_Login/Page_Login';
import Page_Document_Id from './pages/Page_Document_Id/Page_Document_Id';
// import apis
import { getSearchResult } from './apis/searchApi';
import { getMe } from './apis/userApi';
// import Context
import UserContext from './context/UserContext';
const App = () => {
  // search
  // router
  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          path: "company",
          element: <Page_Company />,
        },
        {
          path: "my-documents",
          element: <Page_My_Documents />,
        },
        {
          path: "shared-documents",
          element: <Page_Shared_Documents />,
        },
        {
          path: "search",
          element: <Page_Search />,
        },
        {
          path: "trash",
          element: <Page_Trash />,
        },
        {
          path: "upload",
          element: <Page_Upload />,
        },
        {
          path: "ontology",
          element: <Page_Ontology />,
        },
        {
          path: "ontology/:ontologyUrl",
          element: <Page_Ontology_Url />,
        },
        {
          path: "document/:document_id",
          element: <Page_Document_Id />,
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
    <RouterProvider router={router} />
  );
};

export default App;
