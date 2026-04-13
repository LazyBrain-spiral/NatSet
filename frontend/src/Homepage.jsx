import ShapeGrid from "@/components/ShapeGrid";
import {Link} from "react-router-dom";
import React from "react";
import { useNavigate } from "react-router-dom";
import Signup from "./Signup";

export default function MyPage() {
  return (
    <div className="absolute inset-0 -z-10 bg-[#060010] w-full h-full overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <ShapeGrid
          speed={0.5}
          squareSize={40}
          direction="diagonal"
          borderColor="#3D2B6B"
          hoverFillColor="#4a2f8f"
          shape="square"
          hoverTrailAmount={0}
        />
      </div>

      <div className="justify-center">
        <div className="text-xl font-bold tracking-tight text-white font-montserrat md:text-3xl">
          Natset
        </div>
        <div></div>
      </div>

      <div className="relative z-10 flex items-center justify-center h-full text-white pointer-events-none">
        <div className="flex flex-col items-center gap-8 p-12 text-center pointer-events-auto">
          <div className="flex flex-col gap-4">
            <h1 className="text-5xl font-bold tracking-tight text-white font-montserrat md:text-7xl">
              NatSet
            </h1>
            <h2 className="text-xl font-semibold text-white font-montserrat md:text-3xl">
              Redefining Trust in Freelancing
            </h2>
          </div>

          <div className="flex justify-center gap-6">
            <Link
              to="/signup"
              className="hover:bg-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-900 transition-colors bg-white rounded-full font-montserrat md:text-base hover:bg-gray-100"
            >
              Get Started
            </Link>

            <button
              onClick={() =>
                window.open(
                  "https://github.com/LazyBrain-spiral",
                  "_blank",
                  "noopener,noreferrer",
                )
              }
              className="px-6 py-2.5 text-sm font-semibold text-gray-300 transition-colors bg-transparent border border-gray-700 rounded-full font-montserrat md:text-base hover:bg-gray-800"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
