import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom';
import { resetUser } from '../Store/authStore';

export default function ProtectedRoute({children}) {
    const {user,token}=useSelector((state)=>state.auth);
    const dispatch=useDispatch();

    if(!user || !token){
        const storeUser=JSON.parse(localStorage.getItem('user'));
        const storeToken=JSON.parse(localStorage.getItem('token'));

        dispatch(resetUser({storeUser,storeToken}));

        if(!storeUser || !storeToken){
            return <Navigate to='/auth' replace/>
        }
    }
    return children;
}


// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Navigate } from 'react-router-dom';
// import { resetUser } from '../Store/authStore';

// export default function ProtectedRoute({ children }) {
//   const { user, token } = useSelector(state => state.auth);
//   const dispatch = useDispatch();
//   const [checked, setChecked] = useState(false);

//   useEffect(() => {
//     if (!user || !token) {
//       const storeUser = JSON.parse(localStorage.getItem('user'));
//       const storeToken = JSON.parse(localStorage.getItem('token'));

//       if (storeUser && storeToken) {
//         dispatch(resetUser({ storeUser, storeToken }));
//       }
//     }
//     setChecked(true);
//   }, [user, token, dispatch]);

//   if (!checked) return null; // ⛔ wait for auth check

//   if (!user || !token) {
//     return <Navigate to="/auth" replace />;
//   }

//   return children;
// }
