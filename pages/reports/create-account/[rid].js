import Router from "next/router";
import { useState } from "react";
//Signup user
//Update the report

export default function CreateAccount({data}){
    const [values, setValues] = useState({
        username: "",
        email: "",
        password: ""
    });

    const handleChange = (event) => {
        const {value, name} = event.target;
        setValues((prev) => {
            return {...prev, [name]: value}
        });
    };

    const handleSubmit = async () => {
        const signup = await fetch('/api/users', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                ...values,
                type: 'citizen'
            })
        })

        const userData = await signup.json();
        console.log(userData)
        if(userData){
            const updateReport = await fetch(`/api/reports/createAccount/${data._id}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    username: userData.username,
                    account: userData.userId
                })
            })
            const response = await updateReport.json();
            console.log(response)
            Router.push(`/reports/edit/${response.data._id}`)
        }
    }

    return <>
        <p>To manage this report, you need to create an account.</p>
        <div>
            <h1>Your Report</h1>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
        <div>
            <h1>Signup</h1>
            <input 
                placeholder="username" 
                type="text" 
                name="username"
                value={values.username} 
                onChange={handleChange}
                required /><br />
            <input 
                placeholder="email" 
                type="email" 
                name="email"
                value={values.email} 
                onChange={handleChange} 
                required /><br />
            <input 
                placeholder="password" 
                type="password"
                name="password" 
                value={values.password} 
                onChange={handleChange} 
                required /><br />

            <button onClick={handleSubmit}>Signup</button>
        </div>

    </>
}

export async function getServerSideProps(context){
    const {rid} = context.params;
    const res = await fetch(`http://localhost:3000/api/reports/${rid}`)
    const data = await res.json();

    return {
        props: {data}
    }
}