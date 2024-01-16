import { useState, useEffect } from 'react';
import { API_URL } from '@/constants/api';

export default function Auth() {
    const [input, setInput] = useState('');
    const [customerData, setCustomerData] = useState(null);
    const [message, setMessage] = useState('');
    const [attendanceData, setAttendanceData] = useState(null);
    const [isError, setIsError] = useState(false);

    const handleInputChange = (event) => {
        setInput(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setCustomerData(null);

        // Retrieve the customer data
        const customerResponse = await fetch(`${API_URL}/customers/${input}`);
        if (customerResponse.ok) {
            const customer = await customerResponse.json();
            setCustomerData(customer);

            // Save the attendance record
            const attendanceResponse = await fetch(`${API_URL}/attendance`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ customer: customer._id }),
            });

            if (attendanceResponse.ok) {
                const attendance = await attendanceResponse.json();
                setAttendanceData(attendance);
                setMessage('Authentication successful');
                setIsError(false);
            } else {
                setMessage('Error authenticating customer');
                setIsError(true);
            }
        } else {
            setMessage('Authentication failed');
            setIsError(true);
        }

        setInput('');
    };

    return (
        <div className="container">
            <h1>Authentication</h1>
            <div className="row mt-4">
                <div className="col">
                    <form onSubmit={handleSubmit} className="search-form">
                        <label className="form-label">
                            Enter ID or barcode:
                            <input type="text" value={input} onChange={handleInputChange} className="form-input" required />
                        </label>
                        <button type="submit" className="btn hola-btn mb-3">Authenticate</button>
                    </form>
                    {customerData && (
                        <table className="table table-striped">
                            <thead>
                                <tr className="text-center">
                                    <th>ID</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Barcode</th>
                                    <th>Type</th>
                                    <th>Waiver Signed</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="text-center">
                                    <td>{customerData.customerId}</td>
                                    <td>{customerData.firstName}</td>
                                    <td>{customerData.lastName}</td>
                                    <td>{customerData.barcode}</td>
                                    <td className='customer-type'>{customerData.customerType}</td>
                                    <td>{customerData.hasSignedPolicy ? 'Yes' : 'No'}</td>
                                </tr>
                            </tbody>
                        </table>
                    )}
                    {message && <p className={`alert ${isError ? 'alert-danger' : 'alert-success'}`} role="alert">
                        {message}
                        {!isError && attendanceData && ` on ${new Date(attendanceData.date).toLocaleString()}`}
                    </p>}
                </div>
            </div>
        </div>
    );
}