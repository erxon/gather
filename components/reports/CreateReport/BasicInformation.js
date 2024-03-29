import Layout from "./Layout";
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Paper,
  Popover,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import TextFieldWithValidation from "@/components/forms/TextFieldWithValidation";
import MultipleItemField from "./MultipleItemField";
import { useState } from "react";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import Image from "next/image";
import useSWR from "swr";
import { fetcher } from "@/lib/hooks";
import QueryPhotoSmall from "@/components/photo/QueryPhotoSmall";
import QueryPhoto from "@/components/photo/QueryPhoto";
import calculateTimeElapsed from "@/utils/calculateTimeElapsed";
import computeElapsedTime from "@/utils/helpers/computeElapsedTime";
import QueryPhotoLarge from "@/components/photo/QueryPhotoLarge";
import fileProcessing from "@/utils/file-upload/fileProcessing";
import ErrorAlert from "@/components/ErrorAlert";
import FileUploadGuidelines from "@/components/FileUploadGuidelines";
import GenderSelection from "@/components/forms/GenderSelection";
import AgeField from "@/components/forms/AgeField";

function ImageDetails({ photoId }) {
  const { data, error, isLoading } = useSWR(
    `/api/reporters/uploaded-photo/${photoId}`,
    fetcher
  );

  if (isLoading) return <CircularProgress size={24} />;
  if (error)
    return <Typography variant="body2">Something went wrong</Typography>;

  if (!data) {
    return <Typography color="GrayText">Unknown</Typography>;
  }

  const date = new Date(data.createdAt);
  const elapsedTime = computeElapsedTime(date);

  return (
    <Box>
      <Typography variant="body2" sx={{ fontWeight: "bold" }}>
        {data.firstName} {data.lastName} (uploader)
      </Typography>
      <Typography variant="body2" color="GrayText">
        {elapsedTime}
      </Typography>
      <Typography variant="body2" color="GrayText">
        Email: {data.email}
      </Typography>
      <Typography variant="body2" color="GrayText">
        Contact number: {data.contactNumber}
      </Typography>
    </Box>
  );
}

