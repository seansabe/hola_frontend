import { useState, useEffect, FormEvent } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function Login() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [remember, setRemember] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true)
        const user = localStorage.getItem('user');
        if (user) {
            router.push('/home');
        }
    }, [router]);

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        try {
            const response = await axios.post('http://localhost:5001/api/users/login', { email, password });
            if (remember) {
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            router.push('/home');
        } catch (error) {
            setError('Invalid email or password');
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div>
                <h1 className="hola text-center">hola.</h1>
                <form onSubmit={handleSubmit} className="mt-4">
                    <div className="form-group mt-2">
                        <label>Email:</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" required />
                    </div>
                    <div className="form-group mt-2">
                        <label>Password:</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" required />
                    </div>
                    <div className="form-group form-check mt-4">
                        <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="form-check-input" />
                        <label className="form-check-label">Remember me</label>
                    </div>
                    <button type="submit" className="btn login-button mt-4">Login</button>
                </form>
                <p className="text-grey text-center mt-4 mb-4">Ver 1.0</p>
                {error && <div className="alert alert-danger">{error}</div>}
            </div>
        </div>
    );
}