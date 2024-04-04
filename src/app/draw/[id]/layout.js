import VideoWrapper from "@/components/videos/VideoWrapper";
const RootLayout = ({ children }) => {
  return (
    <main>
      <VideoWrapper>{children}</VideoWrapper>
    </main>
  );
};

export default RootLayout;
