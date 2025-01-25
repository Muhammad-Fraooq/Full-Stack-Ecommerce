import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Ecommerce Website for Shoppers",
    description: "Ecommerce Website for educational purpose",
};


const RootLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <html lang="en">
            <body>
                {children}
            </body>
        </html>
    )
}
export default RootLayout;