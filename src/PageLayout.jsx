import { Outlet } from "react-router-dom";
import { Header } from "./pages/Header";
import { Footer } from "./pages/Footer";

export const PageLayout = () => {
  return (
    <>
      <Header />
      
        <Outlet /> 

      <Footer />
    </>
  );
};
