import { Html, Head, Main, NextScript } from "next/document"

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />

        {/* Defer non-critical third-party scripts */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.addEventListener('DOMContentLoaded', function() {
                // Load analytics after page is interactive
                setTimeout(function() {
                  // Your analytics or other non-critical scripts
                }, 3000);
              });
            `,
          }}
        />
      </body>
    </Html>
  )
}
