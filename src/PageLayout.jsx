import { Outlet } from "react-router-dom";
import { Header } from "./pages/Header";
import { Footer } from "./pages/Footer";
import { ScrollToTop } from "./ScrollToTop";

export const PageLayout = () => {
  return (
    <>
      <ScrollToTop />
      <Header />
      <main>
        <Outlet />  {/* Yaha nested route render hoga */}
      </main>
      <Footer />
    </>
  );
};
