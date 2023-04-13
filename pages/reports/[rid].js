import { useRouter } from "next/router";
import { Button, Form } from "react-bootstrap";

export default function ReportPage({ data }) {
    const reportedAt = new Date(data.reportedAt)
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
            <img src="https://placehold.co/250" />
        </div>
        <div>
            Notes: <textarea placeholder="Notes"/>
        </div>
        
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
        <div><strong>Features: </strong></div>
        <div><strong>Email: </strong></div>
        <div><strong>Social Media Accounts: </strong></div>
    </div>
  );
}

export const getServerSideProps = async ({ params }) => {
  const { rid } = params;
  const res = await fetch(`http://localhost:3000/api/reports/${rid}`);

  const data = await res.json();
    console.log(data)
  return {
    props: { data },
  };
};
