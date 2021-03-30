import Head from "next/head";

export default function Metatags({
    title = "Dynamily",
    description = "Dynamily helps you manage and connect your family's everyday life.",
    image = process.env.NEXT_PUBLIC_VERCEL_URL + "/images/featured.png",
}) {
    return (
        <Head>
            <title>{title}</title>
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:site" content="@raymon_rz" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
        </Head>
    );
}
