export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="public">
      <main>{children}</main>
    </div>
  );
}
