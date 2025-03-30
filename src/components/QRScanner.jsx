import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Html5Qrcode } from "html5-qrcode";

function QRScanner({ fetchQrData, onClose }) {
  const scannerRef = useRef(null);
  const scannerId = "reader";
  // useEffect(() => {

  //   if (scannerRef.current) return;
  //   const scannerId = "reader";
  //   const qrCodeScanner = new Html5Qrcode(scannerId);
  //   scannerRef.current = qrCodeScanner;
  //   let isScanning = false;

  //   const onScanSuccess = (qrCodeMessage) => {
  //     fetchQrData(qrCodeMessage);

  //     qrCodeScanner
  //       .stop()
  //       .then(() => {
  //         qrCodeScanner.clear();
  //       })
  //       .catch((error) => {
  //         console.error("Error stopping scanner:", error);
  //       });

  //     navigator.mediaDevices.enumerateDevices().then((devices) => {
  //       devices
  //         .filter((device) => device.kind === "videoinput")
  //         .forEach((device) => {
  //           navigator.mediaDevices
  //             .getUserMedia({ video: { deviceId: device.deviceId } })
  //             .then((stream) => {
  //               stream.getTracks().forEach((track) => track.stop());
  //               console.log(`Camera ${device.label} stopped.`);
  //             })
  //             .catch((error) => console.error("Error stopping camera:", error));
  //         });
  //     });
  //     // qrCodeScanner
  //     //   .stop()
  //     //   .then(() => {
  //     //     qrCodeScanner.clear();
  //     //     navigator.mediaDevices
  //     //       .getUserMedia({ video: true })
  //     //       .then((stream) => {
  //     //         stream.getTracks().forEach((track) => {
  //     //           track.stop();
  //     //           console.log("Camera stopped:", track);
  //     //         });
  //     //       })
  //     //       .catch((error) => console.error("Error stopping camera:", error));
  //     //   })
  //     //   .catch((error) => {
  //     //     console.error("Error stopping scanner:", error);
  //     //   });
  //     isScanning = false;
  //     onClose();
  //   };
  //   qrCodeScanner
  //     .start(
  //       { facingMode: "environment" },
  //       {
  //         fps: 10,
  //         disableFlip: true,
  //         rememberLastUsedCamera: false,
  //       },
  //       onScanSuccess
  //     )
  //     .then(() => {
  //       isScanning = true;
  //     })
  //     .catch((error) => {
  //       console.error("Error starting QR scanner:", error);
  //     });
  //   return () => {
  //     if (isScanning) {
  //       qrCodeScanner
  //         .stop()
  //         .then(() => {
  //           qrCodeScanner.clear();
  //         })
  //         .catch((error) => {
  //           console.error("Error stopping scanner:", error);
  //         });
  //     }
  //   };
  // }, [fetchQrData, onClose]);
  useEffect(() => {
    if (scannerRef.current) return;

    const qrCodeScanner = new Html5Qrcode(scannerId);
    scannerRef.current = qrCodeScanner;

    const onScanSuccess = (qrCodeMessage) => {
      fetchQrData(qrCodeMessage);
      stopScanner();
      onClose();
    };

    const startScanner = async () => {
      try {
        await qrCodeScanner.start(
          { facingMode: "environment" },
          {
            fps: 10,
            disableFlip: true,
            rememberLastUsedCamera: false,
          },
          onScanSuccess
        );
      } catch (error) {
        console.error("Error starting QR scanner:", error);
      }
    };

    const stopScanner = async () => {
      try {
        await qrCodeScanner.stop();
        qrCodeScanner.clear();
        scannerRef.current = null;
      } catch (error) {
        console.error("Error stopping scanner:", error);
      }
    };

    startScanner();

    return () => {
      stopScanner();
    };
  }, [fetchQrData, onClose]);
  return (
    <div className="w-full h-full flex justify-center items-center ">
      <div id={scannerId} className="w-full max-w-md  "></div>
    </div>
  );
}
QRScanner.propTypes = {
  onClose: PropTypes.func.isRequired,
  fetchQrData: PropTypes.func.isRequired,
};

export default QRScanner;
