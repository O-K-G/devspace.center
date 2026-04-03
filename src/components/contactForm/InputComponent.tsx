import { handleA11y1000FirstNumbers } from '@utils/handleA11y1000FirstNumbers';
import { InputComponentProps } from '@constants/interfaces';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import DOMPurify from "isomorphic-dompurify";

export default function InputComponent({
  component: Component = 'input',
  id,
  placeholder,
  minLength,
  maxLength,
  rows,
  onChange,
  isError,
  bottomSlot,
  isReset,
  onClick,
  label,
  placeholderFontClassName = 'placeholder:info-text-font-classNames',
}: InputComponentProps) {
  const isTextarea = Component === 'textarea';
  const [value, setValue] = useState('');
  const t = useTranslations('inputComponentText');

  useEffect(() => {
    if (isReset) {
      setValue('');
    }
  }, [isReset]);

  const ariaLabelErrorValueById = {
    email: t('emailAriaLabelError'),
    subject: t('subjectAriaLabelError'),
    content: t('contentAriaLabelError'),
  };

  const ariaLabel = !isError
    ? `${
        !value
          ? handleA11y1000FirstNumbers(maxLength)
          : handleA11y1000FirstNumbers(maxLength - value.length)
      } ${t(
        maxLength - value.length !== 1
          ? 'charactersAriaLabelError'
          : 'characterAriaLabelError'
      )} ${t('remain')}`
    : `${t('error')} - ${
        ariaLabelErrorValueById[id as keyof typeof ariaLabelErrorValueById]
      }`;

  return (
    <div className="w-full text-white sm:gap-6 flex flex-col items-start sm:flex-row justify-center overflow-hidden">
      <div className="flex items-center justify-start sm:justify-end sm:mt-1.5 sm:w-2/12 md:w-3/12 md:max-w-24">
        <label
          htmlFor={id}
          className="uppercase info-text-font-classNames text-sm sm:text-3xl w-12 sm:w-24"
        >
          {label}:
        </label>
      </div>
      <div className="center-elements flex-col w-full">
        <div className="w-full flex flex-col items-end justify-center">
          <Component
            type="text"
            onChange={({ target: { value } }) => {
              setValue(DOMPurify.sanitize(value));
              onChange?.();
            }}
            onClick={onClick}
            value={value}
            minLength={minLength}
            maxLength={maxLength}
            aria-label={ariaLabel}
            id={id}
            name={id}
            className={`w-full placeholder:uppercase text-sm sm:text-xl placeholder:text-white/30 regular-text-font-by-locale outline-hidden ${placeholderFontClassName} ${
              !isTextarea
                ? 'h-[3.188rem] px-2 sm:px-4'
                : 'p-2 sm:p-4 resize-none'
            } ${
              !isError
                ? 'bg-title-purple/30 hover:bg-black/70 active:bg-black/70 focus:bg-black/70'
                : 'bg-red-500/70'
            }`}
            placeholder={placeholder}
            rows={rows}
          />
          <div aria-live="assertive" className="sr-only">
            {isError ? ariaLabel : ''}
          </div>
          <div aria-hidden className="font-bebas-neue text-base">
            {!value ? maxLength : maxLength - value.length}
          </div>
        </div>
        {bottomSlot}
      </div>
    </div>
  );
}
