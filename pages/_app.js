import Layout from "@/utils/Layout";

import "@/public/style/global.css";

export default function MyApp({ Component, pageProps }) {
  return (
      <Layout>
        <main>
          <div className="container">
            <Component {...pageProps} />
          </div>
        </main>
      </Layout>
  );
}
