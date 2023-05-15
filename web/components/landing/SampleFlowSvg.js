import styles from "@web/styles/SampleFlowSvg.module.css"
import { useInterval } from "@mantine/hooks"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

const period = 1.2
const travelTime = 1


const draw = i => {
    const delay = (period - travelTime / 2) + (i - 1) * period
    return {
        hidden: {
            pathLength: 0,
        },
        visible: {
            pathLength: 1,
            transition: {
                delay,
                type: "spring",
                duration: travelTime,
                bounce: 0,
            },
        },
    }
}

// const fade = i => {
//     const delay = 0 + (i - 1) * period
//     return {
//         hidden: {
//             // opacity: 0.3,
//             opacity: 0,
//             scale: 0.5,
//         },
//         visible: {
//             scale: 1,
//             opacity: 1,
//             transition: {
//                 duration: 0.4,
//                 delay,
//             },
//         },
//     }
// }

const pop = i => {
    const delay = 0 + (i - 1) * period
    return {
        hidden: {
            scale: 0.7,
            opacity: 0,
        },
        visible: {
            scale: 1,
            opacity: 1,
            transition: {
                duration: 0.7,
                type: "spring",
                bounce: 0.5,
                delay,
            },
        },
    }
}

const appear = {
    hidden: {
        opacity: 0,
    },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.1,
            delay: period * 3,
        },
    },
}


