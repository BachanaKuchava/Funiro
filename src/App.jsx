import Header from './layout components/Header';
import HomePage from './pages/homepage/HomePage';
import ProductsPage from './pages/productsPage/ProductsPage';
import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';

function App() {
    return (   
        <BrowserRouter>
            <Header />
            <Routes>
                <Route path='/' element={<HomePage />} />
                <Route path='/productsPage' element={<ProductsPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;