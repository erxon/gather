/*
This page renders a single report using report ID.
It checks if the user owns the report or if the user.type is authority.
If so, the user could edit or delete the report.
*/
import React from "react";
import Router from "next/router";
import { useEffect, useState } from "react";
import { fetcher, useUser } from "@/lib/hooks";
import {
  Box,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Stack,
  Chip,
  Paper,
  Collapse,
} from "@mui/material";

import { getSingleReport, deleteReport } from "@/lib/api-lib/api-reports";
import EditIcon from "@mui/icons-material/Edit";
import UpdateIcon from "@mui/icons-material/Update";
import { useRouter } from "next/router";
import TabLayout from "@/components/reports/TabLayout";
import SectionHeader from "@/utils/SectionHeader";
//Components
import ReportInformation from "@/components/reports/ReportPage/ReportInformation";
import ReportProcessing from "@/components/reports/ReportPage/ReportProcessing";
import ReportProcessLogs from "@/components/reports/ReportPage/ReportProcessLogs";
import ProfilePhoto from "@/components/photo/ProfilePhoto";
import Image from "next/image";
import computeElapsedTime from "@/utils/helpers/computeElapsedTime";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import useSWR from "swr";
import QueryPhoto from "@/components/photo/QueryPhoto";
import IconText from "@/utils/components/IconText";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import ContentLayout from "@/utils/layout/ContentLayout";

function UpdatedBy({ updatedBy, updatedAt }) {
  const dateUpdated = new Date(updatedAt);
  const timeElapsed = computeElapsedTime(dateUpdated);
  const router = useRouter();
  const { _id, photo, username, firstName, lastName, type } = updatedBy;

  const handleRoute = () => {
    router.push(`/profile/${_id}`);
  };

  return (
    <Box sx={{ p: 1, maxWidth: 300 }}>
      <Typography sx={{ mb: 1 }} color="GrayText" variant="body2">
        Last update
      </Typography>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Box>
          {photo ? (
            <ProfilePhoto publicId={photo} />
          ) : (
            <Image
              width={32}
              height={32}
              style={{ borderRadius: "100%" }}
              alt="placeholder for profile photo"
              src="/assets/placeholder.png"
            />
          )}
        </Box>
        <Box>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Typography sx={{ fontWeight: "bold" }} variant="body2">
              {firstName} {lastName}
            </Typography>
            <Typography variant="body2">{timeElapsed}</Typography>
          </Stack>
          <Typography sx={{ color: "GrayText" }} variant="body2">
            {username}
          </Typography>
        </Box>
      </Stack>
      <Button
        onClick={handleRoute}
        sx={{ mt: 1 }}
        startIcon={<AccountCircleIcon />}
        size="small"
      >
        View Profile
      </Button>
    </Box>
  );
}

function MatchedPhoto({ photo }) {
  const { data, isLoading, error } = useSWR(`/api/photos/${photo}`, fetcher);

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography>Something went wrong</Typography>;

  return <QueryPhoto publicId={data.image} />;
}

function Match({ photo }) {
  const { data, error, isLoading } = useSWR(
    `/api/reporters/uploaded-photo/${photo}`,
    fetcher
  );

  const router = useRouter();

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography>Something went wrong.</Typography>;

  const date = data.createdAt;
  const elapsedTime = computeElapsedTime(date);

  const handleRoute = () => {
    router.push(`/found-person/${photo}`);
  };

  return (
    <Paper sx={{ px: 3, pt: 2, pb: 2 }}>
      {" "}
      <Typography variant="h6">Match found</Typography>
      <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
        <Stack direction="row" alignItems="flex-start" spacing={1}>
          <MatchedPhoto photo={photo} />
          <Box>
            <Typography sx={{ mb: 1 }} variant="body2">
              This matches the photo uploaded by {data.firstName}{" "}
              {data.lastName} {elapsedTime}
            </Typography>

            <Typography>
              About {data.firstName} {data.lastName}
            </Typography>
            <IconText
              icon={<PhoneIcon fontSize="small" />}
              text={data.contactNumber}
            />
            <IconText icon={<EmailIcon fontSize="small" />} text={data.email} />
          </Box>
        </Stack>
      </Paper>
      <Button
        variant="outlined"
        sx={{ mt: 3, alignSelf: "center", mr: "auto" }}
        size="small"
        onClick={handleRoute}
      >
        View
      </Button>
    </Paper>
  );
}

function DetailSection({ data, title }) {
  console.log(typeof data);
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="body2" sx={{ fontWeight: "bold", mb: 1 }}>
        {title}
      </Typography>
      {typeof data === "object" ? (
        data.length > 0 ? (
          data.map((item, index) => {
            return <Chip key={index} label={item} />;
          })
        ) : (
          <Typography variant="body2" color="GrayText">
            None
          </Typography>
        )
      ) : (
        <Typography variant="body2">{data}</Typography>
      )}
    </Box>
  );
}

