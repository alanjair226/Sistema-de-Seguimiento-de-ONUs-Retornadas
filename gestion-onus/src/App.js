import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OrderList from './components/OrderList';
import OrderDetails from './components/OrderDetails';
import ModifyOrder from './components/ModifyOrder';
import NewOrder from './components/NewOrder';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<OrderList />} />
                <Route path="/order/:id" element={<OrderDetails />} />
                <Route path="/modify_order/:id" element={<ModifyOrder />} />
                <Route path="/new_order" element={<NewOrder />} />
            </Routes>
        </Router>
    );
};

export default App;
