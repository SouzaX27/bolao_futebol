import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Navbar from "./components/Navbar";

import ProtectedRoute
    from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Palpites from "./pages/Palpites";
import Ranking from "./pages/Ranking";
import Admin from "./pages/Admin";


function App() {

    return (

        <BrowserRouter>

            <Navbar />

            <Routes>

                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />

                <Route
                    path="/login"
                    element={
                        <Login />
                    }
                />

                <Route
                    path="/palpites"
                    element={

                        <ProtectedRoute>

                            <Palpites />

                        </ProtectedRoute>

                    }
                />

                <Route
                    path="/ranking"
                    element={

                        <ProtectedRoute>

                            <Ranking />

                        </ProtectedRoute>

                    }
                />

                <Route
                    path="/admin"
                    element={

                        <ProtectedRoute>

                            <Admin />

                        </ProtectedRoute>

                    }
                />

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>

    );

}


export default App;