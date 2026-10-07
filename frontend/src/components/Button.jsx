import 'react';
import './Button.css';















export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  ariaLabel
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn btn--${variant} btn--${size} ${className}`.trim()}
      aria-label={ariaLabel}>
      
      {children}
    </button>);

}