import ShapeGrid from "@/components/ShapeGrid";

export default function MyPage() {
  return (
    <div className="absolute inset-0 -z-10 bg-[#060010] w-full h-full overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <ShapeGrid
          speed={0.5}
          squareSize={40}
          direction="diagonal"
          borderColor="#3D2B6B" // more visible purple, like the demo
          hoverFillColor="#4a2f8f"
          shape="square"
          hoverTrailAmount={0}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 pointer-events-none flex items-center justify-center h-full text-white">
        <h1>Welcome to my app</h1>
      </div>
    </div>
  );
}
