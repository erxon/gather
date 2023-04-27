import Router from "next/router";
import { useEffect, useState } from "react";
import { useUser } from "@/lib/hooks";
//Signup user
//Update the report

export default function CreateAccount({data}){
    //Initialize user using useUser hook
    const [user, {mutate}] = useUser();
    //Control input fields
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
    //Handle submit for signup and report update.
    const handleSubmit = async () => {
        //Signup the user first
        const res = await fetch('/api/users', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                ...values,
                type: 'citizen'
            })
        })
        //Get the data
        const userObj = await res.json();

        //If the res.status is 201, add the username and account of the user in the report
        if(res.status === 201){
            const updateReport = await fetch(`/api/reports/createAccount/${data._id}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    username: userObj.username,
                    account: userObj.userId
                })
            })
            //Get data from the updateReport request
            const response = await updateReport.json();
            console.log(response)

            //Update user
            mutate(userObj)
            // Router.push(`/reports/edit/${response.data._id}`)
        }
    }

    //if the user is authenticated, redirect to "/myreport" page
    useEffect(() => {
        if(user) {
            Router.push('/myreport')
        } 
    }, [user]);


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