function ReportDetails({
  details,
  aliases,
  smt,
  medications,
  prostheticsAndImplants,
  clothingAndAccessories,
  bloodType,
}) {
  return (
    <Paper sx={{ p: 3, mb: 1 }}>
      <SectionHeader title="Details" />
      <Typography variant="body1" sx={{ my: 2 }}>
        {details}
      </Typography>
      <DetailSection data={aliases} title={"Aliases"} />
      <DetailSection data={smt} title={"Scars, Marks, and Tattoos"} />
      <DetailSection data={medications} title={"Medications"} />
      <DetailSection
        data={prostheticsAndImplants}
        title={"Prosthetics and Implants"}
      />
      <DetailSection
        data={clothingAndAccessories}
        title={"Clothing and Accessories"}
      />
      <DetailSection data={bloodType} title={"Blood Type"} />
      <Button size="small">View all</Button>
    </Paper>
  );
}

export default function ReportPage({ data }) {
  const router = useRouter();
  const [user, { mutate, loading }] = useUser();
  const [authorized, isAuthorized] = useState(false);
  const [updateReport, setUpdateReport] = useState(false);

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
  }, [user, data.username, loading]);

  if (loading) return <CircularProgress />;

  //Delete report
  const handleDelete = async () => {
    const res = await deleteReport(data._id);
    console.log(res);
    if (res === 200) {
      Router.push("/reportDashboard");
    }
  };

  return (
    <>
      <ContentLayout>
        <TabLayout
          userType={user && user.type}
          userId={user && user._id}
          reportOwner={data.account}
          reportId={data._id}
          index={0}
        >
          <Box>
            {/*If the user is the owner of the report, and not yet completed*/}
            {!data.referencePhotos &&
              (!data.photo || !data.photoId) &&
              user._id === data.account && (
                <Box sx={{ p: 1 }}>
                  <Typography sx={{ fontWeight: "bold" }}>
                    Finish your report
                  </Typography>
                  <Typography sx={{ mt: 0.5, mb: 1 }} variant="body2">
                    Your Report still needs required information
                  </Typography>
                  <Button
                    href={`/reports/complete-report/${data._id}`}
                    size="small"
                  >
                    Finish report
                  </Button>
                </Box>
              )}
            <Stack direction="row" alignItems="flex-start" spacing={1.5}>
              {data.updatedBy && (
                <Box sx={{ mb: 3, width: "75%" }}>
                  <UpdatedBy
                    updatedBy={data.updatedBy}
                    updatedAt={data.updatedAt}
                  />
                </Box>
              )}
              {user &&
                ((data.editors.length > 0 && data.editors.includes(user._id)) ||
                  user.role === "reports administrator") && (
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => {
                      router.push(`/reports/edit/${data._id}`);
                    }}
                    variant="outlined"
                    sx={{ mr: 2 }}
                  >
                    Edit
                  </Button>
                )}
              {user &&
                (data.assignedTo === user._id ||
                  user.role === "reports administrator") && (
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<UpdateIcon />}
                    onClick={() => setUpdateReport(!updateReport)}
                  >
                    Process
                  </Button>
                )}
            </Stack>
            {user &&
              ((user.type === "authority" &&
                user.role === "reports administrator") ||
                user._id === data.assignedTo) && (
                <Box>
                  <Collapse in={updateReport}>
                    <ReportProcessing currentUser={user} report={data} />
                  </Collapse>
                </Box>
              )}
            {/*Basic Information */}
            {user &&
            (user._id === data.account ||
              user.role === "reports administrator" ||
              user.type === "authority") ? (
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12} md={8}>
                  {data.match && <Match photo={data.match} />}
                  <Box sx={{ mt: 1 }}>
                    <ReportInformation
                      authorized={authorized}
                      data={data}
                      user={user}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ mb: 3 }}>
                    <ReportProcessLogs
                      report={data}
                      user={user}
                      reportId={data._id}
                    />
                  </Box>
                  {/*Report Details*/}
                  {/*******************************************/}
                  <ReportDetails
                    details={data.details}
                    aliases={data.aliases}
                    smt={data.smt}
                    prostheticsAndImplants={data.prostheticsAndImplants}
                    medications={data.medications}
                    clothingAndAccessories={data.clothingAndAccessories}
                    bloodType={data.bloodType}
                  />
                </Grid>
              </Grid>
            ) : (
              <Grid container sx={{ mt: 3 }} spacing={1}>
                <Grid item xs={12} md={8}>
                  <ReportInformation
                    authorized={authorized}
                    data={data}
                    user={user}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <ReportDetails
                    details={data.details}
                    aliases={data.aliases}
                    smt={data.smt}
                    prostheticsAndImplants={data.prostheticsAndImplants}
                    medications={data.medications}
                    clothingAndAccessories={data.clothingAndAccessories}
                    bloodType={data.bloodType}
                  />
                </Grid>
              </Grid>
            )}
          </Box>
        </TabLayout>
      </ContentLayout>
    </>
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
