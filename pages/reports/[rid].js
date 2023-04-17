import Router from "next/router";
import { useEffect, useState } from "react";
import { useUser } from "@/lib/hooks";
import { Button, Form } from "react-bootstrap";

export default function ReportPage({ data }) {
  const reportedAt = new Date(data.reportedAt)
  const [user, { mutate }] = useUser();
  const [authorized, isAuthorized] = useState(false);
  useEffect(() => {
    if(!user){
      return
    } else {
      if(user.username === data.username || user.type === 'Authority') {
        isAuthorized(true);
      } else {
        isAuthorized(false);
      }
    }
  }, [user])
  const handleDelete = async () => {
    const res = await fetch(`/api/reports/${data._id}`, {
      method: 'DELETE'
    })
    if (res.status === 200) {
      Router.push('/reportDashboard')
    }
  }
  //delete function
  return (
    <div>
        <div>
            Reported by: {
                Object.hasOwn(data, 'username') && 
                (<div>
                    <p>{data.username}</p>
                    <Button size="sm">View Profile</Button>
                </div>)
            }
        </div>
        <div>Reported at: {reportedAt.toDateString()}</div>
        <div>
            <img src="https://placehold.co/250" /> <br />
            {authorized && <input type="file"/>}
        </div>
        <div>
            Notes: <textarea placeholder="Notes"/>
        </div>
        {authorized && (
          <div>
            <Button href={`/reports/edit/${data._id}`} size="sm">Edit</Button>
            <Button size="sm" onClick={handleDelete}>Delete</Button>
          </div>)}
        {/*Basic Information */}
        <div>
            {data.firstName} {data.lastName}
        </div>
        <div>
            <strong>Age: </strong>{data.age} <br />
            <strong>Gender: </strong>{data.gender} <br />
            <strong>Last seen: </strong>{data.lastSeen}
        </div>
        
        {/*Features, Email, Social Media Accounts */}
        <div><strong>Features: </strong>{
          data.features && data.features.map((feature) => {
            return <p>{feature}</p>
          })
        }</div>
        <div><strong>Email: </strong>{data.email && data.email}</div>
        <div><strong>Social Media Accounts: </strong> {
        data.socialMediaAccount && data.socialMediaAccount.map((account) => {
          return <p>{account}</p>
        })
        }</div>
    </div>
  );
}

export const getServerSideProps = async ({ params }) => {
  const { rid } = params;
  const res = await fetch(`http://localhost:3000/api/reports/${rid}`);

  const data = await res.json();
  return {
    props: { data },
  };
};
