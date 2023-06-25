import Layout from "@/utils/Layout";

import "@/public/style/global.css";
import UserProvider from "@/utils/auth/UserProvider";

export default function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <Layout>
        <main>
          <div className="container">
            <Component {...pageProps} />
          </div>
        </main>
      </Layout>
    </UserProvider>
  );
}
