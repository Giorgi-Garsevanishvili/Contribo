import "../styles/globals.css"

export default function LogInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex justify-center items-center w-screen h-screen m-0 p-0">
          {children}
        </div>
      </body>
    </html>
  );
}
