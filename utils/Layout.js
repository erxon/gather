
import Image from "next/image";
import ComponentNavbar from "@/components/ComponentNavbar";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/utils/theme";
import SideNavBar from "@/components/SideNavBar";
import { Box, Drawer} from "@mui/material";
import { useState } from "react";

export default function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleChange = (event) => {
    console.log(event);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <ComponentNavbar handleToggle={handleDrawerToggle} />
        <Box
          component="nav"
          sx={{
            width: { sm: 240 },
            flexShrink: { sm: 0 },
          }}
          aria-label="mailbox folders"
        >
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: 240,
                backgroundColor: "#F7FAF9",
                border: "none",
              },
            }}
          >
            <Box sx={{ textAlign: "center", mt: 3 }}>
              <Image
                quality={80}
                width={100}
                height={100}
                style={{
                  objectFit: "cover",
                  objectPosition: "50% 50%",
                  borderRadius: "100%",
                }}
                src="/assets/logo.png"
              />
            </Box>
            <SideNavBar />
          </Drawer>
          <Drawer
            sx={{
              display: { xs: "none", sm: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: 240,
                backgroundColor: "#F7FAF9",
                border: "none",
              },
            }}
            variant="permanent"
            open
          >
            <Box sx={{ px: 3, pt: 3 }}>
              <Box sx={{ textAlign: "center" }}>
                <Image
                  quality={80}
                  width={150}
                  height={150}
                  style={{
                    objectFit: "cover",
                    objectPosition: "50% 50%",
                    borderRadius: "100%",
                  }}
                  src="/assets/logo.png"
                />
              </Box>
            </Box>
            <SideNavBar onPageChange={handleChange} />
          </Drawer>
        </Box>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${240}px)` },
          }}
        >
          <Box
            sx={{
              marginTop: 10,
              borderRadius: "20px",
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
