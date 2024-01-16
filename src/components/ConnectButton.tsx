import { useColorMode } from "@chakra-ui/react";
import { useWeb3ModalTheme } from "@web3modal/ethers5/react"
import React from "react";


export default function ConnectButton() {
  const { setThemeMode } = useWeb3ModalTheme();
  const colorMode = useColorMode();
  React.useEffect(() => {
    setThemeMode(colorMode.colorMode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colorMode.colorMode])
  return <w3m-button balance="hide" />
}