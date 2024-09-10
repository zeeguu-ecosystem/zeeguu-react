import * as s from "./Button.sc";

export default function Button({ children, className, href, onClick, type }) {
  return (
    <s.Button type={type} className={className} role="button" onClick={onClick}>
      {children}
    </s.Button>
  );
}