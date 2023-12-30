import {
  BrowserRouter,
  Routes, Route, Link, Navigate
} from 'react-router-dom'
// import components
import PageTest from './pages/PageTest';
import FolderTree from './components/FolderTree/FolderTree';
import PageMyDocuments from './pages/PageMyDocuments/PageMyDocuments';
import { ConfigProvider, theme } from 'antd';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import PageColor from './pages/PageColor';
import MainLayout from './components/MainLayout/MainLayout';
const App = () => {
  let dmsTheme = window.localStorage.getItem("dmsTheme")
  const themeQuery = useQuery({
    queryKey: ["theme"],
    queryFn: () => {
      if (dmsTheme == "dark") {
        return "dark"
      }
      else if (dmsTheme == "light") {
        return "light"
      }
      else {
        window.localStorage.setItem("dmsTheme", "light")
        return "light"
      }
    }
  })
  const myTheme = {
    algorithm: themeQuery.data == "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm
  }

  return (
    <ConfigProvider theme={myTheme}>
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
