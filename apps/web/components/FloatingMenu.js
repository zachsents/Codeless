import { Menu } from '@mantine/core'

export default function FloatingMenu({ children, width = 200, radius = "lg", ...props }) {
    return (
        <Menu 
        {...props}
        width={width}
        radius={radius}
        styles={{
            dropdown: {
                border: "none",
            }
        }} 
        shadow="xl"
        >
            {children}
        </Menu>
    )
}