import React, { useState } from 'react';
import { API_URL } from '../constants/api';

const Settings = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        console.log(event.target.files[0]);
    };

    const handleFileUpload = async (event) => {
        console.log('handleFileUpload called');
        event.preventDefault();
    
        const formData = new FormData();
        if (file) {
            formData.append('file', file);
        }
    
        console.log('About to send fetch request'); // new log statement
    
        try {
            const response = await fetch(`${API_URL}/import`, {
                method: 'POST',
                body: formData,
            });
    
            console.log('Fetch request completed'); // new log statement
    
            if (!response.ok) {
                throw new Error('Error uploading file');
            }
    
            setMessage('File uploaded successfully');
            setIsError(false);
        } catch (error) {
            console.log('Caught an error', error); // new log statement
            setMessage('Error uploading file');
            setIsError(true);
        }
    };

    return (
        <div className="container">
            <h1>Settings</h1>
            <div className="row">
                <div className="col-4">
                    <h2 className='mt-4'>Bulk Import</h2>
                    <p>Upload a CSV file to import multiple contacts at once.</p>
                    <form onSubmit={handleFileUpload}>
                        <div className="input-group mb-2">
                            <input type="file" className="form-control" onChange={handleFileChange} required/>
                            <button className="btn hola-inline-btn" type="submit">Upload</button>  
                        </div>
                        <div className="form-text mb-2">The CSV file must be have the following format.</div>
                    </form>
                    {message && <p className={`alert ${isError ? 'alert-danger' : 'alert-success'}`} role="alert">{message}</p>}
                </div>
            </div>
        </div>
    );
};

export default Settings;