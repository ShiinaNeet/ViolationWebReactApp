import { useEffect } from "react";
import PropTypes from "prop-types";
import { Html5Qrcode, Html5QrcodeScanner } from "html5-qrcode";

function QRScanner({ fetchQrData, onClose }) {
  useEffect(() => {
    const qrCodeScanner = new Html5Qrcode("readerw");
    let isScanning = false;

    const onScanSuccess = (qrCodeMessage) => {
      console.log(qrCodeMessage);
      fetchQrData(qrCodeMessage);
      qrCodeScanner
        .stop()
        .then(() => {
          qrCodeScanner.clear();
          navigator.mediaDevices
            .getUserMedia({ video: true })
            .then((stream) => {
              stream.getTracks().forEach((track) => {
                track.stop(); // Stop each active track
                console.log("Camera stopped:", track);
              });
            })
            .catch((error) => console.error("Error stopping camera:", error));
        })
        .catch((error) => {
          console.error("Error stopping scanner:", error);
        });
      onClose();
    };

    qrCodeScanner
      .start(
        { facingMode: "environment" },
        {
          fps: 10,
          disableFlip: true,
          rememberLastUsedCamera: false,
        },
        onScanSuccess
      )
      .then(() => {
        isScanning = true; // Mark as scanning
      })
      .catch((error) => {
        console.error("Error starting QR scanner:", error);
      });

    // Cleanup on component unmount
    return () => {
      if (isScanning) {
        // qrCodeScanner
        //   .stop() // Stop scanning only if it's running
        //   .then(() => {
        //     qrCodeScanner.clear(); // Clear camera resources
        //     navigator.mediaDevices
        //       .getUserMedia({ video: true })
        //       .then((stream) => {
        //         stream.getTracks().forEach((track) => {
        //           track.stop(); // Stop each active track
        //           console.log("Camera stopped:", track);
        //         });
        //       })
        //       .catch((error) => console.error("Error stopping camera:", error));
        //   })
        //   .catch((error) => {
        //     console.error("Error stopping scanner:", error);
        //   });
        // navigator.mediaDevices.enumerateDevices().then((devices) => {
        //   devices
        //     .filter((device) => device.kind === "videoinput") // Find active cameras
        //     .forEach((device) => {
        //       navigator.mediaDevices
        //         .getUserMedia({ video: { deviceId: device.deviceId } })
        //         .then((stream) => {
        //           stream.getTracks().forEach((track) => track.stop()); // Stop each track
        //           console.log(`Camera ${device.label} stopped.`);
        //         })
        //         .catch((error) =>
        //           console.error("Error stopping camera:", error)
        //         );
        //     });
        // });
      } else {
        console.log("QR CODE SCANNER:Scanner is not running.");
        console.log("QR CODE SCANNER:Scanner is not running.");
        console.log("QR CODE SCANNER:Scanner is not running.");
      }
    };
  }, [fetchQrData, onClose]);

  // useEffect(() => {
  //   let html5QrcodeScanner;
  //   if (Html5QrcodeScanner) {
  //     // Creates anew instance of `HtmlQrcodeScanner` and renders the block.
  //     html5QrcodeScanner = new Html5QrcodeScanner(
  //       "readerw",
  //       {
  //         fps: 10,
  //         // qrbox: { width: 250, height: 250 },
  //         rememberLastUsedCamera: false,
  //       },
  //       false
  //     );
  //     html5QrcodeScanner.render(
  //       (data) => console.log(onScanSuccess(data))
  //       // (err) => console.log("err ->", err)
  //     );
  //   }
  //   const onScanSuccess = (qrCodeMessage) => {
  //     fetchQrData(qrCodeMessage);
  //     onClose();
  //   };

  //   return () => {
  //     html5QrcodeScanner?.clear();
  //   };
  // }, [Html5QrcodeScanner]);
  return (
    <div className="w-full overflow-y-hidden">
      <div id="readerw" style={{ width: "100%", height: "400px" }}></div>
      {/* Custom UI for scanner can go here */}
    </div>
  );
}

QRScanner.propTypes = {
  onClose: PropTypes.func.isRequired,
  fetchQrData: PropTypes.func.isRequired,
};

export default QRScanner;
