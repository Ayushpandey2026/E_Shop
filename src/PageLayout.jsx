import { Outlet } from "react-router-dom";
import { Header } from "./pages/Header";
import { Footer } from "./pages/Footer";
import { ScrollToTop } from "./ScrollToTop"; // Ye import add karo

export const PageLayout = () => {
  return (
    <>
      <ScrollToTop />  {/* Ye top pe daal */}
      <Header />
      <main>
        <Outlet /> 
      </main>
      <Footer />
    </>
  );
};
