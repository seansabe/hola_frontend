import Link from 'next/link';
import { useRouter } from 'next/router';
import { SetStateAction, useEffect, useState } from 'react';
import Customers from './customers';
import Settings from './settings';
import Auth from './auth';

export default function Home() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [activeComponent, setActiveComponent] = useState('auth');
    const [selectedMenu, setSelectedMenu] = useState('auth');

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user') as string);
        setUser(userData);
    }, []);

    const logout = () => {
        localStorage.removeItem('user');
        router.push('/login');
    };

    const handleClick = (componentName: SetStateAction<string>) => {
        setActiveComponent(componentName);
        setSelectedMenu(componentName);
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2 sidebar">
                    <div>
                        <h1 className='hola text-center'>hola.</h1>
                        <p className="text-grey text-center mt-4">{user ? user.email : ""}</p>
                        <div className="list-group mt-4">
                            <a onClick={() => handleClick('auth')} className={`list-group-item ${selectedMenu === 'auth' ? 'selected' : ''}`}>Authentication</a>
                            <a onClick={() => handleClick('customers')} className={`list-group-item ${selectedMenu === 'customers' ? 'selected' : ''}`}>Customers</a>
                            <a onClick={() => handleClick('settings')} className={`list-group-item ${selectedMenu === 'settings' ? 'selected' : ''}`}>Settings</a>
                        </div>
                    </div>
                    <button onClick={logout} className="btn hola-btn mt-3">Logout</button>
                </div>
                <div className="col-md-10 content">
                    {activeComponent === 'auth' && <Auth />}
                    {activeComponent === 'customers' && <Customers />}
                    {activeComponent === 'settings' && <Settings />}
                </div>
            </div>
        </div>
    );
}