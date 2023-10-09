import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useState } from "react";

export default function DataPrivacyDialog({ open, setOpen, onConfirm }) {
  const [next, setNext] = useState(false);
  const handleClose = () => setOpen(false);
  const handleNext = () => setNext(true);
  const handleBack = () => setNext(false);

  return (
    <Dialog open={open} onClose={handleClose}>
      {!next ? (
        <DialogTitle>Data Privacy Agreement</DialogTitle>
      ) : (
        <DialogTitle>Terms and Conditions</DialogTitle>
      )}
      {!next ? (
        <DialogContent>
          <Typography sx={{ fontWeight: "bold", mb: 1 }}>
            1. Introduction
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            This Data Privacy Agreement Policy outlines the procedures and
            principles for the collection, processing, and protection of
            personal data in accordance with the Philippine National Police
            (PNP) Memorandum 2016-033 dated June 1,2016 concerning the handling
            of reports about missing persons, and the Data Privacy Act of 2012
            (Republic Act No. 10173).
          </Typography>
          <Typography sx={{ fontWeight: "bold", mb: 1 }}>2. Scope </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            This policy applies to all personnel and entities involved in the
            collection, processing, and management of personal data related to
            missing persons within the Philippine National Police.{" "}
          </Typography>
          <Typography sx={{ fontWeight: "bold", mb: 1 }}>
            3. Data Collection and Purpose{" "}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            3.1. Personal data shall only be collected for legitimate and
            specific purposes as defined in the PNP Memorandum concerning
            missing persons.{" "}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            3.2. Data subjects shall be informed of the purpose and legal basis
            for data collection, particularly in the context of reporting
            missing persons.
          </Typography>
          <Typography sx={{ fontWeight: "bold", mb: 1 }}>
            4. Data Processing{" "}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            4.1. Data processing shall be conducted solely by authorized
            personnel who have undergone data protection training.{" "}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            {" "}
            4.2. Data accuracy, relevance, and confidentiality shall be
            maintained throughout the processing of missing persons&apos; reports.{" "}
          </Typography>
          <Typography sx={{ fontWeight: "bold", mb: 1 }}>
            5. Data Security{" "}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            5.1. Adequate security measures shall be implemented to safeguard
            personal data from unauthorized access, disclosure, alteration, or
            destruction.{" "}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            5.2. Access to personal data shall be restricted to authorized
            individuals based on a need-to-know basis.{" "}
          </Typography>
          <Typography sx={{ fontWeight: "bold", mb: 1 }}>
            6. Data Retention{" "}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            6.1. Personal data related to missing persons shall be retained only
            for the duration necessary to fulfill the purposes defined in the
            Memorandum and as required by applicable laws.
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            6.2. Disposal or anonymization of data shall follow established
            procedures.{" "}
          </Typography>
          <Typography sx={{ fontWeight: "bold", mb: 1 }}>
            7. Data Subject Rights{" "}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            7.1. Data subjects have the right to access, correct, and request
            the deletion of their personal data, in accordance with legal and
            procedural constraints.{" "}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            7.2. Requests from data subjects related to missing persons&apos; reports
            shall be handled promptly and in compliance with the law.{" "}
          </Typography>
          <Typography sx={{ fontWeight: "bold", mb: 1 }}>
            8. Data Breach Notification
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            8.1. In the event of a data breach, the Data Protection Officer
            (DPO) shall notify the relevant authorities and affected data
            subjects as mandated by applicable data protection laws.{" "}
          </Typography>
          <Typography sx={{ fontWeight: "bold", mb: 1 }}>
            9. Training and Awareness
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            9.1. Personnel involved in the collection and processing of data
            related to missing persons shall receive regular training on data
            protection principles and this policy.{" "}
          </Typography>
          <Typography sx={{ fontWeight: "bold", mb: 1 }}>
            10. Accountability and Compliance{" "}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            10.1. Non-compliance with this policy and data protection
            regulations may result in disciplinary action.{" "}
          </Typography>
          <Typography sx={{ fontWeight: "bold", mb: 1 }}>
            11. Review and Updates
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            11.1. This policy shall be reviewed periodically and updated as
            necessary to ensure alignment with the PNP Memorandum and any
            changes in data privacy laws.
          </Typography>
          <Typography sx={{ fontWeight: "bold", mb: 1 }}>
            12. Contact Information{" "}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            For inquiries or concerns regarding data privacy matters associated
            with missing persons&apos; reports within the PNP, please contact the
            Data Protection Officer (02) 8234 222, info@privacy.gov.ph.
          </Typography>
        </DialogContent>
      ) : (
        <DialogContent>
          <Typography sx={{ fontWeight: "bold", mb: 1 }}>
            1. Introduction
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            1.1. These Terms and Conditions govern the reporting of missing
            persons to the Philippine National Police (PNP) in compliance with
            the PNP Memorandum 2016-033 dated June 1,2016.
          </Typography>
          <Typography sx={{ fontWeight: "bold", mb: 1 }}>
            2. Reporting
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            2.1. By submitting a report of a missing person to the PNP, you
            agree to provide accurate and truthful information.
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            2.2. You understand that false reporting may result in legal
            consequences.
          </Typography>
          <Typography sx={{ fontWeight: "bold", mb: 1 }}>
            3. Privacy and Data Protection
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            3.1. The personal data collected during the reporting of missing
            persons will be processed in accordance with the PNP Data Privacy
            Agreement Policy and applicable data protection laws.
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            3.2. You consent to the collection, processing, and retention of
            personal data as outlined in the Data Privacy Agreement Policy.
          </Typography>
          <Typography sx={{ fontWeight: "bold", mb: 1 }}>
            4. Confidentiality
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            4.1. The information provided in missing persons&apos; reports will be
            handled with confidentiality and used solely for the purpose of
            locating the missing person.
          </Typography>
          <Typography sx={{ fontWeight: "bold", mb: 1 }}>
            5. Cooperation
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            5.1. You agree to cooperate with the PNP and provide any additional
            information or assistance required to investigate and resolve the
            missing person case.
          </Typography>
          <Typography sx={{ fontWeight: "bold", mb: 1 }}>
            6. Disclaimers
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            6.1. The PNP is not liable for the accuracy of the information
            provided in the missing persons&apos; reports.
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            6.2. The PNP is not responsible for any actions or consequences
            arising from the reporting of missing persons.
          </Typography>
          <Typography sx={{ fontWeight: "bold", mb: 1 }}>
            7. Changes to Terms and Conditions
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            7.1. The PNP reserves the right to modify these Terms and Conditions
            as needed. Updated terms will be published on the PNP website.
          </Typography>
          <Typography sx={{ fontWeight: "bold", mb: 1 }}>
            8. Contact Information
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            For inquiries or concerns regarding these Terms and Conditions,
            please contact the Philippine National Police.
          </Typography>
        </DialogContent>
      )}
      <DialogActions>
        {!next ? (
          <Button onClick={handleNext}>Next</Button>
        ) : (
          <div>
            <Button onClick={handleBack}>Back</Button>
            <Button onClick={onConfirm}>Confirm</Button>
          </div>
        )}
        <Button onClick={handleClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}
