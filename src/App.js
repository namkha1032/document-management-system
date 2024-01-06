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
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import Page_Color from './pages/Page_Color';
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
// import apis
import { getSearchResult } from './apis/searchApi';



const App = () => {
  console.log('---------------render App----------------')
  const queryClient = useQueryClient()
  // search
  let searchOptionQuery = useQuery({
    queryKey: ['searchOption'],
    queryFn: () => {
      return {
        original_query: '',
        extend_keywords: [],
        metadata: [],
        method: 'full-text',
        domain: 'phapluat',
        pagination: {
          current: 1,
          pageSize: 10,
        },
        search_scope: 'all'
      }
      // return null
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  })
  let searchResultQuery = useQuery({
    queryKey: ['searchResult'],
    queryFn: () => {
      return {
        documents: [],
        broader: [],
        related: [],
        narrower: [],
        pagination: {
          current: null,
          pageSize: null,
          total: null
        }
      }
      // return null
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  })
  const searchMutation = useMutation({
    mutationFn: getSearchResult,
    onSuccess: (response) => {
      const searchOption = queryClient.getQueryData(['searchOption'])
      queryClient.setQueryData(['searchResult'], () => {
        const newBroader = response.broader.filter(kwItem => {
          for (let extendItem of searchOption.extend_keywords) {
            if (extendItem.keyword == kwItem.keyword) {
              return false
            }
          }
          return true
        })
        const newRelated = response.related.filter(kwItem => {
          for (let extendItem of searchOption.extend_keywords) {
            if (extendItem.keyword == kwItem.keyword) {
              return false
            }
          }
          return true
        })
        const newNarrower = response.narrower.filter(kwItem => {
          for (let extendItem of searchOption.extend_keywords) {
            if (extendItem.keyword == kwItem.keyword) {
              return false
            }
          }
          return true
        })
        return {
          ...response,
          broader: newBroader,
          related: newRelated,
          narrower: newNarrower
        }
      })
    }
  })
  // router
  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout
        searchMutation={searchMutation}
      // searchOptionQuery={searchOptionQuery}
      // searchResultQuery={searchResultQuery}
      />,
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
          element: <Page_Search
            searchMutation={searchMutation}
          // searchOptionQuery={searchOptionQuery}
          // searchResultQuery={searchResultQuery}
          />,
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
    {
      path: '/color',
      element: <Page_Color />
    }
  ]);
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
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  })
  const algo = {
    algorithm: queryClient.getQueryData(['modeTheme']) == "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm
  }
  // --------------------dark light mode---------------------
  return (
    <ConfigProvider theme={algo}>
      <RouterProvider router={router} />
    </ConfigProvider>
  );
};

export default App;
