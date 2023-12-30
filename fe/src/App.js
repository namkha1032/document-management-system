// import packages
import {
  BrowserRouter,
  Routes, Route, Link, Navigate
} from 'react-router-dom'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ConfigProvider, theme } from 'antd';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import PageColor from './pages/PageColor';
import MainLayout from './components/MainLayout/MainLayout';
// import pages
import PageTest from './pages/PageTest';
import FolderTree from './components/FolderTree/FolderTree';

import Page_Company from './pages/Page_Company/Page_Company';
import Page_My_Documents from './pages/Page_My_Documents/Page_My_Documents';
import Page_Shared_Documents from './pages/Page_Shared_Documents/Page_Shared_Documents';
import Page_Trash from './pages/Page_Trash/Page_Trash';
import Page_Search from './pages/Page_Search/Page_Search';
import Page_Upload from './pages/Page_Upload/Page_Upload';
// test

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
      }
    ]
  },
]);

const App = () => {
  // --------------------dark light mode---------------------
  let modeTheme = window.localStorage.getItem("modeTheme")
  const modeQuery = useQuery({
    queryKey: ['modeTheme'],
    queryFn: () => {
      if (modeTheme == "dark") {
        return "dark"
      }
      else if (modeTheme == "light") {
        return "light"
      }
      else {
        window.localStorage.setItem("modeTheme", "light")
        return "light"
      }
    }
  })
  const queryClient = useQueryClient()
  const algo = {
    algorithm: queryClient.getQueryData(['modeTheme']) == "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm
  }
  // --------------------dark light mode---------------------
  return (
    <ConfigProvider theme={algo}>
      {/* <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route path="/my-documents" element={<PageMyDocuments />}></Route>
            <Route path="/test" element={<PageTest />}></Route>
            <Route path="/color" element={<PageColor />}></Route>
          </Route>
        </Routes>
      </BrowserRouter> */}
      <RouterProvider router={router} />
    </ConfigProvider>
  );
};

export default App;
