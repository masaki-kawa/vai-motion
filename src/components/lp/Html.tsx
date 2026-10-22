/** Render a copy string that may hold <br>, <wbr> or <em> markup from the dictionary. */
export default function Html({
  as: Tag = "span",
  html,
  className,
  style,
  id,
}: {
  as?: "span" | "p" | "h1" | "h2" | "h3" | "div";
  html: string;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
}) {
  return <Tag id={id} className={className} style={style} dangerouslySetInnerHTML={{ __html: html }} />;
}
