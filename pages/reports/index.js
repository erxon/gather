/*
This page displays all reports. Authorities could see
all reports while citizens could only see active reports.
*/
import { CloudinaryImage } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { useUser } from "@/lib/hooks";
import { useState } from "react";
import {
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Box,
  Grid,
  Chip,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import PlaceIcon from "@mui/icons-material/Place";
import { getReports } from "@/lib/api-lib/api-reports";
import StackRowLayout from "@/utils/StackRowLayout";
import ArticleIcon from "@mui/icons-material/Article";

function Report(props) {
  const route = `/reports/${props.id}`;
  let image;
  if (props.photo) {
    image = new CloudinaryImage(props.photo, {
      cloudName: "dg0cwy8vx",
      apiKey: process.env.CLOUDINARY_KEY,
      apiSecret: process.env.CLOUDINARY_SECRET,
    }).resize(fill().height(150));
  }
  return (
    <>
      <Box sx={{ mt: 3 }}>
        <Card style={{ maxWidth: "300px" }}>
          {image ? (
            <CardMedia
              sx={{
                height: 150,
                textAlign: "center",
                backgroundColor: "#F2F4F4",
              }}
            >
              <AdvancedImage cldImg={image} />
            </CardMedia>
          ) : (
            <CardMedia
              sx={{ height: "200px" }}
              image="https://placehold.co/50"
            />
          )}
          <CardContent>
            <StackRowLayout spacing={1}>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 0.5 }}>
                {props.firstName} {props.lastName}
              </Typography>
              <Chip
                sx={{ mt: 2 }}
                variant="filled"
                color="success"
                label={props.status}
              />
            </StackRowLayout>
            <StackRowLayout spacing={1}>
              <PersonIcon />
              <Typography variant="body1">
                {props.age}, {props.gender}
              </Typography>
            </StackRowLayout>
            <StackRowLayout spacing={1}>
              <PlaceIcon />
              <Typography variant="body1">{props.lastSeen}</Typography>
            </StackRowLayout>

            <CardActions sx={{ p: 0, mt: 2 }}>
              <Button variant="contained" fullWidth href={route}>
                View
              </Button>
            </CardActions>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}

export default function ReportPage({ data }) {
  const [user, { mutate }] = useUser();
  const [displayData, setDisplayData] = useState(
    data.filter((report) => report.status === "active")
  );
  const handleChange = (event) => {
    if (event.target.value === "all") {
      setDisplayData(data);
    } else {
      setDisplayData(
        data.filter((report) => report.status === event.target.value)
      );
    }
  };
  return (
    <div>
      <Box sx={{ mb: 3 }}>
        <StackRowLayout spacing={1}>
          <ArticleIcon />
          <Typography variant="h5">Reports</Typography>
        </StackRowLayout>
      </Box>
      <div>
        {user && user.status === "verified" && user.type === "authority" && (
          <RadioGroup onChange={handleChange} name="filter">
            <StackRowLayout>
              <FormControlLabel
                value="pending"
                control={<Radio />}
                label="Pending"
              />
              <FormControlLabel
                value="active"
                control={<Radio />}
                label="Active"
              />
              <FormControlLabel
                value="closed"
                control={<Radio />}
                label="Closed"
              />
              <FormControlLabel value="all" control={<Radio />} label="All" />
            </StackRowLayout>
          </RadioGroup>
        )}
        <Grid container spacing={2}>
          {displayData.length > 0 ? (
            displayData.map((report) => {
              return (
                <Grid item xs={12} md={4} sm={6} key={report._id}>
                  <Report
                    id={report._id}
                    photo={report.photo}
                    firstName={report.firstName}
                    lastName={report.lastName}
                    lastSeen={report.lastSeen}
                    age={report.age}
                    gender={report.gender}
                    status={report.status}
                  />
                </Grid>
              );
            })
          ) : (
            <Typography sx={{ mt: 3, p: 3 }} color="GrayText" variant="body1">
              Nothing to show
            </Typography>
          )}
        </Grid>
      </div>
    </div>
  );
}

export const getServerSideProps = async () => {
  //Get all reports
  const data = await getReports();
  return { props: { data } };
};
