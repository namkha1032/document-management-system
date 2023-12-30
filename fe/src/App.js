import {
  BrowserRouter,
  Routes, Route, Link, Navigate
} from 'react-router-dom'
// import pages
import PageTest from './pages/PageTest';
import FolderTree from './components/FolderTree/FolderTree';
import PageMyDocuments from './pages/PageMyDocuments/PageMyDocuments';

import Page_Company from './pages/Page_Company/Page_Company';
import Page_My_Documents from './pages/Page_My_Documents/Page_My_Documents';
import Page_Shared_Documents from './pages/Page_Shared_Documents/Page_Shared_Documents';
import Page_Trash from './pages/Page_Trash/Page_Trash';
// import packages
import { ConfigProvider, theme } from 'antd';
import { useQuery } from '@tanstack/react-query';
import PageColor from './pages/PageColor';
import MainLayout from './components/MainLayout/MainLayout';
// test
const App = () => {
  let darklightTheme = window.localStorage.getItem("darklightTheme")
  const themeQuery = useQuery({
    queryKey: ["theme"],
    queryFn: () => {
      if (darklightTheme == "dark") {
        return "dark"
      }
      else if (darklightTheme == "light") {
        return "light"
      }
      else {
        window.localStorage.setItem("darklightTheme", "light")
        return "light"
      }
    }
  })
  const antdTheme = {
    algorithm: themeQuery.data == "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm
  }

  return (
    <ConfigProvider theme={antdTheme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route path="/my-documents" element={<PageMyDocuments />}></Route>
            <Route path="/test" element={<PageTest />}></Route>
            <Route path="/color" element={<PageColor />}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;
