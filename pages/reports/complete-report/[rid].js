//Hooks
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

//Material UI Components
import {
  Typography,
  Box,
  Button,
  Snackbar,
  Paper,
  Stack,
  CircularProgress,
} from "@mui/material";

//Material UI Icons
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

//Components
import Report from "../../../components/reports/CompleteReport/Report";
import UploadReferencePhotos from "../../../components/reports/CompleteReport/UploadReferencePhotos";
import MissingPersonMainPhoto from "../../../components/reports/CompleteReport/MissingPersonMainPhoto";

//APIs
import { getSingleReport, updateReport } from "@/lib/api-lib/api-reports";
import ReferencePhotos from "@/components/reports/CreateReport/ReferencePhotos";
import referencePhotoUploadProcess from "@/utils/file-upload/referencePhotoUploadProcess";

const ReferencePhotosUpload = ({
  formsToComplete,
  setFormsToComplete,
  setSnackbarValues,
  report,
}) => {
  const [referencePhotos, setReferencePhotos] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleReferencePhotoUpload = async () => {
    if (referencePhotos.length < 3) {
      setIsSubmitted(true);
      return;
    }
    try {
      setIsSubmitted(true);
      setUploading(true);
      const missingPersonName = `${report.firstName} ${report.middleName} ${report.lastName}`;
      const result = await referencePhotoUploadProcess(
        referencePhotos,
        report._id,
        missingPersonName
      );
      console.log(result);
      setFormsToComplete((prev) => {
        return { ...prev, isReferencePhotosUploaded: true };
      });
    } catch (error) {
      setSnackbarValues({ open: true, message: "Something went wrong." });
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Stack direction="row" alignItems="center" spacing={1}>
        {formsToComplete.isReferencePhotosUploaded && (
          <CheckCircleIcon color="primary" />
        )}
        <Typography variant="body1" fontWeight={500}>
          Reference Photos
        </Typography>
      </Stack>
      {!formsToComplete.isReferencePhotosUploaded ? (
        <ReferencePhotos
          referencePhotos={referencePhotos}
          setReferencePhotos={setReferencePhotos}
          isSubmitted={isSubmitted}
        />
      ) : (
        <Typography sx={{ mt: 2 }} variant="body2">
          Reference photos are uploaded
        </Typography>
      )}
      {!formsToComplete.isReferencePhotosUploaded && (
        <Stack direction="row" alignItems="center" spacing={1}>
          {uploading && <CircularProgress size={24} />}
          <Button onClick={handleReferencePhotoUpload} disabled={uploading}>
            Upload
          </Button>
        </Stack>
      )}
    </Paper>
  );
};

export default function Page({ data }) {
  const router = useRouter();
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
    if (
      formsToComplete.isReferencePhotosUploaded &&
      formsToComplete.isReportProfilePhotoUploaded
    ) {
      router.push(`/reports/${data._id}`);
    }
  }, [
    formsToComplete.isReferencePhotosUploaded,
    formsToComplete.isReportProfilePhotoUploaded,
    data._id,
    router
  ]);

  return (
    <>
      <Snackbar
        open={snackbarValues.open}
        autoHideDuration={6000}
        onClose={() => setSnackbarValues({ open: false })}
        message={snackbarValues.message}
      />
      <Box sx={{ margin: "auto" }}>
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
        <ReferencePhotosUpload
          setSnackbarValues={setSnackbarValues}
          formsToComplete={formsToComplete}
          setFormsToComplete={setFormsToComplete}
          report={data}
        />
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
