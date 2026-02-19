import { useEffect, useRef } from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";

const CloudinaryUploadWidget = ({ uploadImage }) => {
  const widgetRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    if (!window.cloudinary?.createUploadWidget) return;

    // 위젯 생성 (한 번만)
    if (!widgetRef.current) {
      const CLOUDNAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const UPLOADPRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

      widgetRef.current = window.cloudinary.createUploadWidget(
        { cloudName: CLOUDNAME, uploadPreset: UPLOADPRESET },
        (error, result) => {
          if (!error && result && result.event === "success") {
            const url = result.info.secure_url;
            uploadImage(url);
          }
        },
      );
    }

    const handleClick = () => widgetRef.current?.open();

    const el = buttonRef.current;
    if (el) el.addEventListener("click", handleClick);

    return () => {
      if (el) el.removeEventListener("click", handleClick);
    };
  }, [uploadImage]);

  return (
    <UploadButton ref={buttonRef} size="small" variant="contained">
      Upload Image +
    </UploadButton>
  );
};

export default CloudinaryUploadWidget;

/* styled components (맨 아래) */
const UploadButton = styled(Button)(() => ({
  borderRadius: 12,
  fontWeight: 700,
}));
