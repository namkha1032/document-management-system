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
  let searchOptionQuery = useQuery({
    queryKey: ['searchOption'],
    queryFn: () => {
      return {
        original_query: '',
        extend_keywords: [],
        // metadata: [
        //   {
        //     "obj_id": "mfdl7",
        //     "$and": [
        //       {
        //         "obj_id": "75jdm",
        //         "$or": [
        //           {
        //             "obj_id": "i16zk",
        //             "$and": [
        //               {
        //                 "obj_id": "6e3ph",
        //                 "key": "key A",
        //                 "value": "value A"
        //               },
        //               {
        //                 "obj_id": "1z06b",
        //                 "$not": {
        //                   "obj_id": "hzzau",
        //                   "key": "key B",
        //                   "value": "value B"
        //                 }
        //               },
        //               {
        //                 "obj_id": "unxh6",
        //                 "key": "key C",
        //                 "value": "value C"
        //               }
        //             ]
        //           },
        //           {
        //             "obj_id": "301e2",
        //             "$not": {
        //               "obj_id": "es5es",
        //               "key": "key D",
        //               "value": "value D"
        //             }
        //           },
        //           {
        //             "obj_id": "yd8p0",
        //             "$and": [
        //               {
        //                 "obj_id": "wlkzy",
        //                 "key": "key F",
        //                 "value": "value F"
        //               },
        //               {
        //                 "obj_id": "0l9fw",
        //                 "key": "key G",
        //                 "value": "value G"
        //               }
        //             ]
        //           }
        //         ]
        //       },
        //       {
        //         "obj_id": "6va5f",
        //         "$not": {
        //           "obj_id": "ysavo",
        //           "key": "key E",
        //           "value": "value E"
        //         }
        //       }
        //     ]
        //   }
        // ],
        metadata: [],
        method: 'full-text',
        domain: 'phapluat'
      }
      // return null
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  })
  // let searchOption = queryClient.getQueryData(['searchOption'])
  let searchOption = searchOptionQuery.data
  let searchResultQuery = useQuery({
    queryKey: ['searchResult'],
    queryFn: async () => {
      const response = await getSearchResult(searchOption)
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
        documents: [],
        broader: [],
        related: [],
        narrower: []
      }
      // return null
    },
    // enabled: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  })
  console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&', searchResultQuery)
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
        searchResultQuery={searchResultQuery}
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
            searchResultQuery={searchResultQuery}
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
