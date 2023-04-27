import ComponentNavbar from "@/components/ComponentNavbar";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/utils/theme";
import SideNavBar from "@/components/SideNavBar";
import { Box, Toolbar, Divider, Drawer } from "@mui/material";
import { useState } from "react";
import Layout from "@/utils/Layout";

export default function MyApp({ Component, pageProps }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <Box sx={{ display: "flex" }}>
          <ComponentNavbar handleToggle={handleDrawerToggle} />
          <Box
            component="nav"
            sx={{ width: { sm: 240 }, flexShrink: { sm: 0 } }}
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
                },
              }}
            >
              <Toolbar />
              <Divider />
              <SideNavBar />
            </Drawer>
            <Drawer
              sx={{
                display: { xs: "none", sm: "block" },
                "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
              }}
              variant="permanent"
              open
            >
              <Toolbar />
              <Divider />
              <SideNavBar />
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
