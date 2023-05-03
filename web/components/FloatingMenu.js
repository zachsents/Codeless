import { Menu } from "@mantine/core"

export default function FloatingMenu({ children, width = 200, ...props }) {
    return (
        <Menu
            {...props}
            width={width}
            styles={{
                dropdown: {
                    border: "none",
                }
            }}
            shadow="lg"
        >
            {children}
        </Menu>
    )
}