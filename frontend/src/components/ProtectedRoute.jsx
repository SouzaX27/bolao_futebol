import {
    Navigate
} from "react-router-dom";


function ProtectedRoute({
    children
}) {

    var usuario = localStorage.getItem(
        "usuario"
    );


    if (!usuario) {

        return (

            <Navigate
                to="/login"
                replace
            />

        );

    }


    return children;

}


export default ProtectedRoute;