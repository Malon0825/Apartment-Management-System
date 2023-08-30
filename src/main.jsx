import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { BrowserRouter as Router, Routes as Switch, Route, } from "react-router-dom"
import { AuthProvider } from './Context/Auth'
import PrivateRoute from './context/PrivateRoute.jsx'
import App from './components/App'
import Home from './components/Home'
import Signup from './components/Signup'
import ForgotPassword from './components/ForgotPassword'


ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>

            <Router>

                <AuthProvider>

                  <Switch>

                        <Route path="/" element={<App />} />

                        <Route path="/signup" element={<Signup />} />

                        <Route path="/forgotpassword" element={<ForgotPassword />} />

                        <Route path='/home' element={<PrivateRoute/>}>
                                <Route exact path='/home' element={<Home/>}/>
                        </Route> 

                    </Switch>          
                </AuthProvider> 
            </Router>
    </React.StrictMode>,
    )
