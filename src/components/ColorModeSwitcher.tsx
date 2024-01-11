import {
    useColorMode,
    useColorModeValue,
    IconButton,
    IconButtonProps,
} from "@chakra-ui/react"
import { FaMoon } from "react-icons/fa"
import { SunIcon } from "@chakra-ui/icons"

type ColorModeSwitcherProps = Omit<IconButtonProps, "aria-label">

export const ColorModeSwitcher = (props: ColorModeSwitcherProps) => {
const { toggleColorMode } = useColorMode()
const text = useColorModeValue("dark", "light")
const SwitchIcon = useColorModeValue(FaMoon, SunIcon)

return (
    <IconButton
        size="md"
        borderRadius="99px"
        fontSize="lg"
        marginLeft="2"
        onClick={toggleColorMode}
        icon={<SwitchIcon />}
        aria-label={`Switch to ${text} mode`}
        {...props}
    />
)
}