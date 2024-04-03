import VideoWrapper from "@/components/videos/VideoWrapper";
import StreamClientProvider from "@/providers/StreamClientProvider";

const RootLayout = ({ children }) => {
  return (
    <main>
      <VideoWrapper>{children}</VideoWrapper>
    </main>
  );
};

export default RootLayout;
