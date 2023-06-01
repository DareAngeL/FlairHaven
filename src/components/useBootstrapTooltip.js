import { Tooltip, tooltipClasses } from "@mui/material"
import { styled } from "@mui/material/styles";

export default function useBootstrapTooltip() {

    const BootstrapTooltip = styled(({ className, ...props }) => (
        <Tooltip {...props} classes={{ popper: className }} />
        ))(({ theme }) => ({
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: 'white',
            boxShadow: theme.shadows[1],
        },
    }))

    return { BootstrapTooltip }
}