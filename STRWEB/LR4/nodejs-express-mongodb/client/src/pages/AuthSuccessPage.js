import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function AuthSuccessPage() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const id = params.get('id');
        const username = params.get('username');
        const email = params.get('email');
        const roles = params.get('roles');

        if (token && id && username && email && roles) {
            try {
                const user = {
                    accessToken: token,
                    id: id,
                    username: decodeURIComponent(username),
                    email: decodeURIComponent(email),
                    roles: JSON.parse(decodeURIComponent(roles))
                };
                localStorage.setItem('user', JSON.stringify(user));
                navigate('/profile');
                window.location.reload(); 
            } catch (e) {
                console.error("Error parsing user data from URL:", e);
                navigate('/login');
            }
        } else {
            console.error("Missing authentication parameters in URL.");
            navigate('/login');
        }
    }, [location, navigate]);

    return (
        <div>
            <h1>Processing Google Login...</h1>
            <p>Please wait while we log you in.</p>
        </div>
    );
}

export default AuthSuccessPage;
