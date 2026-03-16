import Footer from "../sections/Footer";
import Header from "../sections/Header";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <main className="h-full w-full">
        {children}
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;
