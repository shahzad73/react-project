import './App.css';
import 'semantic-ui-css/semantic.min.css'

import { Route, Routes } from "react-router";
import { BrowserRouter } from "react-router-dom";
import { Link } from "react-router-dom";


import Main from "./pages/main";
import Walletconnect from "./pages/walletconnect";
import Solana from "./pages/solana";
import Ethereum from "./pages/ethereum";
import PolymeshPage from "./pages/polymesh";
import Testings from "./pages/testing.tsx";
import Solar from "./pages/solar";

function App() {
  return (
    <BrowserRouter> 
      <div className="App">
        <header className="App-header">


        <div class="page">

          <div class="left-section">
              <Link  to="/" > Main </Link>              
              <br /><br />
              <Link to="/walletconnect" > Wallet Connect </Link>
              <br /><br />
              <Link to="/ethereum" > Wallet Connect 2 </Link>              
              <br /><br />                            
              <Link to="/solana" > Solana </Link>
              <br /><br />              
              <Link to="/polymesh" > Polymesh </Link>  
              <br /><br />              
              <Link to="/testings" > Testings </Link>                              
              <br /><br />              
              <Link to="/solar" > Solar </Link>                              
          </div>

          <div class="right-section">

                <Routes>
                      <Route path="/" element={<Main />} />
                      <Route path="/walletconnect" element={<Walletconnect />} />    
                      <Route path="/solana" element={<Solana />} />
                      <Route path="/ethereum" element={<Ethereum />} />                                            
                      <Route path="/polymesh" element={<PolymeshPage />} />
                      <Route path="/testings" element={<Testings />} />                      
                      <Route path="/solar" element={<Solar />} />                                            
                </Routes>

          </div>

        </div>


        </header>
      </div>
    </BrowserRouter>
  );
}

export default App;
