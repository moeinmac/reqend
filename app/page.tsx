import { Header } from "@/components/header";
import { BackgroundPaths } from "@/components/ui/background-paths";

const Landing = () => {
  return (
    <div>
      <Header />
      <BackgroundPaths title="reQend" subTitle="Open Source Postman Alternative" path="/request" />
    </div>
  );
};

export default Landing;
