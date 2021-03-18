import { FC } from "react";
import ReactDOM from "react-dom";

export const Modal: FC<{ container: HTMLElement; open: boolean }> = ({
  container,
  open,
  children,
}) => {
  if (!open) {
    return null;
  }

  return ReactDOM.createPortal(
    <div className="modalScrim">
      <div className="modalContent">{children}</div>
    </div>,
    container
  );
};
