export default function getCompanyLogo(companyName) {

    const logos = {

        "Valeo Egypt": "/logos/valeo.png",

        "Bosch": "/logos/bosch.png",

        "Visa": "/logos/visa.jpg",

        "Netflix": "/logos/netflix.png",

        "HashiCorp": "/logos/hashicorp.png",

        "Anthropic": "/logos/anthropic.png",

        "Figma": "/logos/figma.png",

        "Stripe": "/logos/Stripe.png",

        "Vercel": "/logos/Vercel.png",

        "CIB": "/logos/cib.png",

        "CircleCI": "/logos/CircleCI.png",

        "DigitalOcean": "/logos/DigitalOcean.png",

        "Elastic": "/logos/Elastic.png",

        "ITWorx": "/logos/ITWorx.png",

        "Skechers": "/logos/Skechers.png",

        "VOIS": "/logos/VOIS.png"

    };


    return logos[companyName] || "/logos/default.png";

}