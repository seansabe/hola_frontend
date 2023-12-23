import { SetStateAction, useState } from 'react';
import { API_URL } from '@/constants/api';

export default function Customers() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [customerType, setCustomerType] = useState('');
    const [customerId, setCustomerId] = useState('');
    const [hasSignedPolicy, setHasSignedPolicy] = useState(false);
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const resetForm = () => {
        setFirstName('');
        setLastName('');
        setCustomerType('');
        setCustomerId('');
        setHasSignedPolicy(false);
    };

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        const response = await fetch(`${API_URL}/customers`, {
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
            resetForm();
        } else {
            setMessage('Error creating user');
            setIsError(true);
        }
    };

    const handleSearch = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/customers?page=${currentPage}&limit=10&search=${searchTerm}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setSearchResults(data.customers);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handlePageChange = (newPage: SetStateAction<number>) => {
        setCurrentPage(newPage);
        handleSearch(e);
    };

    const handleEdit = (customer: SetStateAction<null>) => {
        setSelectedCustomer(customer);
    };

    const handleUpdate = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        const customerData = {
            firstName: selectedCustomer.firstName,
            lastName: selectedCustomer.lastName,
            customerType: selectedCustomer.customerType,
            customerId: selectedCustomer.customerId,
            hasSignedPolicy: selectedCustomer.hasSignedPolicy,
        };

        const response = await fetch(`${API_URL}/customers/${selectedCustomer.customerId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(customerData),
        });

        if (response.ok) {
            setMessage('User updated successfully');
            setIsError(false);
            resetForm();
            setSelectedCustomer(null);
        } else {
            setMessage('Error updating user');
            setIsError(true);
        }
    }

    const handleSave = (e: { preventDefault: any; }) => {
        e.preventDefault();
        if (selectedCustomer) {
            handleUpdate(e);
        } else {
            handleSubmit(e);
        }
    };

    return (
        <div className="customers-container container">
            <h1>Customers</h1>
            <div className="row">
                <div className="col">
                    <h2 className='text-center'>{selectedCustomer ? 'Update' : 'Create'}</h2>
                    <form onSubmit={handleSave} className="customer-form">
                        <label className="form-label">
                            First Name:
                            <input type="text" value={selectedCustomer ? selectedCustomer.firstName : firstName} onChange={(e) => selectedCustomer ? setSelectedCustomer({ ...selectedCustomer, firstName: e.target.value }) : setFirstName(e.target.value)} required className="form-input" />
                        </label>
                        <label className="form-label">
                            Last Name:
                            <input type="text" value={selectedCustomer ? selectedCustomer.lastName : lastName} onChange={(e) => selectedCustomer ? setSelectedCustomer({ ...selectedCustomer, lastName: e.target.value }) : setLastName(e.target.value)} required className="form-input" />
                        </label>
                        <label className="form-label">
                            Customer ID:
                            <input type="text" value={selectedCustomer ? selectedCustomer.customerId : customerId} onChange={(e) => selectedCustomer ? setSelectedCustomer({ ...selectedCustomer, customerId: e.target.value }) : setCustomerId(e.target.value)} required className="form-input" />
                        </label>
                        <label className="form-label">
                            Customer Type:
                            <select value={selectedCustomer ? selectedCustomer.customerType : customerType} onChange={(e) => selectedCustomer ? setSelectedCustomer({ ...selectedCustomer, customerType: e.target.value }) : setCustomerType(e.target.value)} required className="form-select">
                                <option value="">Select...</option>
                                <option value="student">Student</option>
                                <option value="staff">Staff</option>
                                <option value="alumni">Alumni</option>
                                <option value="community">Community</option>
                            </select>
                        </label>
                        <div className="form-group form-check mt-4">
                            <input type="checkbox" checked={selectedCustomer ? selectedCustomer.hasSignedPolicy : hasSignedPolicy} onChange={(e) => selectedCustomer ? setSelectedCustomer({ ...selectedCustomer, hasSignedPolicy: e.target.checked }) : setHasSignedPolicy(e.target.checked)} className="form-check-input" />
                            <label className="form-check-label">The customer has accepted <strong>Fitness Centre Policies</strong> and has signed the waiver form.</label>
                        </div>
                        <button type="submit" className="btn hola-btn mt-4 mb-4">{selectedCustomer ? 'Save' : 'Submit'}</button>
                        {message && (
                            <div className={`alert ${isError ? 'alert-danger' : 'alert-success'}`} role="alert">
                                {message}
                            </div>
                        )}
                    </form>
                </div>
                <div className="col">
                    <h2 className="text-center">Search</h2>
                    <form onSubmit={handleSearch} className="search-form mt-4">
                        <label className="form-label">
                            Search by Customer ID or Name:
                            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} required className="form-input" />
                        </label>
                        <button type="submit" className="btn hola-btn">Search</button>
                    </form>
                    <div className="search-results mt-4">
                        <h2>Search Results</h2>
                        {searchResults.length > 0 ? (
                            <table className="table table-striped">
                                <thead>
                                    <tr className="text-center">
                                        <th>Name</th>
                                        <th>Last Name</th>
                                        <th>Customer ID</th>
                                        <th>Type</th>
                                        <th>Waiver Signed</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {searchResults.map((customer) => (
                                        <tr key={customer._id} className="text-center">
                                            <td>{customer.firstName}</td>
                                            <td>{customer.lastName}</td>
                                            <td>{customer.customerId}</td>
                                            <td className='customer-type'>{customer.customerType}</td>
                                            <td>{customer.hasSignedPolicy ? 'Yes' : 'No'}</td>
                                            <td>
                                                <button onClick={() => handleEdit(customer)} className="btn hola-btn">Edit</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No results found</p>
                        )}
                        <div className="pagination">
                            {Array.from(Array(totalPages).keys()).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page + 1)}
                                    className={`btn ${currentPage === page + 1 ? 'hola-btn' : 'btn-secondary'}`}
                                >
                                    {page + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}