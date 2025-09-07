"use client";

import { Box, Modal, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 600,
  maxHeight: "80vh",
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 3,
  overflow: "hidden",
};

export default function TermsModal({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  return (
    <>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={style}>
          {/* Close Button */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            {/* Title */}
            <Typography variant="h6" align="center" sx={{ fontWeight: "bold" }}>
              Terms & Conditions
            </Typography>
            <IconButton onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Scrollable Content */}
          <Box sx={{ maxHeight: "60vh", overflowY: "auto", pr: 1, pb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Eligibility
            </Typography>
            <Typography variant="body2" paragraph>
              Open to participants aged 15–35. Registration with payment
              required.
            </Typography>

            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Registration & Fees
            </Typography>
            <Typography variant="body2" paragraph>
              Registration valid only after payment. Fees are non-refundable.
            </Typography>

            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Health & Safety
            </Typography>
            <Typography variant="body2" paragraph>
              Participants must be fit to join. Consult a doctor if needed.
              Organizers are not responsible for injuries or health issues.
            </Typography>

            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Code of Conduct
            </Typography>
            <Typography variant="body2" paragraph>
              Follow trainer instructions at all times. Misconduct may lead to
              removal without refund.
            </Typography>

            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Liability
            </Typography>
            <Typography variant="body2" paragraph>
              Participation is at your own risk. Organizers are not liable for
              loss, damage, or injury.
            </Typography>

            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Media Consent
            </Typography>
            <Typography variant="body2" paragraph>
              Photos/videos may be taken for promotion. By joining, you consent
              to their use.
            </Typography>

            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Changes & Cancellations
            </Typography>
            <Typography variant="body2">
              Organizers may change schedule, venue, or trainers. Fees refunded
              only if camp is cancelled by organizers.
            </Typography>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
