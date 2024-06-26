
import Banner from "@/components/landing/components/banner/Banner";
import "./globals.css";
import Waves from "@/components/landing/components/waves/Waves";
import QueEsTualoPage from "./que-es-tualo/page";
import ComoFuncionaPage from "./como-funciona/page";
import BeneficiosPage from "./beneficios/page";
import NegociosQueHemosAyudadoPage from "./negocios-que-hemos-ayudado/page";
import ResenasPage from "./resenas/page";
import FormPage from "./form/page";
import Footer from "./footer/page";


export default function HomePage() {
  return (
    <div className="gradient">
      <div className="h-full w-full">
        <Banner/>
      </div>
      <Waves />
      <QueEsTualoPage/>
      <div className="rotate-180">
          <Waves/>
      </div>
      <ComoFuncionaPage/>
      <Waves/>
      <BeneficiosPage/>
      <NegociosQueHemosAyudadoPage/>
      <ResenasPage/>
      <FormPage/>
      <div className="rotate-180">
          <Waves/>
      </div>
      <Footer/>
    </div>
  );
}
