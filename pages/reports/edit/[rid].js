import {
  TextField,
  Typography,
  Button,
  Box,
  Stack,
  InputAdornment,
  IconButton,
  Paper,
  Snackbar,
  CircularProgress,
  Grid,
  Breadcrumbs,
  Link,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import InstagramIcon from "@mui/icons-material/Instagram";
import React, { useState, useEffect } from "react";
import { useUser } from "@/lib/hooks";
import ReportPhoto from "@/components/photo/ReportPhoto";
import {
  getSingleReport,
  updateReport,
  uploadReportPhoto,
} from "@/lib/api-lib/api-reports";
import Image from "next/image";
import ReferencePhotos from "@/components/myreports/ReferencePhotos";
import Sections from "@/components/reports/Edit/Sections";
import TextFieldWithValidation from "@/components/forms/TextFieldWithValidation";
import MultipleItemField from "@/components/reports/CreateReport/MultipleItemField";
import clientFileUpload from "@/utils/api-helpers/clientFileUpload";
import MapWithSearchBox from "@/components/map/MapWithSearchBox";
import fileProcessing from "@/utils/file-upload/fileProcessing";
import uploadReportToCloudinary from "@/utils/file-upload/uploadReportToCloudinary";
import ContentLayout from "@/utils/layout/ContentLayout";

function ChangePhoto({ data, setSnackbarValues }) {
  const [image, setImage] = useState({ renderImage: "", file: null });

  const handleChange = (event) => {
    fileProcessing(
      event.target.files[0],
      (onLoadEvent, file) => {
        setImage({
          renderImage: onLoadEvent.target.result,
          file: file,
        });
      },
      (message) => {
        setSnackbarValues({
          open: true,
          message: message,
        });
      }
    );
  };

  const handleSave = async () => {
    //Upload photo
    const file = image.file;
    const uploadPreset = "report-photos";

    const photoUpload = await uploadReportToCloudinary(file, uploadPreset);
    const response = await updateReport(data._id, {
      photo: photoUpload.public_id,
    });

    setSnackbarValues({
      open: true,
      message: response.message,
    });
  };

  return (
    <Box>
      <Box>
        {data.photo ? (
          <ReportPhoto publicId={data.photo} />
        ) : (
          <Image
            width="150"
            height="150"
            alt="placeholder"
            src={
              image.renderImage === ""
                ? "/assets/placeholder.png"
                : image.renderImage
            }
          />
        )}
      </Box>
      {/*Image file name*/}
      {image.file && (
        <Stack direction="row" alignItems="center" spacing={0.75}>
          <Typography sx={{ color: "GrayText" }} variant="body2">
            {image.file.name}
          </Typography>
          <IconButton onClick={() => setImage({ renderImage: "", file: null })}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Stack>
      )}
      <Box>
        {!image.file ? (
          <Button component="label">
            Choose File
            <input
              hidden
              type="file"
              onChange={handleChange}
              accept=".jpg, .jpeg, .png"
            />
          </Button>
        ) : (
          <Button size="small" onClick={handleSave}>
            Save
          </Button>
        )}
      </Box>
    </Box>
  );
}

function BasicInformation({ data, setSnackbarValues }) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [values, setValues] = useState({
    firstName: data.firstName,
    lastName: data.lastName,
    middleName: data.middleName,
    qualifier: data.qualifier,
    age: data.age,
    gender: data.gender,
  });
  const [aliases, setAliases] = useState({
    aliases: [...data.aliases],
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleSave = async () => {
    if (
      values.firstName !== "" &&
      values.lastName !== "" &&
      values.middleName !== ""
    ) {
      setIsSubmitted(true);

      const response = await updateReport(data._id, {
        ...values,
        aliases: aliases.aliases,
      });

      setSnackbarValues({ open: true, message: response.message });
    } else {
      setIsSubmitted(true);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Grid container spacing={1}>
        <Grid item xs={12} md={6} sm={6}>
          <TextFieldWithValidation
            isSubmitted={isSubmitted}
            style={{ mb: 2 }}
            isFullWidth={true}
            label="First name"
            changeHandler={handleChange}
            value={values.firstName}
            name="firstName"
            variant="outlined"
          />
          <TextFieldWithValidation
            isSubmitted={isSubmitted}
            style={{ mb: 2 }}
            isFullWidth={true}
            label="Middle name"
            changeHandler={handleChange}
            value={values.middleName}
            name="middleName"
            variant="outlined"
          />
          <TextFieldWithValidation
            isSubmitted={isSubmitted}
            style={{ mb: 2 }}
            isFullWidth={true}
            label="Last name"
            changeHandler={handleChange}
            value={values.lastName}
            name="lastName"
            variant="outlined"
          />
          <TextField
            sx={{ maxWidth: 100, mb: 2 }}
            label="Qualifier"
            onChange={handleChange}
            value={values.qualifier}
            name="qualifier"
            variant="outlined"
          />
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField
              label="Age"
              onChange={handleChange}
              value={values.age}
              name="age"
              variant="outlined"
            />
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Gender</InputLabel>
              <Select
                value={values.gender}
                label="Gender"
                name="gender"
                onChange={handleChange}
              >
                <MenuItem value={"male"}>Male</MenuItem>
                <MenuItem value={"female"}>Female</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Grid>
        <Grid item xs={12} md={6} sm={6}>
          <MultipleItemField
            collection={aliases.aliases}
            collectionName={"aliases"}
            collections={aliases}
            setCollections={setAliases}
            label={"Known Aliases"}
          />
        </Grid>
      </Grid>
      <Button onClick={handleSave} sx={{ mt: 2 }}>
        Save
      </Button>
    </Paper>
  );
}

function ContactInformation({ data, setSnackbarValues }) {
  const [values, setValues] = useState({
    email: data.email,
    contactNumber: data.contactNumber,
    socialMediaAccounts: {
      facebook: data.socialMediaAccounts.facebook,
      twitter: data.socialMediaAccounts.twitter,
      instagram: data.socialMediaAccounts.twitter,
    },
  });

  const handleSingleValueField = (event) => {
    const { name, value } = event.target;
    setValues((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleMultiValueField = (event) => {
    const { name, value } = event.target;
    setValues((prev) => {
      return {
        ...prev,
        socialMediaAccounts: { ...prev.socialMediaAccounts, [name]: value },
      };
    });
  };

  const handleSave = async () => {
    const response = await updateReport(data._id, { ...values });
    setSnackbarValues({ open: true, message: response.message });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <TextField
            fullWidth
            label="Email"
            onChange={handleSingleValueField}
            value={values.email}
            id="email"
            name="email"
            type="age"
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Contact Number"
            onChange={handleSingleValueField}
            value={values.contactNumber}
            id="contactNumber"
            name="contactNumber"
            type="text"
            variant="outlined"
          />
        </Stack>
      </Box>
      <Box sx={{ mt: 3 }}>
        <Typography sx={{ mb: 3, fontWeight: "bold" }}>
          Social Media Accounts
        </Typography>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <TextField
            fullWidth
            label="Facebook"
            variant="outlined"
            name="facebook"
            value={values.socialMediaAccounts.facebook}
            onChange={handleMultiValueField}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FacebookIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="Twitter"
            name="twitter"
            variant="outlined"
            value={values.socialMediaAccounts.twitter}
            onChange={handleMultiValueField}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <TwitterIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="Instagram"
            name="instagram"
            variant="outlined"
            value={values.socialMediaAccounts.instagram}
            onChange={handleMultiValueField}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <InstagramIcon />
                </InputAdornment>
              ),
            }}
          />
        </Stack>
      </Box>
      <Button sx={{ mt: 2 }} onClick={handleSave}>
        Save
      </Button>
    </Paper>
  );
}

function Details({ data, setSnackbarValues }) {
  const [isSubmitted, setSubmitted] = useState(false);
  const [singleValueField, setSingleValueField] = useState({
    details: data.details,
    lastKnownClothing: data.lastKnownClothing,
    bloodType: data.bloodType,
    eyeColor: data.eyeColor,
    currentHairColor: data.currentHairColor,
  });
  const [collections, setCollections] = useState({
    smt: [...data.smt],
    prostheticsAndImplants: [...data.prostheticsAndImplants],
    medications: [...data.medications],
    accessories: data.accessories ? [...data.accessories] : [],
    birthDefects: [...data.birthDefects],
  });

  const handleSingleValueInput = (event) => {
    const { name, value } = event.target;
    setSingleValueField((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleSave = async () => {
    setSubmitted(true);
    if (
      singleValueField.lastKnownClothing !== "" &&
      singleValueField.eyeColor !== "" &&
      singleValueField.currentHairColor !== ""
    ) {
      const response = await updateReport(data._id, {
        ...singleValueField,
        ...collections,
      });

      setSnackbarValues({ open: true, message: response.message });
    } else {
      setSnackbarValues({
        open: true,
        message: "Please fill all required details",
      });
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Grid container spacing={1}>
        <Grid item xs={12} md={6} sm={6}>
          <TextFieldWithValidation
            style={{ mb: 2 }}
            isFullWidth={true}
            isSubmitted={isSubmitted}
            label="Current Hair Color (note if dyed or natural)"
            name="currentHairColor"
            value={singleValueField.currentHairColor}
            changeHandler={handleSingleValueInput}
          />
          <TextFieldWithValidation
            style={{ mb: 2 }}
            isFullWidth={true}
            isSubmitted={isSubmitted}
            label="Eye color"
            name="eyeColor"
            value={singleValueField.eyeColor}
            changeHandler={handleSingleValueInput}
          />
          <TextFieldWithValidation
            style={{ mb: 2 }}
            isFullWidth={true}
            isSubmitted={isSubmitted}
            label="Last Known Clothing"
            name="lastKnownClothing"
            value={singleValueField.lastKnownClothing}
            changeHandler={handleSingleValueInput}
          />
          <TextField
            fullWidth
            sx={{ mb: 2 }}
            label="Blood type"
            name="bloodType"
            value={singleValueField.bloodType}
            onChange={handleSingleValueInput}
          />
        </Grid>
        <Grid item xs={12} md={6} sm={6}>
          <MultipleItemField
            label="Scars, marks and tattoos"
            collection={collections.smt}
            collections={collections}
            collectionName={"smt"}
            setCollections={setCollections}
          />
          <MultipleItemField
            label="Prosthetics and Implants"
            collection={collections.prostheticsAndImplants}
            collections={collections}
            collectionName={"prostheticsAndImplants"}
            setCollections={setCollections}
          />
          <MultipleItemField
            label="Medications"
            collection={collections.medications}
            collections={collections}
            collectionName={"medications"}
            setCollections={setCollections}
          />
          <MultipleItemField
            label="Accessories"
            collection={collections.accessories}
            collections={collections}
            collectionName={"accessories"}
            setCollections={setCollections}
          />
          <MultipleItemField
            label="Birth defects"
            collection={collections.birthDefects}
            collections={collections}
            collectionName={"birthDefects"}
            setCollections={setCollections}
          />
        </Grid>
      </Grid>
      <TextField
        fullWidth
        sx={{ mb: 2 }}
        multiline
        rows={3}
        label="Additional"
        name="details"
        value={singleValueField.details}
        onChange={handleSingleValueInput}
      />
      <Button onClick={handleSave}>Save</Button>
    </Paper>
  );
}

function DentalAndFingerprint({ data, setSnackbarValues }) {
  const [dentalAndFingerprint, setDentalAndFingerprint] = useState(
    data.dentalAndFingerprint ? data.dentalAndFingerprint : null
  );
  const [isChanged, setIsChanged] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const handleChangeFile = (event) => {
    if (event.target.files[0].size < 500000) {
      setDentalAndFingerprint(event.target.files[0]);
      setIsChanged(true);
    } else {
      console.log("file exceeds 500 kilobytes");
    }
  };

  const handleOpenFile = async (reportId) => {
    const getFile = await fetch(
      `/api/reports/view-dental-and-fingerprint/${reportId}`
    );
    window.open(getFile.url);
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("file", dentalAndFingerprint);

    const response = await clientFileUpload(
      `/api/reports/file-upload/dental-fingerprint-record/${data._id}`,
      formData
    );

    if (response.status === 200) {
      setSnackbarValues({
        open: true,
        message: "Dental and Fingerprint records changed",
      });
    }
  };

  const handleDelete = async () => {
    if (data.dentalAndFingerprint) {
      //Delete data in database
      setOpenConfirmDialog(false);
      const response = await updateReport(data._id, {
        dentalAndFingerprint: null,
      });
      setSnackbarValues({
        open: true,
        message: "The record has been deleted.",
      });
    } else {
      //Delete current dental and fingerprint file
      setDentalAndFingerprint();
      setIsChanged(false);
    }
  };

  const handleConfirmDialog = () => {
    if (data.dentalAndFingerprint) {
      setOpenConfirmDialog(true);
    } else {
      setDentalAndFingerprint(null);
      setIsChanged(false);
    }
  };

  return (
    <div>
      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
      >
        <DialogTitle>Delete file</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this file?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDelete}>Yes</Button>
          <Button onClick={() => setOpenConfirmDialog(false)}>No</Button>
        </DialogActions>
      </Dialog>
      <Paper sx={{ p: 3 }}>
        <Typography sx={{ mb: 1 }} variant="body2">
          Add dental and fingerprint records
        </Typography>
        {dentalAndFingerprint ? (
          <Stack sx={{ mb: 1 }} direction="row" alignItems="center" spacing={1}>
            <Button
              disabled={isChanged}
              onClick={() => handleOpenFile(data._id)}
              size="small"
            >
              Open file
            </Button>
            <Button component="label" size="small">
              Change file
              <input
                hidden
                onChange={handleChangeFile}
                type="file"
                accept=".jpg, .jpeg, .png, .pdf, .docx"
              />
            </Button>
          </Stack>
        ) : (
          <Button sx={{ mr: 1 }} component="label" size="small">
            Add
            <input
              hidden
              onChange={handleChangeFile}
              type="file"
              accept=".jpg, .jpeg, .png, .pdf, .docx"
            />
          </Button>
        )}
        <Button size="small" disabled={!isChanged} onClick={handleSave}>
          Save
        </Button>
        {dentalAndFingerprint && (
          <Button onClick={handleConfirmDialog} size="small" sx={{ ml: 1 }}>
            Delete
          </Button>
        )}
      </Paper>
    </div>
  );
}

function UpdateLocation({ data, setSnackbarValues }) {
  const [lastSeen, setLastSeen] = useState(data.lastSeen);
  const [location, setLocation] = useState(
    data.location ? data.location : null
  );
  const [isLocationChanged, setIsLocationChanged] = useState(false);

  const handleChange = (event) => {
    setLastSeen(event.target.value);
  };

  const handleSetLocation = (coordinates) => {
    setLocation({
      longitude: coordinates.longitude,
      latitude: coordinates.latitude,
    });
    setIsLocationChanged(true);
  };

  const handleSave = async () => {
    const response = await updateReport(data._id, {
      lastSeen: lastSeen,
      location: {
        longitude: location.longitude,
        latitude: location.latitude,
      },
    });

    setSnackbarValues({ open: true, message: response.message });
    setIsLocationChanged(false);
  };

  return (
    <div>
      <Paper sx={{ p: 3 }}>
        <TextField
          value={lastSeen}
          onChange={handleChange}
          placeholder="Last Seen"
          sx={{ mb: 2 }}
          label="Last Seen"
        />
        {location && (
          <MapWithSearchBox
            setNewPosition={handleSetLocation}
            lng={location.longitude}
            lat={location.latitude}
          />
        )}
        <Button
          disabled={!isLocationChanged}
          onClick={handleSave}
          sx={{ mt: 3 }}
        >
          Save
        </Button>
      </Paper>
    </div>
  );
}

export default function EditReport({ data }) {
  const [user, { loading }] = useUser();

  const [status, setStatus] = useState(data.status);
  const [isStatusChange, setStatusChange] = useState(false);
  const [photoId, setPhotoId] = useState(null);
  //for snackbar
  const [snackbarValues, setSnackbarValues] = useState({
    open: false,
    message: "",
  });
  const [body, setBody] = useState({
    firstName: data.firstName,
    lastName: data.lastName,
    lastSeen: data.lastSeen,
    age: data.age,
    gender: data.gender,
    email: data.email,
    contactNumber: data.contactNumber,
    photo: data.photo,
    details: data.details,
  });
  const [features, setFeatures] = useState([...data.features]);
  const [value, setValue] = useState({
    facebook: Object.hasOwn(data, "socialMediaAccounts")
      ? data.socialMediaAccounts.facebook
      : "",
    twitter: Object.hasOwn(data, "socialMediaAccounts")
      ? data.socialMediaAccounts.twitter
      : "",
    feature: "",
  });
  const [currentSection, setCurrentSection] = useState("Photo");

  if (!user) {
    return <CircularProgress />;
  }

  //Snackbar
  const handleClose = () => {
    setSnackbarValues((prev) => {
      return { ...prev, open: false };
    });
  };

  //Image

  //Features
  const handleDeleteFeatures = (feature) => {
    setFeatures((prev) => {
      return prev.filter((item) => {
        return item !== feature;
      });
    });
  };

  const handleInputChange = (e) => {
    const { value, name } = e.target;
    setValue((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleFormChange = (e) => {
    const { value, name } = e.target;
    setBody((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleInputSubmit = (typeOfInput) => {
    if (typeOfInput === "account") {
      setAccounts((prev) => {
        return [...prev, value.account];
      });
    } else if (typeOfInput === "features") {
      setFeatures((prev) => {
        return [...prev, value.feature];
      });
      setSnackbarValues({
        open: true,
        message: "Feature added",
      });
    }

    setValue({
      account: "",
      feature: "",
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    //Upload photo to cloud
    //Add the public id to photo property in update

    //if status set to active trigger a notification
    const update = {
      ...body,
      photoId: photoId,
      updatedBy: user._id,
      updatedAt: new Date(),
      socialMediaAccounts: { facebook: value.facebook, twitter: value.twitter },
      features: [...features],
    };
    //update report
    const message = await updateReport(data._id, update);
    setSnackbarValues({ open: true, message: message.message });
  };
  const actions = (
    <React.Fragment>
      <Button
        href={`/reports/${data._id}`}
        color="secondary"
        size="small"
        onClick={handleClose}
      >
        BACK
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );
  const reportedDateAndTime = `${new Date(
    data.reportedAt
  ).toDateString()} ${new Date(data.reportedAt).toLocaleTimeString()}`;
  const updatedDateAndTime = data.updatedAt
    ? `${new Date(data.updatedAt).toDateString()} ${new Date(
        data.updatedAt
      ).toLocaleTimeString()}`
    : null;

  return (
    <>
      <ContentLayout>
        <Snackbar
          open={snackbarValues.open}
          autoHideDuration={6000}
          onClose={handleClose}
          message={snackbarValues.message}
          action={actions}
        />
        <Breadcrumbs>
          <Link underline="hover" color="inherit" href={`/reports/${data._id}`}>
            My report
          </Link>
          <Typography color="text.primary">Edit Report</Typography>
        </Breadcrumbs>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <Sections
              currentSection={currentSection}
              setCurrentSection={setCurrentSection}
            />
          </Grid>
          <Grid item xs={12} md={9}>
            <Typography variant="h6">{currentSection}</Typography>
            {currentSection === "Photo" && (
              <ChangePhoto setSnackbarValues={setSnackbarValues} data={data} />
            )}
            {currentSection === "Basic information" && (
              <BasicInformation
                setSnackbarValues={setSnackbarValues}
                data={data}
              />
            )}
            {currentSection === "Contact information" && (
              <ContactInformation
                setSnackbarValues={setSnackbarValues}
                data={data}
              />
            )}
            {currentSection === "Details" && (
              <Details setSnackbarValues={setSnackbarValues} data={data} />
            )}
            {currentSection === "Dental and Fingerprint Records" && (
              <DentalAndFingerprint
                setSnackbarValues={setSnackbarValues}
                data={data}
              />
            )}
            {currentSection === "Location" && (
              <UpdateLocation
                data={data}
                setSnackbarValues={setSnackbarValues}
              />
            )}
            {currentSection === "Reference Photos" && (
              <ReferencePhotos
                reportId={data._id}
                mpName={`${data.firstName} ${data.lastName}`}
              />
            )}
          </Grid>
        </Grid>
      </ContentLayout>
    </>
  );
}

export async function getServerSideProps({ params }) {
  const { rid } = params;

  const data = await getSingleReport(rid);

  if (!data) {
    return {
      redirect: {
        destination: `/reports/${rid}`,
        permanent: false,
      },
    };
  }
  return {
    props: { data },
  };
}
