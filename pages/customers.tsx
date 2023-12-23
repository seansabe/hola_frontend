import { useState } from 'react';

export default function Customers() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [customerType, setCustomerType] = useState('');
    const [customerId, setCustomerId] = useState('');
    const [hasSignedPolicy, setHasSignedPolicy] = useState(false);
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        const response = await fetch('http://localhost:5001/api/customers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                firstName,
                lastName,
                customerType,
                customerId,
                hasSignedPolicy,
            }),
        });

        if (response.ok) {
            setMessage('User created successfully');
            setIsError(false);
            // Reset the form
            setFirstName('');
            setLastName('');
            setCustomerType('');
            setCustomerId('');
            setHasSignedPolicy(false);
        } else {
            setMessage('Error creating user');
            setIsError(true);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="customer-form">
            <label className="form-label">
                First Name:
                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required className="form-input" />
            </label>
            <label className="form-label">
                Last Name:
                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required className="form-input" />
            </label>
            <label className="form-label">
                Customer Type:
                <select value={customerType} onChange={(e) => setCustomerType(e.target.value)} required className="form-select">
                    <option value="">Select...</option>
                    <option value="student">Student</option>
                    <option value="staff">Staff</option>
                    <option value="alumni">Alumni</option>
                    <option value="community">Community</option>
                </select>
            </label>
            <label className="form-label">
                Customer ID:
                <input type="text" value={customerId} onChange={(e) => setCustomerId(e.target.value)} required className="form-input" />
            </label>
            <div className="form-group form-check mt-4">
                <input type="checkbox" checked={hasSignedPolicy} onChange={(e) => setHasSignedPolicy(e.target.checked)} className="form-check-input" />
                <label className="form-check-label">The customer has accepted <strong>Fitness Centre Policies</strong> and has signed the waiver form.</label>
            </div>
            <button type="submit" className="btn add-customer-button mt-4 mb-4">Submit</button>
            {message && (
                <div className={`alert ${isError ? 'alert-danger' : 'alert-success'}`} role="alert">
                    {message}
                </div>
            )}
        </form>
    );
}