//Hooks
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

//Material UI Components
import { Typography, Box, Button, Snackbar } from "@mui/material";

//Components
import Report from "./Report";
import UploadReferencePhotos from "./UploadReferencePhotos";
import MissingPersonMainPhoto from "./MissingPersonMainPhoto";

//APIs
import { getSingleReport, updateReport } from "@/lib/api-lib/api-reports";

export default function Page({ data }) {
  const router = useRouter();
  const [completed, setCompleted] = useState(data.completed);
  const [formsToComplete, setFormsToComplete] = useState({
    isReportProfilePhotoUploaded: !!data.photo,
    isReferencePhotosUploaded: !!data.referencePhotos,
  });
  const [snackbarValues, setSnackbarValues] = useState({
    open: false,
    message: "",
  });

  //if report is already completed, redirect to the report page
  useEffect(() => {
    if (completed) {
      router.push(`/reports/${data._id}`);
    }
  }, [completed]);

  //Handle submit for signup and report update.
  const handleFinish = async () => {
    await updateReport(data._id, {
      completed: true,
    });
    setCompleted(true);
  };

  return (
    <>
      <Snackbar
        open={snackbarValues.open}
        autoHideDuration={6000}
        onClose={() => setSnackbarValues({ open: false })}
        message={snackbarValues.message}
      />
      <Box sx={{ margin: "auto", width: { xs: "100%", md: "50%" } }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5">Finish-up your report</Typography>
        </Box>

        <Report data={data} />
        {/*Report profile photo upload */}
        <MissingPersonMainPhoto
          setSnackbar={setSnackbarValues}
          reportId={data._id}
          setUploaded={setFormsToComplete}
          uploaded={formsToComplete.isReportProfilePhotoUploaded}
          currentPhoto={data.photo}
        />
        {/*Upload photo*/}
        <UploadReferencePhotos
          mpName={`${data.firstName} ${data.lastName}`}
          reportId={data._id}
          uploaded={formsToComplete.isReferencePhotosUploaded}
          setUploaded={setFormsToComplete}
          setSnackbar={setSnackbarValues}
        />
        <Button
          disabled={
            !(
              formsToComplete.isReferencePhotosUploaded &&
              formsToComplete.isReportProfilePhotoUploaded
            )
          }
          variant="contained"
          onClick={handleFinish}
        >
          Finish
        </Button>
      </Box>
    </>
  );
}

export async function getServerSideProps(context) {
  const { rid } = context.params;
  const data = await getSingleReport(rid);
  return {
    props: { data },
  };
}
