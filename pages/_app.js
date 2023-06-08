import ComponentNavbar from "@/components/ComponentNavbar";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/utils/theme";
import SideNavBar from "@/components/SideNavBar";
import { Box, Toolbar, Divider, Drawer, Typography } from "@mui/material";
import { useState } from "react";
import Layout from "@/utils/Layout";
import "@/public/style/global.css";

export default function MyApp({ Component, pageProps }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleChange = (event) => {
    console.log(event)
  }
  return (
    <>
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
                  border: 'none',
                },
              }}
            >
              <Typography>Gather</Typography>
              <Toolbar />
              <Divider />
              <SideNavBar />
            </Drawer>
            <Drawer
              sx={{
                display: { xs: "none", sm: "block" },
                "& .MuiDrawer-paper": {
                  boxSizing: "border-box",
                  width: 240,
                  backgroundColor: "#F7FAF9",
                  border: 'none',
                },
              }}
              variant="permanent"
              open
            >
              <Box sx={{px: 3, pt: 3}}>
                <Typography variant="h4">Gather</Typography>
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
            <Layout>
              <main>
                <div className="container">
                  <Component {...pageProps} />
                </div>
              </main>
            </Layout>
          </Box>
        </Box>
      </ThemeProvider>
    </>
  );
}
