import "./globals.css";

export const metadata = {
  title: "Brand Carousel Showcase",
  description: "Responsive, accessible brand carousel component demo"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
