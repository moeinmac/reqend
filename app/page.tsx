import { Hero } from "@/components/hero";
import { BackgroundPaths } from "@/components/ui/background-paths";

const Landing = () => {
  return (
    <div>
      {/* <Hero
        title="Open Source Postman Alternative"
        subtitle="monitor your endpoint's heartbeat with reQend . free and open source postman alternative for you API's . enjoy!"
        actions={[
          {
            label: "Contact Me",
            href: "contact",
            variant: "outline",
          },
          {
            label: "Start Free",
            href: "home",
            variant: "default",
          },
        ]}
        titleClassName="text-5xl md:text-6xl font-extrabold"
        subtitleClassName="text-lg md:text-xl max-w-[600px]"
        actionsClassName="mt-8"
      /> */}
      <BackgroundPaths title="reQend" subTitle="Open Source Postman Alternative" />
    </div>
  );
};

export default Landing;
