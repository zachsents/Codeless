
export default function Show({ children, condition = true }) {
    return (
        <div style={condition ? {} : { display: "none" }}>
            {children}
        </div>
    )
}
