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
  Stack,
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
import ArticleIcon from "@mui/icons-material/Article";
import { getReports } from "@/lib/api-lib/api-reports";

function Report(props) {
  const route = `/reports/${props.id}`;
  let image;
  if (props.photo) {
    image = new CloudinaryImage(props.photo, {
      cloudName: "dg0cwy8vx",
      apiKey: process.env.CLOUDINARY_KEY,
      apiSecret: process.env.CLOUDINARY_SECRET,
    }).resize(fill().width(345).height(200));
  }
  return (
    <>
      <Box sx={{ mt: 3 }}>
        <Card style={{ maxWidth: "300px" }} variant="outlined">
          {image ? (
            <CardMedia>
              <AdvancedImage cldImg={image} />
            </CardMedia>
          ) : (
            <CardMedia
              sx={{ height: "200px" }}
              image="https://placehold.co/50"
            />
          )}
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {props.firstName} {props.lastName}
            </Typography>
            

            <Typography>
              <strong>Last seen: </strong> {props.lastSeen} <br />
              <strong>Age: </strong> {props.age} <br />
              <strong>Gender: </strong> {props.gender} <br />
            </Typography>
            <Chip
              sx={{ mt: 2 }}
              variant="outlined"
              color="primary"
              label={props.status}
            />

            <CardActions sx={{p: 0, mt: 2}}>
              <Button variant="contained" disableElevation fullWidth href={route}>
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
      console.log(displayData);
    }
  };
  return (
    <div>
      <Stack direction="row" alignItems="center" spacing={1}>
        <ArticleIcon />
        <Typography variant="h6">Reports</Typography>
      </Stack>

      <div className="row">
        {user && user.type === "authority" && (
          <div>
            <RadioGroup onChange={handleChange} name="filter">
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
            </RadioGroup>
          </div>
        )}
        <Grid container spacing={2}>
          {displayData.length > 0 ? (
            displayData.map((report) => {
              return (
                <Grid item xs={12} md={4} sm={6}>
                  <Report
                    key={report._id}
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
            <Typography sx={{ mt: 3 }}>Nothing to show</Typography>
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
