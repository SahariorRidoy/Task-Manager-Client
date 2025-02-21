import  { useContext } from 'react';
import { AuthContext } from '../Provider/AuthProvider';
import { Navigate, useLocation } from 'react-router';
import Loading from '../components/Loading/Loading';

const PrivateRoute = ({children}) => {
    
const {user,loading}=useContext(AuthContext)
const location = useLocation()

if(loading){
    return <Loading></Loading>
}
if(user&& user?.email){
return children;
}
return (
    <Navigate state={location.pathname} to={'/'}></Navigate>
)
    
};

export default PrivateRoute;