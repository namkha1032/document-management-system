// import packages
import {
  BrowserRouter,
  Routes, Route, Link, Navigate
} from 'react-router-dom'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import Page_Color from './pages/Page_Color';
import MainLayout from './components/MainLayout/MainLayout';
import { useContext } from 'react';
// import pages
import PageTest from './pages/PageTest';
import FolderTree from './components/FolderTree/FolderTree';

import Page_Company from './pages/Page_Company/Page_Company';
import Page_My_Documents from './pages/Page_My_Documents/Page_My_Documents';
import Page_Shared_Documents from './pages/Page_Shared_Documents/Page_Shared_Documents';
import Page_Trash from './pages/Page_Trash/Page_Trash';
import Page_Search from './pages/Page_Search/Page_Search';
import Page_Upload from './pages/Page_Upload/Page_Upload';
import Page_Ontology_Id from './pages/Page_Ontology_Id/Page_Ontology_Id';
import Page_Login from './pages/Page_Login/Page_Login';
// import apis
import { getSearchResult } from './apis/searchApi';
// import context
import { ModeThemeProvider } from './context/ModeThemeContext';
import { SearchOptionProvider } from './context/SearchOptionContext';
import { SearchResultProvider } from './context/SearchResultContext';
import { GridListProvider } from './context/GridListContext';
const App = () => {
  let modeTheme = window.localStorage.getItem("modeTheme")
  const queryClient = useQueryClient()
  // search
  let searchOptionQuery = useQuery({
    queryKey: ['searchOption'],
    queryFn: () => {
      return {
        original_query: '',
        broader: {},
        related: {},
        narrower: {},
        metadata: [],
        method: 'fulltext',
        domain: 'legal',
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
        broader: {},
        related: {},
        narrower: {},
        pagination: {
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
      let searchResult = {
        ...response
      }
      Object.entries(searchOption.broader).forEach(([oriTerm, extendArray], index) => {
        if (searchResult.broader.hasOwnProperty(oriTerm)) {
          extendArray.forEach((extendTerm, index) => {
            searchResult = {
              ...searchResult,
              broader: {
                ...searchResult.broader,
                [oriTerm]: searchResult.broader[oriTerm].filter(newItem => newItem != extendTerm)
              }
            }
          })
        }
      })
      Object.entries(searchOption.related).forEach(([oriTerm, extendArray], index) => {
        if (searchResult.related.hasOwnProperty(oriTerm)) {
          extendArray.forEach((extendTerm, index) => {
            searchResult = {
              ...searchResult,
              related: {
                ...searchResult.related,
                [oriTerm]: searchResult.related[oriTerm].filter(newItem => newItem != extendTerm)
              }
            }
          })
        }
      })
      Object.entries(searchOption.narrower).forEach(([oriTerm, extendArray], index) => {
        if (searchResult.narrower.hasOwnProperty(oriTerm)) {
          extendArray.forEach((extendTerm, index) => {
            searchResult = {
              ...searchResult,
              narrower: {
                ...searchResult.narrower,
                [oriTerm]: searchResult.narrower[oriTerm].filter(newItem => newItem != extendTerm)
              }
            }
          })
        }
      })
      // queryClient.setQueryData(['searchResult'], () => {
      //   const newBroader = response.broader.filter(kwItem => {
      //     for (let extendItem of searchOption.extend_keywords) {
      //       if (extendItem.keyword == kwItem.keyword) {
      //         return false
      //       }
      //     }
      //     return true
      //   })
      //   const newRelated = response.related.filter(kwItem => {
      //     for (let extendItem of searchOption.extend_keywords) {
      //       if (extendItem.keyword == kwItem.keyword) {
      //         return false
      //       }
      //     }
      //     return true
      //   })
      //   const newNarrower = response.narrower.filter(kwItem => {
      //     for (let extendItem of searchOption.extend_keywords) {
      //       if (extendItem.keyword == kwItem.keyword) {
      //         return false
      //       }
      //     }
      //     return true
      //   })
      //   return {
      //     ...response,
      //     broader: newBroader,
      //     related: newRelated,
      //     narrower: newNarrower
      //   }
      // })
      queryClient.setQueryData(['searchResult'], searchResult)
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
        },
        {
          path: "ontology/:id",
          element: <Page_Ontology_Id />,
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
    <ModeThemeProvider>
      <SearchOptionProvider>
        <SearchResultProvider>
          <GridListProvider>
            <RouterProvider router={router} />
          </GridListProvider>
        </SearchResultProvider>
      </SearchOptionProvider>
    </ModeThemeProvider>
  );
};

export default App;
