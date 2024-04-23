# OpenStatus Real User Monitoring for NextJS

Start monitoring the performance your NextJS application with [OpenStatus](https://www.openstatus.dev) Real User Monitoring.

## Usage

To use OpenStatus Real User Monitoring in your NextJS application, you need to install the package first:

```bash
pnpm add @openstatus/next-monitoring
```

Then, you need to add in your application the `OpenStatusProvider` component. You can do this in your custom `layout.tsx` file or in a custom layout component

```tsx
import { OpenStatusProvider } from "@openstatus/next-monitoring";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <OpenStatusProvider dsn="YOUR_DSN" />
        {children}
      </body>
    </html>
  );
}
```


