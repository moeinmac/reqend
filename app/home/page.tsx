"use client";

import Request from "@/components/Request/Request";
import Sidebar from "@/components/Sidebar/Sidebar";

const Home = () => {
  return (
    <div className="grid grid-cols-8">
      <Sidebar />
      <Request />
    </div>
  );
};

export default Home;
