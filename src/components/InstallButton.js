"use client";
import { useEffect, useState } from "react";

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handler = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("Usuario instaló la PWA");
        }
        setDeferredPrompt(null);
        setIsInstallable(false);
      });
    }
  };

  return isInstallable ? (
    <button
      onClick={handleInstall}
      style={{ padding: "10px", fontSize: "16px", cursor: "pointer" }}
    >
      Instalar la App
    </button>
  ) : null;
}