function ImageSelections({ setSelectedImage, setOpen, setPhotoAdded }) {
  const { data, isLoading, error } = useSWR("/api/photos/types/query", fetcher);

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography>Something went wrong</Typography>;

  const handleSelectImage = (query) => {
    setSelectedImage(query);
    setOpen(false);
    setPhotoAdded({ added: true, new: false });
  };

  return (
    <List>
      {data.map((query) => {
        return (
          <ListItem disablePadding key={query._id}>
            <ListItemButton onClick={() => handleSelectImage(query)}>
              <QueryPhotoSmall publicId={query.image} />
              <Box sx={{ ml: 2 }}>
                <ImageDetails photoId={query._id} />
              </Box>
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
}

function SelectExistingImageDialog({
  open,
  setOpen,
  setSelectedImage,
  setPhotoAdded,
}) {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Select existing image</DialogTitle>
      <ImageSelections
        setPhotoAdded={setPhotoAdded}
        setOpen={setOpen}
        setSelectedImage={setSelectedImage}
      />
    </Dialog>
  );
}

function NewImageDialog({ open, setOpen, setPhoto, photo, setPhotoAdded }) {
  const [error, setError] = useState({
    open: false,
    message: "",
  });
  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    fileProcessing(
      event.target.files[0],
      (onLoadEvent, file) => {
        setPhoto({
          src: onLoadEvent.target.result,
          file: file,
        });
      },
      (message) => {
        setError({
          open: true,
          message: message,
        });
      }
    );
  };

  const handleProceed = () => {
    if (!photo.file) {
      setOpen(false);
      return;
    }
    setPhotoAdded({ added: true, new: true });
    setOpen(false);
  };

  const errorAlertClose = () => {
    setError({
      open: false,
      message: "",
    });
  };

  return (
    <Dialog fullWidth open={open} onClose={handleClose}>
      <DialogTitle>Add new image</DialogTitle>

      <DialogContent>
        <Box sx={{ mb: 1.5 }}>
          <FileUploadGuidelines content="File should be less than 5 MB" />
        </Box>
        <Button component="label" size="small">
          {photo.file ? "Change Image" : "Select Image"}
          <input
            onChange={handleChange}
            hidden
            type="file"
            accept=".jpg, .jpeg, .png"
          />
        </Button>
        {photo.file && <Typography>{photo.file.name}</Typography>}
        <ErrorAlert
          open={error.open}
          message={error.message}
          close={errorAlertClose}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleProceed}>Proceed</Button>
        <Button onClick={handleClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}

function UploadNewImage({
  photoAdded,
  setPhotoAdded,
  photo,
  setPhoto,
  selectedImage,
  setSelectedImage,
}) {
  const [anchorEl, setAnchorEl] = useState(null);

  const [openNewImageDialog, setOpenNewImageDialog] = useState(false);
  const [selectExistingImageDialog, setSelectExistingImageDialog] =
    useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.target);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const selectNewImage = () => {
    setAnchorEl(null);
    setOpenNewImageDialog(true);
  };

  const selectExistingImage = () => {
    setAnchorEl(null);
    setSelectExistingImageDialog(true);
  };

  const open = Boolean(anchorEl);
  const id = open ? "select-image" : undefined;

  return (
    <div>
      <NewImageDialog
        setPhoto={setPhoto}
        photo={photo}
        setPhotoAdded={setPhotoAdded}
        open={openNewImageDialog}
        setOpen={setOpenNewImageDialog}
      />
      <SelectExistingImageDialog
        open={selectExistingImageDialog}
        setOpen={setSelectExistingImageDialog}
        setSelectedImage={setSelectedImage}
        setPhotoAdded={setPhotoAdded}
      />
      <Paper
        variant="outlined"
        sx={{
          height: 300,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          mb: 2,
        }}
      >
        {photoAdded.added &&
          (photoAdded.new ? (
            <Image
              alt="missing person report photo"
              style={{ objectFit: "cover" }}
              src={photo.src}
              width={200}
              height={200}
            />
          ) : (
            <QueryPhotoLarge publicId={selectedImage.image} />
          ))}
        <Box sx={{ display: "flex", direction: "row", alignItems: "center" }}>
          <IconButton onClick={handleClick} component="label" color="primary">
            <AddPhotoAlternateIcon />
          </IconButton>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            <List>
              <ListItem disablePadding>
                <ListItemButton onClick={selectNewImage}>
                  <Typography variant="body2">New image</Typography>
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton onClick={selectExistingImage}>
                  <Typography variant="body2">Existing image</Typography>
                </ListItemButton>
              </ListItem>
            </List>
          </Popover>
          <Typography variant="body2">
            {!photoAdded.added ? "Add image" : "Change"}
          </Typography>
        </Box>
      </Paper>
    </div>
  );
}

export default function BasicInformation({
  formValues,
  setFormValues,
  collections,
  setCollections,
  isSubmitted,
  photoAdded,
  setPhotoAdded,
  photo,
  setPhoto,
  selectedImage,
  setSelectedImage,
}) {
  const handleInput = (event) => {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      basicInformation: {
        ...formValues.basicInformation,
        [name]: value,
      },
    });
  };

  return (
    <Layout head="Basic Information">
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <UploadNewImage
            photoAdded={photoAdded}
            setPhotoAdded={setPhotoAdded}
            photo={photo}
            setPhoto={setPhoto}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
          />
          {
            <Collapse sx={{ mb: 2 }} in={!photoAdded.added && isSubmitted}>
              <Alert severity="error">Please select a photo</Alert>
            </Collapse>
          }
          <TextFieldWithValidation
            isSubmitted={isSubmitted}
            style={{ mb: 2 }}
            value={formValues.basicInformation.firstName}
            changeHandler={handleInput}
            isFullWidth={true}
            name="firstName"
            variant="standard"
            label="First Name"
          />
          <TextFieldWithValidation
            isSubmitted={isSubmitted}
            style={{ mb: 2 }}
            value={formValues.basicInformation.middleName}
            changeHandler={handleInput}
            isFullWidth={true}
            name="middleName"
            variant="standard"
            label="Middle Name"
          />
          <TextFieldWithValidation
            isSubmitted={isSubmitted}
            style={{ mb: 2 }}
            value={formValues.basicInformation.lastName}
            changeHandler={handleInput}
            isFullWidth={true}
            name="lastName"
            variant="standard"
            label="Last Name"
          />
          <TextField
            sx={{ mb: 2, maxWidth: 100 }}
            value={formValues.basicInformation.qualifier}
            onChange={handleInput}
            name="qualifier"
            label="Qualifier"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Stack direction="row" sx={{ mb: 1 }} spacing={1}>
            <AgeField
              isSubmitted={isSubmitted}
              changeHandler={handleInput}
              value={formValues.basicInformation.age}
              style={{ mb: 2 }}
              name="age"
              label="Age (Required)"
            />
            <GenderSelection
              isSubmitted={isSubmitted}
              gender={formValues.basicInformation.gender}
              handleChange={handleInput}
            />
          </Stack>
          <MultipleItemField
            collectionName={"aliases"}
            collection={collections.aliases}
            collections={collections}
            setCollections={setCollections}
            label={"Known Aliases"}
          />
        </Grid>
      </Grid>
    </Layout>
  );
}
