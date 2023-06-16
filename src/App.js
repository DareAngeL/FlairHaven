import { Container } from 'react-bootstrap';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import { AppProvider } from './AppContext';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Register from './pages/Register';
import { AnimatePresence } from 'framer-motion';
import SellerIntro from './pages/SellerIntro';
import {initializeApp} from 'firebase/app'
import {getStorage} from  'firebase/storage'
import EditProduct from './pages/EditProduct';
import UserDetail from './pages/UserDetails';
import CheckoutPage from './pages/CheckoutPage';
import { useMediaQuery } from '@mui/material';
import SearchResult from './pages/SearchResult';
import Maintenance from './pages/Maintenance';
import Error from './pages/Error';
import { useState } from 'react';

function App() {

  const isMobileView = useMediaQuery('(max-width:800px)')
  const isSmallScreenMobile = useMediaQuery('(max-width:480px)')

  const [isFirstTimeOpen, setIsFirstTimeOpen] = useState(true)

  const firebaseConfig = {
    apiKey: "AIzaSyCBaPrer7UYUpAS3VeI0DCmbojlHcRtC0k",
    authDomain: "flairhaven-d7457.firebaseapp.com",
    projectId: "flairhaven-d7457",
    storageBucket: "flairhaven-d7457.appspot.com",
    messagingSenderId: "582585086738",
    appId: "1:582585086738:web:3b8b71b8e7024b6e27b9cb",
    measurementId: "G-9BR1D5QBR4"
  };

  const app = initializeApp(firebaseConfig)
  const storage = getStorage(app)

  const pageVariants = {
        initial: {
          opacity: 0,
          scaleX: 0,
          y: "100vh",
        },
        in: {
          opacity: 1,
          scaleX: 1,
          y: 0,
        },
        out: {
          opacity: 0,
          scaleX: 0,
          y: "-100vh",
        },
      };

  const pageTransition = {
      type: "tween",
      ease: "anticipate",
      duration: 1,
  };

  const appValues = {
    user: () => JSON.parse(localStorage.getItem('user')),
    isMobileView: isMobileView,
    isSmallScreenMobile: isSmallScreenMobile,
    storage: storage,
    pageVariants: pageVariants,
    pageTransition: pageTransition,
    isFirstTimeOpen,
    setIsFirstTimeOpen
  }

  return (
    <AppProvider value={appValues}>
      <AnimatePresence mode='wait'>
        <Router>
          <Container id="root-container" className={appValues.isSmallScreenMobile?"p-0":""} fluid>
            <Routes>
              <Route path='/dashboard' element={<Dashboard/>}/>
              <Route path='/user_detail' element={<UserDetail/>}/>
              <Route path='/search_result/:productName' element={<SearchResult/>}/>
              <Route path='/edit_prod/:productId' element={<EditProduct/>}/>
              <Route path='/register' element={<Register/>}/>
              <Route path='/seller_intro' element={<SellerIntro/>}/>
              <Route path='/checkout/fromCart/:fromCart/:productId?' element={<CheckoutPage/>}/>
              <Route path='/' element={<Home/>}/>
              <Route path='*' element={<Maintenance/>}/>
              <Route path='/error' element={<Error/>}/>
            </Routes>
          </Container>
        </Router>
      </AnimatePresence>
    </AppProvider>
  );
}

export default App;