export default function SampleFlowSvg() {

    const [animation, setAnimation] = useState("hidden")

    const runAnimation = () => {
        setAnimation("hidden")
        setTimeout(() => setAnimation("visible"), 1000)
    }

    const interval = useInterval(runAnimation, 7000)
    useEffect(() => {
        runAnimation()
        interval.start()
        return interval.stop
    }, [])

    return (
        <motion.svg
            initial="hidden"
            animate={animation}
            viewBox="0 0 2057.5 933.18"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
        >
            <defs>
                <linearGradient id="linear-gradient" x1="317.5" y1="905.18" x2="317.5" y2="564.18" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stop-color="#fff" />
                    <stop offset=".04" stop-color="#fff" stop-opacity=".93" />
                    <stop offset=".2" stop-color="#fff" stop-opacity=".69" />
                    <stop offset=".35" stop-color="#fff" stop-opacity=".48" />
                    <stop offset=".5" stop-color="#fff" stop-opacity=".31" />
                    <stop offset=".64" stop-color="#fff" stop-opacity=".17" />
                    <stop offset=".77" stop-color="#fff" stop-opacity=".08" />
                    <stop offset=".9" stop-color="#fff" stop-opacity=".02" />
                    <stop offset="1" stop-color="#fff" stop-opacity="0" />
                </linearGradient>
            </defs>
            <g className={styles["cls-52"]}>
                <g id="Layer_2" data-name="Layer 2">
                    <g id="Layer_1-2" data-name="Layer 1">
                        <g>
                            {/* <g>
                                <path className={styles["cls-11"]} d="m1264,312.18c-2.03,0-4.03-.02-6-.06" />
                                <path className={styles["cls-21"]} d="m1246.27,311.58c-150.11-10.39-114.23-154-264.41-161.13" />
                                <path className={styles["cls-11"]} d="m976,150.25c-1.97-.05-3.97-.07-6-.07" />
                            </g>
                            <g>
                                <path className={styles["cls-11"]} d="m1760,397.18c-2.05,0-4.05-.03-6-.08" />
                                <path className={styles["cls-12"]} d="m1741.15,396.31c-68.15-6.73-61.9-50.34-134.72-54.77" />
                                <path className={styles["cls-11"]} d="m1600,341.26c-1.95-.05-3.95-.08-6-.08" />
                            </g>
                            <g>
                                <path className={styles["cls-11"]} d="m1760,448.18c-2.06,0-4.06.07-6,.21" />
                                <path className={styles["cls-15"]} d="m1741.62,450.37c-52.02,13.3-55.5,82.92-105.42,92.67" />
                                <path className={styles["cls-11"]} d="m1629.99,543.92c-1.93.17-3.93.26-5.99.26" />
                            </g>
                            <g>
                                <path className={styles["cls-11"]} d="m1264,365.18c-2.06,0-4.06.11-5.99.31" />
                                <path className={styles["cls-20"]} d="m1246.45,368.18c-75.7,28.37-25.7,248.81-107.6,267.71" />
                                <path className={styles["cls-11"]} d="m1132.99,636.87c-1.93.21-3.92.31-5.99.31" />
                            </g> */}
                            <motion.path variants={draw(2)} className={styles["glowingLine"]} d="M 970.7,150.1 C 1140.7,150.1 1089.7,312.1 1264.7,312.1" />
                            <motion.path variants={draw(3)} className={styles["glowingLine"]} d="M 1594.7,341.1 C 1687.7,341.1 1667.7,397.1 1760.7,397.1" />
                            <motion.path variants={draw(3)} className={styles["glowingLine"]} d="M 1624.7,544.1 C 1692.7,544.1 1685.7,448.1 1760.7,448.1" />
                            {/* <g>
                                <path className={styles["cls-22"]} d="m797.7,639.1c-2.05,0-4.05.04-6,.11" />
                                <path className={styles["cls-10"]} d="m779.82,640.13c-80.99,9.9-64.9,87.99-151.16,94.53" />
                                <path className={styles["cls-22"]} d="m622.7,735c-1.95.07-3.95.11-6,.11" />
                            </g> */}
                            <motion.path variants={draw(1)} className={styles["glowingLine"]} d="M 616.7,735.1 C 723.0,735.1 692.0,639.1 797.7,639.1" />
                            <motion.path variants={draw(2)} className={styles["glowingLine"]} d="M 1127.7,637.1 C 1232.7,637.1 1159.7,365.1 1264.7,365.1" />
                            <motion.g variants={pop(1)}>
                                <g>
                                    <g>
                                        <image className={styles["cls-77"]} width="638" height="115" transform="translate(1 333.18)" xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAn4AAABzCAYAAAAG0Q+XAAAACXBIWXMAAAsSAAALEgHS3X78AAAMlklEQVR4nO3d6W7bSBaA0ZK8THe//7vOxIs0CCDOVN/cWijLaVI6ByBkK9qcXx9usagCAAAAANyRw0b/lK1+LgCAWeet/U/9zsAScwAAud8Sid8VY9e8rjAEAO7VNWF38xi8dWy1Xm/0PqIPALh3o5Br/fvNAvBWwRVfZ/T77PsLQgBgb24VeKPfV/tqWPUCb+bn7DVm/w0AYIt6gdaLuZmfs9eYdm1YzQTf6Lb1PACAezOKutFtfF72+9AtNmFkgTfzc3bbeg8AgL1phVrv9hz+vfXY+JpT1gbWaLKXRV92lOSx2XsAAOxZa7oXf86O+O/xNeLrDq2JrFb0xYA7JqGX3TcKwOx3AICt6036esF36twXn1Ouib/nyf+4GH29qd6xuj0m942mgPH9AAD2KJvS9YIvuz2E+IuW+w8z8TcTfjPRF2OvdcQgFH8AwD2aib5TiL14LNFXwnOW3w/hPYbxNzvxK40AbAXfU/LzU3jMzBIwAMAezUz54vFZfr09VAF4urRTHX9ldtpXJsIvO+euFX114PWObBoo/ACAe9IKv1bw1cexir46AEv1uqfq/+pcxV83Atec49c6ny8G3/Pg9mli+lca4ScGAYCtyUIrC79R8H00bkvVQMvS8DGJv1I9No2/Xvi1LrWSLe3WsZcdL0kQtuKvhACMnwEAYIviLtt6OhfDLwZfffxspPfQQ5/htU9hChgngqm1E7+STPueQvS9NI4YhK34c30/AGBvetfrm4m+9+qIq6ElvHb9XqfGhC+d+rXCrzftixO/GH2v1e1r9Xt9tJZ949QvfgYAgC2Lu3njtK8XfW9VIx2rJqrVrx8HZiW89y9mL+fSWuLNom85/hVuYwBm8WeTBwCwZ71NHa3oe7vcZk1UGq93DPF39a7e3jJrb5n3pYq/Py7hF48Yf62pX6tgRSAAsDXZN3W0lnmXDRv10u7LJf7qJmq91rm6rMs5xF+pfk93+M5cziWLvt7Eb4m9P6qjDsDXMPWLI03n+QEAezJ7fl/cyLFM+n6EHsomfdllYOpNHt92OZcYfk/JUu8Sfn82AvC1E37ZeFPwAQBbl+3qjZs64hJvPK/v0Hj+skT8VP5/rb968ldu9c0dvev3zUz8/gwBWJ/z19rhK/wAgL0ZhV9c5n27TPuy6Gtd62+Jv/p1s4nf6l29WXxlmzuewnl7Mf5+Rt9fYfL3GqZ+vfATfQDAXsSl3hhwH+HcvmwHb3z8cjxfbnvffhaj728BGMOv9W0ZMxO/0Xl+fyVTv1H42dwBAGxdb3NHnPh9hEu31NEXd/9+hOfUm2I/BhtiU9ee4zezszeLvz+T8HuZDD/RBwBsVbbMuxyfSfgtg6+4vBungu+dU+OO1bl+ZebSLtfs6h3t7B3FX73cK/wAgHuwJvyeG+f0Lf/+GqaCo288K98x8Sud8OvF32sSgcvPs5d0iZ8DAGArZpZ6Py+98x5aJ5v0vYbo633j2fQyb1kRfqVzrl9vyTfGX/xWj7iz1+YOAGDPRps74jl9n9VO3/gNZ2umffH3dLm3F369F+vt8G1t+ohHttT7lMRl9pkAALZi5ps7PqsNGSW5Pwu+3rWOe630pXP84u+tc/2yyV884h81WurNPgMAwFa1Jn6HJPpeqnP+nqt+ihO+mfhrDcumvrJtFHy9AIyTv+yIf2C8YrXNHQDAnrQ2dxyr8CtV9C3X5ItDszr66jZqRV9t2EpZ+M28SOvyLtkxE4L1H7j6mjQAABsSl3rr6DsPWqh1tCZ837a5I754Fn+tJeBeFMafhR8AsGcx/Eo1/VtzxAFbFn0z/nfe39pdvfXP2ZuvDcDWc5zjBwDsUf2Vaedwfl/WQK0+Gg3CWiu0hzr0oufOC7RevLf0Wxof9tpj9LkAALbsmJzrlw2+ehs2eiG4qpPWLvXWbzL7wb4afqv/KACAf8A5aZZz6KR4m030vu20t9F1/FpjxNbje49rhWL8t9n3AwDYkqVb6mXW3pCs1UnRzQLw2olfS+vcvN7adOsPzx4LALBVMfhK475e84zuz36f7qTjxGNmtN7wK4XqHD8AYE967TK7ahrvX9NBw8feKvym3mxFwQIA3KPeiue3u0X4zY4os6VfwQcA8JvccuIHAMA/J712X034AQD887JoOw9i7hxuh4QfAMCDEH4AAA9C+AEAPAjhBwDwIIQfAMCDEH4AAA9C+AEAPAjhBwDwIIQfAMCDEH4AAA9C+AEAPAjhBwDwIIQfAMCDEH4AAA9C+AEAPAjhBwDwIIQfAMCDEH4AAA9C+AEAPAjhBwDwIIQfAMCDEH4AAA9C+AEAPAjhBwDwIIQfAMCDEH4AAA/iFuF3btwX7z8nP2fPBQC4V1kDZc3U6qsvueXEb+bDfNsfAgCwYbODsszNOulW4df6QLN/UO81RSEAsAdfbZdeN92kh55v8SKV8+QIs3T+c5bfD4PnAwBsVe+0t9HqZ/24mzZQb+I3Ok8ve3zvcedwlOQPm13jBgDYml7L9NpnNgQzq9rp2olf/LCtP+Lao3YQfwDATty6iXqvt1odfuewvFrCv2U/1/fd8g8FANij7xiG3WwquGbiF188+1CncP9pcCyPOYbnHKpDCAIAe9KKuNOKPorPKZ1B2XQrrV3qbU321gbfcnxeou9UvcchHAAAexID7TO0z2wn9VordtmULPzikm9vaXemXj87x/Fy1O/XCj8RCABsVW9ldNRD9dGLwCz+Snjf3u/NiV8Wf71jNvSW46OU8hSi7xxCcLlf8AEAexGncXUffVS3H1eE4Jo9EukkcLTUm71Ib0k3xl083i/v+XQ56ug7VfdlE78iAgGADRr1Ut1H71UbvYffPxpR2FsCngq+RS/8ztWlVLL15NGS7kfyhz1X4VdH33M458/EDwDYo9HE7+fxVrXReyMAR0vArX0XpRd/a3f1tiZ+MfjqP+LnH/dyObJJ3/K8p2Sp18QPANi63sQvC7+fffTj0kjxiCGYxd9ombdpNvx607444WtF33NyTt/n5d8+JsJP9AEAW9Xa3BF7qW6k/1wCMEZgNgXsnfNXZuNv5hy/1uVbWgVb/0E/qqXdLPo+qugTfgDAXl0Tfj8u8fefJAJb8dc616/MTP/WTPyyy7e0lnjfwvl8x+p7gc8hGN8nw6+IPwBgg2aXeuv2ycKvFX/Zku/M5V1+EcMvXsYlfvjsejRxE8db2LlbR9/yxy+PfWk81uYOAGCPeps7Yvi9JeGXxV+26WP2XL+/3de7jt8iXnIlO7+v3rH7FkJueX79nGyXbyv8ivgDAHYgW+5t7Yl4S6Z+/x4s+fZ2+Mb3veo6fvEFWhO/p2rJ9ph8I0e2vNtaDhZ+AMAe9cIv2xfxVkXe7NRv7cTvb649x681tpyNvnqnbwy/eH6fAAQAtiwGX2m0U7Yhto6/HyH83kL4jb7NY2j2mzsOg3JtRVs2Hcyu69cKP5s7AICt623uaF33OLsSSnZkE7/RhZybsvA7V6F3SO6rY+5wibWPTvSdGtH3nIRfFn1iDwDYi2ziN7oayns45+9txc7e7Dp+zWv7zZ7jV6oPXaow+2xM5mLhZku8rWnfsXqPIvwAgB2J0XXqTP1i/L0nF3IeTfxWLff2dvVmU79SffgYf/H52bl9z52dvM7vAwD2avY8v9Yl8bIIXHsB5/jev1j7lW1xubdU98fHx5MYl9jrRV897RN9AMCeZLt6SzL1i/FXD8liDMbdvK1l3i9v7uhN/WL0fUxcpbq1vFtH3+jcPgEIAGxN78LJdRu14i8GYHbbW+LN3jO1duIX7zuFf4/h93T5oE/V9f6OyWFTBwBwT3qbPFpfiNE6TiH8suv33exyLofw++J0CbhT+Pd4ft8Se6Mpn/ADAO5FK/x6078YeK0pX29Dx+rLubS0lnzr++rjWIXhMVz+ZSb4hB8AsFdx2bUVgFkEZkcv+KamfWVFXMWNFofwc30ck8AbTfhEHwBwb2biL04AsyBsLeuuDsA15/jFaV/vMYfqw84s6baCTwACAHvTWn7Noi0LwOy++JyyNvrKFWGVXWIlm/7F39cEn9gDAO5Fa9ftaAo4ir1vXertPacVgKOfs9uvfC4AgC3pTf7ibS8Ks+fE15xybWD1Qm0Ud63pntgDAO5Va0LXi8HWY1u/D301tmYCsPdz9hqz/wYAsEW9IOvF28zP2WtMu1VYjWKu9T6j9xd+AMDejMKst1F2ze+r3TqsBB4AQO5WQXi17wquW2waAQC4F9fE282Cb/E7Y0vYAQDkbh55ma3GmEgEAPbut8QcAAAAAPCQSin/BZ21PiXdprslAAAAAElFTkSuQmCC" />
                                        <rect className={styles["cls-27"]} x="21" y="347.18" width="596" height="73" rx="10" ry="10" />
                                    </g>
                                    <text className={styles["cls-3"]} transform="translate(38.81 395.6)"><tspan className={styles["cls-47"]} x="0" y="0">Y</tspan><tspan x="18.5" y="0">our o</tspan><tspan className={styles["cls-65"]} x="105.62" y="0">r</tspan><tspan x="118.8" y="0">der has shipped!</tspan></text>
                                </g>
                                <g>
                                    <g>
                                        <image className={styles["cls-77"]} width="638" height="126" transform="translate(0 436.18)" xlinkHref="data:image/png;base64,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" />
                                        <rect className={styles["cls-27"]} x="20" y="450.18" width="596" height="84" rx="10" ry="10" />
                                    </g>
                                    <g>
                                        <text className={styles["cls-2"]} transform="translate(108.81 490.6)"><tspan x="0" y="0">Supplier</tspan></text>
                                        <text className={styles["cls-5"]} transform="translate(110.81 510.6)"><tspan x="0" y="0">transa</tspan><tspan className={styles["cls-64"]} x="42.06" y="0">c</tspan><tspan x="50.11" y="0">tions@supplie</tspan><tspan className={styles["cls-57"]} x="145.96" y="0">r</tspan><tspan x="150.72" y="0">.com</tspan></text>
                                        <circle className={styles["cls-97"]} cx="64.5" cy="490.68" r="25.5" />
                                        <g>
                                            <path className={styles["cls-27"]} d="m64.11,474.61c4.37.07,7.66,3.52,7.63,7.89-.03,3.87-3.56,7.45-7.65,7.45-4.03,0-7.73-3.56-7.67-7.77.06-4.2,3.72-7.67,7.7-7.57Zm-.06,12.31c2.59.04,4.65-1.96,4.68-4.56.04-2.55-1.98-4.68-4.49-4.73-2.68-.06-4.79,1.96-4.82,4.6-.03,2.6,1.99,4.65,4.62,4.69Z" />
                                            <path className={styles["cls-27"]} d="m64.04,496.18c-1.03,0-2.06,0-3.08,0-2.4,0-4.36,1.72-4.57,4.12-.11,1.17-.04,2.36-.07,3.54-.03,1.19-.79,1.76-1.95,1.49-.56-.13-.96-.49-.96-1.06,0-1.69-.1-3.41.14-5.08.46-3.11,3.57-5.86,6.71-5.99,2.55-.11,5.1-.12,7.65,0,3.6.17,6.71,3.43,6.88,7.04.05,1.2.06,2.4.04,3.6-.02,1.18-.75,1.73-1.9,1.49-.61-.13-.99-.5-1.01-1.13-.04-.92-.01-1.85-.02-2.78-.02-1.6-.35-3.06-1.65-4.15-.86-.73-1.82-1.13-2.95-1.11-1.08,0-2.16,0-3.24,0Z" />
                                        </g>
                                    </g>
                                </g>
                                <g>
                                    <g>
                                        <image className={styles["cls-77"]} width="638" height="383" transform="translate(0 550.18)" xlinkHref="data:image/png;base64,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AQAUIfwAAIoQfgAARQg/AIAihB8AQBHCDwCgCOEHAFCE8AMAKEL4AQAUIfwAAIoQfgAARQg/AIAihB8AQBHCDwCgCOEHAFCE8AMAKEL4AQAUIfwAAIoQfgAARQg/AIAihB8AQBHCDwCgCOEHAFCE8AMAKEL4AQAUIfwAAIoQfgAARQg/AIAihB8AQBHCDwCgCOEHAFCE8AMAKEL4AQAUIfwAAIoQfgAARQg/AIAihB8AQBHCDwCgCOEHAFCE8AMAKEL4AQAUIfwAAIoQfgAARQg/AIAihB8AQBHCDwCgCOEHAFCE8AMAKEL4AQAUIfwAAIoQfgAARQg/AIAihB8AQBHCDwCgCOEHAFCE8AMAKEL4AQAUIfwAAIoQfgAARQg/AIAihB8AQBHCDwCgCOEHAFCE8AMAKEL4AQAUIfwAAIoQfgAARQg/AIAihB8AQBHCDwCgCOEHAFCE8AMAKEL4AQAUIfwAAIoQfgAARQg/AIAihB8AQBHCDwCgCOEHAFCE8AMAKEL4AQAUIfwAAIoQfgAARQg/AIAihB8AQBHCDwCgCOEHAFCE8AMAKEL4AQAUIfwAAIoQfgAARQg/AIAihB8AQBHCDwCgCOEHAFCE8AMAKEL4AQAUIfwAAIoQfgAARQg/AIAihB8AQBHCDwCgCOEHAFCE8AMAKEL4AQAUIfwAAIoQfgAARQg/AIAihB8AQBHCDwCgCOEHAFCE8AMAKEL4AQAUIfwAAIoQfgAARQg/AIAihB8AQBHCDwCgCOEHAFCE8AMAKEL4AQAUIfwAAIoQfgAARQg/AIAihB8AQBHCDwCgCOEHAFCE8AMAKEL4AQAUIfwAAIoQfgAARQg/AIAihB8AQBHCDwCgCOEHAFCE8AMAKEL4AQAUIfwAAIoQfgAARQg/AIAihB8AQBHCDwCgCOEHAFCE8AMAKEL4AQAUIfwAAIoQfgAARQg/AIAihB8AQBHCDwCgCOEHAFCE8AMAKEL4AQAUIfwAAIoQfgAARQg/AIAihB8AQBHCDwCgCOEHAFCE8AMAKEL4AQAUIfwAAIoQfgAARQg/AIAihB8AQBHCDwCgCOEHAFCE8AMAKEL4AQAUIfwAAIoQfgAARQg/AIAihB8AQBHCDwCgCOEHAFCE8AMAKEL4AQAUIfwAAIoQfgAARQg/AIAihB8AQBHCDwCgCOEHAFCE8AMAKEL4AQAUIfwAAIoQfgAARQg/AIAihB8AQBHCDwCgCOEHAFCE8AMAKEL4AQAUIfwAAIoQfgAARQg/AIAihB8AQBHCDwCgCOEHAFCE8AMAKEL4AQAUIfwAAIoQfgAARQg/AIAihB8AQBHCDwCgCOEHAFCE8AMAKEL4AQAUIfwAAIoQfgAARQg/AIAihB8AQBHCDwCgCOEHAFCE8AMAKEL4AQAUIfwAAIoQfgAARQg/AIAihB8AQBHCDwCgCOEHAFCE8AMAKEL4AQAUIfwAAIoQfgAARQg/AIAihB8AQBHCDwCgCOEHAFCE8AMAKEL4AQAUIfwAAIoQfgAARQg/AIAihB8AQBHCDwCgCOEHAFCE8AMAKEL4AQAUIfwAAIoQfgAARQg/AIAihB8AQBHCDwCgCOEHAFCE8AMAKEL4AQAUIfwAAIoQfgAARQg/AIAihB8AQBHCDwCgCOEHAFCE8AMAKEL4AQAUIfwAAIoQfgAARQg/AIAihB8AQBHCDwCgCOEHAFCE8AMAKEL4AQAUIfwAAIoQfgAARQg/AIAihB8AQBHCDwCgCOEHAFCE8AMAKOIe4Xfu3BfvPyc/Z88FAPiqsgbKmqnXVx9yz4nfzIf5tD8EAOCBzQ7KMnfrpHuFX+8Dzf5Bo9cUhQDAHny0XUbddJceer7HizTOkyPMZfCfc/39sPJ8AIBHNTrtbW31s33cXRtoNPFbO08ve/zocedwLMkfNrvGDQDwaEYtM2qf2RDMbGqnWyd+8cP2/ohbj9ZB/AEAO3HvJhq93mZt+J3D8uoS/i37ub3vnn8oAMAefcYw7G5TwS0Tv/ji2Yc6hftPK8f1McfwnENzCEEAYE96EXfa0EfxOctgUDbdSluXenuTva3Bdz3eL9F3at7jEA4AgD2JgfYe2me2k0atFbtsShZ+ccl3tLQ7U6/vg+N4Odr364WfCAQAHtVoZXSth9pjFIFZ/C3hfUe/dyd+WfyNjtnQux5vy7I8heg7hxC83i/4AIC9iNO4to/emtu3G0Jwyx6JdBK4ttSbvchoSTfGXTxeL+/5dDna6Ds192UTv0UEAgAPaK2X2j56bdroNfz+1onC0RLwVPBdjcLv3FxKJVtPXlvSfUv+sOcm/Nroew7n/Jn4AQB7tDbx+3m8NG302gnAtSXg3r6LZRR/W3f19iZ+MfjaP+LnH/ftcmSTvuvznpKlXhM/AODRjSZ+Wfj97KMfl0aKRwzBLP7Wlnm7ZsNvNO2LE75e9D0n5/S9X/7tbSL8RB8A8Kh6mztiL7WN9J9LAMYIzKaAo3P+ltn4mznHr3f5ll7Btn/Qj2ZpN4u+tyb6hB8AsFe3hN+PS/z9J4nAXvz1zvVbZqZ/WyZ+2eVbeku8L+F8vmPzvcDnEIyvk+G3iD8A4AHNLvW27ZOFXy/+siXfmcu7/CKGX7yMS/zw2fVo4iaOl7Bzt42+6x9/fey3zmNt7gAA9mi0uSOG30sSfln8ZZs+Zs/1+9t9o+v4XcVLrmTn97U7dl9CyF2f3z4n2+XbC79F/AEAO5At9/b2RLwkU79/ryz5jnb4xve96Tp+8QV6E7+nZsn2mHwjR7a821sOFn4AwB6Nwi/bF/HSRN7s1G/rxO9vbj3Hrze2nI2+dqdvDL94fp8ABAAeWQy+pdNO2YbYNv5+hPB7CeG39m0eq2a/ueOwUq69aMumg9l1/XrhZ3MHAPDoRps7etc9zq6Ekh3ZxG/tQs5dWfidm9A7JPe1MXe4xNrbIPpOneh7TsIviz6xBwDsRTbxW7sayms45+9lw87e7Dp+3Wv7zZ7jtzQfemnC7L0zmYuFmy3x9qZ9x+Y9FuEHAOxIjK7TYOoX4+81uZDz2sRv03LvaFdvNvVbmg8f4y8+Pzu373mwk9f5fQDAXs2e59e7JF4WgVsv4Bzf+xdbv7ItLvcuzf3x8fEkxmvsjaKvnfaJPgBgT7JdvUsy9Yvx1w7JYgzG3by9Zd4Pb+4YTf1i9L1NXKW6t7zbRt/auX0CEAB4NKMLJ7dt1Iu/GIDZ7WiJN3vP1NaJX7zvFP49ht/T5YM+Ndf7OyaHTR0AwFcy2uTR+0KM3nEK4Zddv+9ul3M5hN+vTpeAO4V/j+f3XWNvbcon/ACAr6IXfqPpXwy83pRvtKFj8+VcenpLvu197XFswvAYLv8yE3zCDwDYq7js2gvALAKzYxR8U9O+ZUNcxY0Wh/BzexyTwFub8Ik+AOCrmYm/OAHMgrC3rLs5ALec4xenfaPHHJoPO7Ok2ws+AQgA7E1v+TWLtiwAs/vic5at0bfcEFbZJVay6V/8fUvwiT0A4Kvo7bpdmwKuxd6nLvWOntMLwLWfs9uPfC4AgEcymvzF21EUZs+Jrznl1sAahdpa3PWme2IPAPiqehO6UQz2Htv7fdVHY2smAEc/Z68x+28AAI9oFGSjeJv5OXuNafcKq7WY673P2vsLPwBgb9bCbLRRdsvvm907rAQeAEDuXkF4s88KrntsGgEA+Cpuibe7Bd/V74wtYQcAkLt75GUeNcZEIgCwd78l5gAAAACAkpZl+S++u0A91/ogLQAAAABJRU5ErkJggg==" />
                                        <rect className={styles["cls-27"]} x="20" y="564.18" width="596" height="341" rx="10" ry="10" />
                                    </g>
                                    <g>
                                        <text className={styles["cls-44"]} transform="translate(220.09 601.6)"><tspan className={styles["cls-78"]} x="0" y="0">Y</tspan><tspan className={styles["cls-39"]} x="8.86" y="0">our o</tspan><tspan className={styles["cls-66"]} x="51.77" y="0">r</tspan><tspan x="57.96" y="0">der will arri</tspan><tspan className={styles["cls-68"]} x="148.55" y="0">v</tspan><tspan x="157.48" y="0">e on</tspan></text>
                                        <text className={styles["cls-41"]} transform="translate(267.55 625.6)"><tspan x="0" y="0">O</tspan><tspan className={styles["cls-73"]} x="14.24" y="0">c</tspan><tspan className={styles["cls-91"]} x="24.91" y="0">t</tspan><tspan x="32.26" y="0">ober 25</tspan></text>
                                        <g>
                                            <rect className={styles["cls-43"]} x="188" y="647.18" width="258" height="37" rx="18.5" ry="18.5" />
                                            <text className={styles["cls-28"]} transform="translate(250.82 670.6)"><tspan className={styles["cls-67"]} x="0" y="0">T</tspan><tspan x="7.59" y="0">rack </tspan><tspan className={styles["cls-79"]} x="40.89" y="0">y</tspan><tspan className={styles["cls-38"]} x="48.65" y="0">our pac</tspan><tspan className={styles["cls-74"]} x="100.13" y="0">k</tspan><tspan x="107.84" y="0">a</tspan><tspan className={styles["cls-94"]} x="115.92" y="0">g</tspan><tspan x="123.6" y="0">e</tspan></text>
                                        </g>
                                        <text className={styles["cls-51"]} transform="translate(254.76 724.69)"><tspan x="0" y="0">O</tspan><tspan className={styles["cls-89"]} x="10.98" y="0">r</tspan><tspan x="15.79" y="0">der #A</tspan><tspan className={styles["cls-37"]} x="62.03" y="0">D</tspan><tspan className={styles["cls-96"]} x="71.12" y="0">X</tspan><tspan x="79.27" y="0">34</tspan><tspan className={styles["cls-90"]} x="95.97" y="0">L</tspan><tspan x="102.41" y="0">GM</tspan></text>
                                        <text className={styles["cls-50"]} transform="translate(256.17 760.69)"><tspan className={styles["cls-42"]}><tspan x="0" y="0">Shipping </tspan><tspan className={styles["cls-40"]} x="62.41" y="0">A</tspan><tspan x="71.9" y="0">dd</tspan><tspan className={styles["cls-61"]} x="90.16" y="0">r</tspan><tspan x="95.58" y="0">ess:</tspan></tspan><tspan className={styles["cls-60"]}><tspan x="-12.03" y="28.8">1600 </tspan><tspan className={styles["cls-62"]} x="24.14" y="28.8">P</tspan><tspan x="31.84" y="28.8">enn</tspan><tspan className={styles["cls-81"]} x="55.82" y="28.8">s</tspan><tspan className={styles["cls-38"]} x="62.52" y="28.8">yl</tspan><tspan className={styles["cls-56"]} x="73.42" y="28.8">v</tspan><tspan x="80.36" y="28.8">ania </tspan><tspan className={styles["cls-45"]} x="110.57" y="28.8">A</tspan><tspan className={styles["cls-56"]} x="119.15" y="28.8">v</tspan><tspan x="126.1" y="28.8">e</tspan></tspan><tspan className={styles["cls-60"]}><tspan className={styles["cls-67"]} x="-14.64" y="45.6">W</tspan><tspan x="-1.79" y="45.6">ashing</tspan><tspan className={styles["cls-53"]} x="39.88" y="45.6">t</tspan><tspan x="45.1" y="45.6">on, DC </tspan><tspan className={styles["cls-93"]} x="91.13" y="45.6">2</tspan><tspan className={styles["cls-55"]} x="99" y="45.6">0500</tspan></tspan></text>
                                        <text className={styles["cls-50"]} transform="translate(293.75 846.69)"><tspan className={styles["cls-42"]}><tspan x="0" y="0">D</tspan><tspan className={styles["cls-61"]} x="9.95" y="0">e</tspan><tspan className={styles["cls-38"]} x="18.2" y="0">tails</tspan></tspan><tspan className={styles["cls-60"]}><tspan x="-103.19" y="16.8">25 x Zenith</tspan><tspan className={styles["cls-98"]} x="-31.99" y="16.8">T</tspan><tspan x="-25.41" y="16.8">ech Blu</tspan><tspan className={styles["cls-74"]} x="21.8" y="16.8">e</tspan><tspan className={styles["cls-53"]} x="29.53" y="16.8">t</tspan><tspan className={styles["cls-38"]} x="34.75" y="16.8">o</tspan><tspan className={styles["cls-96"]} x="43.04" y="16.8">o</tspan><tspan x="51.04" y="16.8">th Headphones</tspan></tspan><tspan className={styles["cls-60"]}><tspan x="-72.22" y="33.6">14 x Ap</tspan><tspan className={styles["cls-40"]} x="-27.05" y="33.6">e</tspan><tspan x="-19.4" y="33.6">xGear Gaming Mouse</tspan></tspan><tspan className={styles["cls-60"]}><tspan x="-74.84" y="50.4">30 x Ap</tspan><tspan className={styles["cls-40"]} x="-24.43" y="50.4">e</tspan><tspan x="-16.79" y="50.4">xGear Gaming Mouse</tspan></tspan></text>
                                    </g>
                                    <rect className={styles["cls-88"]} x="39" y="564.18" width="557" height="341" />
                                </g>
                                <g>
                                    <path className={styles["cls-70"]} d="m26.16,322.22h15.51v-37.67l-10.16-17.73-12,1.12v47.64c0,3.67,2.97,6.65,6.65,6.65Z" />
                                    <path className={styles["cls-58"]} d="m94.84,322.22h15.51c3.67,0,6.65-2.97,6.65-6.65v-47.64l-11.98-1.12-10.17,17.73v37.67h0Z" />
                                    <path className={styles["cls-92"]} d="m94.84,255.75l-9.11,17.38,9.11,11.42,22.16-16.62v-8.86c0-8.21-9.38-12.91-15.95-7.98l-6.2,4.65Z" />
                                    <path className={styles["cls-63"]} d="m41.67,284.56l-8.68-18.34,8.68-10.47,26.59,19.94,26.59-19.94v28.8l-26.59,19.94-26.59-19.94Z" />
                                    <path className={styles["cls-26"]} d="m19.51,259.08v8.86l22.16,16.62v-28.8l-6.2-4.65c-6.58-4.93-15.95-.24-15.95,7.98Z" />
                                </g>
                            </motion.g>
                            <motion.g variants={pop(2)}>
                                <g>
                                    <rect className={styles["cls-69"]} x="797" y="570.18" width="330" height="138" rx="10" ry="10" />
                                    <rect className={styles["cls-13"]} x="797" y="570.18" width="330" height="138" rx="10" ry="10" />
                                </g>
                                <text className={styles["cls-4"]} transform="translate(908.06 618.37)"><tspan className={styles["cls-6"]}><tspan x="0" y="0">EXTR</tspan><tspan className={styles["cls-65"]} x="61.49" y="0">A</tspan><tspan x="77.78" y="0">C</tspan><tspan className={styles["cls-86"]} x="94.2" y="0">T</tspan></tspan><tspan className={styles["cls-36"]}><tspan x="-83.65" y="55.2">“O</tspan><tspan className={styles["cls-65"]} x="-40.41" y="55.2">r</tspan><tspan x="-27.23" y="55.2">der Number”</tspan></tspan></text>
                                <path d="m856.78,517.56c1.47-4.42.96-9.26-1.39-13.27-3.54-6.16-10.66-9.33-17.6-7.84-3.09-3.48-7.53-5.46-12.19-5.44-7.1-.02-13.41,4.56-15.59,11.32-4.56.93-8.5,3.79-10.81,7.84-3.57,6.15-2.75,13.9,2.01,19.17-1.47,4.42-.96,9.26,1.39,13.27,3.54,6.16,10.66,9.33,17.6,7.84,3.09,3.48,7.53,5.46,12.19,5.43,7.11.02,13.41-4.56,15.6-11.32,4.56-.93,8.5-3.79,10.81-7.84,3.56-6.15,2.75-13.89-2.02-19.16h0Zm-24.38,34.08c-2.84,0-5.6-.99-7.78-2.81.1-.05.27-.15.38-.22l12.92-7.46c.66-.38,1.07-1.08,1.06-1.84v-18.21l5.46,3.15c.06.03.1.09.11.15v15.08c0,6.71-5.44,12.14-12.15,12.16h0Zm-26.12-11.16c-1.43-2.46-1.94-5.35-1.45-8.15.1.06.26.16.38.23l12.92,7.46c.65.38,1.47.38,2.12,0l15.77-9.11v6.3c0,.06-.03.13-.08.17l-13.06,7.54c-5.82,3.35-13.24,1.36-16.61-4.45h0Zm-3.4-28.2c1.42-2.47,3.66-4.35,6.33-5.33,0,.11,0,.31,0,.45v14.92c0,.76.4,1.46,1.06,1.84l15.77,9.1-5.46,3.15c-.05.04-.12.04-.18.02l-13.06-7.55c-5.8-3.36-7.79-10.79-4.45-16.6h0Zm44.86,10.44l-15.77-9.11,5.46-3.15c.05-.04.12-.04.18-.02l13.06,7.54c5.81,3.36,7.81,10.8,4.45,16.61-1.42,2.46-3.66,4.35-6.33,5.33v-15.37c0-.76-.4-1.46-1.05-1.84h0Zm5.43-8.18c-.1-.06-.26-.16-.38-.23l-12.92-7.46c-.65-.38-1.47-.38-2.12,0l-15.77,9.11v-6.3c0-.06.03-.13.08-.17l13.06-7.53c5.82-3.36,13.25-1.36,16.61,4.46,1.42,2.46,1.93,5.33,1.45,8.13h0Zm-34.16,11.24l-5.46-3.15c-.06-.03-.1-.09-.11-.15v-15.08c0-6.71,5.45-12.16,12.17-12.15,2.84,0,5.59,1,7.77,2.81-.1.05-.27.15-.38.22l-12.92,7.46c-.66.38-1.07,1.08-1.06,1.84v18.2s0,0,0,0Zm2.97-6.39l7.02-4.06,7.02,4.05v8.11l-7.02,4.05-7.02-4.05v-8.11Z" />
                            </motion.g>
                            <motion.g variants={pop(2)}>
                                <g>
                                    <rect className={styles["cls-48"]} x="640" y="81.18" width="330" height="138" rx="10" ry="10" />
                                    <rect className={styles["cls-18"]} x="640" y="81.18" width="330" height="138" rx="10" ry="10" />
                                </g>
                                <text className={styles["cls-4"]} transform="translate(716.12 129.37)"><tspan className={styles["cls-7"]}><tspan x="0" y="0">GOOGLE SHEE</tspan><tspan className={styles["cls-75"]} x="164.06" y="0">T</tspan></tspan><tspan className={styles["cls-35"]}><tspan x="-17.25" y="55.2">“Shipments”</tspan></tspan></text>
                                <g>
                                    <path className={styles["cls-87"]} d="m692.01,64.69h-38.23c-2.43,0-4.41-1.98-4.41-4.41V4.41c0-2.43,1.98-4.41,4.41-4.41h26.47l16.17,16.17v44.11c0,2.43-1.98,4.41-4.41,4.41Z" />
                                    <path className={styles["cls-9"]} d="m680.25,0l16.17,16.17h-16.17V0Z" />
                                    <path className={styles["cls-80"]} d="m658.19,25.36v20.58h29.41v-20.58h-29.41Zm12.87,16.91h-9.19v-4.78h9.19v4.78Zm0-8.45h-9.19v-4.78h9.19v4.78Zm12.87,8.45h-9.19v-4.78h9.19v4.78Zm0-8.45h-9.19v-4.78h9.19v4.78Z" />
                                </g>
                            </motion.g>
                            <motion.g variants={pop(3)}>
                                <g>
                                    <rect className={styles["cls-48"]} x="1264" y="279.18" width="330" height="123" rx="10" ry="10" />
                                    <rect className={styles["cls-18"]} x="1264" y="279.18" width="330" height="123" rx="10" ry="10" />
                                </g>
                                <text className={styles["cls-1"]} transform="translate(1372.72 327.37)"><tspan className={styles["cls-46"]}><tspan x="0" y="0">FIND </tspan><tspan className={styles["cls-83"]} x="60.93" y="0">R</tspan><tspan className={styles["cls-85"]} x="77.04" y="0">O</tspan><tspan className={styles["cls-82"]} x="93.53" y="0">W</tspan></tspan><tspan className={styles["cls-34"]}><tspan className={styles["cls-76"]} x="-52.52" y="40.8">b</tspan><tspan x="-38.17" y="40.8">y “O</tspan><tspan className={styles["cls-65"]} x="10.55" y="40.8">r</tspan><tspan x="19.33" y="40.8">der Number”</tspan></tspan></text>
                                <g>
                                    <path className={styles["cls-87"]} d="m1316.01,262.69h-38.23c-2.43,0-4.41-1.98-4.41-4.41v-55.87c0-2.43,1.98-4.41,4.41-4.41h26.47l16.17,16.17v44.11c0,2.43-1.98,4.41-4.41,4.41Z" />
                                    <path className={styles["cls-9"]} d="m1304.25,198l16.17,16.17h-16.17v-16.17Z" />
                                    <path className={styles["cls-80"]} d="m1282.19,223.36v20.58h29.41v-20.58h-29.41Zm12.87,16.91h-9.19v-4.78h9.19v4.78Zm0-8.45h-9.19v-4.78h9.19v4.78Zm12.87,8.45h-9.19v-4.78h9.19v4.78Zm0-8.45h-9.19v-4.78h9.19v4.78Z" />
                                </g>
                            </motion.g>
                            <motion.g variants={pop(3)}>
                                <g>
                                    <rect className={styles["cls-27"]} x="1409" y="515.18" width="215" height="57" rx="10" ry="10" />
                                    <rect className={styles["cls-17"]} x="1409" y="515.18" width="215" height="57" rx="10" ry="10" />
                                </g>
                                <text className={styles["cls-8"]} transform="translate(1429.02 551.37)"><tspan x="0" y="0">Shipped</tspan></text>
                                <g>
                                    <polygon className={styles["cls-30"]} points="1459.11 481.34 1459.11 480 1453.36 480 1453.36 481.34 1455.57 481.34 1455.57 503.84 1453.36 503.84 1453.36 505.18 1459.11 505.18 1459.11 503.84 1456.9 503.84 1456.9 481.34 1459.11 481.34" />
                                    <g>
                                        <path className={styles["cls-30"]} d="m1418.53,499.73l6.73-15.2c.47-1.05,1.32-1.68,2.48-1.68h.25c1.16,0,1.99.63,2.45,1.68l6.73,15.2c.14.3.22.58.22.86,0,1.13-.88,2.04-2.01,2.04-.99,0-1.65-.58-2.04-1.46l-1.3-3.03h-8.5l-1.35,3.17c-.36.83-1.08,1.32-1.96,1.32-1.1,0-1.96-.88-1.96-1.99,0-.3.11-.61.25-.91Zm11.94-5.35l-2.68-6.37-2.68,6.37h5.35Z" />
                                        <path className={styles["cls-30"]} d="m1439.41,498.22v-.06c0-3.23,2.45-4.72,5.96-4.72,1.49,0,2.57.25,3.61.61v-.25c0-1.74-1.08-2.7-3.17-2.7-1.16,0-2.1.17-2.9.41-.25.08-.41.11-.61.11-.97,0-1.74-.74-1.74-1.71,0-.74.47-1.38,1.13-1.63,1.32-.5,2.76-.77,4.72-.77,2.29,0,3.94.61,4.99,1.65,1.1,1.1,1.6,2.73,1.6,4.72v6.73c0,1.13-.91,2.01-2.04,2.01-1.21,0-2.01-.85-2.01-1.74v-.03c-1.02,1.13-2.43,1.88-4.47,1.88-2.79,0-5.08-1.6-5.08-4.52Zm9.63-.97v-.74c-.72-.33-1.65-.55-2.68-.55-1.79,0-2.9.72-2.9,2.04v.06c0,1.13.94,1.79,2.29,1.79,1.96,0,3.28-1.08,3.28-2.59Z" />
                                    </g>
                                </g>
                            </motion.g>
                            <motion.g variants={pop(4)}>
                                <g>
                                    <rect className={styles["cls-48"]} x="1760" y="360.18" width="294" height="129" rx="10" ry="10" />
                                    <rect className={styles["cls-18"]} x="1760" y="360.18" width="294" height="129" rx="10" ry="10" />
                                </g>
                                <text className={styles["cls-4"]} transform="translate(1860.23 405.37)"><tspan className={styles["cls-7"]}><tspan x="0" y="0">UP</tspan><tspan className={styles["cls-65"]} x="32.93" y="0">D</tspan><tspan className={styles["cls-49"]} x="49.46" y="0">A</tspan><tspan x="64.34" y="0">TE</tspan></tspan><tspan className={styles["cls-35"]}><tspan x="-22.82" y="55.2">“St</tspan><tspan className={styles["cls-93"]} x="27.76" y="55.2">a</tspan><tspan x="47.53" y="55.2">tus”</tspan></tspan></text>
                                <g>
                                    <path className={styles["cls-87"]} d="m1812.01,343.69h-38.23c-2.43,0-4.41-1.98-4.41-4.41v-55.87c0-2.43,1.98-4.41,4.41-4.41h26.47l16.17,16.17v44.11c0,2.43-1.98,4.41-4.41,4.41Z" />
                                    <path className={styles["cls-9"]} d="m1800.25,279l16.17,16.17h-16.17v-16.17Z" />
                                    <path className={styles["cls-80"]} d="m1778.19,304.36v20.58h29.41v-20.58h-29.41Zm12.87,16.91h-9.19v-4.78h9.19v4.78Zm0-8.45h-9.19v-4.78h9.19v4.78Zm12.87,8.45h-9.19v-4.78h9.19v4.78Zm0-8.45h-9.19v-4.78h9.19v4.78Z" />
                                </g>
                            </motion.g>
                            <motion.g >
                                <g>
                                    <rect className={styles["cls-16"]} x="1859.35" y="705.34" width="197.65" height="55.66" />
                                    <text className={styles["cls-33"]} transform="translate(1917.48 741.48)"><tspan x="0" y="0">St</tspan><tspan className={styles["cls-25"]} x="26.24" y="0">a</tspan><tspan className={styles["cls-84"]} x="39.98" y="0">tus</tspan></text>
                                </g>
                                <g>
                                    <rect className={styles["cls-19"]} x="1859.35" y="761" width="197.65" height="55.66" />
                                    <text className={styles["cls-32"]} transform="translate(1914.05 797.14)"><tspan x="0" y="0">O</tspan><tspan className={styles["cls-59"]} x="15.79" y="0">r</tspan><tspan x="23.78" y="0">de</tspan><tspan className={styles["cls-54"]} x="50.64" y="0">r</tspan><tspan x="58.66" y="0">ed</tspan></text>
                                </g>
                                <g>
                                    <rect className={styles["cls-23"]} x="1859.35" y="649.68" width="197.65" height="55.66" />
                                    <text className={styles["cls-31"]} transform="translate(1949.02 685.82)"><tspan x="0" y="0">B</tspan></text>
                                </g>
                                <g>
                                    <rect className={styles["cls-16"]} x="1567.98" y="705.34" width="291.37" height="55.66" />
                                    <text className={styles["cls-33"]} transform="translate(1670.02 741.48)"><tspan x="0" y="0">O</tspan><tspan className={styles["cls-72"]} x="16.77" y="0">r</tspan><tspan className={styles["cls-84"]} x="27" y="0">de</tspan><tspan className={styles["cls-95"]} x="55.79" y="0">r</tspan><tspan x="65.7" y="0" xmlSpace="preserve"> #</tspan></text>
                                </g>
                                <g>
                                    <rect className={styles["cls-16"]} x="1567.98" y="761" width="291.37" height="55.66" />
                                    <text className={styles["cls-32"]} transform="translate(1651.97 797.14)"><tspan x="0" y="0">NCU04APQ</tspan></text>
                                </g>
                                <g>
                                    <rect className={styles["cls-23"]} x="1567.98" y="649.68" width="291.37" height="55.66" />
                                    <rect className={styles["cls-23"]} x="1459.5" y="705.34" width="107.91" height="55.66" />
                                    <text className={styles["cls-29"]} transform="translate(1706.29 685.82)"><tspan x="0" y="0">A</tspan></text>
                                    <text className={styles["cls-31"]} transform="translate(1509.05 741.48)"><tspan x="0" y="0">1</tspan></text>
                                    <rect className={styles["cls-23"]} x="1459.5" y="761" width="107.91" height="55.66" />
                                    <text className={styles["cls-31"]} transform="translate(1507.12 797.14)"><tspan x="0" y="0">2</tspan></text>
                                    <g>
                                        <rect className={styles["cls-19"]} x="1859.35" y="816.66" width="197.65" height="55.66" />
                                        <text className={styles["cls-32"]} transform="translate(1914.05 852.8)"><tspan x="0" y="0">O</tspan><tspan className={styles["cls-59"]} x="15.79" y="0">r</tspan><tspan x="23.78" y="0">de</tspan><tspan className={styles["cls-54"]} x="50.64" y="0">r</tspan><tspan x="58.66" y="0">ed</tspan></text>
                                    </g>
                                    <g>
                                        <rect className={styles["cls-16"]} x="1567.98" y="816.66" width="291.37" height="55.66" />
                                        <text className={styles["cls-32"]} transform="translate(1654.1 852.8)"><tspan x="0" y="0">BFR82PBD</tspan></text>
                                    </g>
                                    <rect className={styles["cls-23"]} x="1459.5" y="816.66" width="107.91" height="55.66" />
                                    <text className={styles["cls-31"]} transform="translate(1506.93 852.8)"><tspan x="0" y="0">3</tspan></text>
                                    <g>
                                        <rect className={styles["cls-19"]} x="1859.35" y="872.32" width="197.65" height="55.66" />
                                        <text className={styles["cls-32"]} transform="translate(1914.05 908.47)"><tspan x="0" y="0">O</tspan><tspan className={styles["cls-59"]} x="15.79" y="0">r</tspan><tspan x="23.78" y="0">de</tspan><tspan className={styles["cls-54"]} x="50.64" y="0">r</tspan><tspan x="58.66" y="0">ed</tspan></text>
                                    </g>
                                    <g>
                                        <rect className={styles["cls-16"]} x="1567.98" y="872.32" width="291.37" height="55.66" />
                                        <text className={styles["cls-32"]} transform="translate(1653.27 908.47)"><tspan x="0" y="0">A</tspan><tspan className={styles["cls-95"]} x="15.5" y="0">D</tspan><tspan x="31.18" y="0">X34</tspan><tspan className={styles["cls-71"]} x="73.64" y="0">L</tspan><tspan x="86.45" y="0">GM</tspan></text>
                                    </g>
                                    <rect className={styles["cls-23"]} x="1459.5" y="872.32" width="107.91" height="55.66" />
                                    <text className={styles["cls-31"]} transform="translate(1506.7 908.47)"><tspan x="0" y="0">4</tspan></text>
                                </g>
                                <motion.g variants={appear}>
                                    <rect className={styles["cls-24"]} x="1859.35" y="872.32" width="197.65" height="55.66" />
                                    <text className={styles["cls-32"]} transform="translate(1912.59 908.47)"><tspan x="0" y="0">Shipped</tspan></text>
                                </motion.g>
                            </motion.g>
                        </g>
                    </g>
                </g>
            </g>
        </motion.svg>
    )
}
