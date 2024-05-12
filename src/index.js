import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "./index.css"
// import context
import { ModeThemeProvider } from './context/ModeThemeContext';
import { SearchOptionProvider } from './context/SearchOptionContext';
import { SearchResultProvider } from './context/SearchResultContext';
import { GridListProvider } from './context/GridListContext';
import { UserProvider } from './context/UserContext';
import { UploadDocumentProvider } from './context/UploadDocumentContext';
import { DocumentMyProvider } from './context/DocumentMyContext';
import { DocumentCompanyProvider } from './context/DocumentCompanyContext';
import { DocumentSharedProvider } from './context/DocumentSharedContext';
import { DocumentTrashProvider } from './context/DocumentTrashContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  // <React.StrictMode>
  <UserProvider>
    <ModeThemeProvider>
      <UploadDocumentProvider>
        <SearchOptionProvider>
          <SearchResultProvider>
            <GridListProvider>
              <DocumentMyProvider>
                <DocumentCompanyProvider>
                  <DocumentSharedProvider>
                    <DocumentTrashProvider>
                      <App />
                    </DocumentTrashProvider>
                  </DocumentSharedProvider>
                </DocumentCompanyProvider>
              </DocumentMyProvider>
            </GridListProvider>
          </SearchResultProvider>
        </SearchOptionProvider>
      </UploadDocumentProvider>
    </ModeThemeProvider>
  </UserProvider>
  // </React.StrictMode>
);

