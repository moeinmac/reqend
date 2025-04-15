"use client";

import InputReq from "@/components/Request/InputReq/InputReq";
import Sidebar from "@/components/Sidebar/Sidebar";

const Home = () => {
  return (
    <div className="grid grid-cols-8">
      <Sidebar />
      <InputReq />
    </div>
  );
};

export default Home;
