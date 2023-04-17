import { Button } from "@mantine/core"
import { forwardRef } from "react"


const TagTile = forwardRef(({ tag, ...props }, ref) => {

    const color = tag.color ?? "gray"

    return (
        <Button
            color={color}
            variant="light"
            leftIcon={tag.icon &&
                <tag.icon size={20} />}
            {...props}
            ref={ref}
        >
            {tag.id}
        </Button>
    )
})

TagTile.displayName = "TagTile"
export default TagTile