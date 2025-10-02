import RequestWrapper from "@/components/Request/RequestWrapper";
import Sidebar from "@/components/Sidebar/Sidebar";

const Home = () => {
  return (
    <div className="grid grid-cols-8">
      <Sidebar />
      <RequestWrapper />
    </div>
  );
};

export default Home;
