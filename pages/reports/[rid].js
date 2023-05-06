/*
This page renders a single report using report ID.
It checks if the user owns the report or if the user.type is authority.
If so, the user could edit or delete the report.
*/

import Router from "next/router";
import { useEffect, useState } from "react";
import { useUser } from "@/lib/hooks";
import ReportPhoto from "@/components/photo/ReportPhoto";
import { Box, Typography, Button, TextField, Grid, Stack } from "@mui/material";
import Link from "next/link";
import { getSingleReport, deleteReport } from "@/lib/api-lib/api-reports";

//Share Buttons
import FacebookButton from "@/components/socialMediaButtons/FacebookButton";
import TwitterButton from "@/components/socialMediaButtons/TwitterButton";

export default function ReportPage({ data }) {
  console.log(data);
  const reportedAt = new Date(data.reportedAt);
  const [user, { mutate }] = useUser();
  const [authorized, isAuthorized] = useState(false);
  //Checks if the user is authorized
  useEffect(() => {
    if (!user) {
      return;
    } else {
      if (user.username === data.username || user.type === "authority") {
        isAuthorized(true);
      } else {
        isAuthorized(false);
      }
    }
  }, [user]);
  //Delete report
  const handleDelete = async () => {
    const res = await deleteReport(data._id);
    console.log(res);
    if (res === 200) {
      Router.push("/reportDashboard");
    }
  };

  return (
    <Box>
      <div>
        <Typography variant="body1"> Reported by: </Typography>{" "}
        {data.reporter && (
          <Box>
            <Typography variant="body2">
              {data.reporter.firstName} {data.reporter.lastName}
            </Typography>
            <Typography variant="body2">
              {data.reporter.contactNumber}
            </Typography>
            <Typography variant="body2">{data.reporter.email}</Typography>
          </Box>
        )}
        {Object.hasOwn(data, "username") && (
          <Box sx={{ mt: 0.5 }}>
            <Typography variant="body2">
              <Link href={`/profile/${data.account}`}>{data.username}</Link>
            </Typography>
          </Box>
        )}
      </div>
      <Typography sx={{ mt: 2 }} variant="body2">
        {reportedAt.toDateString()} {reportedAt.toLocaleTimeString()}
      </Typography>
      <Stack direction="row" spacing={2}>
        <Box>
          <div>
            {data.photo ? (
              <ReportPhoto publicId={data.photo} />
            ) : (
              <div>
                <img src="https://placehold.co/250" /> <br />
              </div>
            )}
          </div>
          {authorized && (
            <Box>
              <TextField
                multiline
                sx={{ mt: 3, width: "250px" }}
                rows={4}
                label="Notes"
              />
            </Box>
          )}
          {authorized && (
            <div>
              <Button href={`/reports/edit/${data._id}`} size="sm">
                Edit
              </Button>
              <Button size="sm" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          )}
        </Box>
        {/*Basic Information */}
        <Box>
          <Typography variant="h4">
            {data.firstName} {data.lastName}
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1">
              <strong>Age: </strong>
              {data.age} <br />
            </Typography>
            <Typography variant="body1">
              <strong>Gender: </strong>
              {data.gender} <br />
            </Typography>
            <Typography variant="body1">
              <strong>Last seen: </strong>
              {data.lastSeen}
            </Typography>
          </Box>

          {/*Features, Email, Social Media Accounts */}
          <Box>
            <Typography variant="body1">
              <strong>Features: </strong>
            </Typography>
            {data.features &&
              data.features.map((feature) => {
                return <Typography>{feature}</Typography>;
              })}
          </Box>
          <Box>
            <Typography variant="body1">
              <strong>Email: </strong>
              {data.email && data.email}
            </Typography>
          </Box>
          <Box>
            <Typography>
              <strong>Social Media Accounts: </strong>
            </Typography>
            {data.socialMediaAccounts && (
              <Box>
                <Typography>
                  Facebook: {data.socialMediaAccounts.facebook}
                </Typography>
                <Typography>
                  Twitter: {data.socialMediaAccounts.twitter}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
        {data.status === "active" && authorized && (
          <Stack>
            <FacebookButton /> 
            <TwitterButton />
          </Stack>
        )}
      </Stack>
    </Box>
  );
}

export const getServerSideProps = async ({ params }) => {
  const { rid } = params;
  //Get single report
  const data = await getSingleReport(rid);
  return {
    props: { data },
  };
};
